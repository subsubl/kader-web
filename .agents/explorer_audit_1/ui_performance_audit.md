# Kader — UI, Components, Responsiveness & Performance Forensic Audit Report

**Date:** 2026-09-13  
**Auditor:** Explorer 1 (UI, Components & Performance Explorer)  
**Project:** Kader Grad Kodeljevo (`kader-grad-kodeljevo`)  
**Framework:** Nuxt 3 (SSR + Vue 3 + TypeScript + TailwindCSS)  
**Status:** Complete Forensic Investigation

---

## 1. Executive Summary & Critical Discoveries

This comprehensive audit inspected all public routes, shared layouts, navigation structures, modal dialogs, client asset loading mechanisms, responsive breakpoints, and performance vectors across the Kader web platform.

### High-Severity Findings Summary
1. **Critical Homepage Duplication (`/` vs `/pizzeria`)**:
   - In commit `b0fff5c3`, `src/pages/index.vue` was completely replaced by a verbatim copy of `src/pages/pizzeria.vue`.
   - The root route `/` has lost its authentic identity as "Grad Kodeljevo — Pizza bistro in plesni bar", discarding its castle hero narrative, the Day (Bistro) / Night (Club) split, upcoming event preview, and the extensive 10-language `home.*` translations already present in `src/composables/useLocale.ts`.
   - Both `/` and `/pizzeria` currently serve identical 900+ line pizza menus, identical SEO tags (`seo.pizzeria.title`), and duplicate `@type: 'PizzaRestaurant'` JSON-LD schemas.
2. **Orphaned High-Value Interactive Components**:
   - **`src/components/PizzeriaCraft.vue` (355 lines)**: An elaborate interactive Neapolitan craft HUD featuring 5 telemetry metrics (450°C, 72% H₂O, 48h fermentation, etc.), a 5-step dough/fermentation explorer, pizzaiolo quotes, and full 10-language translation support. It is currently unreferenced and unused on any page.
   - **`src/components/ProvenanceBadge.vue` (327 lines)**: A Neapolitan culinary ingredient registry (D.O.P. San Marzano, Bufala Campana D.O.P., Mortadella I.G.P., etc.) with interactive flyouts/tooltips. Unused on any page; pages use static un-interactive inline badges instead.
   - **`src/components/ClubDjPlayer.vue` (299 lines)**: A bespoke Klipsch audio player with live audio streaming, animated waveform visualizer, audio scrubbing, and volume control. It was previously mounted on `/club` and was inadvertently dropped during recent refactoring.
3. **Orphaned Public Route (`/shop`)**:
   - `src/pages/shop.vue` exists with full Pretix merch integration, translations, SEO schema (`@type: 'Store'`), and a `sitemap.xml` entry (`priority: 0.7`), but has **zero inbound links** anywhere on the site (missing from `Header.vue`, `Footer.vue`, and all page CTAs).
4. **Dead State & Unused Code**:
   - In `src/pages/pizzeria.vue`: `zoomOpen = ref(false)` and `activeView = ref<'digital' | 'printed'>('digital')` are declared with an un-triggerable teleported lightbox.
   - In `src/pages/index.vue` and `src/pages/pizzeria.vue`: `navCategories` and `activeCategory` are computed but never rendered.
   - In `src/components/Footer.vue`: `EnvelopeIcon` is imported but unused; `FacebookIcon`, `InstagramIcon`, and `TwitterIcon` render functions are defined in `<script>` but completely omitted from the `<template>`.
5. **Client Asset Loading, Image Optimization & Core Web Vitals (CWV)**:
   - 12+ below-the-fold image elements lack `loading="lazy"`, `decoding="async"`, and explicit `width`/`height` dimensions (causing Layout Shift / CLS).
   - Hero background images have `fetchpriority="high"` (good for LCP), but lack `decoding="async"`.
   - `src/plugins/pretix.client.ts` eagerly injects external Pretix JavaScript on **every** route load (even `/` and `/pizzeria`), and hardcodes `widget/v2.en.js` ignoring the user's selected language.
   - Hardcoded private IP fallback `http://192.168.64.147` in `PretixWidget.vue` and `shop.vue`.
   - Continuous `requestAnimationFrame` loop in `ClubDjPlayer.vue` executes even when audio playback is paused, creating background CPU and battery drain.
