# Original User Request

## Initial Request — 2026-09-12T09:16:40Z

Expand Kader's multi-language internationalization system to support Polish (`pl`), Czech (`cs`), and Spanish (`es`) across all UI strings, and merge the `/events` page functionality directly into the `/club` page while simplifying venue sections.

Working directory: `/home/ator/Kader`
Integrity mode: development

## Requirements

### R1. Expand i18n to Polish (pl), Czech (cs), and Spanish (es)
- Add `pl` (Polish), `cs` (Czech), and `es` (Spanish) to `SUPPORTED_LOCALES`, `Locale` type, and `localeLabels` in `src/composables/useLocale.ts`.
- Provide full, natural, accurate translation dictionaries for all ~938 leaf keys in Polish, Czech, and Spanish with 100% key parity across all 10 supported languages (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`).
- Update `Header.vue` language selector and `nuxt.config.ts` `hreflang` alternate meta tags to include `pl`, `cs`, and `es`.

### R2. Merge /events into /club Page & Simplify Club Sections
- On `src/pages/club.vue`:
  - Remove the detailed Sound System ("Klipsch La Scala") and Floors 01/02 sections as requested.
  - Retain the Club Culture / Safety ("Ljubljanska klubska kultura, svoboda in varnost") and Door Rules & FAQ ("Pravila na vratih & Pogosta vprašanja") sections.
  - Embed the complete interactive Events experience from `/events` (Upcoming RA Events grid, event detail modal with ticket purchase/Pretix integration, and past events archive) into `/club`.
- Set up a clean redirect from `/events` to `/club` or update navigation links in `Header.vue` and `Footer.vue` so "Klub & Dogodki" (Club & Events) seamlessly points to `/club`.

### R3. Automated Verification & Build Integrity
- Ensure type safety, reactive language switching, and SSR build compatibility.

## Acceptance Criteria

### Automated Verification
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` compiles cleanly into production Nitro SSR bundle (`.output/server`).
- [ ] Dictionary audit confirms 100% key parity across all 10 languages (`sl`, `en`, `de`, `fr`, `it`, `sr`, `nl`, `pl`, `cs`, `es`) with zero missing/fallback keys.
- [ ] `/club` page successfully renders upcoming & past events, door rules, and FAQ, with sound system/floors sections removed.
