---
date: 2026-04-27
area: tooling
symptom: capture-web.ts dawn screenshot looks identical to the moon (dark) screenshot
---

# capture-web theme-switch only works if the captured page honors prefers-color-scheme

## Symptom

You add a `theme: "light"` shot to `scripts/capture/capture-web.ts` for a new page. The output PNG comes out in dark mode anyway. The script's `setTheme` calls `page.evaluate` to remove the `.dark` class and add `.light`, but the new page paints with dark colors regardless.

## Fix

Make the captured page honor `prefers-color-scheme` itself, with an inline script in `<head>` that runs before paint:

```html
<script>
  // Default to dark. Drop the class if the OS prefers light.
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.classList.remove("dark");
  }
</script>
```

`page.emulateMedia({ colorScheme: "light" })` from the capture script is what actually gets the inline script to fire down the light branch.

## Why this happens

`captureShot` in `scripts/capture/capture-web.ts` calls `setTheme` BEFORE `page.goto`. The `page.evaluate` inside `setTheme` runs against the previous page (often `about:blank`) and is discarded by the navigation. After `goto`, the new page paints with whatever class is hardcoded in its HTML.

`page.emulateMedia` is the only thing from `setTheme` that survives navigation — it sets the browser context's CSS-media emulation. So if the page's HTML responds to `prefers-color-scheme`, the right theme paints. If the page hardcodes `<html class="dark">` without listening to the media query, both shots come out dark.

## When NOT to fix this in capture-web

The capture script's class manipulation works correctly for the cc-lab site, which uses `next-themes` and reads `localStorage["theme"]` (also set by the script's `addInitScript`). The sample apps are simpler — they don't use next-themes — so they need the `prefers-color-scheme` inline script instead.

Don't change `setTheme` to run after `goto` without testing all existing shots — the order is load-bearing for the cc-lab site captures.

## What to look for

- A new shot's dawn/light variant looking identical to the moon/dark variant
- A captured page that hardcodes `class="dark"` in `<html>`
- A page without `next-themes` or equivalent theme provider that reads localStorage

## Related

- `scripts/capture/capture-web.ts` — `setTheme` + `captureShot` ordering
- `samples/python-react/frontend/index.html` — the inline script pattern documented here