6. **Font Display & Typography Consistency**:
   - `nuxt.config.ts` preconnects to Google Fonts and loads `Playfair Display` and `Montserrat` with `display=swap`.
   - However, `tailwind.config.ts` defines `sans: ['Inter', 'sans-serif']`. `Inter` is **not** imported in the Google Fonts link, causing devices without local `Inter` (Windows, Android, Linux) to fall back to generic system sans, creating cross-platform rendering discrepancies.
7. **Address & GEO Metadata Discrepancy**:
   - `pizzeria.vue`, `club.vue`, and `buyouts.vue` contain a street typo: `'Kobalarjeva ulica 20'` (extra 'a').
   - `Footer.vue` and `index.vue` use `"Ulica Carla Benza 20"`, whereas `PROJECT.md` specifies `"Koblarjeva ulica 34"` with coordinates `46.0494, 14.5367`.
   - Schemas on `/pizzeria`, `/club`, `/buyouts` currently use outdated coordinates `46.0515, 14.5361`.

---

## 2. Public Pages Audit

### 2.1 `src/pages/index.vue` (Route `/`)
- **Current State**: Exact duplicate of `src/pages/pizzeria.vue`.
- **Intended Purpose**: Primary landing page for Grad Kodeljevo representing both the daytime Neapolitan pizza bistro and nighttime electronic music club & cultural venue.
- **Issues Identified**:
  1. **Content Mismatch (Lines 37-45)**: Page displays `t('pizzeria.titleMain')` ("Pizzeria Bistro Kader") and manifesto instead of home hero copy.
  2. **Unused Homepage Copy**: Extensive translation dictionaries under `"home"` in `useLocale.ts` (`home.dayTitle`, `home.dayP`, `home.nightTitle`, `home.nightP`, `home.basementTitle`, `home.terraceTitle`, `home.heroTaglineQuote`, etc.) are completely abandoned.
  3. **Duplicate SEO Metadata (Lines 618-642)**: Uses `seo.pizzeria.title` ("Pizzeria Kader Grad Kodeljevo...") instead of `seo.home.title` ("Kader Grad Kodeljevo — Pristna Neapeljska Pica & Klub Ljubljana").
  4. **Duplicate Schema (Lines 590-615)**: Hardcoded to `@type: 'PizzaRestaurant'` instead of a composite multi-entity `@graph` or `LocalBusiness`/`NightClub` + `Restaurant`.
  5. **Hero Image Decoding (Line 9)**: Missing `decoding="async"`.
  6. **Badge Image Dimensions (Line 263)**: `/logo-badge.png` missing `loading="lazy"`, `decoding="async"`, `width="48"`, `height="48"`.
  7. **Showcase Images (Lines 421, 430)**: Missing `loading="lazy"` and `decoding="async"`.
  8. **Dead Computeds (Lines 644, 714)**: `activeCategory` and `navCategories` computed without template representation.
  9. **Mobile Title Sizing (Line 38)**: `text-5xl md:text-7xl lg:text-8xl` causes text clipping on 320px–360px mobile viewports.

### 2.2 `src/pages/pizzeria.vue` (Route `/pizzeria`)
- **Current State**: Complete digital pizza menu, craft presentation, and reservation system.
- **Issues Identified**:
  1. **Address Typo in Schema (Line 615)**: `'Kobalarjeva ulica 20'` should be `'Koblarjeva ulica 34'` (or resolved to actual physical address).
  2. **Dead State & Phantom Lightbox (Lines 575-583, 656, 659)**:
     ```html
     <!-- Line 575: Modal for zoomOpen -->
     <div v-if="zoomOpen" ... @click="zoomOpen = false">
     ```
     `zoomOpen` is initialized to `false` (line 659) and is never toggled by any button or image click. `activeView` (line 656) is defined as `'digital' | 'printed'` but has no UI switcher.
  3. **Missing Integration with `PizzeriaCraft.vue`**:
     The page features a static "Začutite obrt" card grid (lines 357-416) rather than utilizing the richer `PizzeriaCraft.vue` component, which includes interactive phase telemetry, hydration physics, and master pizzaiolo insights.
  4. **Missing Integration with `ProvenanceBadge.vue`**:
     Lines 340-352 use plain static strings instead of rich `ProvenanceBadge` elements with interactive origin metadata and D.O.P. certification cards.
  5. **Showcase Images Lazy Loading (Lines 422, 431)**: Below-the-fold food images lack `loading="lazy"` and `decoding="async"`.
  6. **Hero LCP Decoding (Line 9)**: Missing `decoding="async"`.

