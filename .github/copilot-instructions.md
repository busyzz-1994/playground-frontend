# Copilot Instructions

## Tech Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, TailwindCSS v4, TanStack Query v5, React Hook Form + Zod, shadcn/ui (radix-vega style), `jose`, `date-fns`, `lucide-react`.

## Build & Dev Commands

```bash
pnpm dev          # next dev --turbopack
pnpm build        # next build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier --write "**/*.{ts,tsx}"
```

## Architecture

### API Layer (3 layers — always follow this pattern)

1. **Route Handlers** (`app/api/**`) — BFF proxies to the real backend via `backendFetch` from `lib/api.ts`. Forward cookies and relay `set-cookie` headers. Never call the backend from the browser directly.
2. **Services** (`services/*.ts`) — plain `async` functions that call `/api/...` routes and throw `Error` on failure. One file per domain (e.g. `services/auth.ts`, `services/users.ts`).
3. **Hooks** (`hooks/*.ts`) — wrap services with TanStack Query (`useQuery` / `useMutation`). Export query key factories alongside hooks. Navigation side-effects (e.g. `router.push`) go in `onSuccess`.

> Never use raw `fetch` in components or pages — always go through a service function called via a hook.

### Routing

```
app/
├── page.tsx                  # redirects → /dashboard
├── auth/page.tsx             # /auth (login + register tabs)
├── (dashboard)/              # route group, shared layout
│   ├── layout.tsx            # Server Component: auth guard + Sidebar/Header
│   ├── dashboard/page.tsx
│   └── profile/page.tsx
└── api/                      # BFF route handlers
```

`(dashboard)/layout.tsx` is a **Server Component** that reads the `token` cookie, calls `verifyToken` (from `lib/auth.ts`), and redirects unauthenticated users to `/auth`.

### Auth

- Token stored as HttpOnly `token` cookie set by the backend.
- **Middleware** (`middleware.ts`) uses `jwtVerify` from `jose` (Edge-compatible) to protect `/dashboard`, `/profile`, `/settings`. Do **not** import `jsonwebtoken` or `lib/auth.ts` in middleware — it breaks Edge Runtime.
- `lib/auth.ts` (`jsonwebtoken`) is for Server Components and Route Handlers (Node.js runtime) only.
- Secret: `process.env.JWT_SECRET`.

## Components

- UI primitives live in `components/ui/` — add new ones with `pnpm dlx shadcn@latest add <name>`.
- Dashboard-specific components (e.g. `Sidebar`, `Header`, `UsersTable`) live in `components/dashboard/`.
- Icons: `lucide-react` only.

## Code Conventions

- **Path alias**: `@/` maps to the workspace root.
- **Date formatting**: always use `date-fns` `format()`, never `toLocaleString`.
- **Zod schemas** in `lib/schemas.ts` — shared between form validation and exported TS types.
- **Forms**: React Hook Form + `zodResolver`. Register field name in schema matches the backend payload key (e.g. `userName`).
- **Styling**: Tailwind utility classes only, no inline styles. Class order enforced by `prettier-plugin-tailwindcss`.
- **QueryProvider** wraps the app in `app/layout.tsx` via `providers/query-provider.tsx`.
