# Priyanka Yadav · Product Designer

UI/UX and product designer at Noise, Gurugram. Designing for people, building with AI.

**Live site → https://priyankayadav769.github.io/portfolio/**
**Style guide → https://priyankayadav769.github.io/portfolio/design-system/style-guide.html**

---

## Selected work

| Project | Client | Type |
| --- | --- | --- |
| **NoiseFit sleep details page revamp**: a calmer way to read a night's sleep. One score up top, and the contributors that shaped it right below. Full case study on the site. | NoiseFit app | Mobile app · Data visualisation · Design system |
| **Noise Junior purchase review**: a bright, friendly review moment for the Noise Jr. Champ 3. One product, one question, five stars from poor to great. | Noise Junior | Mobile app · Post-purchase flow · Kids product |
| **Bose × Noise Master Buds**: the launch page for Master Buds with sound by Bose. Big imagery, highlight carousels and a clear path to buy. | gonoise.com | Campaign landing page · Responsive web |

Brands worked with: Noise, Nykaa Fashion, Myntra, Times Internet.

## Two editions, one portfolio

Visitors pick a mood on arrival and can switch at any time from the top bar (or press `N` / `S`).

- **Normal**: warm light, frosted glass and gold. Follows the system light / dark setting.
- **Street**: spray paint, stickers and a lot of red.

## Repository structure

```
portfolio/
├── index.html                  The website
├── css/                        Styles, loaded in this order
│   ├── 01-tokens.css           Design tokens (colour, type, motion, spacing) for every edition and theme
│   ├── 02-base.css             Base elements, loader, cursor, grain
│   ├── 03-nav.css              Navigation and mobile menu
│   ├── 04-sections.css         Normal edition sections
│   ├── 05-street-edition.css   Street edition
│   ├── 06-edition-chooser.css  Edition chooser and spray transition
│   ├── 07-review-panel.css     Review panel and Dev mode
│   ├── 08-intro-options.css    Intro options under review
│   ├── 09-street-work-experience.css
│   ├── 10-case-study.css       NoiseFit case study and rebuilt app screens
│   ├── 11-nav-polish.css
│   ├── 12-review-controller.css
│   └── 13-responsive.css       Breakpoints and reduced motion
├── js/
│   ├── main.js                 Site behaviour
│   ├── dev-mode.js             Dev mode inspector
│   └── review-controller.js    Review panel: documented states and jumps
├── assets/
│   ├── images/
│   │   ├── photos/             Portrait
│   │   ├── projects/           Project covers and screens
│   │   ├── logos/              Brands worked with
│   │   ├── tools/              Toolbox icons (Figma, Claude, Adobe …)
│   │   ├── icons/social/       LinkedIn, Behance
│   │   ├── textures/           Paper and wall textures (Street edition)
│   │   └── case-study/noisefit-screens/   Icons and parts of the rebuilt NoiseFit screens
│   │       ├── old-sleep-page/
│   │       ├── new-sleep-page/
│   │       ├── new-sleep-page-variant/
│   │       └── shared/
│   └── videos/                 Project walkthrough videos
├── design-system/
│   ├── README.md               Overview and principles
│   ├── foundations.md          Colour, typography, spacing, radius, elevation, motion, breakpoints
│   ├── components.md           Components, variants and interaction states
│   ├── states.md               Page-level states: editions, intro options, layouts, flows
│   ├── accessibility.md        Contrast checks, focus, keyboard, motion
│   ├── style-guide.html        Visual style guide (opens in a browser)
│   └── tokens/tokens.json      Tokens in W3C Design Tokens format
└── standalone/
    └── priyanka-yadav-portfolio.html   The whole site in one file, for offline sharing
```

## Design system

Read the [design system](design-system/README.md): tokens, foundations, components with their states, page states and an accessibility audit. [`tokens.json`](design-system/tokens/tokens.json) can be imported into Figma (Tokens Studio) or Style Dictionary.

## Sharing the site

- **Best:** share the live link, https://priyankayadav769.github.io/portfolio/
- **Offline:** send [`standalone/priyanka-yadav-portfolio.html`](standalone/priyanka-yadav-portfolio.html). It's a single file with every image and video inside, so it opens in any browser on its own.
- To run this repository locally, download it and open `index.html`, or run `python3 -m http.server` in the folder and visit `http://localhost:8000`.

Fonts load from Google Fonts. Smooth scrolling (Lenis) and the toolbox physics (Matter.js) load from public CDNs. Without internet the site still works with system fonts.

## Review build

The site includes a **review controller** (left panel) for design reviews. It switches intro options, experience layouts, compare layouts and editions, and jumps to every documented state. **Dev mode** lets you click any element to inspect its size, spacing, colours (mapped to the tokens), typography and code.

## Known issues

- One mask image (`ASSET/ad005.png`) in the old NoiseFit sleep screen was never exported from Figma, so the browser logs a 404. It doesn't change how the screen looks.

## Contact

- Email: priyankayadav76047@gmail.com
- Behance: https://www.behance.net/priyankayadav40

---

© Priyanka Yadav. All rights reserved. Project work is shown for portfolio purposes. Brand names and logos belong to their owners.
