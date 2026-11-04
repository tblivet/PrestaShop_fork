# /ui kit — markup, styling, JS hook and accessibility conventions

Rules for any markup rendered with the `/ui` kit: Twig components, `Ui/` page templates, shared helpers they include, Storybook stories and playground mockups. Kit architecture and build live in [`.ai/Component/UiKit/CONTEXT.md`](../../.ai/Component/UiKit/CONTEXT.md).

## One element, three jobs

```html
<p class="ps-password-feedback__requirement d-flex align-items-center gap-1 mb-0"
   data-ps-ref="password-requirement-length"
   data-ps-state="met">
```

| Part | Job | Rule |
|------|-----|------|
| BEM class `ps-block__element--modifier` | What the element **is**, and its own look | Styled in `ui/src/scss` |
| Bootstrap utilities (`d-flex`, `gap-1`, `mb-0`, `text-truncate`…) | Generic layout and spacing | Never re-written in SCSS |
| `data-ps-*` | What **JS** needs, and runtime **state** | Never styled, except state |

## Classes: BEM with the `ps-` prefix

- **Blocks start with `ps-`** (`ps-login`, `ps-password-feedback`) so they never clash with Bootstrap or module classes. Elements `__`, modifiers `--`, kebab-case: `ps-password-field__icon--shown`.
- **One block per partial**, nested with `&__` / `&--` in `ui/src/scss/{components,layout,pages}/_<block>.scss`. No element of another block, no element of an element (`ps-login__card-body`, not `ps-login__card__body`).
- **The block name is declared once**, on the first line, as in Hummingbird: `$component-name: ps-flash-messages;` then `.#{$component-name} { … }`. Write elements and modifiers with `&__` / `&--`, nesting a modifier under its element (`&__icon { &--shown { … } }`). When a rule needs more specificity, nest the element under another element or a state of the block (`&__toggle[aria-pressed="true"] &__icon { &--shown { … } }`) rather than spelling `.#{$component-name}__icon` in full. Never style another block from a partial, not even a modifier of it: put the page's own block on the same element instead and style that block in its partial.
- **Pages may need more than one block** (`ui/src/scss/pages/`), unlike components and layouts. Pick by size:
  1. **One block** (default): the page's parts are elements of `ps-{page}`, flattened (`&__card`, `&__card-body`). Example: `pages/_login.scss`.
  2. **One partial per sub-block** when a part has its own elements: `pages/{page}/_{page}.scss`, `_{page}-kpi.scss`… each with its own `$component-name`.
  3. **A `$selectors` map** when one partial reads better with several of the page's own blocks: `$selectors: (page: 'ps-dashboard', kpi: 'ps-dashboard-kpi');` then `.#{map.get($selectors, kpi)} { … }`. Pages only, and only the page's own blocks, never a component's classes. Stylelint checks that every value is a `ps-` BEM class.
- **Page wrapper**: every page's root element carries `ps-page ps-page--{page}` and the page's own block `ps-{page}`: `<main class="ps-page ps-page--login ps-login">`. `ps-page--{page}` names the page wrapper for whoever reads the markup and may have no styles; the page's styles go on `ps-{page}` in `pages/_{page}.scss`. `ps-page--{page}` gets styles only for a real variant of the page layout, in `layout/_page.scss`. Stylelint checks the variable's value and the `&__` / `&--` names (it cannot read a full `.#{$component-name}__…` selector, one more reason to avoid it).
- **Modifiers are fixed variants** chosen in the template (size, tone, layout): `ps-page--bg-subtle`. Never a runtime state.
- **Utilities first**: if a Bootstrap utility expresses it, put the utility in the markup instead of a SCSS rule. SCSS only holds what utilities cannot (component colors, shapes, transitions, state). Tokens through `var(--#{$prefix}…)`, never hard-coded colors.
- **Logical properties and values only**, so the BO can go RTL without rewriting styles: `margin-inline-start`, `padding-block`, `inset-inline-end`, `border-start-start-radius`, `text-align: start`, `float: inline-end`; utilities `ms-*` / `me-*` / `ps-*` / `pe-*`, `text-start` / `text-end`, `float-start` / `float-end`. `width` / `height` stay allowed.
- **Bootstrap component classes** (`btn btn-primary`, `form-control`, `alert alert-danger`) stay as they are; add a BEM class beside them only when the element needs its own styles.

## Components and layouts

