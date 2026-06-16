// rate-limited-ai-route.ts — copy to app/api/ai/route.ts
//
// A server-side LLM endpoint that is rate-limited BEFORE it can run up your bill.
// The API key never leaves the server. The client POSTs a prompt; this route calls
// the model and streams/returns the result.
//
// Deps (production, serverless-safe):
//   npm i @anthropic-ai/sdk @upstash/ratelimit @upstash/redis
// Env (server-only — NOT NEXT_PUBLIC_):
//   ANTHROPIC_API_KEY=...
//   UPSTASH_REDIS_REST_URL=...
//   UPSTASH_REDIS_REST_TOKEN=...

import Anthropic from '@anthropic-ai/sdk';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs'; // Anthropic SDK; use 'edge' only with an edge-compatible client

// ── Rate limiter ──────────────────────────────────────────────────────
// 10 requests / 60s per identifier, sliding window. Tune to your cost model.
// Falls back to an in-memory limiter ONLY for local dev (resets on cold start —
// useless on serverless/multi-instance, so never rely on it in prod).
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      prefix: 'ratelimit:ai',
      analytics: true,
    })
  : devMemoryLimiter(10, 60_000);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  // Identify the caller. Prefer an authenticated user id; fall back to IP.
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';
  const identifier = ip; // e.g. `user:${session.userId}` when authenticated

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  if (!success) {
    return Response.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.max(0, Math.ceil((reset - Date.now()) / 1000))),
        },
      },
    );
  }

  // Validate input — never trust the client. Cap length to bound cost.
  let prompt: unknown;
  try {
    ({ prompt } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > 4000) {
    return Response.json(
      { error: 'prompt must be a string of 1–4000 chars.' },
      { status: 400 },
    );
  }

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024, // hard cap — bounds per-request cost
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  // Return model output as DATA. Do not eval it, run it as a tool, or inject it into
  // HTML/SQL without validation — treat it as untrusted (prompt-injection defense).
  return Response.json({ text });
}

// ── Dev-only in-memory limiter ────────────────────────────────────────
// Single-process only. Resets on restart/cold start. For local dev convenience so
// you don't need Upstash to run the app. DO NOT rely on this in production.
function devMemoryLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return {
    async limit(id: string) {
      const now = Date.now();
      const arr = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
      arr.push(now);
      hits.set(id, arr);
      const remaining = Math.max(0, max - arr.length);
      return {
        success: arr.length <= max,
        limit: max,
        remaining,
        reset: now + windowMs,
      };
    },
  };
}
