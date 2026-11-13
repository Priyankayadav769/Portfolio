# Priyanka Yadav · Product Designer

UI/UX and product designer at Noise, Gurugram. Designing for people, building with AI.

**Live site → https://priyankayadav769.github.io/portfolio/**
**Style guide → https://priyankayadav769.github.io/portfolio/design-system/style-guide.html**

---

## Selected work

| Project | Client | Type |
| --- | --- | --- |
| **[NoiseFit sleep details page revamp](https://priyankayadav769.github.io/portfolio/case-studies/noisefit-sleep.html)**: a calmer way to read a night's sleep. One score up top, and the contributors that shaped it right below. | NoiseFit app | Mobile app · Data visualisation · Design system |
| **Noise Junior purchase review**: a bright, friendly review moment for the Noise Jr. Champ 3. One product, one question, five stars from poor to great. Case study coming soon. | Noise Junior | Mobile app · Post-purchase flow · Kids product |
| **[Bose × Noise Master Buds](https://www.gonoise.com/a/h/noise-master-buds-2-truly-wireless-earbuds)**: the launch page for Master Buds with sound by Bose. Big imagery, highlight carousels and a clear path to buy. | gonoise.com | Campaign landing page · Responsive web |

Brands worked with: Noise, Nykaa Fashion, Myntra, Times Internet.

## Two editions, one portfolio

Visitors pick a mood on arrival and can switch at any time from the top bar (or press `N` / `S`).

- **Normal**: clean white, Arial headlines, Noto Sans body and one pink accent. Same sections and content as Street: hero, brands, quick links, about, how I work, work, experience, toolkit, spray wall, sticker playground and contact.
- **Street**: spray paint, stickers and a lot of red.

## Repository structure

```
portfolio/
├── README.md
├── .gitignore
├── LICENSE
├── index.html                    Home: hero, work, experience, toolbox, contact
├── case-studies/
│   ├── noisefit-sleep.html       NoiseFit sleep details page revamp
│   └── noise-junior/             Noise Junior purchase review (coming soon)
├── assets/
│   ├── images/                   Web-ready .webp / .jpg
│   │   ├── photos/               Portrait
│   │   ├── projects/             Project covers and screens
│   │   ├── logos/                Brands worked with
│   │   └── textures/             Paper and wall textures (SVG, Street edition)
│   ├── icons/
│   │   ├── social/               LinkedIn, Behance
│   │   ├── tools/                Toolbox icons (Figma, Claude, Adobe …)
│   │   └── noisefit-app/         Icons and parts of the rebuilt NoiseFit screens
│   ├── fonts/                    Self-hosted web fonts (.woff2) + licences
│   └── videos/                   Project walkthrough videos
├── css/                          Loaded in this order
│   ├── 00-fonts.css              @font-face rules for assets/fonts
│   ├── 01-tokens.css             Design tokens for every edition and theme
│   ├── 02-base.css … 13-responsive.css
│   └── 14-normal-mode.css        Normal mode look (loaded last)
├── js/
│   ├── main.js                   Site behaviour (both pages)
│   ├── normal-mode.js            Normal mode motion: letter reveals, lens, pinned lines, timeline
│   ├── dev-mode.js               Dev mode inspector (review mode only)
│   ├── review-controller.js      Review panel (review mode only)
│   └── vendor/                   Lenis (smooth scroll) and Matter.js (physics), MIT
└── design-system/
    ├── README.md                 Overview and principles
    ├── foundations.md            Colour, typography, spacing, radius, elevation, motion
    ├── components.md             Components, variants and interaction states
    ├── states.md                 Page-level states and flows
    ├── accessibility.md          Contrast checks, focus, keyboard, motion
    ├── style-guide.html          Visual style guide
    └── tokens/tokens.json        Tokens in W3C Design Tokens format
```

Everything the site needs (fonts, scripts, images, videos) is in the repository. Nothing loads from outside services, so the site also works offline.

## Design system

Read the [design system](design-system/README.md): tokens, foundations, components with their states, page states and an accessibility audit. [`tokens.json`](design-system/tokens/tokens.json) can be imported into Figma (Tokens Studio) or Style Dictionary.

## Sharing the site

- Share the live link: https://priyankayadav769.github.io/portfolio/
- Link straight to a case study: https://priyankayadav769.github.io/portfolio/case-studies/noisefit-sleep.html
- To run it locally, download the repository and open `index.html`, or run `python3 -m http.server` in the folder and visit `http://localhost:8000`.

## Review mode

Add `?review` to the address (https://priyankayadav769.github.io/portfolio/?review) to open the **review panel** and **Dev mode**. The panel switches intro options, experience layouts, compare layouts and editions, and jumps to every documented state. Dev mode lets you click any element to inspect its size, spacing, colours (mapped to the tokens), typography and code. Visitors without `?review` don't see either.

## Adding a case study

1. Create the page inside `case-studies/` (for example `case-studies/noise-junior/index.html`).
2. Copy the `<head>` from `case-studies/noisefit-sleep.html`, keep `data-page="case"` on the `<html>` tag (it skips the home-page loader and animations), and adjust the `../` paths to the folder depth.
3. Put images in `assets/images/projects/` as .webp or .jpg, and videos in `assets/videos/`.
4. Point the project's card in `index.html` to the new page.

## Known issues

- One mask image (`ASSET/ad005.png`) in the old NoiseFit sleep screen was never exported from Figma, so the browser logs a 404. It doesn't change how the screen looks.

## Contact

- Email: priyankayadav76047@gmail.com
- Behance: https://www.behance.net/priyankayadav40

---

© Priyanka Yadav. All rights reserved, see [LICENSE](LICENSE). Brand names and logos belong to their owners.
