# Foundations

Source: [`css/01-tokens.css`](../css/01-tokens.css) · Machine-readable: [`tokens/tokens.json`](tokens/tokens.json)

## Colour

Components use **semantic tokens** only. Each edition or theme supplies its own values.

| Token | Role | Normal · light | Normal · dark | Street |
| --- | --- | --- | --- | --- |
| `--bg` | Page background | `#f2ede5` | `#0b0907` | `#151413` |
| `--bg2` | Raised surface | `#e8e0d3` | `#14100b` | `#1d1b19` |
| `--ink` | Primary text | `#1c1611` | `#f3ead9` | `#f1ece2` |
| `--mute` | Secondary text | `#6c6153` | `#a2968a` | `rgba(241,236,226,.62)` |
| `--line` | Hairline dividers | `rgba(28,22,17,.13)` | `rgba(243,234,217,.12)` | `rgba(241,236,226,.14)` |
| `--glass` | Frosted glass fill | `rgba(255,255,255,.5)` | `rgba(255,246,228,.045)` | `rgba(255,255,255,.04)` |
| `--glass-b` | Glass and control borders | `rgba(28,22,17,.1)` | `rgba(255,236,200,.12)` | `rgba(241,236,226,.16)` |
| `--chip` | Chip fill | `rgba(255,255,255,.78)` | `rgba(30,24,17,.82)` | `#141312` |
| `--acc` | Accent: primary buttons, focus ring | `#8f661d` | `#dcb66c` | `#e3242b` |
| `--acc2` | Accent highlight | `#b98a3a` | `#f4dba0` | `#ff4d4d` |
| `--on-acc` | Text on accent | `#fff8ec` | `#1b1309` | `#ffffff` |
| `--glow` | Accent glow | `rgba(201,154,69,.32)` | `rgba(220,182,108,.26)` | `rgba(227,36,43,.25)` |
| `--dim` / `--lit` | Scroll-lit headings, before / after | `rgba(28,22,17,.09)` / `#8f661d` | `rgba(243,234,217,.07)` / `#f4dba0` | `rgba(241,236,226,.12)` / `#f1ece2` |

### Street palette

Spray-can colours, used for stickers, paper notes and drips.

| Token | Value | Use |
| --- | --- | --- |
| `--s-red` | `#e3242b` | Accent, drips, active nav, primary sticker button |
| `--s-yel` | `#f4dc1f` | Paper notes, "Kids product" sticker |
| `--s-grn` | `#3cff52` | Path sticker |
| `--s-blu` | `#2f5bff` | Circle stickers |
| `--s-org` | `#ff7a1a` | Sticker variant |
| `--s-cream` | `#f1ece2` | Sticker borders, text |
| `--s-paper` | `#e6e0d2` | Paper |
| `--s-ink` | `#121110` | Ink |

### NoiseFit app (case study)

The rebuilt app screens use the product's own Figma tokens: background `#080a0b`, cards `#14171a`, text `#f8f9fa`, SF Pro and Satoshi.

## Typography

All fonts are self-hosted in [`assets/fonts`](../assets/fonts) and loaded by [`css/00-fonts.css`](../css/00-fonts.css), so the site needs no font service.

| Token | Family | Used for |
| --- | --- | --- |
| `--serif` | Bodoni Moda | Normal edition display headings, field values |
| `--sans` | Hanken Grotesk | Body copy and UI in both editions |
| `--tag` | Sedgwick Ave Display | Street graffiti headlines |
| `--hand` | Sedgwick Ave | Street hand-lettered notes |
| `--sten` | Big Shoulders Stencil | Street buttons, nav, labels |
| `--deva` | Tiro Devanagari Hindi | "नमस्ते" in the loader |
| — | JetBrains Mono | Card tags, Dev mode |

### Scale

Sizes are fluid: they scale with the viewport between a minimum and maximum.

| Style | Size | Notes |
| --- | --- | --- |
| Display (name, big words) | `clamp(60px, 15.6vw, 250px)` | One per section at most |
| Section heading (h2) | `clamp(44px, 6.6vw, 104px)` | Bodoni Moda 400 in Normal |
| Statement | `clamp(38px, 6.4vw, 104px)` | Scroll-lit "How I work" line |
| Sub-heading | `clamp(28px, 3.9vw, 58px)` | |
| Body | `clamp(16px, .94rem + .2vw, 18px)` / 1.55 | Hanken Grotesk |
| Button | `15.5px` (`14px` small) / 600 | |
| Label, small | `14px` | Field keys, chips |

**Rule:** each section uses two fonts and two sizes (headline + 18px body) wherever possible.

## Spacing and layout

| Token | Value | Use |
| --- | --- | --- |
| `--gut` | `clamp(20px, 4.4vw, 64px)` | Page side padding |
| `--sg` | `clamp(96px, 14vh, 168px)` | Gap between case study sections |
| `--hg` | `clamp(28px, 4.5vh, 48px)` | Gap under case study headings |

Content sits in a centred column. Work cards and the case study share a 1560px maximum width on wide screens.

## Radius

| Name | Value | Use |
| --- | --- | --- |
| Pill | `999px` | Buttons, chips, toggles, social links, toast |
| Card | `24px` | Contact fields, glass panels |
| Sticker | `11px` (`9px` small, `14px` XL) | Street sticker buttons |
| App card | `10px` | NoiseFit app cards |
| Paper | `4px` | Street paper and wall |

## Elevation

| Token | Value |
| --- | --- |
| `--shadow` · Normal light | `0 30px 60px -30px rgba(60,40,10,.35)` |
| `--shadow` · Normal dark | `0 40px 80px -30px rgba(0,0,0,.8)` |
| `--shadow` · Street | `0 18px 40px -16px rgba(0,0,0,.8)` |
| Sticker drop (Street buttons) | `0 4px 0 rgba(0,0,0,.5)` |

## Motion

| Token | Curve | Use |
| --- | --- | --- |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | Reveals, page transitions, menus |
| `--spring` | `cubic-bezier(.34,1.56,.64,1)` | Buttons, toast, copy button press |

Typical durations: 300–500ms for UI feedback, 600–800ms for reveals. All non-essential motion turns off under `prefers-reduced-motion: reduce`.

## Breakpoints

| Name | Width | Change |
| --- | --- | --- |
| Navigation | `≤ 1260px` | Nav links collapse into the burger menu |
| Laptop | `≤ 1060px` | Layouts tighten |
| Tablet | `≤ 900px` | Sections stack, review panel starts minimised |
| Phone | `≤ 520px` | Single column, smaller type steps |
