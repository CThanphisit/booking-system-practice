# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev       # Start development server (Next.js on port 3000)
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

No test runner is configured in this project.

## Environment

**Development** (`.env.local`):
- `NEXT_PUBLIC_API_URL=http://localhost:3000/` — public base URL used by the frontend
- `API_URL=http://localhost:3001` — backend API URL used server-side by the proxy

**Production** (`.env.production`):
- `NEXT_PUBLIC_API_URL=https://backend-booking-system-practice.onrender.com/`

## Architecture

This is a **Next.js frontend** that talks to a separate backend API (Node.js on port 3001 locally, Render.com in production). There is no ORM or direct database access here.

### API Access Pattern

All backend calls go through a single catch-all proxy route at [app/api/proxy/[...path]/route.ts](app/api/proxy/[...path]/route.ts). It forwards every HTTP method with cookies preserved and relays `Set-Cookie` headers back to the browser. Components call `/api/proxy/<endpoint>` — never the backend URL directly.

The lone exception is the server action in [app/actions.ts](app/actions.ts) (`registerUser`), which posts directly to the backend during the registration form submission.

### Authentication

- **Cookie-based JWT**: the backend sets `access_token` and `role` cookies on login.
- **Middleware** ([middleware.ts](middleware.ts)) enforces route protection server-side. Matcher covers `/dashboard`, `/bookings`, and `/admin` subtrees. Admin users are hard-redirected to `/admin/dashboard_admin` and cannot reach user-facing routes.
- **AuthContext** ([app/context/AuthContext.tsx](app/context/AuthContext.tsx)) wraps the whole app (see [app/layout.tsx](app/layout.tsx)) and exposes `useAuth()` with `user`, `isAuthenticated`, `isLoading`, `checkAuth()`, and `logout()`.

### Route Groups

| Path prefix | Who can access |
|---|---|
| `/`, `/rooms/[id]`, `/login`, `/register` | Public |
| `/dashboard`, `/booking/[id]/*`, `/my-bookings/*` | Authenticated users (non-admin) |
| `/admin/*` | `role === "ADMIN"` only |

### Key Directories

- [app/components/](app/components/) — feature-scoped components (admin, booking, room, etc.)
- [components/](components/) — shadcn/ui primitives
- [types/index.ts](types/index.ts) — all shared TypeScript types (`Room`, `Booking`, `Payment`, `User`, status enums)
- [app/schemas/](app/schemas/) — Zod validation schemas (Thai error messages)
- [lib/](lib/) — shared utilities

### UI Stack

Tailwind CSS v4 + shadcn/ui (style: `base-nova`, icons: Lucide). Component config is in [components.json](components.json). Path alias `@/` resolves to the repo root.

Image domains allowed in [next.config.ts](next.config.ts): `cdn.pixabay.com` and `res.cloudinary.com`.
