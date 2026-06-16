// eslint-no-client-secrets.mjs — merge into eslint.config.mjs (flat config)
//
// Fails the build if secret-shaped values reach client code. Two guards:
//   1. No hardcoded API-key-shaped string literals anywhere.
//   2. No `process.env.NEXT_PUBLIC_*SECRET|KEY|TOKEN|PASSWORD` — anything read through
//      a NEXT_PUBLIC_ var is inlined into the browser bundle. URLs/IDs are fine; secrets
//      are not. (Name public-safe vars without SECRET/KEY/TOKEN, e.g.
//      NEXT_PUBLIC_SUPABASE_ANON_KEY is a deliberate, documented exception — allowlist it.)
//
// Usage in eslint.config.mjs:
//   import noClientSecrets from './docs/security/nextjs/eslint-no-client-secrets.mjs'
//   export default [ ...yourConfig, ...noClientSecrets ]

export default [
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // Hardcoded key-shaped literals (OpenAI, Anthropic, AWS, Google, GitHub, Slack).
          selector:
            "Literal[value=/(sk-[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9-]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|ghp_[0-9A-Za-z]{36}|xox[baprs]-[0-9A-Za-z-]{10,})/]",
          message:
            'Hardcoded API key detected. Move it to a server-only env var (no NEXT_PUBLIC_ prefix).',
        },
        {
          // Reading a secret through a NEXT_PUBLIC_ var → shipped to the browser.
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env'] > Identifier.property[name=/^NEXT_PUBLIC_.*(SECRET|KEY|TOKEN|PASSWORD)/]",
          message:
            'NEXT_PUBLIC_* vars are exposed to the browser. A SECRET/KEY/TOKEN/PASSWORD must be server-side (drop the NEXT_PUBLIC_ prefix). If this value is genuinely public (e.g. an anon key), rename it or add a targeted eslint-disable with a comment explaining why.',
        },
      ],
    },
  },
];