Two kinds of `<twig:ui:*>`, never mixed (`DECISIONS.md` #24):

| | Component | Layout |
|---|---|---|
| Is | One element: look, content, states, behaviour (`ui:Button`, `ui:Badge`, `ui:Alert`, `ui:Modal`, `ui:Grid`) | The arrangement of elements (`ui:Layout:Page`, `ui:Layout:Stack`, `ui:Layout:Cluster`, `ui:Layout:Columns`, `ui:Layout:FormSection`) |
| Owns | Its inner padding, borders, colors, typography, its own parts | The space between its children (`gap`), alignment, wrapping, columns, responsive stacking, the page slots |
| Never | Outer margin, position, width or alignment taken from where it is used; a layout inside it | Styles, classes or props of its children; a child's look or behaviour |
| Name, folder | `ui:{Name}`, `Twig/Component/Ui/`, `scss/components/`, Storybook "Components" | `ui:Layout:{Name}`, `Twig/Component/Ui/Layout/`, `scss/layout/`, Storybook "Layouts" |

- **Spacing comes from the layout**: a page wraps components in a layout instead of putting `mb-3`, `ms-auto` or `w-100` on them. A component's SCSS root has no `margin`; a Bootstrap class that brings one (`.alert`, `.form-group` style margins) is reset in the kit.
- **A layout takes any child**: it lays out its content block and named slots with Bootstrap's flex and grid utilities driven by props (`gap`, `align`, `justify`, `direction`, `breakpoint`), and never selects its children's classes.
- **A component with regions keeps them inside**: a modal's header, body and footer, a card's body are the component's own parts. What goes into a region (the buttons of a modal footer) is arranged by a layout placed in that region (`ui:Layout:Cluster`).
- **The page template is the top layout**: slots title, breadcrumb, actions, tabs, content; inside content, sections and stacks; inside those, components.
- **Attribute pass-through stays for hooks and ARIA** (`data-ps-*`, `aria-*`, `id`); spacing and placement utilities on a component are a sign a layout is missing.

## Component API

Templates write `<twig:ui:*>` components and layouts, not raw Bootstrap markup (`DECISIONS.md` #23). A component is only worth it if it covers the real cases, so each one is built to be flexible (layouts follow the same rules for their props and slots):

- **Props for meaning, not for looks**: `variant`, `size`, `type`, `state`, `icon`, `label`, with allowed values checked in `preMount()` (see `Alert.php`). No prop that only maps to one utility class.
- **Attributes pass through**: any other attribute (`id`, `data-ps-*`, `aria-*`, `title`, an extra `class`) lands on the root element through `attributes.defaults()`, so a page adds a hook without a new prop. Placement and spacing are not passed this way: they belong to a layout.
- **Content in blocks**: the main content in `{% block content %}`, named blocks for the other slots (`actions`, `footer`, `icon`), so any markup fits inside.
- **The right element**: when the same look has different semantics, a prop chooses it (a button-like link gets `href` and renders `<a>`, otherwise `<button type="button">`).
- **Accessible by default**: the correct role, `type` and ARIA come from the component; a prop is required when accessibility needs it (an icon button's `label`).
- **Bootstrap underneath**: the component outputs Bootstrap's own classes, so Bootstrap docs, utilities and JS keep working on it.
- **Compose only what is generic; own what is specific**: a component reuses another when it needs it exactly as it is, through its normal props (a menu of actions made of standard buttons). When a part belongs to one component (its structure, state or behaviour are tied to it), the component owns that part as a BEM element instead: the show/hide button of `ui:PasswordField` is `ps-password-field__toggle`, not a generic icon button. A sign of the wrong choice: a generic component growing a prop only one parent uses (`pressedIcon` for the password field).
- **A missing case goes into the component**: add the variant, slot or prop, with its story and test, instead of writing raw markup in the page.

## JS hooks: `data-ps-*`

Same vocabulary as the Hummingbird front theme.

| Attribute | Put it on | Example |
|-----------|-----------|---------|
| `data-ps-ref="…"` | An element JS reads or updates | `data-ps-ref="password-strength-bar"` |
| `data-ps-action="…"` | An element whose interaction triggers a behaviour | `data-ps-action="toggle-password"` |
| `data-ps-target="…"` | A container JS writes content into (live region, injected markup) | `data-ps-target="password-feedback-announcement"` |
| `data-ps-data-*` | Strings or values handed to JS, usually translated | `data-ps-data-valid="{{ '…'\|trans }}"` |

- **Values are kebab-case nouns** naming what the element is (`password-strength-bar`), not what it looks like (`red-bar`).
- **JS never selects a class or an id**, so renaming a class never breaks a script. SCSS never selects `ref`, `action`, `target` or `data`, so moving a hook never changes the look.
- **Selectors live in one map per scope**: `ui/src/js/selectors.js` for kit behaviour, a `*-map.ts` or a map constant at the top of the file for new-theme page logic. No selector strings inline in the code.

## Runtime state

1. **The native ARIA state when one exists**, since it is also announced: `aria-expanded`, `aria-pressed`, `aria-selected`, `aria-current`, `aria-invalid`, `aria-disabled`. Style it directly: `.ps-nav__link[aria-current="page"]`.
2. **Otherwise one `data-ps-state="…"`** with a kebab-case value (`met`, `loading`, `open`), set by JS and styled in SCSS: `&__requirement[data-ps-state="met"] &__icon`. Render the initial value in the template.
3. **Visibility**: the `hidden` attribute or `d-none`. Never a modifier class toggled by JS.

## Kit templates and the old theme

The Bootstrap 4 theme may break on the feature branch (`ui/.ai/DECISIONS.md`): a kit page does not have to keep shared markup working with `PS_UI_KIT=0`.

- **Fork rather than bend**: when a shared helper, form theme or script gets in the way, give the kit its own (`Ui/` template, `ui_kit_layout.html.twig`, a `_ui` entry) instead of making one file serve both themes.
- **Theme-specific bits** that stay shared go through the `ui_kit` global: `ui_kit ? 'material-symbols-outlined' : 'material-icons'`.
- **Record what changes for others** in `ui/.ai/CHANGELOG-UI.md`: removed or renamed classes and ids, moved hooks, changed strings. Module developers and the final UI-test pass rely on it.

## Page shell

Every kit page renders in the one page template (title, breadcrumb, actions, tabs, content). A page fills its slots and never builds its own header or toolbar. Hooks (`renderhook`, `displayAdmin…`) keep their place in the page; one moves only when the new layout makes its old place meaningless, with a `CHANGELOG-UI.md` entry.

## Accessibility (WCAG 2.2 AA)

Check these in every template and story before committing:

- **Native first**: `<button>` for actions, `<a href>` for navigation, real `<label for>` on every field. ARIA only fills a gap HTML cannot.
- **Icons**: decorative icons get `aria-hidden="true"`. An icon-only control gets an `aria-label` (translated), and the icon inside stays hidden.
- **Never color alone**: a state also changes shape or text (`radio_button_unchecked` → `check_circle`, not grey → green only). Text contrast ≥ 4.5:1, large text and UI parts ≥ 3:1.
- **Dynamic messages**: updates appear in a live region that exists before the update — `role="status"` (polite) for progress and hints, `role="alert"` only for blocking errors. Debounce what changes while typing.
- **Help and errors**: link them to their field with `aria-describedby`; set `aria-invalid="true"` on a field in error.
- **Hidden text for screen readers**: `visually-hidden` (kit) or `sr-only` (Bootstrap 4). Never hide visible information with `aria-hidden`.
- **Keyboard**: everything reachable and usable with the keyboard, in a logical order, with a visible focus ring; no keyboard trap outside modals; `Escape` closes overlays.
- **Targets and motion**: touch targets ≥ 24×24 px; transitions and animations stop under `prefers-reduced-motion: reduce`.
- **Text**: every visible or announced string is translatable (`|trans` with a domain); no text baked into images or CSS `content`. Rewording is welcome; list the new strings with `node ui/.ai/bin/missing-translations.mjs`.
- **Forms**: render kit forms with `@PrestaShop/Admin/TwigTemplateForm/ui_kit_layout.html.twig`, so errors and help are linked to their field even when widgets are rendered one by one. A field type's markup lives in a kit component; the form theme block only maps the field to it (`DECISIONS.md` #25), never Bootstrap 4 or prestakit classes. Field state is `aria-invalid`, which the kit styles like `.is-invalid`.

## Lint

`npm run lint:scss` in `ui/` and `npm run lint` in `admin-dev/themes/new-theme` (both in CI, `.github/workflows/lint.yml`), `npm run lint:scss:fix` to fix what can be fixed. `ui/.stylelintrc.json` extends Bootstrap's config, which orders properties with `stylelint-config-recess-order` (as Hummingbird, through `stylelint-config-prestashop`), and adds the kit rules:

| Rule | Enforces |
|------|----------|
| `property-disallowed-list`, `declaration-property-value-disallowed-list` | Logical properties and values only |
| `selector-class-pattern` | `ps-` classes are BEM |
| `declaration-property-value-allowed-list`, `selector-nested-pattern` | `$component-name` is a `ps-` block, `$selectors` values are `ps-` BEM classes, `&__element--modifier` names are BEM |
| `selector-attribute-name-disallowed-list` | No `data-ps-*` selector in SCSS except `data-ps-state` |
| ESLint `no-restricted-syntax` (`admin-dev/themes/new-theme/.eslintrc.js`, `uiKitFiles`) | Kit page scripts never select a class or an id |

Add a page's scripts to `uiKitFiles` when it moves to the kit. Not linted, check by hand or with the `ui-review` skill: utilities rewritten in SCSS, accessibility, and the kit's own `ui/src/js` (no JS lint in `ui/` yet).

## Canonical examples

- `src/PrestaShopBundle/Resources/views/Admin/Helpers/password_feedback.html.twig` + `admin-dev/themes/new-theme/js/components/change-password-handler.ts` + `ui/src/scss/components/_password.scss` — BEM + utilities + hooks, `data-ps-state`, shape-changing icon, debounced live region, `aria-describedby`, shared by both themes
- `ui/src/scss/pages/_login.scss` — page block with elements and a modifier
- `ui/src/js/components/password-toggle.js` — `data-ps-action` behaviour with `aria-pressed` and a translated `aria-label`
- `themes/hummingbird/templates/components/password-policy-template.tpl` — the same widget in the front theme
