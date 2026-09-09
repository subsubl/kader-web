# 🏰 Kader Grad Kodeljevo — Venue ERP & BI Platform

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.15-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Tested-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![CI](https://github.com/subsubl/Kader/actions/workflows/ci.yml/badge.svg)](https://github.com/subsubl/Kader/actions/workflows/ci.yml)

**Kader Grad Kodeljevo** is an all-in-one venue management platform, ERP, and Business Intelligence (BI) dashboard for **Grad Kodeljevo** — a historic Slovenian castle venue in Ljubljana operating as a daytime pizzeria, nighttime underground club, and event space.

---

## 🌟 High-Impact Features

### 🎧 1. Persistent Radio Meuh Header Player
- **Integrated Radio Stream**: Live internet radio stream from [Radio Meuh](https://www.radiomeuh.com/) pinned directly in the top header bar across all admin routes.
- **Player Controls**: Play/Pause with audio pulse indicator, **Stream Reload** button (for buffer recovery), volume slider, and one-click mute.

### 📊 2. Staff Operations BI Dashboard (`/admin/dashboard`)
- **Capacity Gauge**: Real-time venue occupancy meter with legal capacity thresholds and visual warnings.
- **Bar Revenue Velocity**: Live revenue tracking (€/hr) with shift-over-shift comparison.
- **Door Check-In Velocity**: Entry scan velocity (scans/hr) and peak hour estimation.
- **Hourly Visitor Flow Chart**: Interactive SVG bar breakdown of door traffic curves.
- **Live Surveillance Grid**: Embedded RTSP security camera view with multi-camera selector.

### 📹 3. RTSP Security Camera Stream Viewer & Settings
- **Live Video Window**: Embedded in BI Dashboard with camera switcher (Entrance, Club Floor, Pizzeria Bar, DJ Booth).
- **Stream Controls**: Snapshot capture, Fullscreen mode, audio toggle, and stream retry button.
- **Configurable Endpoints**: Full CRUD camera config under `/admin/settings` (RTSP, HLS, HTTP stream support).

### 📱 4. QR Digital Menu & Table Ordering System (`/order?table=N`)
- **Public Guest Ordering**: Mobile-first digital menu with category pill filters and real-time cart summary.
- **Server Price Validation**: Server-side price calculation and menu item availability verification (`/api/table-orders`).
- **Kitchen Display System (KDS)**: `/admin/kitchen` tablet display with 8s auto-polling, incoming order chime, order timers, and status buttons (`Pending` → `Preparing` → `Ready` → `Served`).

### 🤖 5. Telegram Staff Alerts Bot
- **Real-Time Push Alerts**: Dispatches instant HTML alerts to a designated staff Telegram group chat on:
  - 📋 **Venue Buyout Inquiries** (`/api/inquiries`)
  - 🍕 **Kitchen & Table Orders** (`/api/table-orders`)
  - 🎫 **Pretix Ticket Sales** (`/api/webhooks/pretix`)
- **In-App Testing**: "Send Test Alert" button on `/admin/settings` to verify bot credentials.

### 📣 6. Promoter Performance & Commission Tracker (`/admin/promoters`)
- **Leaderboard**: Aggregates promoter guestlist entries vs. verified door check-ins.
- **Commission Ledger**: Automatic commission calculation (€2.00 default or per-event override).
- **Payout Workflow**: One-click payout request generation, status tracking (`pending` → `approved` → `paid`), and CSV export.

### 📈 7. Post-Event P&L Report Generator (`/admin/pnl`)
- **Event Profitability**: Comprehensive breakdown of Revenue (Ticket, Bar, Door, Other) vs. Costs (Staff, Promoter, Artist, Venue, Other).
- **Pretix Auto-Prefill**: Pulls verified ticket totals, door check-in counts, and promoter payouts automatically.
- **Reporting**: Net profit margin calculation, draft/final status management, and downloadable CSV exports.

---

## 🧭 Navigation & Route Index

| Interface | Route | Auth Level | Description |
|---|---|---|---|
| **Public Landing** | `/` | Public | Dual-concept castle hero, event schedule, sound specs |
| **Pizzeria Menu** | `/pizzeria` | Public | Dynamic pizzeria food & beverage menu |
| **QR Table Order** | `/order?table=5` | Public | Guest table ordering cart & waiter alert |
| **Resident Advisor Events** | `/rae` | Public | Synced RA club events |
| **BI Operations Center** | `/admin/dashboard` | Staff / Admin | Live capacity, revenue velocity, RTSP camera |
| **Kitchen Display (KDS)** | `/admin/kitchen` | Staff / Admin | Tablet kitchen order management |
| **Promoter Tracker** | `/admin/promoters` | Admin | Promoter leaderboard & payout generator |
| **Event P&L Reports** | `/admin/pnl` | Admin | Event financial report manager & CSV exporter |
| **Door Operations** | `/admin/door` | Staff / Admin | Door check-ins, guestlist search, walk-ins |
| **Admin Settings** | `/admin/settings` | Admin | Camera feeds, Telegram bot, venue limits |

---

## 🛠 Tech Stack & Architecture

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3, SSR & Nitro Engine)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Service Role API, Row Level Security)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Dark Mode High-Contrast Venue Theme)
- **Icons & Media**: Heroicons, HTML5 Web Audio API, RTSP/HLS HTML5 Stream Video
- **Ticketing & Webhooks**: Pretix REST API & Webhooks (`/api/webhooks/pretix`)
- **Alert System**: Telegram Bot API (`sendTelegramAlert`)
- **E2E Testing**: [Playwright](https://playwright.dev/) (Chromium)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)

---

## ⚡ Quick Start

### Prerequisites
- Node.js `^20.0.0` or `^22.0.0`
- npm `^10.0.0`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/subsubl/Kader.git
cd Kader
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials in `.env`:
```env
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NUXT_SUPABASE_SERVICE_KEY=your-service-role-key
NUXT_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
NUXT_TELEGRAM_CHAT_ID=-100yourchatid
```

### 3. Database Migrations
Apply Supabase migrations in `/supabase/migrations/`:
```bash
npx supabase db reset
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

### Run Type Checking
```bash
npm run typecheck
```

### Run Production Build
```bash
npm run build
```

### Run Playwright E2E Tests
```bash
npm run test:e2e
```

---

## 🚢 CI/CD Pipeline

The repository includes a automated GitHub Actions workflow [`.github/workflows/ci.yml`](file:///home/ator/Kader/.github/workflows/ci.yml) that executes:
1. **Typecheck & Production Build** (`npm run typecheck` & `npm run build`).
2. **Playwright End-to-End Tests** against a live production preview build.
3. **Supabase Schema Validation** using local Postgres in Docker.

---

## 📄 License

Private repository — Kader Grad Kodeljevo. All rights reserved.