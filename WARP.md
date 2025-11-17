# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Tooling & Commands

This is a Next.js (App Router) + TypeScript app with Tailwind CSS (v4-style `@tailwindcss/postcss`), Prisma, and Clerk auth.

### Package scripts (npm)

- **Start dev server** (primary entry point during development):
  - `npm run dev`
- **Build production bundle**:
  - `npm run build`
- **Start production server** (after build):
  - `npm run start`
- **Lint TypeScript/JavaScript**:
  - `npm run lint`

If you prefer other package managers, the default Next.js variants from `README.md` also work:

- Yarn: `yarn dev`
- pnpm: `pnpm dev`
- Bun: `bun dev`

### Linting details

`npm run lint` runs `eslint` with `eslint-config-next` (see `package.json`). Apply fixes with:

- `npx eslint . --fix`

Use TypeScript's compiler for type-only checks if needed:

- `npx tsc --noEmit`

### Prisma

Prisma is configured via `prisma.config.ts` and `prisma/schema.prisma` with a PostgreSQL datasource using `DATABASE_URL`.

Common commands (run from repo root):

- **Generate Prisma client** (after editing the schema):
  - `npx prisma generate`
- **Run migrations** (when models change):
  - `npx prisma migrate dev`
- **Inspect DB** (if needed during debugging):
  - `npx prisma studio`

These assume `DATABASE_URL` is set in your environment (or `.env`).

### Running a "single test" equivalent

There is no test runner configured yet (no Jest/Vitest/Playwright config or `test` script in `package.json`).

If you introduce a test framework later, prefer to:

- Add a focused script (e.g. `"test": "vitest"`) and use framework-native filters (`vitest my-file.test.ts`, `jest path/to/test`, etc.).

For now, rely on:

- The dev server (`npm run dev`) and manual checks via the browser.
- API route invocation via `fetch`/browser forms to validate backend behavior.

## High-Level Architecture

### Overview

- **Framework**: Next.js App Router with TypeScript.
- **Routing root**: `src/app`.
- **Styling**: Tailwind CSS v4-style via `postcss.config.mjs` and `src/app/globals.css` with CSS custom properties.
- **Auth**: Clerk (`@clerk/nextjs`).
- **Data layer**: Prisma ORM (`@prisma/client`) backed by PostgreSQL.

### App Router structure

The application uses the `app` directory structure under `src/app`:

- `src/app/layout.tsx`
  - Global root layout and navigation shell.
  - Wraps the app in `<ClerkProvider>` for authentication.
  - Defines `metadata` (title/description) and a persistent header with navigation links.
  - Uses the `Geist` and `Geist_Mono` fonts and applies global background/typography classes.
- `src/app/page.tsx`
  - Home page and marketing landing screen with several sections:
    - Hero section with background imagery and CTAs.
    - "Why Choose FitBeast" feature cards.
    - Classes preview cards.
    - Testimonials and final CTA.
  - Links into other pages (`/classes`, `/contact`, `/login`, etc.).
- Feature pages (currently mostly content stubs):
  - `src/app/about/page.tsx` — About FitBeast copy.
  - `src/app/classes/page.tsx` — **interactive schedule + booking UI**, see below.
  - `src/app/contact/page.tsx` — copy and future form location (current trial form stays on home).
  - `src/app/login/page.tsx` — Clerk `<SignIn>` experience.
  - `src/app/pricing/page.tsx` — pricing stub.
  - `src/app/programs/page.tsx` — programs stub.
  - `src/app/shop/page.tsx` — shop stub (cart icon in navbar points here).
  - `src/app/thank-you/page.tsx` — confirmation page for contact/trial form.
  - `src/app/trainers/page.tsx` — trainers stub.

All of these pages share the common layout shell from `layout.tsx`.

### Styling & theming

- `src/app/globals.css` imports Tailwind via `@import "tailwindcss"` and defines app-level CSS variables for background/foreground colors.
- An `@theme inline` block binds CSS variables to Tailwind-style tokens (`--font-geist-sans`, `--font-geist-mono`).
- The `<body>` background uses layered radial gradients for the visual style.
- Tailwind is wired via `postcss.config.mjs` using `"@tailwindcss/postcss"` as the sole plugin.

### Authentication (Clerk)