### 2.3 `src/pages/club.vue` (Route `/club`)
- **Current State**: Electronic music club programming, RA events sync, live countdown, and Berlin door policy accordion.
- **Issues Identified**:
  1. **Dropped `ClubDjPlayer`**:
     The 299-line `ClubDjPlayer.vue` component was dropped from the page template in recent commits. It belongs directly beneath the hero section to showcase the venue's audio identity and resident sound curation.
  2. **Address Typo & Coordinate Mismatch in Schema (Lines 625, 632, 650, 668)**:
     - `'streetAddress': 'Kobalarjeva ulica 20'` (misspelled `Kobalarjeva`).
     - `'latitude': 46.0515, 'longitude': 14.5361` deviates from target `46.0494, 14.5367`.
  3. **Event Modal Scroll Lock (Lines 384-489)**:
     When `selectedEvent` is active, `document.body.style.overflow` is not locked to `hidden`, allowing background page scrolling behind the modal backdrop.
  4. **Past Events Image Attributes (Line 264)**:
     Flyer thumbnails lack `loading="lazy"`, `decoding="async"`, `width="48"`, `height="48"`.
  5. **Event Modal Flyer (Line 401)**:
     Missing `decoding="async"`.
  6. **Hero Image Decoding (Line 5)**:
     Missing `decoding="async"`.
  7. **Countdown Overflow on Narrow Mobile (Lines 65-82)**:
     4-column countdown (`min-w-[62px]`) with letter-spaced uppercase labels overflows viewports narrower than 360px when rendered with longer translated strings (e.g., German/French).

### 2.4 `src/pages/buyouts.vue` (Route `/buyouts`)
- **Current State**: Private venue rental & corporate buyouts page with tiered pricing, sound takeover banner, and reactive inquiry form.
- **Issues Identified**:
  1. **Address Typo & Coordinates in Schema (Lines 369, 376-377)**:
     - `'streetAddress': 'Kobalarjeva ulica 20'` typo.
     - `'latitude': 46.0515, 'longitude': 14.5361` needs alignment with standard coordinates `46.0494, 14.5367`.
  2. **Hero Image Decoding (Line 6)**:
     Missing `decoding="async"`.
  3. **Booking Image Lazy Loading (Line 62)**:
     `buyouts_booking_bg` image lacks `loading="lazy"` and `decoding="async"`.
  4. **Venue Showcase Grid Images (Lines 175, 185, 195, 205)**:
     All 4 venue showcase images lack `loading="lazy"` and `decoding="async"`.
  5. **Pricing Card Mobile Layout (Lines 74-124)**:
     On tablet breakpoints (768px–1024px), 3 columns with `p-8` creates cramped card widths (~150px content area). Should use `p-5 md:p-6 lg:p-8` or responsive stacking.

### 2.5 `src/pages/shop.vue` (Route `/shop`)
- **Current State**: Standalone merchandise shop with Pretix embed and pickup information.
- **Issues Identified**:
  1. **Complete Site Orphan**:
     There is no link pointing to `/shop` in `Header.vue`, `Footer.vue`, `index.vue`, `club.vue`, or `buyouts.vue`.
  2. **Hardcoded Private IP Fallback (Line 45)**:
     ```ts
     const pretixBase = (config.public.pretixUrl as string || 'http://192.168.64.147').replace(/\/$/, '')
     ```
     Falling back to internal LAN IP `http://192.168.64.147` causes broken iframe/widget loading in production or when `NUXT_PUBLIC_PRETIX_URL` is empty. Should fall back to `'https://pretix.eu'`.
  3. **Missing Canonical Base Portability (Line 63)**:
     Hardcoded `https://www.kader.si/shop`.

### 2.6 `src/pages/events.vue` (Redirect Route)
- **Current State**: Server redirect via `routeRules` in `nuxt.config.ts` (`{ redirect: { to: '/club', statusCode: 301 } }`) and client middleware redirect in `events.vue`.
- **Status**: Functionally sound. Properly passes query parameters and hash anchors to `/club`.

---

## 3. Shared Components & Layout Audit

