# Components

Each component lists its variants, the states it supports and where its styles live. States follow one rule across the site: **hover** previews, **focus-visible** shows a 2px accent ring, **active / pressed** confirms, **disabled** stays readable but stops responding.

---

## Button · Normal edition

`css/02-base.css`, `css/04-sections.css` · class `.btn`

| Variant | Class | Look |
| --- | --- | --- |
| Primary | `.btn.gold` | Accent fill, on-accent text |
| Secondary | `.btn.ghost` | Glass fill, hairline border |
| Small | `.btn.sm` | 40px tall (default 48px) |
| Coming soon | `.btn.btn-soon` | Pulsing dot, not clickable |

| State | Primary | Secondary |
| --- | --- | --- |
| Default | `--acc` fill, `--on-acc` text, pill radius | `--glass` fill, `--line` border |
| Hover | Light sheen sweeps across (800ms, `--ease`) | Border turns `--acc` |
| Focus-visible | 2px `--acc` outline, 4px offset | Same |
| Pressed | Magnetic pull follows the pointer (`data-magnet`), springs back | Same |
| Disabled / soon | `aria-disabled="true"`, pointer events off, 90% opacity, pulsing dot | Same |

## Button · Street edition (sticker)

`css/05-street-edition.css` · class `.sb`

| Variant | Class | Fill / text |
| --- | --- | --- |
| Red | `.sb.red` | `--s-red` / white |
| Yellow | `.sb.yellow` | `--s-yel` / ink |
| Blue | `.sb.blue` | `--s-blu` / white |
| Green | `.sb.green` | `--s-grn` / ink |
| Orange | `.sb.orange` | `--s-org` / ink |
| White | `.sb.white` | cream / red |
| Dark | `.sb.dark` | ink / cream |
| Sizes | `.sb.sm` 38px · default 48px · `.sb.xl` 76px | |

Every sticker has a 2.5px cream border, a slight rotation (`--rt`) and the hard sticker drop shadow. In Street, `.btn.gold` and `.btn.ghost` restyle into stencil stickers automatically.

## Edition toggle

`css/03-nav.css`, `css/11-nav-polish.css` · `#edBtn`, `#edBtn2`

| State | Behaviour |
| --- | --- |
| Normal selected | "Normal" segment filled with `--acc` (`:root[data-edition="gold"] .ed [data-e="gold"]`) |
| Street selected | "Street" segment filled with `--s-red` |
| Hover (unselected side) | Unselected label brightens to cream |
| Focus-visible | Accent ring around the whole toggle |
| Activate | Spray-paint transition, then the edition swaps. The choice is saved for the next visit |

## Navigation

`css/03-nav.css`, `css/11-nav-polish.css`

| Element | States |
| --- | --- |
| Link `.links a` | Default muted · Hover background glass (Normal) or white text (Street) · **Active section** `.on`: set by scroll position, colour-only in Normal, red drip under the link in Street |
| Burger `.burger` | Shown at ≤1260px · `aria-expanded` false/true · Open: three lines morph into a cross (`.menu-open`) |
| Mobile menu `.mmenu` | Closed / open, full-screen, includes the edition toggle and résumé button |
| Back link `.nav-back` | Only visible while a case study is open (`html.case-open`) |
| Path chip `#pathChip` | Shows "Here for: …" after a visitor picks a path. Clear button resets it |

## Work card

`css/04-sections.css`, `css/09-street-work-experience.css` · `.card`

| State | Behaviour |
| --- | --- |
| Default | Text column + device stage with a looping video or screen |
| Hover | Stage tilts toward the pointer (`data-tilt`), cursor grows into a "View" disc (`data-cursor`) |
| Link hover | Arrow in "View project" slides out and a new one slides in |
| Open | Card morphs into the case study page (View Transitions), nav shows "All work". `Esc` goes back |
| Street | Taped corners, stencil title, sticker category ("Kids product", "Launch page") |

## Custom cursor

`css/02-base.css` · `#cur`, `#curDot`

| State | Behaviour |
| --- | --- |
| Default | Small ring follows the pointer, dot sits at the exact point |
| Hover on interactive item | Ring scales up (`.hover`) |
| Hover on a card | Becomes an 84px accent disc labelled "View" (`.big`) |
| Touch / pen | Hidden; only shown once a mouse moves (`pointerType === 'mouse'`) |

## Chips and tags

| Component | Class | States |
| --- | --- | --- |
| Skill chips | `.chips span` | Static |
| Draggable chip (physics toolbox) | `.chip`, `.chip.sk`, `.chip.big` | Default grab cursor · Active `grabbing` · Thrown with physics |
| Card tags | `.ptags span` | Static, mono font with pipes between in Street |

## Contact field

`css/04-sections.css` · `.field`

| State | Behaviour |
| --- | --- |
| Default | Glass card, label (`.k`) in `--mute`, value in serif |
| Copy button `.copy` | Hover: none · Pressed: scales to 0.9 with spring · Success: toast "Email copied" |
| Social link `.socials a` | Hover: border `--acc`, glass fill |

## Project brief form (4 steps)

`css/04-sections.css` · `.form`, `.step`

| State | Behaviour |
| --- | --- |
| Step | One step visible at a time (`.step.on`), progress dots fill up to the current step |
| Input default | Underline in `--line` |
| Input focus | Underline turns `--acc` |
| Error | Message under the step in `#d9534f`, plain language: "Add your name to continue." · "Add an email I can reply to, like you@company.com." · "Pick what we're designing." · "Pick a timing, 'Just exploring' is fine." |
| Filled | Green "✓" badge (`.filled.on`) after the brief is complete |
| Back | Hidden on step 1 |
| Send | Replaces "Next" on the last step and opens the visitor's mail app |

## Toast

`css/04-sections.css` · `#toast` (`role="status"`)

| State | Behaviour |
| --- | --- |
| Hidden | Below the viewport, transparent |
| Shown `.show` | Springs up with `--spring`, auto-hides after a few seconds |

## Edition chooser (dialog)

`css/06-edition-chooser.css` · `#chooser` (`role="dialog"`, `aria-modal="true"`)

| State | Behaviour |
| --- | --- |
| First visit | Opens after the loader: "Same work, two moods." |
| Option hover | Card lifts 6px and tilts slightly |
| Keyboard | `N` picks Normal, `S` picks Street. The same keys switch editions anywhere on the page |
| Picked | Dialog closes, choice saved in local storage, not shown again |

## Loader

`css/02-base.css` · `#loader`

Greets in three languages ("Hello", "नमस्ते", "Hii folks!") while a progress bar fills, then lifts away.

## Review controller and Dev mode

`css/07-review-panel.css`, `css/12-review-controller.css`, `js/review-controller.js`, `js/dev-mode.js`

A hand-off panel for reviewers. It switches intro options, experience layouts, compare layouts and editions, shows the **live state**, and jumps to every **documented state** (see [states.md](states.md)). **Dev mode** lets a reviewer click any element to see its size, spacing, radii, colours mapped to the tokens, typography and code.
