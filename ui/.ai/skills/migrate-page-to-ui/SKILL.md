---
name: migrate-page-to-ui
description: >
  Moves one Symfony back-office page from Bootstrap 4 + prestakit onto the /ui kit behind the
  PS_UI_KIT toggle: Ui/ template, playground mockup, _ui webpack entry, BS4→BS5 markup, BEM and
  data-ps hooks, UI test impact. Trigger: "migrate {page} to the ui kit", "port {page} to /ui".
argument-hint: "[page route or template]"
needs: [create-ui-component]
produces: "Ui/ page template + mockup + _ui entry, with the old page untouched"
---

# Migrate a back-office page to the /ui kit

Read `.ai/Component/UiKit/CONTEXT.md` (toggle, `Ui/` templates, webpack groups, mockup sync) and `ui/.ai/CONVENTIONS.md` (classes, hooks, state, shared markup, accessibility). The login pages are the reference: `Admin/Login/Ui/*.html.twig`, `ui/src/playground/pages/login/`, `login_form_ui`.

## 1. Audit the current page

List, with file paths: the templates and blocks it renders, the shared helpers and form themes it includes, its webpack entry and the components it initialises, every jQuery / Bootstrap 4 plugin call, and the selectors the UI tests use on it (search `tests/UI/campaigns` and `PrestaShop/ui-testing-library` for its classes and ids), and the hooks it renders. UI tests are adapted at the end of the project: the selectors do not block a rename, they go in `ui/.ai/CHANGELOG-UI.md`. Check `ui/.ai/INVENTORY.md` for the kit components the page should use, and list the form field types it renders: each one needs its block in `ui_kit_layout.html.twig` ("Form theme" table). A missing one is built first, block and component together. This audit is the plan of `ui-rework` checkpoint 1.

## 2. Mockup first

`ui/src/playground/pages/{page}/{page}.html` + `{page}.stories.js`: the target markup with Bootstrap components, `ps-` BEM blocks (layout and spacing too, no utilities for them: CONVENTIONS.md "Bootstrap first") and `data-ps-*` hooks, static content. The page fills the slots of the page template; missing kit components → `create-ui-component` first. This mockup is `ui-rework` checkpoint 2: show it and wait for approval.

## 3. Template

`src/PrestaShopBundle/Resources/views/Admin/{Section}/Ui/{page}.html.twig`, selected with `{% extends ui_kit ? … %}`; the `Ui/` template has its own block names so the old ones stay unused. Mirror the mockup; only content comes from PHP. The page root carries `ps-page ps-page--{page} ps-{page}`, and the page's styles go on `ps-{page}` in `ui/src/scss/pages/_{page}.scss` (one block, sub-block partials or a `$selectors` map depending on its size, see `CONVENTIONS.md`). Render forms with the kit form theme `@PrestaShop/Admin/TwigTemplateForm/ui_kit_layout.html.twig` (Bootstrap 5 plus linked errors and help) and end with `form_end()`.

Bootstrap 4 → 5 changes to apply on the way:

| BS4 | BS5 |
|-----|-----|
| `data-toggle`, `data-target`, `data-dismiss` | `data-bs-toggle`, `data-bs-target`, `data-bs-dismiss` |
| `ml-*` / `mr-*`, `pl-*` / `pr-*`, `float-left` / `float-right`, `text-left` / `text-right` | `ms-*` / `me-*`, `ps-*` / `pe-*`, `float-start` / `float-end`, `text-start` / `text-end` |
| `sr-only` | `visually-hidden` |
| `form-group`, `form-row` | `mb-3`, `row g-2` |
| `custom-select`, `custom-control custom-checkbox`, `custom-switch` | `form-select`, `form-check`, `form-check form-switch` |
| `badge-{color}` | `text-bg-{color}` |
| `close` + `&times;` | `btn-close` with a translated `aria-label` |
| `input-group-append` / `-prepend` | children directly in `input-group` |
| Material Icons `material-icons` | Material Symbols `material-symbols-outlined` |

## 4. Page JS

Add `{page}_ui` in `admin-dev/themes/new-theme/.webpack/common.js` under the "only loaded while PS_UI_KIT is on" group, and note the replacement on the old entry. Replace jQuery plugin calls with `bootstrap.*` classes, and bind to `data-ps-*` hooks through a `*-map.ts`. A shared script that gets in the way is forked for the kit rather than made to serve both themes. Add the page's scripts to `uiKitFiles` in `admin-dev/themes/new-theme/.eslintrc.js` so the selector lint applies.

## 5. Verify and record

Apply the done gates and the record step of the `ui-rework` skill (builds, lints, tests, Storybook parity, `ui-screen-review` with seed scenarios, `CHANGELOG-UI.md`, strings to translate, `PROGRESS.md`, tracker). The old page with `PS_UI_KIT=0` may break on the feature branch; note it in `CHANGELOG-UI.md` when it does.
