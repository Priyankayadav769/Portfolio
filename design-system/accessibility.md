# Accessibility

Target: **WCAG 2.1 AA**.

## Colour contrast

Ratios calculated from the token values (WCAG relative luminance). AA needs 4.5:1 for body text and 3:1 for large text (24px+, or 18.66px+ bold).

| Edition | Pair | Ratio | Result |
| --- | --- | --- | --- |
| Normal · light | Text `#1c1611` on background `#f2ede5` | 15.37:1 | AAA |
| Normal · light | Muted `#6c6153` on background | 5.19:1 | AA |
| Normal · light | Accent `#8f661d` on background | 4.41:1 | AA large only |
| Normal · light | On-accent `#fff8ec` on accent `#8f661d` (primary button) | 4.87:1 | AA |
| Normal · dark | Text `#f3ead9` on background `#0b0907` | 16.64:1 | AAA |
| Normal · dark | Muted `#a2968a` on background | 6.88:1 | AA |
| Normal · dark | Accent `#dcb66c` on background | 10.37:1 | AAA |
| Normal · dark | On-accent `#1b1309` on accent (primary button) | 9.57:1 | AAA |
| Street | Text `#f1ece2` on wall `#151413` | 15.63:1 | AAA |
| Street | Muted (62% cream) on wall | 6.55:1 | AA |
| Street | Red `#e3242b` on wall | 3.99:1 | AA large only |
| Street | White on red (sticker button) | 4.61:1 | AA |
| Street | Ink on yellow `#f4dc1f` | 13.35:1 | AAA |
| Street | Ink on green `#3cff52` | 14.64:1 | AAA |
| Street | White on blue `#2f5bff` | 5.17:1 | AA |
| Street | Ink on orange `#ff7a1a` | 7.11:1 | AAA |

**Rule that follows from this:** the light-theme gold accent and the Street red are used for large headings, icons, fills and borders, never for small body text on the page background.

## Focus and keyboard

- Every interactive element shows a 2px `--acc` outline with a 4px offset on `:focus-visible`.
- Keyboard shortcuts: `N` / `S` switch editions, `Esc` on a case study page returns to the Work section, `Enter` moves to the next step of the brief form.
- The edition chooser is a real dialog (`role="dialog"`, `aria-modal="true"`, labelled by its heading).
- The mobile menu button reports `aria-expanded` and controls `#mmenu`.

## Screen readers

- Landmarks: `header`, `nav` (labelled "Primary" and "Menu"), `main`, `footer`. Sections are named by an `aria-label` or by their heading.
- Decorative layers (grain, ambient light, cursor, spray canvas, sticker art) are `aria-hidden="true"`.
- The toast uses `role="status"`, so messages like "Email copied" are announced.
- Icon-only buttons have an `aria-label` ("Open menu", "Sound effects", "Back to all work").
- The disabled "Coming soon" button uses `aria-disabled="true"`.

## Motion

- `prefers-reduced-motion: reduce` cuts every animation and transition to near zero, hides the film grain and shows reveal content straight away.
- The scroll-driven intro stops as soon as the visitor scrolls, touches or presses a key.

## Forms

- Each input has a visible label.
- Errors are written in plain language and say how to fix the problem ("Add an email I can reply to, like you@company.com.").

## Known gaps

- Some fine-print text in the Street edition sits on textured paper. Check contrast whenever a texture changes.
- The NoiseFit app screens in the case study are pictures of a product UI, so their images use empty alt text. The case study text describes what they show.
