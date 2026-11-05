---
name: ui-review
description: >
  Reviews a back-office page or component rendered with the /ui kit in a real browser: layout at
  375/768/1280 px, every state including the rare ones, keyboard pass, axe scan, Storybook parity
  and kit conventions, with a screenshot report. Trigger: "review the UI of {page}", "UX/a11y check {page}", "check this
  screen".
needs: []
produces: "a findings report (markdown) with screenshots, ranked by severity"
subagent: recommended
---

# Review a /ui kit screen

Read `ui/.ai/CONVENTIONS.md` first: it is the checklist this review applies. Read `.ai/Component/UiKit/CONTEXT.md` for the toggle, build and Storybook ↔ page pairing.

For every state of one or more pages at once, with a panel of reviewers and an HTML report, run the `ui-screen-review` workflow (`ui/.ai/workflows/ui-screen-review.js`) instead: it applies this same procedure.

## Inputs

- The page URL (e.g. `http://localhost:8001/admin-dev/login`) or the route / template to review.
- Optionally the Storybook story or playground mockup it should match.

## 1. Prepare

1. `PS_UI_KIT=1` in `.env.local`, and assets built: `node ui/.ai/bin/check-builds.mjs` must say "Builds are current" (otherwise run the `make` targets it names, then clear the cache as www-data). The `ui-screen-review` workflow runs it first and stops on stale builds.
2. Open the page in a **new** browser tab and hard-reload (asset URLs only carry `?<ps version>`).
3. A page behind sign-in needs a signed-in tab. Use local test credentials only; otherwise ask the user to sign in.
4. Confirm the kit is loaded: a stylesheet whose URL contains `ui.css`. If not, stop: the review would describe the old theme.

## 2. Look

For each width **375, 768, 1280**, screenshot the page, then every state it has: empty, filled, each error, each flash (the controller's `addFlash` calls), success, loading, long content, a long translation such as German, and the config-gated or rare ones (SSL warning, throttles, expired links, required actions). Put the data scenarios the states need up with the `ui-seed` skill (full listings, long names, limited employee, another language, multistore) and down afterwards. Reach a rare state with a reversible setup on the local shop (`prestashop:config get` then `set`, restore after; emails through MailDev; a disposable employee for account flows) or by forcing it in the DOM, rather than skipping it. The back office has no dark mode: review light only. RTL is out of scope for now. Never report a choice recorded in `ui/.ai/DECISIONS.md`, such as button focus rings in the button color at 50% (#29).

Report: horizontal scroll, overlaps, truncated or clipped text, misaligned spacing, inconsistent component use (two button styles for one action), missing feedback after an action, and anything that differs from the story or mockup.

## 3. Operate with the keyboard only

Tab from the top of the page to the end and back. Check: every control is reachable in a logical order, the focus ring is visible on each, `Enter` / `Space` activate, `Escape` closes overlays, focus moves into and back out of modals, nothing traps focus.

## 4. Scan

Inject axe-core in the page and run it, on the most complete state and on each error or alert state:

```js
await new Promise((r) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'; s.onload = r; document.head.append(s); });
(await axe.run(document, {runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']})).violations.map((v) => ({id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(' '))}));
```

axe covers about a third of WCAG: also check by hand what it cannot — live region announcements, color-only state, meaningful labels and alt text, reduced motion.

## 5. Read the source

On the template, SCSS and JS behind the screen, check the conventions file sections: BEM + utilities + `data-ps-*`, runtime state, migrating shared markup, accessibility. Flag JS selecting classes or ids, SCSS selecting a `data-ps-*` hook other than `data-ps-state`, untranslated strings, and Storybook/page drift. List the strings missing from the catalogues with `node ui/.ai/bin/missing-translations.mjs --locale <installed locale>`.

## 6. Report

Write the report in the session scratchpad, findings ranked **blocker → major → minor → suggestion**. Each finding: what is wrong, where (URL + width/mode, or `file:line`), why it matters (user impact or WCAG criterion), the screenshot path, and a suggested fix. End with what was not checked. Close the browser tabs you opened.

## Scope

The review is about the UI rework: what the user sees and does, and its front-end causes (Twig, SCSS, kit components and their JS behaviour, accessibility, wording, wherever a string is defined). Read controllers to find the states, not to redesign them: a change to a controller, form type, route, security or business flow is not a finding; list it under "Out of scope" (at most 3 lines). On a page already reviewed (`ui/.ai/reviews/<page>.json`), re-check its open findings and the fixes in `CHANGELOG-UI.md` since then, and add only new blockers and majors, so a page converges.

## Do / Don't

- Do review what a user sees and does; the code read in step 5 only explains it.
- Don't fix anything during the review, and don't report a finding you did not observe or read.
