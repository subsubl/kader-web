# Kader Grad Kodeljevo Enterprise Application

## Overview

Kader Grad Kodeljevo is a hybrid daytime pizzeria and nighttime underground club located in the historic Grad Kodeljevo castle in Ljubljana, Slovenia. This enterprise application combines a public-facing website with an internal ERP/venue management system built with Nuxt 3, Vue 3, and Supabase.

### Key Features

- **Public Website**: Home page with castle hero section, dual messaging for pizzeria/club, dynamic pizzeria menu with dietary badges, club soundsystem specifications, event calendar with SEO-optimized landing pages, and buyouts/private hire with tiered pricing
- **Admin Dashboard**: Role-based access control (Admin/Door/Promoter), event management, CRM Kanban workflow, menu/price management, internal calendar, and BEO notes
- **Door Operations**: Guestlist/VIP check-in, promoter tracking, mobile-first dashboard with capacity tracking
- **Integration**: Pretix webhook for ticketing/POS synchronization
- **Database**: Supabase PostgreSQL with RLS for security
- **Design**: Dark mode high-contrast design system with responsive layout

## Setup

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn package manager
- Supabase account with project configured
- Pretix account for event management

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kader-grad-kodeljevo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   NUXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NUXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   NUXT_PRETIX_WEBHOOK_SECRET=<your-webhook-secret>
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

## Usage

### Public Website

Access the public website at `http://localhost:3000`:

- **Home Page**: Castle hero section with dual messaging for pizzeria and club
- **Pizzeria Menu**: Dynamic menu with dietary badges, sold-out indicators, and lazy-loaded images
- **Club Page**: Klipsch La Scala sound system specifications
- **Events Calendar**: Full calendar with individual event landing pages
- **Buyouts**: Tiered pricing for private hire with CRM lead capture

### Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin`:

#### Authentication

- Admin users must log in with Supabase credentials
- Role-based access control restricts functionality based on user roles

#### Features

- **Event Manager**: Create, read, update, delete events
- **CRM Kanban**: Manage inquiries through New → Discussion → Contracted → Invoiced workflow
- **Menu/Price Manager**: Update menu items and prices
- **Internal Calendar**: Schedule internal meetings and notes
- **BEO Notes**: Document business operations and procedures

#### Door Operations

- **Guestlist/VIP Check-in**: Scan QR codes or manually enter guest information
- **Promoter Tracking**: Monitor promoter activity and performance metrics
- **Mobile Dashboard**: Real-time capacity tracking and walk-in management

### Pretix Integration

The application includes a webhook endpoint at `/api/webhooks/pretix` that:

- Receives order notifications from Pretix
- Syncs orders and check-ins to Supabase
- Updates event availability in real-time
- Handles ticket redemption and cancellation

### Development

#### Running Tests

```bash
npm run test
```

#### Building for Production

```bash
npm run build
npm run start
```

#### Code Quality

The project includes:

- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- TypeScript type checking
- Component testing with Vitest

## Architecture

### Technology Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth with RBAC
- **Webhooks**: Pretix integration
- **Deployment**: Server-side rendering with Nuxt 3

### File Structure

```
src/
├── app.vue
├── pages/
│   ├── index.vue
│   ├── pizzeria.vue
│   ├── club.vue
│   ├── events.vue
│   └── buyouts.vue
├── components/
│   ├── Header.vue
│   └── Footer.vue
├── layouts/
│   ├── default.vue
│   └── admin.vue
├── server/
│   └── api/
│       └── webhooks/
│           └── pretix.ts
├── utils/
├── types/
└── assets/
    └── styles/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with descriptive messages
4. Push to the branch
5. Open a pull request

## License

MIT License

## Support

For support, please open an issue in the repository or contact the development team.