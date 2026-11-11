# States

Page-level states: which edition, theme, layout and flow step the visitor is in. Component states (hover, focus, error …) are in [components.md](components.md).

Every state below can be opened directly from the **review controller** (open the site with `?review`, then left panel → *Documented states*), so reviewers can check each one without clicking through the flow.

## Editions and themes

| State | How it's set | Notes |
| --- | --- | --- |
| Normal · light | `data-edition="gold"`, system light | Default for new visitors on a light system |
| Normal · dark | `data-edition="gold"`, system dark or `data-theme="dark"` | |
| Street | `data-edition="street"` | Always dark. Shows `.st-only` content and hides `.gd-only` |

The choice is saved in local storage (`py:edition`) and restored on the next visit.

## Review mode

The review panel and Dev mode only load when the address ends in `?review`, for example `https://priyankayadav769.github.io/portfolio/?review`. Without it, visitors always get the default layouts (Current intro, Experience option 1, Compare layout 1). The options picked in review mode are remembered in that browser only.

## Intro options (Street edition)

| Option | Documented states |
| --- | --- |
| **Current**: loader, edition picker, hero | Loader · Edition picker · Hero, first screen · Sticker links, scroll 1 · Work, 4 scrolls down |
| **Option 1 · Work first**: pinned phone flicks through projects | First screen · Scroll 1 · NoiseFit sleep · Scroll 2 · Noise Junior · Scroll 3 · Master Buds · After the reel |
| **Option 2 · Pick your path**: three intents route the visitor | First screen · Word re-sprayed: design systems · Path · I'm hiring · Path · I've got a project · Path · Just looking around · No click · normal scroll |

## Normal edition

| Documented states |
| --- |
| Prologue title · Hero |

## Experience section

| Option | Description |
| --- | --- |
| Option 1 · Timeline | Current layout, 2 fonts, 2 sizes |
| Option 2 · Paper notes | One taped note per role |
| Option 3 · Job board | Sprayed years, rows that expand. Also documented with every row open |

## Case study: "Same data, new story" compare layout

Set with `html[data-cmpl]`, saved in local storage (`py:cmpl`).

| Value | Layout |
| --- | --- |
| `1` | Current: phones left, copy right |
| `2` | Option 1: copy beside each phone (before copy, two phones, after copy) |
| `3` | Option 2: pills on the side (vertical pill list, phones, copy) |
| `4` | Option 3: big stage (copy above each larger phone) |

## Pages

| State | Trigger | Result |
| --- | --- | --- |
| Home | `index.html` | Portfolio sections |
| Case study | `case-studies/noisefit-sleep.html` (opened from the NoiseFit card) | The page loads with `html.case-open`, nav shows "All work". Old `index.html#case-sleep` links redirect here |

## NoiseFit app screens inside the case study

| Screen | Asset folder |
| --- | --- |
| Old sleep page (before) | `assets/icons/noisefit-app/old-sleep-page/` |
| New sleep page (after) | `assets/icons/noisefit-app/new-sleep-page/` |
| Shared parts (status bar, icons) | `assets/icons/noisefit-app/shared/` |

Flows animated in the case study: add a sleep record → saved → success, and nap / second-sleep entries.

## Contact brief flow

| Step | Asks for | Validation |
| --- | --- | --- |
| 1 | Name, email | Name required, email must look like an address |
| 2 | What we're designing | One option required |
| 3 | Timing | One option required ("Just exploring" is fine) |
| 4 | Message | Required before sending. Send opens the visitor's mail app |

## System states

| State | Behaviour |
| --- | --- |
| Loading | Greeting loader with progress bar |
| Reduced motion | All animations and transitions are cut to near zero, grain is hidden, reveal content shows straight away |
| Touch device | Custom cursor stays hidden (only shown for a mouse) |
| Narrow screen (< 900px) | Review panel starts minimised |
| Offline | Works fully: fonts (`assets/fonts`) and scripts (`js/vendor`) are part of the repository |
