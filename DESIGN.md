---
version: alpha
name: Quiet Technical
description: Monochrome, near-borderless portfolio system — ink-on-paper hierarchy, one neutral accent, almost no decoration. Calm, precise, professional.
colors:
  primary: "#18181B"
  secondary: "#71717A"
  tertiary: "#0A0A0A"
  neutral: "#FFFFFF"
  border: "#E4E4E7"
typography:
  h1:
    fontFamily: "Space Grotesk"
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  h2:
    fontFamily: "Space Grotesk"
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  h3:
    fontFamily: "Space Grotesk"
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  caption:
    fontFamily: "Inter"
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  sm: 6px
  md: 10px
  lg: 14px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  "2xl": 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: 10px
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 10px
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: 24px
  resume-row:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 16px
  divider:
    backgroundColor: "{colors.border}"
  nav-link:
    textColor: "{colors.secondary}"
    typography: "{typography.caption}"
  nav-link-active:
    textColor: "{colors.primary}"
  label-eyebrow:
    textColor: "{colors.secondary}"
    typography: "{typography.caption}"
---

## Overview

**Quiet Technical** is a monochrome design system for a backend-developer portfolio. It
replaces the previous "Cosmic Glass" direction (teal gradients, aurora/matrix motion,
glassmorphism, custom cursors) with a calm, paper-like surface where **hierarchy comes from
type and whitespace, not from color or decoration**. The single accent is ink itself — there
is no hue. Dark mode is the same system inverted (paper becomes near-black, ink becomes
near-white), not a different mood.

Design posture:
- One neutral palette. No teal, no gradients, no glow.
- Type-driven hierarchy: large Space Grotesk display, restrained Inter body, mono only for
  code/labels.
- Borders and background tone separate sections — not shadows, not blur, not cards-with-glow.
- Motion is limited to short (150–200ms) fades and small translates; everything respects
  `prefers-reduced-motion`.
- Decoration is removed: no starfields, no matrix rain, no custom cursor, no fake terminal
  HUD, no count-up monuments, no icon-topper cards unless the icon carries real meaning.

## Colors

- **Primary (#18181B):** near-black ink. Drives headlines, body text, and primary actions.
  This is also the only "accent" — emphasis is created by weight and contrast, not by hue.
- **Secondary (#71717A):** zinc-500 muted gray. Secondary text, captions, inactive nav,
  metadata. Never used as a background.
- **Tertiary (#0A0A0A):** pure ink. Used for primary-button hover and high-contrast moments.
- **Neutral (#FFFFFF):** paper white. Page background and primary-button label.
- **Border (#E4E4E7):** hairline zinc-200. The primary separator — used instead of shadows
  to delineate cards, rows, and sections.

Contrast: ink (#18181B) on paper (#FFFFFF) is ~16:1, far above WCAG AA. Muted (#71717A) on
paper is ~4.6:1 — acceptable for secondary text only, never for body copy.

## Typography

- **Display — Space Grotesk** (weights 500/600/700 only). Tight tracking (-0.03 to -0.04em)
  gives a precise, engineered feel without being playful.
- **Body — Inter** (400/500). Neutral, highly legible; the standard for professional/minimal
  product UIs. Replaces the previous Manrope.
- **Mono — JetBrains Mono** reserved strictly for code snippets, version tags, and small
  technical labels. Not used for running text.
- Two display weights max. No italic drama. Uppercase is allowed only for small eyebrow
  labels (caption style, 0.08em tracking).

## Layout

- Centered content column, max-width ~1080px, generous side padding.
- Vertical rhythm built from the spacing scale (sm 8 / md 16 / lg 24 / xl 40 / 2xl 64).
- Sections are separated by whitespace and a single hairline `divider`, not by floating
  glass panels.
- One idea per section. The hero states who you are and the single primary action; every
  later section answers one question (what I build, where I've worked, what I know).
- Lists (experience, projects, skills) are rendered as clean rows or a simple 2–3 column
  grid with hairline separators — not as equal-weight icon cards.
- A dedicated **Resume** section is required: experience as `resume-row` entries (date column
  + role + one-line scope), skills as an inline mono tag row, and a downloadable CV link.
  This gives the page a scannable, résumé-grade backbone while keeping the precise-mono feel.

## Elevation & Depth

- A single, very soft shadow is permitted for the sticky nav on scroll:
  `0 1px 2px rgba(0,0,0,0.04)`. No long blurred drop-shadows, no floating glow.
- Depth is expressed through background tone (paper vs a faint #FAFAFA surface) and borders,
  never through blur or layered gradients.
- Glassmorphism (`backdrop-filter: blur`) is removed entirely.

## Shapes

- Radii are small and consistent: 6 / 10 / 14px. This reads as precise and tool-like,
  replacing the previous 24–34px "bubble" rounding.
- Buttons and inputs share the `md` (10px) radius. Cards use `lg` (14px).
- Avoid fully-rounded pills except for the theme/language toggles where a round control is
  conventional.

## Components

- `button-primary` is the only high-emphasis action on a page (e.g. "View projects",
  "Contact"). Solid ink, paper label.
- `button-secondary` is a bordered, transparent alternative for lower-priority actions.
- `card` is a bordered surface with no shadow and no glow; used sparingly.
- `divider` is the workhorse separator.
- `nav-link` / `nav-link-active` drive the sticky header; active state is ink, inactive is
  muted — no underline animation theater.
- `label-eyebrow` marks section starts (e.g. "EXPERIENCE") in small uppercase muted text.
- `resume-row` is a bordered surface for one experience/skill entry: a mono date or tag
  column on the left, the role/title and a one-line description on the right, separated by a
  hairline. Rows stack with hairline borders — never as floating icon cards.

## Dark Mode

Dark mode inverts the same system — it is not a new palette. Map:

- background `#0A0A0A`, surface `#141414`, ink `#FAFAFA`, muted `#A1A1AA`,
  border `#27272A`, primary-action label `#0A0A0A` (ink button on light text).
- Accent remains monochrome. No teal, no glow.
- Implemented via `[data-theme='dark']` CSS variables in `theme.css`; the tokens above are
  the light-mode source of truth.

## Do's and Don'ts

**Do**
- Lead with type scale and whitespace for hierarchy.
- Use hairline borders and faint surface tone to separate content.
- Keep one primary action per view.
- Include a structured Resume section (experience rows + skills tags + CV link) for scannability.
- Cap motion at 200ms and honor reduced-motion.
- Use mono only for genuinely technical strings.

**Don't**
- Don't introduce any hue (no teal, blue, green, violet).
- Don't use gradients, glows, blurred glass, or floating shadows.
- Don't add starfields, matrix rain, custom cursors, or fake terminal HUDs.
- Don't use count-up numbers or icon-topper cards as decoration.
- Don't round corners beyond 14px.
- Don't let muted gray carry body copy (contrast fails).
