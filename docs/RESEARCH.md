# Kader — Research Notes (agent-reach)

Collected via **agent-reach** skill (web = Jina Reader; GitHub = gh CLI) on 2026-08-10.
Folded into the v1 build on branch `build/kader-v1`.

## Venue — Grad Kodeljevo ⚠️ corrections vs. original brief
- **Type:** 17th-century manor (*dvorec*), Renaissance style, 2 storeys, steep hipped roof. Cultural monument (**RKD 1118**, declared 1984) + natural landmark.
- **Location:** Kodeljevo district, Ljubljana, on Koblarjeva ulica (near Športni park Kodeljevo & Fakulteta za šport).
- **Geo:** **46°3′0″N 14°31′52″E → 46.05000, 14.53111**. (The prior webpage-factory schema used 46.0511/14.5422 — corrected.)
- **History:** Cadelli family were owners; Anton Codelli brought the first car to Ljubljana (1898). Baroque chapel (1738) with Cararra-marble altars.
- **Current use:** ground floor = pub + pizzeria (fits Kader's "pizza bistro"); venue subject to ongoing restitution process.
- **Kader site today (www.kader.si):** tagline *“Pizza bistro in plesni bar na gradu Kodeljevo”* — address **Ulica Carla Benza 20, 1000 Ljubljana**. → use this street address in schema, not Koblarjeva ulica.

## Audio — Klipsch La Scala (club page) ✅ corrected
- Current production model is **La Scala AL6**, not the legacy "La Scala Series".
- **Three-way, fully horn-loaded** floorstanding loudspeaker.
- **K-406M patented Tractrix® mid-range horn**, 2" throat — high presence/precision.
- **Mumps™** coverage tech (flat response to horn edge).
- **Horn-loaded, vented** bass cabinet (ported efficiency + horn-loaded output).
- Optional **Heritage Active Crossover** DSP — time/phase alignment + EQ (from Klipsch Jubilee trickle-down).
- Value prop for a club: horn-loaded = more acoustic power per watt = lower distortion at high SPL; ideal in a stone vault.

## GitHub — reference projects found
- `weezly/pretix-api-client`, `itk-dev/pretix-api-client-php` → confirms Pretix has first-party REST API + community clients (webhook sync approach is valid).
- `S-nirmal15/Restaurant-Reservation-Booking-System` — enterprise full-stack restaurant booking (analytics, multi-location) → useful for buyouts/CRM scale-up.
- `angelinaquan/Reservation-Sniper` — reservation automation (NY/SF/LA restaurants).
- Nuxt 3 + Supabase SSR: no pinned community scaffold surfaced via gh search this run; our hand-authored config stands.

## Placeholder images
All `/images/*` local paths replaced with **Unsplash CDN placeholders** (`images.unsplash.com/...?auto=format&fit=crop`). Swap for real flyer/site photography later — Supabase Storage is the intended home.

## Open items (from Daedalus audit + this research)
1. **High:** type the Supabase client in `src/server/api/webhooks/pretix.ts`.
2. **Medium:** buyouts form validation; events-filter error handling.
3. **Low:** hero still uses a generic castle/restaurant image — request actual Grad Kodeljevo photography for production.