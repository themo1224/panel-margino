# Agent context — Pricing Panel

This folder is the **Pricing seller panel** (Vite + React SPA). Sellers manage costs, see rival analysis, recommendations, reports, alerts, and API keys.

## Product truth

- Strategy / product language: `iran-saas/STRATEGY.md` (or monorepo `STRATEGY.md` when present)
- Phase 1: MSW + mock data (no seller JSON API yet)
- Phase 2: wire real Sanctum JSON API via `VITE_API_URL`

## Stack & conventions

Follow [`.claude/skills/shadcn-dashboard-free/SKILL.md`](.claude/skills/shadcn-dashboard-free/SKILL.md):

- Views in `src/views/`, routes in `src/routes/Router.tsx`
- Sidebar: `src/layouts/full/vertical/sidebar/sidebaritems.ts` (single **seller** role)
- Mock data: `src/api/<feature>/` + MSW in `src/api/mocks/handlers/`
- Brand tokens: `src/css/globals.css` (`#237227` / `#519A66` / `#FFAA00` / `#FFD786`)
- UI: Farsi RTL (`lang="fa"` `dir="rtl"`), Vazirmatn

## Key product proof

Home and products must show **rival analysis** (source, cheapest/median/count, store vs rival, stale / cannot-match) — not only a recommended price.

## Out of scope here

WordPress plugin UI, Torob scraping, Instagram automation, public API (coming-soon chips only).
