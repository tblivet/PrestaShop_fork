# /ui kit — decision log

What the back office rework has decided, so nobody (person or AI) re-opens it by accident. Newest last. To change a decision, add a new entry that replaces it and mark the old one **Replaced by #n**.

Format: number, date, decision, why, alternatives left aside.

## 1. Bootstrap 5.3, not 6 — 2026-10

Why: Bootstrap 6 is not released; the kit has to ship. Left aside: waiting for 6.

## 2. Storybook is the reference — 2026-11-02

The kit components and the page mockups in Storybook (`ui/src/stories`, `ui/src/playground`) are the design system. AI proposes from them, a person validates; a page is checked against its story or mockup.
Why: the team is developers and integrators, no designer owns Figma files. Left aside: Figma first, AI-only mockups.

## 3. Markup: BEM `ps-`, utilities, `data-ps-*` — 2026-11-02

A `ps-` BEM class for what an element is, Bootstrap utilities for layout and spacing, `data-ps-*` for JS (Hummingbird vocabulary). Runtime state is ARIA first, else `data-ps-state`; modifiers only for fixed variants. Rules in `CONVENTIONS.md`.
Why: renaming a class never breaks a script, moving a hook never changes the look, state is announced.

## 4. Logical properties only, RTL later — 2026-11-02

Only logical properties and values, enforced by stylelint. RTL itself is not reviewed or fixed for now, and screen reviews leave it out.
Why: RTL later without rewriting styles. Left aside: reviewing RTL now.

## 5. No dark mode — 2026-11-03

The back office has no dark mode: it is not reviewed, fixed or built.
Why: not a back office need, and it does not exist today.

## 6. No visual regression tests — 2026-11-02

Why: the UI changes constantly during the rework; screenshots would churn.

## 7. UI tests adapted at the end — 2026-11-02, refined 2026-11-03

The Playwright campaigns and `ui-testing-library` are adapted in one pass when the rework is done, from `CHANGELOG-UI.md`. Locators: roles and labels first, then `data-ps-ref` hooks; never classes, ids or exact copy text.
Why: everything moves meanwhile; one clean pass beats a hundred patches.

## 8. Scope: Symfony pages and the shared shell — 2026-11-03

The rework covers Symfony/Twig pages and the shared shell (header, sidebar, toolbar) that legacy pages render too. Legacy AdminController pages move to the kit when they move to Symfony.
Left aside: re-skinning HelperList / HelperForm / Smarty.

## 9. Components first, then pages — 2026-11-03

Order: inventory of patterns (`INVENTORY.md`), the components, then pages, most used first (Orders, Products, Customers).
Left aside: page by page; simplest pages first.

## 10. Twig components for back office patterns only — 2026-11-03

**Replaced by #23.**

`<twig:ui:*>` components wrap back office patterns (page header, form row, empty state, grid), not Bootstrap primitives. A pattern becomes a component once it appears on a second page.
Left aside: a component for everything; rule of three.

## 11. One page template — 2026-11-03

Every kit page renders in one page template with fixed slots: title, breadcrumb, actions, tabs, content. No page builds its own header or toolbar. Designed through the `ui-component-design` workflow.
Left aside: one layout per page type; free composition.

## 12. A new grid component — 2026-11-03

A new `<twig:ui:Grid>` designed from scratch (listing, filters, bulk and row actions, pagination, empty state), designed through the `ui-component-design` workflow. The old grid blocks stay for pages not on the kit.
Left aside: re-skinning the Grid Twig blocks; per-page grids.

## 13. Behaviour in vanilla JS on `data-ps-*` — 2026-11-03

Small ES modules bound to `data-ps-*` hooks and Bootstrap 5 JS. Vue stays only for the existing rich apps.
Left aside: Stimulus, Live Components, keeping page logic in new-theme TypeScript only.

## 14. Desktop first, usable on mobile — 2026-11-03

Designed for 1280 px and wider, fully usable at 375 px (no page scroll sideways, touch targets); a dense grid may scroll inside its own box.

## 15. The old theme may break on the feature branch — 2026-11-03

