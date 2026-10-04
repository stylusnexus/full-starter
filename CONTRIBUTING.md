# Contributing to Full Starter

Thanks for your interest in improving the starter itself. This guide covers changes to
this repo — for skills and agent packs, see [Skills we like](README.md#skills) below.

## What lives here vs. in agent-plugins

Full Starter bundles the parts that are genuinely per-project: `AGENTS.md`, guidances,
agent definitions, hooks, and the Playwright testing infrastructure. Reusable skills
(TDD, verify, deploy, review workflows, and the rest) live in
[stylusnexus/agent-plugins](https://github.com/stylusnexus/agent-plugins) instead, so
they stay current without every fork going stale. If your change is a new skill or an
improvement to an existing one, open it there. If it's about the starter's own
structure — a guidance doc, a hook, an agent, the e2e scaffolding, the setup docs — open
it here.

## Setting Up

```bash
git clone https://github.com/stylusnexus/full-starter.git
cd full-starter
npm install
```

## Making Changes

1. **Fork the repo** and create a feature branch from `main`.
2. **Make your change.** Keep guidances, hooks, and agent definitions generic — this
   repo is meant to be forked into many different projects, not tuned to one.
3. **Verify it.** Run `./scripts/verify.sh`. If you touched the Playwright infra, run
   the relevant suite under `e2e/suite/`.
4. **Update counts.** If you added or removed an agent, a hook, or a guidance, update
   `README.md` and `docs/index.html`, then run `./scripts/check-docs-sync.sh`. It fails
   if the numbers or the guidance list no longer match the repo.
5. **Open a pull request** against `main`.

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```text
type(scope): description
```

Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`

Examples:

- `feat(agents): add a data-engineer agent template`
- `fix(hooks): correct domain-context-loader path matching`
- `docs: update CONTRIBUTING.md`

### PR Checklist

- [ ] `./scripts/verify.sh` passes
- [ ] Agent, skill-pack, and file counts in `README.md` / `docs/index.html` still match reality
- [ ] Commit messages follow conventional commit format
- [ ] Changes stay generic — no project-specific assumptions baked into shared files

## Reporting Security Issues

See [SECURITY.md](SECURITY.md). Do not open a public issue for a vulnerability — email
**security@stylusnexus.com** instead.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
By participating, you agree to uphold this standard.

## Questions?

Open a [discussion](https://github.com/stylusnexus/full-starter/discussions) or file an issue.
