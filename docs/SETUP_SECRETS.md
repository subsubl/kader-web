# Kader — Setup: Secrets & Environment Variables
> What you need to give GitHub (and your server) so the automated workflows run.
> Everything below is done in the GitHub web UI — no code changes required.

---

## 1. Why this is needed
The repo has three GitHub Actions workflows. Until their secrets are set, **some jobs will
silently no-op or fail** even though every merge is green (CI's build can pass with empty
secrets because the app defaults to blank values — but the **deploy** and **RA sync** jobs
need real secrets to actually do anything).

| Workflow | Runs | Purpose |
|---|---|---|
| `ci.yml` | every PR + push to `main` | typecheck, build, validate Supabase migrations |
| `sync-ra.yml` | every 6h + manual | pull RA club events into `ra_events` |
| `deploy.yml` | push to `main` + manual | build & ship to server + push DB migrations |

---

## 2. Create the "production" and "staging" environments (for deploy)
The deploy workflow uses **environment-scoped secrets** (leasts-privilege + required reviewers).
Only the `production` environment is mandatory to deploy live; `staging` is optional.

**Steps (GitHub web UI):**
1. Repo → **Settings** → **Environments** → **New environment** → name it `production` → click *Configure environment*.
2. (Optional) Repeat for `staging`.
3. In each environment's settings, add the environment secrets from the table below
   (**Deployment branches** → set `main`; **Required reviewers** optional).

> **Also add the CI / sync secrets at repo level** (per step 4) — the build step and sync
> script read repo-level secrets with `${{ secrets.X }}`.

---

## 3. Secrets table

### Environment secrets — add inside `production` (and `staging` if used)
| Secret | Value | Used for |
|---|---|---|
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` | public read/write client URL |
| `SUPABASE_ANON_KEY` | project's **anon / publishable** key | client-safe anon key |
| `SUPABASE_SERVICE_KEY` | project's **service_role** key | server-side (webhook, admin writes) — keep secret |
| `PRETIX_WEBHOOK_SECRET` | a long random string | verify Pretix webhook HMAC |
| `DEPLOY_URL` | your deploy API endpoint, e.g. `http://192.168.64.139:9090/deploy` | receives release archive |
| `DEPLOY_TOKEN` | a bearer token your deploy API checks | authorises the push |
| `SUPABASE_DB_URL` | Postgres connection string for migrations | `supabase db push` to prod |
| `SUPABASE_ACCESS_TOKEN` | **Supabase account access token** (Settings → Access Tokens) | Supabase CLI auth for deploy |

### Repo-level secrets — add in Settings → Secrets and variables → Actions
| Secret | Value | Used by |
|---|---|---|
| `SUPABASE_ANON_KEY` | (same as above) | `ci.yml` build step |
| `SUPABASE_SERVICE_KEY` | (same as above) | `ci.yml` + `sync-ra.yml` |
| `PRETIX_WEBHOOK_SECRET` | (same as above) | `ci.yml` build step |
| `SUPABASE_URL` | (same as above) | `sync-ra.yml` (RA sync writes to `ra_events`) |

> **Why both levels?** `deploy.yml` scopes its secrets to the `production` **environment**, but
> `ci.yml` and `sync-ra.yml` reference `${{ secrets.X }}` which resolves **repo-level** secrets.
> If a secret is missing at repo level, CI's build step just gets an empty value (fine), but the
> RA sync would fail on schedule.

---

## 4. Steps to add secrets

**Repo-level (for CI + RA sync):**
1. Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. Name + paste each of: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `PRETIX_WEBHOOK_SECRET`. Add **Save**.

**Environment-level (for deploy):**
1. Repo → **Settings** → **Environments** → `production`.
2. **Environment secrets** → **Add secret** each of: `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_KEY`, `PRETIX_WEBHOOK_SECRET`, `DEPLOY_URL`, `DEPLOY_TOKEN`,
   `SUPABASE_DB_URL`, `SUPABASE_ACCESS_TOKEN`.

---

## 5. App environment variables (server / local)
These are the runtime `NUXT_*` vars the Nuxt app reads (from `nuxt.config.ts` + server code).
They're **not** GitHub secrets; they belong on the **deploy target server** (its `.env`) and
your local `.env` for dev:

| Env var | Default | Notes |
|---|---|---|
| `NUXT_PUBLIC_SUPABASE_URL` | — | used by client + server |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | — | public key |
| `NUXT_SUPABASE_SERVICE_KEY` | — | service role (server-side only) |
| `NUXT_PRETIX_WEBHOOK_SECRET` | — | Pretix webhook HMAC secret |
| `NUXT_PUBLIC_PRETIX_URL` | `https://pretix.eu` | base URL for the Pretix ticket widget |

> The deploy workflow *bakes* the first three into the build via the environment secrets; the
> server itself mostly needs `NUXT_PUBLIC_PRETIX_URL` if you host elsewhere.

---

## 6. Verification
After setting everything:
1. **Actions → Sync RA Events → Run workflow** (manual) — expect `[sync-ra] Upserted N events…`.
2. Push a trivial change to `main` — **CI** green **and** **Deploy** job runs (watch its logs).
3. Check a public page loads with Supabase data.

### If a job fails
- `sync-ra`: missing `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` at **repo** level.
- deploy `Build`: missing env secrets at the **production** environment (or repo level).
- deploy `Push Supabase migrations`: wrong `SUPABASE_DB_URL` or `SUPABASE_ACCESS_TOKEN`.

---

## 7. Where values come from (quick reference)
- **Supabase**: project **Settings → API** (Project URL = `SUPABASE_URL`; anon & service_role keys).
  Access token: top-right avatar → **Account settings → Access tokens**.
- **Pretix webhook secret**: whatever you set in your Pretix organizer/event webhook config; must
  match `NUXT_PRETIX_WEBHOOK_SECRET`/`PRETIX_WEBHOOK_SECRET`.
- **Deploy URL/token**: defined by your `kader-deploy-api` service (port 9090). Reach out if the
  endpoint/token aren't already provisioned on the server.

> ⚠️ Treat every value except `SUPABASE_ANON_KEY` as private. The anon key is safe to expose
> client-side; the service_role key, DB URL, access & deploy tokens must never be public.