Kit work does not have to keep `PS_UI_KIT=0` working. Shared code that gets in the way is forked for the kit. Breaks go in `CHANGELOG-UI.md`.
Why: the Bootstrap 4 theme goes away with the rework; keeping both alive doubles the cost.

## 16. AI works with three checkpoints — 2026-11-03

On a rework, AI stops for approval after the plan, after the story or mockup, and before committing. It implements and verifies alone in between (`ui-rework` skill).
Left aside: end to end; step by step pairing.

## 17. One feature branch — 2026-11-03

Work accumulates on `feat/introduce-new-ui-kit` behind `PS_UI_KIT`, merged in large chunks.
Left aside: one PR per page; stacked PRs.

## 18. Done gates — 2026-11-03

A page or component is done when: builds and lints pass, its tests pass (Twig component unit and render tests; PHP integration tests for changed form types and controllers; Behat untouched), Storybook matches the page, and the `ui-screen-review` workflow leaves no blocker or major finding (or each one is accepted here with a reason).

## 19. Wording by AI to the tone of voice — 2026-11-03

AI rewrites strings to the PrestaShop tone of voice when it reads better; the developer approves the list at the plan checkpoint. New strings are fine and listed with `missing-translations.mjs`; nobody rewords only to reuse an old key.
Left aside: a content team gate; keeping wording.

## 20. Hooks stay in place — 2026-11-03

Hooks keep their place in the page; one moves only when the new layout makes its old place meaningless, with a `CHANGELOG-UI.md` entry for module developers.

## 21. Two review levels — 2026-11-03

A quick `ui-review` while working; the full `ui-screen-review` workflow (about 30 min, 850k tokens on the login page) once per page at the end, with `ui-seed` data scenarios.

## 22. Tracking in the repository and the tracker — 2026-11-03

The BO UI tracker artifact is the board. In `ui/.ai/`: this log, `INVENTORY.md` (backlog), `PROGRESS.md` (generated: coverage, component adoption, open findings), `CHANGELOG-UI.md` (what changed for others), `reviews/*.json` (last review per page).

## 23. Components for everything the back office uses, built to be flexible — 2026-11-03