### 3.1 `src/components/Header.vue`
- **Location**: Mounted globally in `src/layouts/default.vue`.
- **Issues Identified**:
  1. **Missing Desktop Home Link (Lines 11-15)**:
     The desktop `<nav>` links `/pizzeria`, `/club`, `/buyouts`, but does not include `/` (Home). Users can only reach home by clicking the logo image.
  2. **Club Link Label Inconsistency (Line 13 & 59)**:
     Link `/club` uses `t('nav.events')` ("Dogodki") rather than `t('nav.club')` ("Klub"). While `/events` redirects to `/club`, the destination page is "Club Kader", leading to ambiguity.
  3. **Missing Shop Link**:
     `/shop` is omitted from both desktop and mobile navigation menus.
  4. **Logo Image Decoding (Line 7)**:
     Missing `decoding="async"`.
  5. **Accessibility / ARIA (Line 35-43)**:
     Mobile menu button has `:aria-expanded="mobileMenuOpen"`, but lacks `aria-controls="mobile-navigation-drawer"`.

### 3.2 `src/components/Footer.vue`
- **Location**: Mounted globally in `src/layouts/default.vue`.
- **Issues Identified**:
  1. **Logo Image Optimization (Line 7)**:
     `/logo-badge.png` is missing `loading="lazy"`, `decoding="async"`, and explicit `width="40" height="40"`.
  2. **Unused Imports & Ghost Social Components (Lines 89, 95-97)**:
     - `EnvelopeIcon` is imported from `@heroicons/vue/24/outline` on line 89 but never used in template or script.
     - Lines 95-97 define render functions for `FacebookIcon`, `InstagramIcon`, and `TwitterIcon`, but they are **never rendered in the template**. The footer contains no social media links to Instagram (`@kader.lunapark`) or Resident Advisor (`ra.co/clubs/78778`).
  3. **Quick Links Coverage (Lines 18-26)**:
     Does not link to `/shop`.
  4. **Responsive Grid (Line 4)**:
     `grid-cols-1 md:grid-cols-4 gap-8` renders 1 single long column on tablet devices (640px–767px). Updating to `grid-cols-1 sm:grid-cols-2 md:grid-cols-4` significantly improves tablet layout balance.
  5. **Address Discrepancy (Lines 13, 33)**:
     Displays "Ulica Carla Benza 20, 1000 Ljubljana" while project contract specifies "Koblarjeva ulica 34, 1000 Ljubljana".

### 3.3 `src/components/ReservationModal.vue`
- **Location**: Teleported modal for table bookings and pizza pickup orders.
- **Issues Identified**:
  1. **Unmount Body Overflow Leak (Lines 185-192)**:
     `watch(() => props.isOpen)` sets `document.body.style.overflow = 'hidden'`, but lacks an `onUnmounted` hook. If the component unmounts while open (e.g., page navigation), `overflow: hidden` remains permanently locked on `document.body`.
  2. **Missing Keyboard Escape Handler**:
     Modal lacks a `@keydown.esc` listener (WCAG 2.1 Dialog Requirement).
  3. **Touch Target Size (Line 148)**:
     Footer close button has `min-h-[40px]` instead of the standard mobile touch target minimum of `min-h-[44px]`.

### 3.4 `src/components/ImageLightboxModal.vue`
- **Location**: Fullscreen gallery lightbox with swipe and keyboard controls.
- **Status**: High quality implementation (supports touch swipe, Arrow/Escape keys, unmount cleanup).
- **Minor Issues Identified**:
  1. **Thumbnail Loading Attributes (Line 113)**:
     Filmstrip thumbnail images lack `loading="lazy"`, `decoding="async"`, and `width="56" height="56"`.
  2. **Active Image Decoding (Line 70)**:
     Main stage image missing `decoding="async"`.

### 3.5 `src/components/PizzeriaCraft.vue` (Orphaned Component)
- **Lines**: 355 lines.
- **Status**: Orphaned (not referenced anywhere in `src/pages/`).
- **Internal Optimization Opportunities**:
  1. **Mobile Metric Grid Orphan (Line 23)**:
     `grid-cols-2 md:grid-cols-5` results in 2 rows of 2 and 1 orphaned item on row 3 on mobile screens. Should be `grid-cols-2 sm:grid-cols-3 md:grid-cols-5` or `last:col-span-2 sm:last:col-span-1`.
  2. **Navigation Step Controls (Lines 161, 170)**:
     `min-h-[36px]` buttons are below the 44px touch target threshold.
  3. **Tab Accessibility (Lines 57-70)**:
     Buttons act as tabs but lack `role="tablist"` and `role="tab"` attributes.

