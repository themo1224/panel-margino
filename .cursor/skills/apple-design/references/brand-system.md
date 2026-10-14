# Brand System — Pricing Landing

Project-specific design tokens for this Next.js / Tailwind marketing site.
When reviewing or improving UI in this repo, load this file alongside the core HIG foundations
(`accessibility.md`, `color.md`, `layout.md`, `typography.md`).

## Palette

| Hex | Role | CSS token | Tailwind |
|-----|------|-----------|----------|
| `#237227` | Brand / primary | `--brand` | `brand` / `brand.DEFAULT` |
| `#519A66` | Brand muted / secondary | `--brand-muted` | `brand.muted` |
| `#FFAA00` | Accent gold | `--accent-gold` | `gold` / `gold.DEFAULT` |
| `#FFD786` | Accent soft | `--accent-gold-soft` | `gold.soft` |

HSL equivalents (shadcn-compatible, no `hsl()` wrapper):

| Token | HSL channels |
|-------|----------------|
| `--brand` | `123 53% 29%` |
| `--brand-muted` | `137 31% 46%` |
| `--accent-gold` | `40 100% 50%` |
| `--accent-gold-soft` | `40 100% 76%` |

## Semantic mapping

Dark-first default (`:root`):

- **Primary CTA** → `--brand` with light foreground (`--brand-foreground`)
- **Hover / secondary brand** → `--brand-muted`
- **Emphasis / highlights** → `--accent-gold`
- **Soft glow / selection tint** → `--accent-gold-soft`
- **Focus ring** → gold family (`--ring` aligned to accent gold)

Light appearance (`.dark` class in this codebase inverts to light surfaces): keep brand greens for CTAs; use gold sparingly for emphasis so contrast stays ≥4.5:1 on body text.

## Typography

Keep this stack — do not switch to Inter-only or system defaults for marketing:

- Heading / display: Estedad Mad FD (`--font-estedad`) → Vazirmatn → Aeonik
- Body / UI: Vazirmatn → Inter

UI labels: sentence case (not ALL CAPS / Title Case everywhere).

## Do / Don't

**Do**

- Use `bg-brand`, `text-brand`, `bg-gold`, `from-brand to-brand-muted`, `from-gold to-gold-soft` for brand accents
- Prefer semantic tokens (`primary`, `brand`, `gold`) over raw hex in components
- Check contrast: body text ≥4.5:1; large text ≥3:1

**Don't**

- Introduce purple / violet / fuchsia gradients or glow accents
- Use gold as the only indicator of state (pair with icon/label)
- Hardcode `#237227` / `#FFAA00` in many places — use CSS variables

## HIG → project token map

| HIG / system language | This project |
|----------------------|--------------|
| System / brand tint | `brand` (`#237227`) |
| Secondary fill | `brand.muted` (`#519A66`) |
| Accent / highlight | `gold` (`#FFAA00`) |
| Soft accent / wash | `gold.soft` (`#FFD786`) |
| SF Pro / system font | Estedad Mad (headings) + Vazirmatn (UI) |
| SF Symbols | Lucide / existing icon set in `src/components/global/icons.tsx` |
