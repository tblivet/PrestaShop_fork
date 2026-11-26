# /ui kit — decision log

What the back office rework has decided, so nobody (person or AI) re-opens it by accident. Newest last. To change a decision, add a new entry that replaces it and mark the old one **Replaced by #n**.

Format: number, date, decision, why, alternatives left aside.

## 1. Bootstrap 5.3, not 6 — 2026-10

Why: Bootstrap 6 is not released; the kit has to ship. Left aside: waiting for 6.

## 2. Storybook is the reference — 2026-11-02

The kit components and the page mockups in Storybook (`ui/src/stories`, `ui/src/playground`) are the design system. AI proposes from them, a person validates; a page is checked against its story or mockup.
Why: the team is developers and integrators, no designer owns Figma files. Left aside: Figma first, AI-only mockups.

## 3. Markup: BEM `ps-`, utilities, `data-ps-*` — 2026-11-02

A `ps-` BEM class for what an element is, Bootstrap utilities for layout and spacing (replaced by #38: layout and spacing go in BEM partials too), `data-ps-*` for JS (Hummingbird vocabulary). Runtime state is ARIA first, else `data-ps-state`; modifiers only for fixed variants. Rules in `CONVENTIONS.md`.
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
This is the design priority, not how CSS is written: kit and page SCSS is mobile first like Bootstrap (`media-breakpoint-up`), see "Classes" in `CONVENTIONS.md` (2026-11-06).

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

A page or component is done when: builds and lints pass, its tests pass (Twig component unit and render tests; PHP integration tests for changed form types and controllers; Behat untouched), Storybook matches the page, and the `ui-screen-review` workflow leaves no blocker or major finding (or each one is accepted here with a reason). Minor findings and suggestions are non-blocking, badged so in the report: fixed when cheap, otherwise left open without an entry here, so a good page is not held back by polish.

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

Every kit form has `novalidate` (the kit form theme's `form_start`). The kit checks what the browser would on submit (`ui/src/js/components/form-validation.js`: empty required field, malformed email; more as field types join the form theme), and writes a translated message into the field's client error slot, linked by `aria-describedby`, with `aria-invalid` on the field and focus on the first one to fix. The words come from the field's `data-required-message` and `data-invalid-message`; the server checks the same rules with the same words (`NotBlank`, `Email` messages).
Why: the browser bubble is in the browser's language, not the page's, disappears on its own, cannot be read again, is cut off on phones, and looks unlike every other error of the kit. Left aside: keeping native validation and styling `:invalid` (still the browser's words and timing).

## 31. After a redirect, focus goes to the flash message — 2026-11-05

A page reached by a redirect that shows a flash message (`<twig:ui:FlashMessages>`) moves focus to the first one, whatever its type (success, info, warning, error), made focusable with `tabindex="-1"`; a field in error still comes first. `ui/src/js/components/load-focus.js` does it on every kit page.
Why: a message rendered with the page sits in a live region that already exists, so screen readers do not announce it; "Your password has been changed" or "Check your inbox" is the outcome of the user's action and must be read. Left aside: announcing through a live region filled after load (unreliable timing across screen readers).

## 32. Every page has its own document title — 2026-11-05

The `<title>` names the page, then the shop: "Sign in to your back office • Maison Dupont", "Reset your password • Maison Dupont", "Orders • Maison Dupont" (the separator of the other back office pages). It is the page's `h1` text; a script that switches panels in place (sign in / forgot password) updates `document.title` too.
Why: the title is the first thing a screen reader reads and what a browser tab or history shows; pages that share one cannot be told apart (WCAG 2.4.2). Left aside: the shop name alone (today), the page name alone (several shops open in tabs).

## 33. Screen reviews stay on the front end and converge — 2026-11-05

`ui-screen-review` and the `ui-review` skill report what the user sees and does, caused by Twig, SCSS, kit components and their JS, accessibility or wording. Back-end and business-flow ideas (when a token is checked, where a redirect goes) go to a short "out of scope" list, not to findings. A page already reviewed gets a follow-up review: its open findings are re-checked, fixes listed in `CHANGELOG-UI.md` must hold, and only new blockers and majors are added; `fresh: true` starts a full review again.
Why: each full run dug deeper into PHP and flows and found new minor issues, so a page never closed; the rework is about the UI. Left aside: a fixed number of runs per page; reviewing back end and front end together.

## 34. No columns layout: equal items use Tiles, a main + side split belongs to the page — 2026-11-05

The kit has three placing layouts: `ui:Layout:Stack` (one under another), `ui:Layout:Cluster` (side by side, wrapping) and `ui:Layout:Tiles` (equal items, more per line as the width grows; not "Grid", which names the listing component in PrestaShop and its modules). There is no `ui:Layout:Columns`: a main + side split is placed by the page, or by the layout that needs it (the page template first), with the Bootstrap grid, following the rules kept in `INVENTORY.md` #11. All layouts share one gap scale, `none` to `xl` (Bootstrap spacers 0 to 5), with their own default. A cluster has no slots: groups in a row are nested clusters.
Why: every main + side split found is the page's own structure (order and customer views, permissions, import), never a split inside a block, and the remaining uses are equal items; a generic Columns kept naming problems (a narrow "main" with `1-2`) and let each page pick its breakpoint again. Left aside: Columns with main and side blocks; neutral first/second columns; more ratios.

## 35. Icons are SVG files, every Material Symbol ships, nothing is fetched — 2026-11-12

Kit templates draw every icon with `<twig:ui:Icon>`: an inline SVG from `ui/icons/` (`ux:icon` underneath), sized in `em` by the text around it (`xs` to `xxl`) and centred on its capital letters. The whole Material Symbols set (outlined, and `-fill` for the `filled` prop) is committed in `ui/icons/material-symbols/`, synced from npm `@material-symbols/svg-600` (weight 600, picked by eye: 400 looked thin beside IBM Plex Sans at 16–20px) by `ui/.ai/bin/sync-icons.mjs`; brand logos sit in `ui/icons/brand/`. Bootstrap Icons are gone. The Iconify fallback of `ux_icons` is off: a missing icon fails the render instead of being downloaded.
Why: the Material Symbols font weighed 3.96 MB for three icons on the login page, showed nothing (then the icon's word) until it loaded and shifted the layout when it arrived; an SVG is in place with the first paint, and a page only reads the icons it uses. The full set ships so core pages and modules can use any icon (a module cannot add files to `ui/icons`), for about 1.2 MB in the release zip. Left aside: keeping the font with a fixed box, preload and subsetting (still a build step and a wait); only committing the icons in use (modules stuck); Iconify on demand (a shop server calling an outside API while rendering).

## 36. Header notifications: one list with filters; kinds from modules come later, as sources — 2026-11-16

The kit header's notifications are one list of what is new, with a row of filters (All, then one per kind) instead of tabs, a generic line (the kind's icon, a title, a details line, a link) and one empty state whose sentence comes from the pressed filter (a kind may add a tip). Today the kinds are the three of the core (orders, customers, messages), described once in `Component/Layout/Ui/notifications_center.html.twig`, read from the existing `admin_common_notifications` endpoint; `notifications.js` only knows how to word each kind's line. The old theme keeps its tabs and endpoint.
Why: tabs stop fitting at four or five in a 26rem panel, and every kind hard-coded in the markup and the script makes the next one a core change. A filter row scrolls sideways when kinds outnumber the width, and a generic line and empty state work for any kind.
Later, so modules can add kinds (not built yet): a `NotificationSourceInterface` (key, label, icon, empty sentence and tip, new items as {title, details, url, date, icon}, count, mark seen), the core's three kinds as sources, sources added as tagged Symfony services or through a hook (`actionBackOfficeNotificationSources`) for classic modules, one endpoint returning every source in that generic shape, and seen marked per source key. The panel then renders the filters and lines from the response alone, and `LINES` in `notifications.js` goes away. Left aside: tabs (do not scale), a module hook rendering its own markup in the panel (breaks the generic list and its keyboard order).

## 37. The secondary button is drawn like the primary's outline, with a light grey hover — 2026-11-16

`btn-secondary` (the default of non-submit form buttons; `<twig:ui:Button>`, `<twig:ui:IconButton>` and `<twig:ui:Dropdown>` default to `primary`: a button alone is the action of its area) is transparent with the primary color for border and text; hover and focus lay a light grey under it (`$gray-300`, `$gray-400` pressed) instead of filling it (`components/_buttons.scss`). The markup keeps `btn-secondary`; `outline-primary` stays as a variant (it fills black on hover).
Why: next to a filled primary button, the grey fill of Bootstrap's secondary pulled the eye almost as much and read as dated or disabled; an outline in the primary color makes the pair read as one filled, one outlined. A black fill on hover (the `outline-primary` behaviour) made the secondary look like the primary under the pointer, so it only greys. `outline-secondary` is kept for minor actions, lighter still: the fields' light border and grey text, a light grey hover. Left aside: switching each template to `outline-primary` (every page to touch, and the default would still be grey).

## 38. Every style has one owner, its BEM partial; utilities only for Bootstrap behaviour — 2026-11-18

Bootstrap first means Bootstrap's components and values, not its utility classes. A style belongs to the first owner that fits:
1. a Bootstrap component, in the markup and tuned by its variables;
2. a kit component's own look and inner layout, in its BEM partial;
3. the arrangement of several elements, in a generic layout (`ps-stack`, `ps-cluster`, `ps-tiles`) with size modifiers (`ps-stack--gap-lg`);
4. a page's one-off arrangement, in the page's block.

The rules are written with Bootstrap's values (`var(--#{$prefix}…)`, `$spacers`, `media-breakpoint-*`, its mixins). Utilities stay in the markup only for what is Bootstrap behaviour: `visually-hidden`, a `d-{bp}-none` that follows an `offcanvas-{bp}`. This applies to layouts too: Stack, Cluster and Tiles render their own classes instead of `d-flex gap-3 align-items-*`. Rules in "Bootstrap first" of `CONVENTIONS.md`.
Why:
- templates say what an element is, not how it is drawn;
- one component's styles live in one file instead of being split between Twig, story, mockup and tests;
- utilities are `!important`, so a theme, a module or a page cannot override them;
- the kit's utilities compile to physical properties (`ms-auto` is `margin-left`), against #4.
Left aside: utilities for page layouts (a page would mix two systems), and keeping utilities inside layouts (the DOM stays heavy and they still cannot be overridden). Stack, Cluster, Tiles and the utilities left in templates are migrated in a separate change.

## 39. Accessibility is audited against the RGAA; WCAG 2.2 additions are kept ahead — 2026-11-20

The kit's accessibility reference is the RGAA in force (4.1.2, built on WCAG 2.1 AA; a version 5 on WCAG 2.2 is announced). Reviews cite the RGAA criterion and its WCAG equivalent (`RGAA 7.1 / WCAG 4.1.2`); axe runs with the WCAG 2.1 A/AA rules, the RGAA base, and once more with the 2.2 rules reported apart. WCAG 2.2 criteria the RGAA does not cover yet (target size, focus not obscured…) stay kit rules in `CONVENTIONS.md` but a review reports them at most as minor.
Why: PrestaShop is audited in France against the RGAA, and its criteria map one to one to WCAG, so a finding reads for both audiences. Keeping the 2.2 additions means no catch-up when RGAA 5 lands.
Left aside: WCAG 2.2 AA as the blocking reference (stricter than what the shop is audited against), RGAA only (would drop rules the kit already follows).

## 40. The page head: title and icon, sub-pages on a band, actions with icons; no breadcrumb — 2026-11-20

Replaces the slots of #11. Every kit page starts with `<twig:ui:PageHead>`, rendered by the layout from the page's data (`layoutTitle`, `layoutIcon`, `layoutHeaderToolbarBtn`, the help link, the menu): a compact title (the size of a section title) with an optional icon; on a page with sub-pages the title is the name of their group in the menu ("Attributes & Features", over Attributes | Features), the same on each of them; a page under a sub-page (add, edit, view) keeps its own title ("New attribute") over the same sub-pages (`MenuBuilder::isTabPage()`: the request is not the tab's link, or its action is not a list or options); the page's own name stays in the browser tab; its icon is the group's too; every core page has a title icon by menu entry in `Toolbar::KIT_TITLE_ICONS` (the group for a sub-page, the page's own entry otherwise, or its group's when the group has only it left, its other pages disabled; a page named as its side menu entry has the same icon, `NavBar::KIT_ICONS`; all of them in Playground/Layout/Page titles), module pages none, `layoutIcon` only to override it (2026-11-24); the sibling sub-pages of the menu as links on the bottom edge of a white band, scrolling sideways with a fade when they do not fit, before the actions in the markup so the keyboard reaches them first; the page actions as small buttons, each with its icon and label, the main one first and filled; a module adds one with `actionGetAdminToolbarButtons` on any page, not HTML (`displayDashboardToolbarTopMenu` is not rendered: HTML could not go in the phone menu); Help as an icon button, its tooltip under it. Under the md breakpoint every action and Help go in one "More actions" menu at once. No breadcrumb. The content is centred (75rem) or full width: a page with a grid takes the full width, `layoutFluid` overrides it. The side menu, its monogram and its hamburger switch to the mobile drawer under lg (992px).
Why: the breadcrumb repeated the side menu and took a line; the sub-pages looked like tabs but are links to other pages; a title the size of a page heading took room for little. Shopify and the kit's header keep the top of a page compact. Today a page has at most three toolbar buttons (configure a module) plus Help, and four sub-pages (International > Localization), so one row and one menu hold them.
Left aside: the breadcrumb; the current sub-page as the title (it repeated the underlined link and changed from one sub-page to the other), a title menu to switch sub-pages (hides them), no visible title over the sub-pages (no h1); the sub-pages as segmented buttons, pills, plain text, folder tabs, a title menu, a line above the title or a side rail (tried in the playground, 2026-11-20); folding the actions by the head's own width (container query), which made the menu change while resizing.
Accepted (review 2026-11-24): Help's tooltip does not close with Escape while hovered; Bootstrap's tooltip behaviour, left to it.

## 42. A KPI is a card coloured by its place in the row, from the KPI's data — 2026-11-24

A kit page renders its KPI row (`CommonController::renderKpiRowAction`) as `<twig:ui:Kpi>` cards in `.ps-kpi-row` (up to four a line; on a phone they scroll sideways with ps-scroll-fade, each 80% of the width so the next one shows), each core KPI giving its data (`KpiDataInterface`, `KpiData`; the 15 `HelperKpi` KPIs through `HelperKpiTrait`, their HTML unchanged for the old theme). A KPI's colour is its place in the row: oceanblue, purple, amber, green, as a line on the card's top edge and the tint of its icon square; the line steps weigh the same on white (600, green 300). A linked KPI is a link card; an out-of-date value is fetched on load (`kpi.js`), a placeholder (Bootstrap `.placeholder`) standing for it meanwhile instead of the cached value, which may be stale or broken ("tax excl." alone); a long dash when there is none. A module's KPI (HTML only) keeps its HTML in its tile.
Why: the legacy KPIs were raw HTML with their own jQuery script, not themable; colour tells the figures of a row apart (the visual review found the tint alone too faint, the line alone unbalanced at the 500 steps).
Left aside: the refresh button (an out-of-date value refreshes itself, reloading the page does the rest); the d3 sparkline (no core KPI uses it); a KpiRow component (the row is markup of kpi_row.html.twig); `<twig:ui:Layout:Tiles>`, which stacks them one per line on a phone; a tinted card, a top line alone (playground, 2026-11-24).
Review (2026-11-25): a lone KPI takes the whole width at every size, a row scrolls from two KPIs. No tooltip: no core KPI of a kit page has one (only the old product KPIs), so the prop, its info button and its touch and Escape issues went. The placeholder is the back office's skeleton: Bootstrap's `.placeholder-wave` on its grey (`$gray-400`, the band's peak `$gray-300`, as new-theme `_skeleton.scss`), square. Accepted: it moves under reduced motion as Bootstrap's does (Bootstrap does not stop it); an unbreakable title may overflow on a phone (real titles have spaces).
Page review (2026-11-25): a module's KPI without `KpiDataInterface` keeps its own HTML, unstyled; the module adapts by giving its data (no tile around HTML it styles itself). The row is a tab stop only while it scrolls; focused, it shows whole with Bootstrap's ring inside its edge. Accepted: cards on different lines of the 2×2 grid keep their own heights; a value wraps rather than being cut (no line clamp: a cut figure misleads).

## 41. A page introduction opens once in a modal and never again once closed — 2026-11-20

The showcase cards (9 pages: attributes, features, categories, monitoring, customers, employees, SEO URLs, CMS pages, carriers) are `<twig:ui:ShowcaseModal>` on kit pages: a static modal that opens when the page loads while the card is not closed, with the illustration, the text and a link to the documentation. Its close button, "Got it" or Escape record it closed (`admin_close_showcase_card`), for the whole shop as before; a click outside does not close it, so nobody dismisses it for good by accident.
Why: the card pushed every listing down on every visit until someone closed it, and its close was a clickable `<i>`. A modal says it once, then gets out of the way.
Left aside: a button to reopen it (the content is in the documentation), storing the closing per employee (a back-office change).

## 43. The grid: Bootstrap markup over the presented grid, native forms, kit-layer PHP only — 2026-11-25

`<twig:ui:Grid :grid="…"/>` renders the array the page already gets from `GridPresenter`, unchanged, with Bootstrap's card, table, pagination, dropdowns and modals. Sorting, paging and rows per page are links; row, bulk, status and position actions are native submit buttons (`form`, `formaction`) on one hidden form, so no request is built in JS; a few `data-ps-*` modules do only what HTML and Bootstrap cannot (selection count, confirm dialog, async toggles, row preview, drag reordering with Move up / Move down buttons, clickable rows), the same on every page instead of per-page grid extensions. Core/Grid, the presenters, the controllers and the definitions are untouched: the PHP is the kit's own component classes (`Grid`, `Check`, `EmptyState`, `Pagination`, `ConfirmDialog`) and a `submit` item type in `DropdownMenu`. One `ui:Check` with `type: checkbox|switch`; at 375 the filter row scrolls with the table, no sticky columns in v1; `quicknav` pagination and `empty_state_without_headers` are ignored on kit pages; per-grid empty states move into each page's `empty` block. The full design, its 14 build steps and what was left aside: `ui/.ai/designs/grid.md`, from the `ui-component-design` workflow (three proposals: Bootstrap first 22.5/30, accessibility first 20.5, dense daily use 17.5; ideas grafted from the second: a row header and named row controls, a focusable results summary, one confirm dialog).
Why: the least new code and PHP for a UI rework, every interaction works without JS first and from the keyboard, and identical grids finally behave the same.
Left aside: selection across all pages (no server contract), filter chips, a collapsible filter panel, a sticky bulk bar (no proven need yet), JSON responses for the toggle routes (a PHP change outside the UI scope).
Check review (2026-11-25): accepted, the unchecked box's `#ddd` border (about 1.4:1 on white, below 3:1): its label is visible and says what it is; a label with one unbroken word longer than the line may overflow (real labels have spaces). EmptyState and Pagination review (2026-11-25): accepted, an EmptyState title or message with one unbroken word wider than its box overflows, for the same reason.

## 44. Windows forced colours (high contrast) mode is not reviewed — 2026-11-25

Reviews do not report what forced colours mode changes (a focus ring drawn only with `box-shadow` disappearing, colours replaced by the system's). The kit follows Bootstrap there, as its buttons already do.
Why: too much for the value now; it would be handled once for the whole kit (a transparent `outline` beside every ring), not component by component.
Left aside: a transparent outline on each focus ring.

## 45. The grid's sorted column: its arrow in a round oceanblue badge — 2026-11-26

The sorted column's arrow (up or down) sits in a small round badge with the oceanblue badge's colours (the side menu's version: `oceanblue-bg-subtle`, `oceanblue-800` ink, about 6:1); the other sortable columns keep a muted both-ways arrow. The grid also marks the rest of its state in the brand blue: the count badge in the header, the line of a checked row (`oceanblue-500`, the side menu's accent).
Why: an arrow in the text colour, or a light blue arrow alone, read as a glitch rather than "sorted here"; the badge shows the active column at a glance and its direction is still the arrow's shape and `aria-sort`.
Exception: it is round in a kit without rounded corners, as the employee's picture and the pill badges are, because the shape is what is asked for.

## 46. Menus open in the browser's top layer (Popover API) — 2026-11-26

Every Bootstrap menu of the kit (`<twig:ui:DropdownMenu>`, the notifications panel) carries `popover="manual"`; `dropdown-top-layer.js` calls `showPopover()` when Bootstrap shows it and `hidePopover()` when it hides it, and makes Popper place it against the viewport (`strategy: fixed`). Bootstrap still opens, places, closes and drives it from the keyboard; `.dropdown-menu[popover]` undoes the browser's popover box.
Why: a menu inside a grid's scrolling table was cut by its `overflow`, its fade mask and its size container. In the top layer nothing around it can cut it, now or when a later style adds such a box; Shopify's admin menus do the same. Without the Popover API (before Chrome 114, Safari 17, Firefox 125) the attribute is ignored and the menu is as before.
Left aside: Bootstrap's own `popperConfig` on each toggle (`data-bs-popper-config`), now redundant where present.

## 47. Grid column widths: from their content, with an optional hint — 2026-11-26

By default a grid column is as wide as its heading and values: the filter row's text fields have `size="1"`, so they fill their cell without claiming a width (they used to split the table evenly). A definition can tune one column with the `width` option every column type takes (`AbstractColumn`, `setDefined`, no default): `sm` is as narrow as its content (an id, a code), at least `$ps-grid-column-sm-min-width` (3rem, its filter field too), `md` and `lg` are at least `$ps-grid-column-md-min-width` and `$ps-grid-column-lg-min-width`. The kit renders it as `ps-grid__heading--width-{sm|md|lg}`.
Why: content-driven widths need no rule on column names or types, and a hint stays in the definition where the data is known. `max-width` is not offered: browsers ignore it on table cells; long values wrap.

## 48. Pagination: Previous, a field, Next; under the grid's table — 2026-11-26

`<twig:ui:Pagination>` shows Previous, the page shown and Next, no page numbers: with `jumpUrl` the page shown is a field to go to any page ("‹ Page [3] of 25 Go ›"), without it the text "Page 3 of 25". The arrow that leads nowhere (first, last page) stays in place, disabled and hidden from screen readers. A grid always passes `jumpUrl`. Under the grid's table, inside the card's body (`ps-grid__pager`), no longer in its `card-footer` (left for a page's own `footer` block): the rows shown ("101–120 of 241 results") at the start, the pagination in the middle of the card, the rows per page at the end; under `$ps-grid-pager-wide-min-width` (the bar's own width, 40rem) one under the other, centred.
Why: one form on every list whatever its size (numbers up to five pages and a field beyond changed the bar from one grid to the next), half as many elements, nothing that overflows on a phone; the arrows go to the neighbours, the field anywhere. Proposals compared on Countries (count left and pages right, pages centred, pages left and count right with the field centred); the product owner chose this balanced form.