### 3.6 `src/components/ClubDjPlayer.vue` (Orphaned Component)
- **Lines**: 299 lines.
- **Status**: Orphaned (dropped from `club.vue`).
- **Internal Optimization Opportunities**:
  1. **Continuous Animation Loop (Lines 185-197, 288-294)**:
     `updateWaveform` calls `requestAnimationFrame(updateWaveform)` continuously on every single frame, even when `isPlaying === false`! It should only run when audio is playing or decay is active, stopping when idle to avoid mobile battery drain.
  2. **Touch Targets (Lines 35, 44, 108)**:
     Track switcher buttons and volume mute button use `p-1.5` with 16x16px SVG icons (total touch target ~28px), failing mobile touch guidelines (<44px).
  3. **External Asset Dependency (Line 164)**:
     `https://cdn.pixabay.com/audio/2022/10/25/audio_946777651a.mp3` relies on Pixabay CDN. Should use local or configured audio stream.

### 3.7 `src/components/ProvenanceBadge.vue` (Orphaned Component)
- **Lines**: 327 lines.
- **Status**: Orphaned (not referenced anywhere in `src/pages/`).
- **Internal Optimization Opportunities**:
  1. **Horizontal Viewport Overflow (Line 34)**:
     The flyout has fixed `w-72` (288px) centered with `left-1/2 -translate-x-1/2`. When rendered near the viewport edge on a 320px–375px mobile screen, it overflows the viewport horizontally. Needs `max-w-[calc(100vw-2rem)]` or popover positioning.
  2. **Button Touch Target (Line 7)**:
     Badge trigger button has small padding `px-2.5 py-1 text-[11px]` (~26px height). Needs `min-h-[36px]` or adequate tap spacing.

### 3.8 `src/components/PretixWidget.vue` & `src/plugins/pretix.client.ts`
- **Issues Identified**:
  1. **Eager Global Script Injection**:
     `src/plugins/pretix.client.ts` runs on app startup and injects `${pretixUrl}/widget/v2.en.js` into `<head>` regardless of current route. Users visiting only `/` or `/pizzeria` load unnecessary third-party ticketing scripts.
  2. **Hardcoded English Script in Plugin (Line 17)**:
     Injected script URL is hardcoded to `/widget/v2.en.js`, ignoring the active application locale (`v2.sl.js`, `v2.de.js`, etc.).
  3. **Private IP Fallback in `PretixWidget.vue` (Line 43)**:
     `'http://192.168.64.147'` fallback.

---

## 4. Link Integrity & Router Audit

| Source File | Line | Target Link / Route | Type | Status | Forensic Finding & Action |
|-------------|------|---------------------|------|--------|---------------------------|
| `Header.vue` | 6 | `to="/"` | Internal | Valid | Logo links home, but no text link exists in desktop nav. |
| `Header.vue` | 12, 58 | `to="/pizzeria"` | Internal | Valid | Working correctly. |
| `Header.vue` | 13, 59 | `to="/club"` | Internal | Valid | Text says `t('nav.events')` ("Dogodki") rather than "Klub". |
| `Header.vue` | 14, 60 | `to="/buyouts"` | Internal | Valid | Working correctly. |
| `Header.vue` | — | `to="/shop"` | Internal | **Missing** | `/shop` is missing from navigation. |
| `Footer.vue` | 21-24 | `to="/"`, `to="/pizzeria"`, `to="/club"`, `to="/buyouts"` | Internal | Valid | Working correctly. |
| `Footer.vue` | — | `to="/shop"` | Internal | **Missing** | `/shop` is missing from footer quick links. |
| `Footer.vue` | 39 | `href="tel:+38683836740"` | Tel | Valid | Pizzeria order line. |
| `Footer.vue` | 46 | `href="tel:+38640175628"` | Tel | Valid | Table reservation line. |
| `Footer.vue` | 95-97 | Instagram, Facebook, Twitter | Social | **Dead Code** | Defined in script, missing from template. |
| `index.vue` | 70, 453, 504 | `href="https://maps.app.goo.gl/8FAZpJkTksq2zZGq7"` | External | Valid | Google Maps pin for Grad Kodeljevo. |
| `club.vue` | 37, 196, 475 | `href="https://ra.co/clubs/78778"` | External | Valid | Resident Advisor club profile. |
| `club.vue` | 469 | `href="https://olaii.com"` | External | Valid | Fallback ticketing provider. |
| `buyouts.vue` | 158 | `to="/club"` | Internal | Valid | Working correctly. |
| `buyouts.vue` | 418 | `id="inquiry-form"` | Anchor | Valid | Form scroll target. |
| `shop.vue` | 17, 45 | `PretixWidget` / `shopUrl` | External / Widget | **Defective** | Falls back to internal LAN IP `192.168.64.147`. |
| `events.vue` | 6 | `path: '/club'` | Internal Redirect | Valid | 301 redirect to `/club`. |
| `sitemap.xml` | 4, 10, 16, 22, 28 | `/`, `/pizzeria`, `/club`, `/buyouts`, `/shop` | Sitemap | Valid | All 5 canonical routes listed. |

