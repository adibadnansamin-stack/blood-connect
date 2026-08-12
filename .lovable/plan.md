# Plan: Hamburger menu on all screen sizes

## Goal
Replace the always-visible desktop horizontal nav with a three-line hamburger button that works on **every** screen size (desktop, tablet, mobile). Clicking the hamburger reveals all tabs in a panel that slides down smoothly. This declutters the header and gives it a cleaner, more app-like feel.

## Current state (verified)
- `src/components/Header.tsx` renders two navs:
  - Desktop: `<nav className="hidden ... md:flex">` with inline links + `LanguageToggle` + login button.
  - Mobile: a `Menu`/`X` toggle (`md:hidden`) that conditionally renders a stacked nav (`{mobileOpen && ...}`) with no animation.
- `navLinks` array (Home, Find donors, Blood requests, Become a donor, Request blood) and the login link are reused in both navs.
- Brand (`BloodConnect`), `LanguageToggle`, and `Droplet` icon are in the top bar.

## Changes

### 1. `src/components/Header.tsx` — single hamburger-driven nav
- Remove the `hidden md:flex` inline desktop `<nav>` entirely.
- Keep the top bar as a two-column row: brand on the left, controls on the right (`LanguageToggle` + hamburger button). Use the responsive-grid pattern (`grid-cols-[minmax(0,1fr)_auto]`) so the brand text can shrink/truncate on narrow screens.
- The hamburger button is always visible (drop the `md:hidden` gate). Icon toggles between `Menu` (three lines) and `X` when open. Keep `aria-label` and add `aria-expanded`/`aria-controls` for accessibility.
- The nav panel: instead of conditional mount (`{mobileOpen && ...}`), always render it and toggle a visibility/animation class so it can slide down. Render all `navLinks` (with icons), then the login link — same content as today, just one source.
- Close the panel automatically when a link is clicked (existing `onClick={() => setMobileOpen(false)}` behavior) and on route change.

### 2. `src/styles.css` — slide-down animation
- Add a `@utility` (Tailwind v4) or keyframe for the slide-down panel: animate `max-height`/`opacity`/`translateY` so the menu opens with a smooth ~250ms ease. Close reverses the same transition.
- Respect `prefers-reduced-motion` (skip the transform, keep the show/hide).

### 3. Accessibility & UX details
- Click-outside-to-close: add a transparent backdrop or a `useEffect` listener that closes the menu on outside click / `Escape`.
- Panel should be keyboard reachable (links are real `<Link>`, focus follows tab order).
- Keep the active-route highlight (existing `pathname === link.to` logic).

## Out of scope
- No changes to routes, the `navLinks` set, auth, or i18n — purely the Header chrome and one CSS animation.
- No new dependencies.

## Files touched
- `src/components/Header.tsx` (rewrite of the nav chrome)
- `src/styles.css` (add slide-down animation utility)
