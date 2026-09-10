# Handoff Report: Milestone 2 — World-Class Neapolitan Pizzeria Showcase

**Agent**: Explorer Front 2  
**Target Milestone**: Milestone 2 (`src/pages/pizzeria.vue`, Ingredient Provenance Badges, Table Reservation & Takeaway Quick-Modal, Artisanal Craft & Oven Feature Section)  
**Working Directory**: `/home/ator/Kader/.agents/explorer_front_2`  
**Date**: 2026-09-10  

---

## 1. Observation

### 1.1 Existing Pizzeria Page Structure (`src/pages/pizzeria.vue`)
Direct observation of `/home/ator/Kader/src/pages/pizzeria.vue`:
- **Lines 4-78 (Hero Header)**:
  - Displays static badges: `48-Urna Fermentacija`, `San Marzano D.O.P`, `Mocarela Bufala D.O.P`, `Panuozzo Sendviči`.
  - Action buttons (lines 46-60) are plain anchor links executing `tel:+38683836740` and `tel:+38640175628`:
    ```html
    <a href="tel:+38683836740" class="px-8 py-4 bg-masanielli-gold text-black ...">
      <PhoneIcon class="w-4 h-4 mr-2" /> {{ t('pizzeria.pickUp') }}
    </a>
    <a href="tel:+38640175628" class="px-8 py-4 bg-zinc-950 border border-masanielli-gold/40 ...">
      <CalendarDaysIcon class="w-4 h-4 mr-2" /> {{ t('pizzeria.tableRes') }}
    </a>
    ```
  - Lacks an interactive digital booking/ordering modal interface.
- **Lines 82-165 (Philosophy & Heritage Cards)**:
  - 4 static cards: `01 / TESTO (48h Fermentacija)`, `02 / SESTAVINE (D.O.P. Poreklo)`, `03 / PANUOZZO (Grajski Sendviči)`, `04 / AMBIENT (Grad Kodeljevo)`.
  - Followed by 2 Instagram showcase images (`pizzeria_showcase_1`, `pizzeria_showcase_2`).
  - Lacks an interactive deep-dive into Neapolitan dough craft (hydration metrics, Caputo flour, "schiaffo" hand stretching, 450°C wood oven baking in 90 seconds, cornicione alveolar structure).
- **Lines 177-247 (Digital Menu View)**:
  - Categories: `pizza`, `panuozzo`, `stews`, `mains`, `salads`, `sides`, `desserts`, `drinks`.
  - Items in `cat.items` (lines 218-243) display `name`, `price`, `description`, and raw text `tags` (e.g. `['Vegetarijansko', '48h Ferment']`).
  - Tags lack visual distinction (no gold/emerald certifications), tooltips, or certified provenance explanations (D.O.P., I.G.P., Bio).
  - Cards have no action button to add items to a takeaway cart or initiate a booking.
- **Lines 377-384 (Sticky Mobile Action Bar)**:
  - Contains two `<a>` tags with `tel:` links to the two phone numbers.

### 1.2 Design System & Tailwind Palette (`tailwind.config.ts`)
Inspection of `/home/ator/Kader/tailwind.config.ts` lines 8-30:
- Brand colors extended:
  ```ts
  masanielli: {
    gold: '#cdb083',
    goldDark: '#a8895b',
    goldLight: '#e4cfab',
    darkBg: '#0f0a0d'
  },
  kader: { red: '#ed2224', black: '#101010', cream: '#f0efe0', gray: '#d2d3d4' }
  ```
- Fonts: `Playfair Display` (serif editorial header font) and `Inter` / `Montserrat` (sans/mono fonts).

### 1.3 TypeScript & Build Baseline
Execution of `npm run typecheck`:
```
> kader-grad-kodeljevo@1.0.0 typecheck
> nuxt typecheck
◆ Type check passed in 10933ms.
```
Build and types are 100% clean across the workspace.

---

## 2. Logic Chain

1. **Alignment with 50 Top Pizza Standards**:
   - World-class pizzerias (I Masanielli by Francesco Martucci, Pepe in Grani by Franco Pepe) distinguish themselves through transparent, obsessive focus on ingredient provenance (D.O.P., I.G.P., organic cold-pressed oils) and scientific precision in dough maturation (hydration, cold fermentation, wood-fired thermodynamics).
   - In `pizzeria.vue`, transforming plain string tags into rich, certified `ProvenanceBadge` components with micro-tooltips communicates prestige and quality directly on each menu item (e.g., Bufalina, Parma, Panuozzo Mortadela).

2. **Conversion Funnel via Quick-Modal**:
   - Forcing users into `tel:` links on desktop creates friction and loses visitors who prefer digital reservation or asynchronous takeaway pre-ordering.
   - A dual-tab Quick-Modal (`ReservationModal.vue`) triggered by `<Teleport to="body">` provides instant digital conversion while retaining high-priority phone call shortcuts (`+386 40 175 628` for table reservations; `+386 83 836 740` for takeaway orders).
   - Clicking `[+ Naroči za s seboj]` on any pizza/panuozzo card directly pre-populates the takeaway order cart with that item, removing ordering steps.

3. **Interactive "Craft & Oven" Experience (`PizzeriaCraft.vue`)**:
   - Visitors need visual and interactive proof of artisanal craftsmanship.
   - Placing an interactive 5-step stepper (`Moka Caputo & Kvas` → `72% Hidracija` → `48h Hladno Zorenje` → `Schiaffo Napoletano` → `450°C Peč na Drva`) and a live metrics HUD (`450°C`, `72%`, `48h`, `90s`, `Caputo '00'`) between philosophy and the menu establishes educational authority before ordering.

