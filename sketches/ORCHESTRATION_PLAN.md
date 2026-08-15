# Orchestration Plan — Refactor Public Portfolio UI ("Quiet Technical")

## Goal
Refactor the PUBLIC portfolio page (app/(public), components/* public, features/public/*)
from "Cosmic Glass" (teal gradients, aurora/matrix motion, glassmorphism, custom cursor,
devtools trap, complex preloader, fake terminal HUD) to a monochrome, minimal, professional
system per DESIGN.md ("Quiet Technical" / Precise Mono + Resume, variant 004).

## Constraints
- ACCENT: black/white monochrome only. NO teal/cyan/blue/green/violet anywhere.
- DARK MODE: keep, as inverted monochrome (near-black #0A0A0A bg, near-white #FAFAFA ink).
- KEEP: CMS data flow (publicService, Supabase schema, all API routes), admin pages untouched.
- Tokens already defined: DESIGN.md, lib/theme.css (Tailwind v4 @theme), tailwind.config.js
  already wired to var(--color-*), var(--radius-*), font-body/display/mono.
- Class names `.content-plane`, `.panel`, `.panel-strong`, `.stats-card` MUST be preserved
  (used by 10 components) — only restyle them to monochrome inside globals.css.
- Motion: short fades/translates only (<=200ms), honor prefers-reduced-motion (already in
  MotionConfig reducedMotion="user").
- Fonts: Space Grotesk (display, 500/600/700), Inter (body), JetBrains Mono (labels/code only).

## Pre-change reference (grep map)
- Delete-safe (only self-defined): MatrixBackground.jsx, CustomCursor.jsx
- Used by PortfolioPage only: AnimatedAuroraBackground.jsx, Preloader.jsx, Terminal.jsx
- Used by app/providers.jsx: DevToolsTrap.jsx
- globals.css classes used across 10 components: content-plane, panel, panel-strong, stats-card

## Task Decomposition (each = 1 agy call + verify + commit)

### T1 — Remove obsolete effects
- Delete: components/MatrixBackground.jsx, components/CustomCursor.jsx,
  components/AnimatedAuroraBackground.jsx, components/Preloader.jsx,
  components/Terminal.jsx, components/DevToolsTrap.jsx
- Edit app/providers.jsx: remove <DevToolsTrap /> and its import.
- Edit features/public/pages/PortfolioPage.jsx:
  - remove imports of Preloader, AnimatedAuroraBackground, Terminal (and lazy Terminal)
  - remove <AnimatedAuroraBackground .../>, <Terminal />, <Preloader /> / AnimatePresence block
  - keep theme state + data-theme effect + visit-tracking effect
  - keep MotionConfig reducedMotion="user" wrapper but simplify (no loading/preloader states)
  - NO visual restyle yet (T2/T3 handle styling)

### T2 — Restyle public components to monochrome precise-mono
Files: Hero, Stats, Skills, Projects, Experience, Approach, Contact, Navbar, Footer,
TechMarquee (components/*.jsx).
- Replace teal/cyan colors with ink/neutral/border tokens (use Tailwind utilities:
  text-foreground, text-muted-foreground, bg-background, border-border, bg-primary, etc.
  — these map to theme.css vars).
- Remove: glassmorphism (backdrop-blur), glows, accent rails, gradient backgrounds,
  icon-topper cards, count-up numbers (Stats -> static numbers), spotlight hover (Skills).
- Hero: two-column precise layout (statement + mono spec list) per sketch 004.
- Stats: static grid, no count-up, no icon topper (or minimal).
- Skills: inline mono tag row (no per-card spotlight).
- Projects/Experience: hairline-separated rows/list (no floating cards).
- Navbar: keep function, simplify visuals (remove heavy scroll progress if present).
- Footer/Contact: mono, minimal.
- TechMarquee: keep marquee but monochrome (no colored glow).
- DO NOT change data props/CMS wiring.

### T3 — globals.css cleanup + Resume section + theme import
- Import lib/theme.css at top of app/globals.css (or ensure tokens load).
- Restyle .content-plane / .panel / .panel-strong / .stats-card to monochrome
  (remove teal gradients, glows, accent ::before rails). Keep class names.
- Remove dead CSS for deleted components (aurora, matrix, cursor, preloader, terminal, devtools).
- Add a Resume section to PortfolioPage (after Experience): experience rows
  (date column + role + one-line scope) + skills mono tag row + "Download CV" button
  (links to /public/assets or placeholder #). Use cmsData for experiences/skills if available,
  else static fallback.
- Ensure dark mode works via [data-theme='dark'] (already set on <html> by PortfolioPage).

### T4 — Verify & build
- npm run lint && npm run build (agy runs, but orchestrator re-verifies).
- Fix any JSX/orphan-tag/lint errors.

## Verification gates (orchestrator, not agy)
1. git status --short shows expected files changed only.
2. grep -ri "teal\|#16626c\|#63d0be\|gradient\|backdrop-blur" components app features/public
   returns nothing in public scope.
3. npm run build succeeds (exit 0).
4. npm run lint passes (or only pre-existing warnings).

## Rollback
Each task committed separately -> `git revert <hash>` per task if needed.
