# Kader — CI/CD (GitHub Actions)

Runbook for the repository's automated workflows.

## Workflows

| File | Trigger | Jobs |
|---|---|---|
| `.github/workflows/ci.yml` | PR + push to `main` | Typecheck & build (Node 22), validate Supabase migrations in local Postgres, lint PR title |
| `.github/workflows/deploy.yml` | push to `main` / `workflow_dispatch` | Build → package → push to deploy API → push Supabase migrations |
| `.github/dependabot.yml` | weekly | npm + GitHub Actions dependency bumps |

## Best practices applied
- **Least-privilege token**: `permissions: contents: read`.
- **Concurrency + cancel-in-progress**: superseded CI cancels; deploys serialize so only one revision deploys at a time.
- **Script-injection hardening**: untrusted `github.event.pull_request.title` passed via `env:`, never interpolated inline (validated with `actionlint`).
- **Environment-scoped secrets**: production credentials live under an Actions environment with required reviewers.
- **Official actions**: `actions/checkout`, `actions/setup-node` (`cache: npm`), `supabase/setup-cli@v3`.
- **Reproducible installs**: `npm ci` + committed `package-lock.json`.

## Known gotchas
1. **Node version**: `@supabase/supabase-js` v2.112 requires Node **≥22**. Node 20 → `EBADENGINE`.
2. **`supabase db reset`**: do NOT pass `--db-url <local>` for local validation — the CLI treats a URL as a *remote* DB and prompts `[y/N]`, hanging the job. Use plain `supabase db reset` with `SUPABASE_DB_PASSWORD: postgres`.
3. **`@nuxtjs/supabase` module**: v0.3.x fails on Nuxt 3.21 — removed; the app uses a typed `@supabase/supabase-js` client directly.
4. **`src/` layout**: Nuxt needs `srcDir: 'src'` in `nuxt.config.ts`.
5. **Don't commit the `actionlint` binary** (7 MB) — it's in `.gitignore`.

## Secrets to configure (repo → Settings → Secrets & variables → Actions)
Repo-level: `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `PRETIX_WEBHOOK_SECRET`
Production environment: `SUPABASE_URL`, `DEPLOY_URL`, `DEPLOY_TOKEN`, `SUPABASE_DB_URL`, `SUPABASE_ACCESS_TOKEN`

## Local validation
```bash
npm install
npm run typecheck
npm run build
actionlint .github/workflows/*.yml   # not committed; install separately
```