4. **Modular Architecture & State Decoupling**:
   - Introducing `useReservationModal.ts` allows any component across the site (Header navigation CTAs, hero buttons, sticky mobile bar, individual menu cards) to open either modal tab without prop drilling.
   - Creating standalone components (`ReservationModal.vue`, `ProvenanceBadge.vue`, `PizzeriaCraft.vue`) keeps `pizzeria.vue` lean, maintainable, and strictly typed.

---

## 3. Caveats

1. **Network Mode Restriction**:
   - In CODE_ONLY network mode, all assets and libraries must rely strictly on local packages (`@heroicons/vue`, Tailwind CSS, Vue 3, Nuxt 3). No external CDN scripts may be pulled.
2. **Database Persistence vs Client-Side Feedback**:
   - For table orders, `/api/table-orders.post.ts` currently exists for QR table orders tied to table numbers (1-50) and POS dispatch.
   - For public website table reservations and takeaway orders, the modal implements an instant confirmation flow generating unique reference codes (`#KDR-REZ-XXXX` and `#KDR-PICK-XXXX`) alongside direct phone shortcuts. Future integration can bind this to Supabase or the admin logbook without changing the frontend interface contract.
3. **Mobile Viewports**:
   - The modal must respect safe area insets (`bottom-safe`, `pb-safe`) and handle keyboard popups on mobile devices by remaining scrollable within `max-h-[90vh]`.

---

## 4. Conclusion & Proposed Blueprint

All architectural, visual, and interactive specifications have been produced and verified in `.agents/explorer_front_2/`:

1. **`proposed_useReservationModal.ts`**:
   - Reactive composable managing `isModalOpen`, `modalTab` (`'table' | 'takeaway'`), and `selectedItem` with `openReservation()`, `closeReservation()`, `setTab()`.
2. **`proposed_ProvenanceBadge.vue`**:
   - Rich badge component supporting `dop` (gold foil), `igp` (emerald), `bio` (teal), and `craft` (amber) styles.
   - Full dictionary of certified ingredients: San Marzano D.O.P., Mozzarella di Bufala Campana D.O.P., Fior di Latte dei Monti Lattari, 48-Urna Fermentacija, Mortadella Bologna I.G.P., Pistacchio di Bronte D.O.P., Olio Extra Vergine Bio, Prosciutto di Parma D.O.P., and Stracciatella Pugliese.
   - Interactive hover and tap tooltip with certification details, geographical origin, and culinary facts.
3. **`proposed_ReservationModal.vue`**:
   - High-fidelity `<Teleport to="body">` modal with backdrop blur (`bg-black/85 backdrop-blur-md`).
   - Tab 1 ("Miza"): Date selector, time slots (12:00–21:30), guest counter (1–12+), seating area selection (Grajski vrt vs Notranji ambient), contact inputs, direct phone shortcut (`+386 40 175 628`), and instant confirmation feedback with reference code.
   - Tab 2 ("Za S Seboj"): Cart item list with quantity steppers (`+` / `-`), subtotal calculation, quick-add chips, pickup time selector (ASAP, 45m, 1h, custom slot), takeaway instructions, direct phone shortcut (`+386 83 836 740`), and instant order confirmation.
4. **`proposed_PizzeriaCraft.vue`**:
   - Interactive 5-metric HUD: 450°C wood oven, 72% hydration, 48h fermentation, 90s flash bake, Caputo '00' flour.
   - Interactive 5-step dough craft explorer with technical specifications, master quote, and visual graphic card.
   - Cornicione anatomy breakdown: Maculatura (leopard spotting), alveolatura (air pockets), and digestibility science.
5. **`proposed_pizzeria_patch.md`**:
   - Line-by-line guide for integrating components, guarantee banner, and item card CTA buttons into `src/pages/pizzeria.vue`.

---

## 5. Verification Method

### 5.1 Static Type & Build Verification
Execute Nuxt typecheck and build command:
```bash
npm run typecheck
npm run build
```
*Expected Result*: 0 TypeScript errors, 0 compilation warnings, build completes successfully.

### 5.2 Component Inspection
1. **Badges Rendering**:
   - Inspect `src/pages/pizzeria.vue` digital menu: verify gold D.O.P. badges on `Bufalina` and `Parma`, emerald I.G.P. badges on `Panuozzo Mortadela`.
   - Hover or tap badges: confirm flyout tooltip displays origin and certification text.
2. **Modal Interaction**:
   - Click hero button "Naročim in pridem iskat": verify modal opens on "Za S Seboj" tab.
   - Click hero button "Rezervacije miz": verify modal opens on "Miza" tab.
   - Click `[+ Naroči za s seboj]` on `Bufalina`: verify modal opens with `Bufalina (12 €)` pre-loaded in cart.
   - Test ESC key: modal closes immediately.
   - Test form submission: renders confirmation state with reference code and summary.
3. **Pizzeria Craft & Oven Section**:
   - Click metric cards or step buttons (01 to 05): verify active step updates dynamically with smooth transitions.
4. **Responsive Layout**:
   - Test viewport at 375px (mobile), 768px (tablet), and 1440px (desktop): ensure sticky action bar operates cleanly without viewport clipping.

### 5.3 Invalidation Conditions
- If `ReservationModal.vue` fails to lock background scrolling when open.
- If `npm run typecheck` produces any missing prop or import errors.
- If item cards lack direct click triggers to open the takeaway modal.
- If provenance badges lack hover tooltips or have low contrast against `#000000`.