---

## 5. Responsive Design & Breakpoint Matrix

| Viewport | Range | Tested Pages | Glitches & Layout Defects Observed | Recommended Remediation |
|----------|-------|--------------|-----------------------------------|-------------------------|
| **Mobile XS** | 320px – 375px | `/`, `/pizzeria` | Hero title `text-5xl` (48px) causes overflow or word breakage on narrow viewports; action buttons (`min-w-[200px]`) wrap awkwardly. | Use `text-3xl sm:text-5xl md:text-7xl lg:text-8xl` and `w-full sm:w-auto`. |
| **Mobile XS** | 320px – 375px | `/club` | 4-column countdown (`min-w-[62px]`) with uppercase labels causes horizontal overflow or cramped text. | Use `grid-cols-4 gap-1.5 sm:gap-3` with `min-w-0` and responsive text sizing (`text-xl sm:text-3xl`). |
| **Mobile XS** | 320px – 375px | `ProvenanceBadge.vue` | Tooltip flyout `w-72` (288px) centered overflows viewport when triggered on column edges. | Constrain with `max-w-[calc(100vw-2rem)]` and clamp horizontal alignment. |
| **Mobile S/M** | 375px – 639px | `PizzeriaCraft.vue` | 5 metric HUD cards in `grid-cols-2` leaves 1 orphan card in row 3. | Use `grid-cols-2 sm:grid-cols-3 md:grid-cols-5` or `last:col-span-2 sm:last:col-span-1`. |
| **Tablet** | 640px – 767px | `Footer.vue` | Grid is `grid-cols-1 md:grid-cols-4`, collapsing to 1 single column on tablet viewports. | Use `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`. |
| **Tablet** | 768px – 1024px | `/buyouts` | 3 pricing cards in 3 columns with `p-8` leaves only ~150px content width. | Use `p-5 md:p-6 lg:p-8` or `grid-cols-1 lg:grid-cols-3`. |
| **Desktop** | >1024px | `Header.vue` | Navbar lacks link to `/` (Home) and `/shop`. | Add `/` ("Začetna" / "Home") and `/shop` to desktop nav. |

---

## 6. Client Asset Loading, Images & Performance Matrix

### 6.1 Image Elements Forensic Table

