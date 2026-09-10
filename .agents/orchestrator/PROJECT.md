# Project: Kader Nuxt 3 / Nitro Backend Optimization

## Architecture
- Framework: Nuxt 3 with Nitro server engine
- Server routes: `src/server/api/*`
- Persistence: JSON file store in `.data/*.json` and Supabase integration
- Media processing: Sharp image optimization pipeline (`/api/img`)
- Client: Vue 3 frontend components calling backend endpoints

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Deep Backend Architecture & Caching Audit | Analyze all endpoints, persistence, Sharp pipeline, latency bottlenecks, concurrency issues | none | DONE |
| 2 | High-Performance API Caching & Optimization Implementation | Implement memory/ETag/SWR caching, Sharp stream caching & 304 conditional GETs, refactor .data/*.json I/O | M1 | IN_PROGRESS |
| 3 | Automated Verification & Benchmark Suite | Automated benchmark script (<50ms cached, <100ms uncached), Cache-Control headers, API correctness | M2 | PLANNED |
| 4 | Final Milestone (E2E Verification & Adversarial Coverage Hardening) | Pass 100% test suite, build verification (0 errors), adversarial coverage hardening | M3 | PLANNED |

## Interface Contracts
### Public API Routes
- `/api/site-images`: Returns image list/metadata with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`, deterministic `ETag`, and `304 Not Modified` on matching `If-None-Match`.
- `/api/events`: Returns events list with `Cache-Control: public, max-age=60, stale-while-revalidate=300`, deterministic `ETag`, and `304 Not Modified` on matching `If-None-Match`.
- `/api/ra-events`: Returns Resident Advisor events with `Cache-Control: public, max-age=120, stale-while-revalidate=600`, deterministic `ETag`, and `304 Not Modified` on matching `If-None-Match`.
- `/api/menu-config`: Returns menu configuration with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`, deterministic `ETag`, and `304 Not Modified` on matching `If-None-Match`.
- `/api/img`: Query params `src`/`url`, `w`, `h`, `q`, `format`, `fit`. Returns `Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400` with `ETag`. Handles `If-None-Match` returning `304 Not Modified` with 0 body bytes. Supports streaming via `sendStream`.

### Data Layer
- `.data/*.json`: Concurrent-safe read/write operations using `atomicWriteJson` (temp file + rename) and in-memory caching to prevent race conditions and disk I/O bottlenecks.
- `raSyncEngine.ts`: Asynchronous, single-flight decoupled sync (`isSyncing` mutex) preventing public visitor latency spikes.

## Code Layout
- Server routes: `src/server/api/`
- Server utilities / middleware: `src/server/utils/`, `src/server/middleware/`
- Data store: `.data/`
- Verification / Benchmarks: `scripts/` or `tests/`