Replaces #10. Templates use `<twig:ui:*>` components for the Bootstrap elements the back office uses too (button, icon button, badge, breadcrumb, pagination, modal…), not only for back office patterns. Each component is complete enough that nobody falls back to raw markup: see "Component API" in `CONVENTIONS.md`. A missing variant is added to the component, with its story, rather than written by hand in a page. Back office patterns still become components once on a second page.
Why: one way to write each element harmonizes the back office and keeps it maintainable: a fix or an a11y rule lands once. Left aside: patterns only (#10), plain Bootstrap markup in templates.

## 24. Components and layouts are separate — 2026-11-03

A **component** (`<twig:ui:Button>`, `<twig:ui:Alert>`, `<twig:ui:Grid>`…) is one element: its look, content, states and behaviour, whatever its size. It never says where it sits: no outer margin, no position, no width taken from its context. A **layout** (`<twig:ui:Layout:*>`: the page template, stacks, rows of actions, columns, form sections) places components: spacing between them, alignment, wrapping, columns, how they stack on small screens. A layout never styles or changes the components it holds, and a component never contains a layout decision. Rules in "Components and layouts" of `CONVENTIONS.md`.
Why: the same button then works in a toolbar, a modal footer or a form without variants per context, and a layout change never breaks a component. Left aside: components with placement props (`align`, `margin`), spacing utilities on components in pages.

## 25. One kit form theme renders every field type with kit components — 2026-11-03

`TwigTemplateForm/ui_kit_layout.html.twig` (extends Symfony's `bootstrap_5_layout`) gets a Bootstrap 5 version of every visible form block: rows, labels, help, errors, the standard Symfony widgets and PrestaShop's own types (switch, translatable fields, choice tree, choice table, money, date picker, entity search, multistore checkbox…), today drawn in Bootstrap 4 by `prestashop_ui_kit_base.html.twig`. Each block only maps the field to a kit component (`ui:FormRow`, `ui:Switch`, `ui:TranslatableField`, `ui:ChoiceTree`…), which owns the markup and its story. Internal blocks (attributes, names, CSRF, collection prototypes) stay inherited. The Bootstrap 4 themes stay for pages not on the kit and go with them. The block list and its components are in `INVENTORY.md`, "Form theme".
Why: forms are most of the back office and their markup comes from PHP form types, not templates; this is the only place where the kit can control them, once for every page. Left aside: copying all Symfony blocks; keeping prestakit markup for PrestaShop types.

## 26. SCSS partials name their block with `$component-name` — 2026-11-04

Every `ps-` partial starts with `$component-name: ps-{block};` and writes `.#{$component-name} { … }`, as the 82 partials of Hummingbird do. No selector maps (`$selectors: (…)`). Stylelint checks the variable's value and the nested `&__` / `&--` names, since it cannot read interpolated selectors.
Why: the same habit in the front and the back office, the block name written once. Left aside: one map of selectors per page; literal class names (searchable, but the name repeated in every nested full selector).

## 27. Page wrappers name their page — 2026-11-04

The root of every page carries `ps-page ps-page--{page} ps-{page}` (`<main class="ps-page ps-page--login ps-login">`). `ps-page--{page}` says which page wrapper this is, even with no styles; the page's styles go on its own block `ps-{page}`.
Why: `ps-login` alone does not say it is the page wrapper (it could be a form or a widget); the modifier makes it explicit. Left aside: the page block alone; renaming page blocks `ps-{page}-page`.

## 28. Pages pick one block, sub-block partials or a selector map — 2026-11-04

Refines #26 for `ui/src/scss/pages/` only: a page is one block by default (parts as flattened elements), split into one partial per sub-block when a part has its own elements, or uses a `$selectors` map of its own blocks when one partial reads better. Components and layouts keep one block and `$component-name`. Stylelint checks the map values. Rules in `CONVENTIONS.md`, "Classes".
Why: unlike a component, a page can style many parts and sub-parts; one fixed form does not fit every page size.


## 29. Button focus rings use the button color at 50% — 2026-11-04

Every `.btn` focus ring is a 2px gap in the page color, then the button's own color at 50% (`rgba(var(--bs-btn-focus-shadow-rgb), .5)`, `components/_buttons.scss`), warning and light included. Other focus rings use `$focus-ring-color`, the brand at 50% (3.3:1 on white).
Why: a ring that matches its button, as Bootstrap does; the gap keeps it apart from a dark button. Accepted trade-off: on white these rings are 1.8:1 to 2.8:1, under the 3:1 of WCAG 1.4.11; reviews should not report it again. Left aside: one dark ring for every button (8.9:1); the button color at 100% (3.8:1 to 12.5:1, yellow excepted).

## 30. Kit forms report their own errors, never the browser's bubbles — 2026-11-05

Every kit form has `novalidate`. Its page script checks what the browser would (empty required field, malformed email, too long) on submit, and writes a translated message into the field's error slot, linked by `aria-describedby`, with `aria-invalid` on the field and focus on the first one to fix. The server checks the same rules with the same words.
Why: the browser bubble is in the browser's language, not the page's, disappears on its own, cannot be read again, is cut off on phones, and looks unlike every other error of the kit. Left aside: keeping native validation and styling `:invalid` (still the browser's words and timing).

## 31. After a redirect, focus goes to the flash message — 2026-11-05

A page reached by a redirect that shows a flash message (`<twig:ui:FlashMessages>`) moves focus to the first one, whatever its type (success, info, warning, error), made focusable with `tabindex="-1"`; a field in error still comes first. `server-error-focus.js` does it for danger alerts today and widens to every flash.
Why: a message rendered with the page sits in a live region that already exists, so screen readers do not announce it; "Your password has been changed" or "Check your inbox" is the outcome of the user's action and must be read. Left aside: announcing through a live region filled after load (unreliable timing across screen readers).

## 32. Every page has its own document title — 2026-11-05

The `<title>` names the page, then the shop: "Sign in · Maison Dupont", "Reset your password · Maison Dupont", "Orders · Maison Dupont". It is the page's `h1` text; a script that switches panels in place (sign in / forgot password) updates `document.title` too.
Why: the title is the first thing a screen reader reads and what a browser tab or history shows; pages that share one cannot be told apart (WCAG 2.4.2). Left aside: the shop name alone (today), the page name alone (several shops open in tabs).