| File | Line | Element / Image Source | Above/Below Fold | `loading="lazy"` | `decoding="async"` | `fetchpriority` | Dimensions (`w`/`h`) | Action Required |
|------|------|------------------------|------------------|-------------------|--------------------|-----------------|----------------------|-----------------|
| `Header.vue` | 7 | `/logo-k.jpg` | Above (Header) | No (Correct) | **Missing** | Default | `width="120" height="48"` | Add `decoding="async"`. |
| `Footer.vue` | 7 | `/logo-badge.png` | Below (Footer) | **Missing** | **Missing** | Default | CSS only (`w-10 h-10`) | Add `loading="lazy"`, `decoding="async"`, `width="40" height="40"`. |
| `ImageLightboxModal.vue` | 70 | Active image | Modal | No | **Missing** | Default | CSS max-h | Add `decoding="async"`. |
| `ImageLightboxModal.vue` | 113 | Filmstrip thumbnails | Modal | **Missing** | **Missing** | Default | CSS only | Add `loading="lazy"`, `decoding="async"`, `width="56" height="56"`. |
| `index.vue` | 9 | `pizzeria_hero_bg` | Above (Hero) | No (Correct) | **Missing** | `high` (Correct) | Responsive | Add `decoding="async"`. |
| `index.vue` | 263 | `/logo-badge.png` | Below (Menu QR) | **Missing** | **Missing** | Default | CSS only (`w-12 h-12`) | Add `loading="lazy"`, `decoding="async"`, `width="48" height="48"`. |
| `index.vue` | 421 | `pizzeria_showcase_1` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `index.vue` | 430 | `pizzeria_showcase_2` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `pizzeria.vue` | 9 | `pizzeria_hero_bg` | Above (Hero) | No (Correct) | **Missing** | `high` (Correct) | Responsive | Add `decoding="async"`. |
| `pizzeria.vue` | 264 | `/logo-badge.png` | Below (Menu QR) | **Missing** | **Missing** | Default | CSS only (`w-12 h-12`) | Add `loading="lazy"`, `decoding="async"`, `width="48" height="48"`. |
| `pizzeria.vue` | 422 | `pizzeria_showcase_1` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `pizzeria.vue` | 431 | `pizzeria_showcase_2` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `pizzeria.vue` | 581 | `menuImageUrl` | Modal | No | **Missing** | Default | Responsive | Add `decoding="async"`. |
| `club.vue` | 5 | `club_hero_bg` | Above (Hero) | No (Correct) | **Missing** | `high` (Correct) | Responsive | Add `decoding="async"`. |
| `club.vue` | 130 | `event.flyer_url` | Below (Cards) | `lazy` (Present) | `async` (Present) | Default | CSS aspect-4/3 | Optimized. |
| `club.vue` | 264 | `pastEv.flyer_url` | Below (Past) | **Missing** | **Missing** | Default | CSS only (`w-12 h-12`) | Add `loading="lazy"`, `decoding="async"`, `width="48" height="48"`. |
| `club.vue` | 401 | `selectedEvent.flyer_url` | Modal | No | **Missing** | Default | CSS max-h | Add `decoding="async"`. |
| `buyouts.vue` | 6 | `buyouts_hero_bg` | Above (Hero) | No (Correct) | **Missing** | `high` (Correct) | Responsive | Add `decoding="async"`. |
| `buyouts.vue` | 62 | `buyouts_booking_bg` | Below (Process) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `buyouts.vue` | 175 | `ig_img_5.jpg` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `buyouts.vue` | 185 | `ig_img_7.jpg` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `buyouts.vue` | 195 | `ig_img_13.jpg` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |
| `buyouts.vue` | 205 | `ig_img_3.jpg` | Below (Showcase) | **Missing** | **Missing** | Default | CSS only (`h-80`) | Add `loading="lazy"`, `decoding="async"`. |

### 6.2 Typography & Font Display
- **Google Fonts Link in `nuxt.config.ts` (Line 30)**:
  `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600;700;900&display=swap`
  - `&display=swap` is correctly configured on Google Fonts.
  - **Critical Gap**: `tailwind.config.ts` sets `sans: ['Inter', 'sans-serif']`. Inter is used for the entire site's body, navigation, and UI text, yet Inter is not requested in the font link!
  - **Fix**: Update the font stylesheet URL to include Inter:
    `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600;700;900&display=swap`

### 6.3 Modern Rendering Techniques (`content-visibility`)
- `src/assets/styles/main.css` defines `.content-visibility-auto` with `contain-intrinsic-size: 1px 500px`.
- It is currently used on **zero elements**.
- Applying `.content-visibility-auto` to heavy offscreen sections (e.g. the 6-pillar FAQ on `/club`, past event archive on `/club`, the legal fine print on `/pizzeria`, the inquiry form on `/buyouts`, and `Footer.vue`) improves initial DOM layout time and interaction responsiveness (INP).

---

## 7. Concrete Line-Numbered Recommendations & Fix Blueprint

### Fix 1: Restore Authentic Homepage (`src/pages/index.vue`)
- **Target**: `src/pages/index.vue` (Lines 1–910).
- **Strategy**:
  1. Reconstruct `/` as the true castle portal uniting Day (Neapolitan Pizza Bistro) and Night (Club & Sound Culture) using the rich `home.*` translations.
  2. Wire up the hero banner to use `t('hero.title')`, `t('home.heroTaglineQuote')`, and dual CTAs pointing to `/pizzeria` and `/club`.
  3. Include the upcoming event card preview and castle space showcase (Kletni Klub, 2. Nadstropje, Poletna Terasa) using `home.basementTitle`, `home.secondFloorTitle`, etc.
  4. Point SEO metadata to `seo.home.title` and `seo.home.description`.
  5. Upgrade Schema.org structured data to a unified `@graph` featuring `LocalBusiness` / `Place` (Grad Kodeljevo) with nested `Restaurant` and `NightClub`.