- `src/app/layout.tsx` wraps the entire app in `<ClerkProvider>`, enabling `@clerk/nextjs` hooks and components in child routes.
- `src/app/login/page.tsx` renders the `<SignIn>` component with:
  - `routing="path"`, `path="/login"`, and `signUpUrl="/login?signup=1"`.
  - Custom appearance overrides for the primary button and card container.
- In client components, `useUser` from `@clerk/nextjs` is used to check sign-in state.

For example:

- `src/app/classes/page.tsx` imports `useUser` and conditionally redirects unauthenticated users to `/login?redirect=/classes` when booking.

### Data layer & Prisma

- `prisma/schema.prisma` defines:
  - `User` model keyed by Clerk user id (`id: String @id`).
  - `Trainer`, `GymClass`, and `ClassBooking` models.
  - `DayOfWeek` enum for class scheduling.
- `src/lib/prisma.ts` contains the Prisma client singleton:
  - Uses `globalThis` caching in non-production environments to avoid multiple PrismaClient instances.
  - Enables logging for `"error"` and `"warn"` levels.
- `prisma.config.ts` sets:
  - `schema: "prisma/schema.prisma"`.
  - Migrations path: `prisma/migrations`.
  - Datasource `url` sourced from `env("DATABASE_URL")`.

### API routes (App Router / Route Handlers)

Location: `src/app/api/*/route.ts`.

- `src/app/api/bookings/route.ts`
  - **POST** handler to create a `ClassBooking` for a signed-in user.
  - Auth:
    - Uses `auth()` from `@clerk/nextjs/server` and requires `userId`; otherwise returns `401` JSON.
  - Payload:
    - Expects JSON body with `{ classId: string, date: string }`.
    - Validates presence and that `date` parses into a valid `Date`.
  - Behavior:
    - Upserts the `User` (ensures a record exists for the current `userId`).
    - Creates a `ClassBooking` with the given `classId` and parsed date.
    - Returns `{ booking }` with `201` on success.
  - This route is invoked from the `/classes` client page via `fetch("/api/bookings", { method: "POST", ... })`.

- `src/app/api/contact/route.ts`
  - **POST** handler that processes contact/trial form submissions.
  - Reads `FormData` fields: `name`, `email`, `goal`, `message`.
  - Currently logs submissions to `console.log` and redirects to `/thank-you` with status `303`.
  - Intended as a placeholder for wiring to a real email/CRM integration.

### Booking flow (how pieces connect)

Key cross-file flow for future changes/bugfixes:

1. **Client UI** — `src/app/classes/page.tsx`:
   - Renders an in-memory schedule (`SCHEDULE` constant) grouped by day-of-week.
   - Uses `useState` to track `selectedDay`, `bookingClass`, and `selectedDate`.
   - Uses `useUser()` to check `isSignedIn` and `useRouter()` for navigation.
   - When booking:
     - If not signed in, redirects to `/login?redirect=/classes`.
     - Otherwise, sends a JSON `POST` to `/api/bookings` with `classId` and `date`.

2. **API endpoint** — `src/app/api/bookings/route.ts`:
   - Validates auth and input.
   - Uses Prisma (`@/lib/prisma`) to upsert the `User` and create `ClassBooking`.

3. **Data model** — `prisma/schema.prisma`:
   - Defines `ClassBooking` relationships to `User` and `GymClass`.
   - Currently the UI schedule is static; `GymClass` records are expected to be pre-created (future admin tooling).

This flow is the main example of client ↔ API ↔ DB interaction in the current codebase.

### Routing & navigation shell

- `layout.tsx` defines a `NAV_ITEMS` array for the top navigation bar and renders links for: `/`, `/classes`, `/shop`, `/trainers`, `/programs`, `/pricing`, `/about`, `/contact`.
- The right side of the header includes:
  - A cart icon linking to `/shop`.
  - A `JOIN NOW` button linking to `/login` (hidden on smaller screens).
- All pages render inside the `<main>` container defined in `layout.tsx`, ensuring consistent padding and max width.

## Notes for Future Agents

- When adding new pages or features, follow the App Router conventions (folder-based routing under `src/app`).
- When extending booking functionality, be aware of the interplay between the static `SCHEDULE` constant in `classes/page.tsx` and the `GymClass`/`ClassBooking` Prisma models.
- For auth-sensitive features, use Clerk hooks in client components and `auth()` in server/route handlers, consistent with the existing booking endpoint.
