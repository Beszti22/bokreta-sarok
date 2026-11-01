# Bokréta Sarok Virágüzlet — Design System Master

> **Single Source of Truth** (`design-system/bokreta-sarok/MASTER.md`)
> Generated with `ui-ux-pro-max` (`--variance 5 --motion 5 --density 3`) and tailored to Bokréta Sarok's warm botanical editorial identity.

---

## 1. Brand & Aesthetic Direction

- **Client:** Bokréta Sarok Virágüzlet (Budapest IX., Mester u. – Bokréta u. sarok, alapítva 2010)
- **Tier:** Balanced / Restrained-Expressive Hybrid (`variance: 5`, `motion: 5`, `density: 3`)
- **Pattern:** 3-Step Visual Funnel (Inspiration → Custom Bouquet Configurator → Direct Order / Contact)
- **Tone:** Warm neighborhood craftsmanship, trustworthy, romantic yet approachable, fresh botanical elegance.

---

## 2. Color Tokens (WCAG AA 4.5:1 Verified)

| Semantic Role | CSS Custom Property | Value | Contrast Note |
|---------------|---------------------|-------|---------------|
| Primary Accent (Rose/Berry) | `--color-rose` | `#9e4754` | 5.4:1 on `#ffffff` (passes AA on primary buttons & badges) |
| Primary Hover | `--color-rose-dark` | `#7d333f` | 7.8:1 on `#ffffff` |
| Soft Rose Tint | `--color-rose-soft` | `#f5e6e8` | Subtle chip/badge highlight background |
| Botanical Sage | `--color-sage` | `#4a6349` | 6.4:1 on `#ffffff` |
| Deep Forest Sage | `--color-sage-dark` | `#334732` | 8.8:1 on `#faf6f0` (eyebrows, open badge text) |
| Soft Sage Tint | `--color-sage-soft` | `#eaf0e8` | Open status badge & icon surface |
| Warm Gold Accent | `--color-gold` | `#d4a84f` | Hero rating stars & dark-surface highlights |
| Page Background | `--color-cream` | `#faf6f0` | Warm natural linen |
| Alt Section Background | `--color-cream-deep` | `#f2ebe1` | Soft sand/parchment |
| Primary Ink | `--color-ink` | `#1e201d` | 15.6:1 on `#faf6f0` |
| Secondary Ink | `--color-ink-soft` | `#4e4b46` | 7.6:1 on `#faf6f0` |
| Card Surface | `--color-white` | `#ffffff` | Pure white card surface |
| Hairline Border | `--color-border` | `#e2d7c8` | Warm stone border |

---

## 3. Typography

- **Display / Headings (`--font-display`):** `'Playfair Display', Georgia, serif` — weights 500, 600, 700 + italic accents
- **Body / UI (`--font-body`):** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` — weights 400, 500, 600, 700
- **Base Size:** `16px` (`1rem`), line-height `1.65` for body copy, `1.15` for display headings.

---

## 4. Spacing, Layout & Motion

- **Spacing Scale (`density: 3` spacious):**
  - `--space-xs: 0.5rem` (8px)
  - `--space-sm: 1rem` (16px)
  - `--space-md: 1.75rem` (28px)
  - `--space-lg: 3rem` (48px)
  - `--space-xl: 5.5rem` (88px)
- **Viewport Stability:** Full-height hero uses `min-height: 88vh; min-height: 88dvh;`.
- **Scroll Lock:** Mobile navigation locks background scroll via `body.nav-open { overflow: hidden; }`.
- **Reduced Motion:** All keyframe animations, scroll-driven reveals, and hover transforms respect `@media (prefers-reduced-motion: reduce)`.
- **Touch Targets:** Minimum `44×44px` on all interactive controls (menu triggers, language toggle, lightbox controls, form chips).