### Fix 2: Clean Up Dead Code in `src/pages/pizzeria.vue` & Integrate Craft Components
- **Target**: `src/pages/pizzeria.vue` (Lines 575–583, 644–659).
- **Strategy**:
  1. Remove dead state: `zoomOpen` and unreferenced `activeView`. Remove the phantom `<Teleport to="body">` lightbox that is never opened, or wire it to a zoom button on the menu.
  2. Embed `PizzeriaCraft.vue` into `pizzeria.vue` to replace the static card section with the interactive craft telemetry.
  3. Replace static provenance pills with `ProvenanceBadge.vue` to make D.O.P. and craft certifications interactive.
  4. Fix address typo `'Kobalarjeva ulica 20'` -> `'Koblarjeva ulica 34'` and update coordinates to `46.0494, 14.5367`.
  5. Add `loading="lazy"` and `decoding="async"` to showcase images (lines 422, 431).

### Fix 3: Re-mount `ClubDjPlayer` & Polish `src/pages/club.vue`
- **Target**: `src/pages/club.vue` (Lines 25, 384–490, 625–675).
- **Strategy**:
  1. Mount `<ClubDjPlayer />` right after the hero section (around Line 25).
  2. In `ClubDjPlayer.vue`: Update `updateWaveform` so `requestAnimationFrame` only loops while `isPlaying.value` is true. Increase touch targets for player buttons to `min-w-[44px] min-h-[44px]`.
  3. Fix address typo and coordinates in `clubSchema` (`46.0494, 14.5367`).
  4. In `club.vue` event detail modal: Add `watch(selectedEvent, (ev) => document.body.style.overflow = ev ? 'hidden' : '')` and clean up on unmount.
  5. Add `loading="lazy"` and `decoding="async"` to past events flyers (Line 264) and modal flyer (Line 401).

### Fix 4: Connect Orphan Route `/shop` & Fix LAN IP Fallback
- **Target**: `src/components/Header.vue`, `src/components/Footer.vue`, `src/pages/shop.vue`, `src/components/PretixWidget.vue`.
- **Strategy**:
  1. In `Header.vue` (Line 15 & Line 61): Add `<NuxtLink to="/shop" ...>{{ t('nav.shop') || 'Shop' }}</NuxtLink>`.
  2. In `Footer.vue` (Line 25): Add `<li><NuxtLink to="/shop" ...>{{ t('nav.shop') || 'Shop' }}</NuxtLink></li>`.
  3. In `shop.vue` (Line 45) and `PretixWidget.vue` (Line 43): Replace fallback `'http://192.168.64.147'` with `'https://pretix.eu'`.
  4. In `plugins/pretix.client.ts`: Respect current locale (e.g. `v2.${locale.value}.js` or fallback to `v2.en.js`).

### Fix 5: Footer Social Media & Layout Polish
- **Target**: `src/components/Footer.vue` (Lines 4, 7, 80–84, 89–98).
- **Strategy**:
  1. Render real social media icons/links:
     - Instagram: `https://www.instagram.com/kader.lunapark/`
     - Resident Advisor: `https://ra.co/clubs/78778`
  2. Remove unused import `EnvelopeIcon`.
  3. Update grid from `grid-cols-1 md:grid-cols-4` to `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`.
  4. Add `loading="lazy"`, `decoding="async"`, `width="40" height="40"` to `/logo-badge.png`.

### Fix 6: Global Font Loading & Inter Sans Ingestion
- **Target**: `nuxt.config.ts` (Line 30).
- **Strategy**:
  Update stylesheet link:
  ```ts
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600;700;900&display=swap' }
  ```

### Fix 7: Lazy Loading & Performance Optimization Across All Pages
- **Target**: All `<img>` tags listed in Section 6.1.
- **Strategy**:
  Apply `loading="lazy"` and `decoding="async"` to all below-fold imagery; apply `decoding="async"` to hero images.
  Apply `.content-visibility-auto` to offscreen sections in `club.vue`, `pizzeria.vue`, `buyouts.vue`, and `Footer.vue`.

---

## 8. Verification & Test Confirmation

- **Typecheck**: `npm run typecheck` executed and verified with **0 errors**.
- **SSR Build**: `npm run build` executed and verified producing clean Nitro production bundles in `.output/server` and static assets in `.output/public`.
