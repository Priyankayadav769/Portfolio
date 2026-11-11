# Design system

The rules behind the portfolio: tokens, foundations, components and their states. Everything here comes from the live code in [`../css`](../css), so the docs and the site always agree.

| Document | What's inside |
| --- | --- |
| [Foundations](foundations.md) | Colour, typography, spacing, radius, elevation, motion, breakpoints |
| [Components](components.md) | Every UI component, its variants and its interaction states |
| [States](states.md) | Page-level states: editions, themes, intro options, layouts, flows |
| [Accessibility](accessibility.md) | Contrast checks, focus, keyboard, motion and screen readers |
| [Tokens (JSON)](tokens/tokens.json) | All tokens in W3C Design Tokens format, ready for Figma Tokens Studio or Style Dictionary |
| [Style guide](style-guide.html) | A visual page that renders the tokens and components. Open it in a browser |

## Principles

1. **Same work, two moods.** One content model, two editions. *Normal* is warm light, frosted glass and gold. *Street* is spray paint, stickers and a lot of red. A visitor picks one on arrival and can switch at any time.
2. **Tokens first.** Colours, type and motion are CSS custom properties. An edition or theme is a new set of token values, never a new component.
3. **Simple things, done properly.** Two fonts and two sizes per section wherever possible. One spacing system for the whole case study.
4. **Readable by default.** Body text meets WCAG AA in every edition and theme. Focus is always visible and motion respects the system setting.

## How the editions and themes switch

```
<html data-edition="gold">                 Normal edition (follows the system light/dark setting)
<html data-edition="gold" data-theme="dark">  Normal edition, forced dark
<html data-edition="street">               Street edition (always dark)
```

The token blocks live in [`css/01-tokens.css`](../css/01-tokens.css). Components only ever read the semantic tokens (`--bg`, `--ink`, `--acc` …), so they restyle themselves when the edition or theme changes.
