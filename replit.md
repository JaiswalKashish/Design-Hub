# Smart Bharat AI

A production-quality AI-powered civic companion platform for Indian citizens — simplifying access to government services, enabling complaint reporting, providing personalized scheme recommendations, and offering multilingual AI assistance. Built for the DEVENGERS PromptWars 2026 Hackathon.

## Run & Operate

- `pnpm --filter @workspace/smart-bharat-ai run dev` — run the frontend (auto-started via workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (auto-started via workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (pre-configured by Replit)
- Optional env: `GEMINI_API_KEY` — Google Gemini API key for live AI features (placeholder responses used if not set)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide icons, Wouter routing, React Query
- **Backend**: Express 5, Drizzle ORM, PostgreSQL
- **AI**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **UI**: Radix UI components, Recharts, Sonner toasts, next-themes dark mode
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/smart-bharat-ai/` — React + Vite frontend, preview path `/`
- `artifacts/api-server/` — Express backend, preview path `/api`
- `lib/api-spec/openapi.yaml` — Single source of truth for API contracts
- `lib/db/src/schema/` — Drizzle ORM schema (complaints, chat, users)
- `artifacts/api-server/src/lib/gemini.ts` — Gemini AI integration
- `artifacts/api-server/src/routes/` — API route handlers

## Pages

| Route | Page |
|-------|------|
| `/` | Landing page (public) |
| `/login` | Login / Register |
| `/dashboard` | Main dashboard (authenticated) |
| `/chat` | AI Civic Companion (ChatGPT-style) |
| `/schemes` | Government Scheme Finder |
| `/documents` | Document Assistant |
| `/report-complaint` | Report Complaint (multi-step) |
| `/track-complaint` | Track Complaint by ID |
| `/nearby` | Nearby Government Offices |
| `/emergency` | Emergency Services |
| `/profile` | User Profile & Settings |
| `/admin` | Admin Dashboard |

## Architecture decisions

- Auth is simulated via `AuthContext` with a mock user (`user-1`) — easily replaceable with Firebase Auth or Clerk
- Gemini AI called server-side to keep API key secure; returns graceful placeholder if key not set
- All DB queries use Drizzle ORM (no raw SQL) — no SQL injection risk
- OpenAPI-first: all contracts in `lib/api-spec/openapi.yaml`, types auto-generated
- Chat XSS-safe: AI responses rendered as plain `whitespace-pre-wrap` text, not innerHTML

## User preferences

- Modern SaaS look with glassmorphism, blue (#2563EB) primary, green (#22C55E) accent, dark navy secondary
- No emojis in the main UI
- Framer Motion animations throughout

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Always run `pnpm run typecheck:libs` after changing any `lib/*` package
- The `GEMINI_API_KEY` environment variable must be set for live AI responses
- Admin status updates use `complaintId` (e.g. `SB-XXXXXXXX`), not numeric `id`
