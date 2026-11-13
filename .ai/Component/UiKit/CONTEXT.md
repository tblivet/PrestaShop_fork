# UiKit Component

## Purpose

`/ui` is the back-office design system: Bootstrap 5.3 customised from bootstrap-play, built with Vite into `ui/dist` (`css/ui.css`, `js/ui.js`, fonts, brand images) and documented in Storybook. New-theme Symfony pages load it instead of Bootstrap 4 + prestakit when the `PS_UI_KIT` toggle is on. It holds styles and generic UI behaviour only: page logic stays in new-theme, and the legacy `default` theme is out of scope.

## How to work

The process (checkpoints, done gates, records) is in [`ui/README.md`](../../../ui/README.md); the rules in [`ui/.ai/CONVENTIONS.md`](../../../ui/.ai/CONVENTIONS.md); what is decided in [`ui/.ai/DECISIONS.md`](../../../ui/.ai/DECISIONS.md). Records: `ui/.ai/INVENTORY.md` (component backlog), `PROGRESS.md` (generated), `CHANGELOG-UI.md` (changes for modules, tests, translators), `reviews/*.json`.

## Layers

| Layer | Path |
|-------|------|
| Design tokens, Bootstrap overrides, components | `ui/src/scss/` (`_variables.scss`, `components/`, `forms/`) |
| Back-office frame and page styles (`ps-` classes) | `ui/src/scss/layout/`, `ui/src/scss/pages/` |
| Generic UI JS, `data-ps-*` hooks | `ui/src/js/` (`components/`, `selectors.js`, `compat/`) |
| Storybook stories and page mockups | `ui/src/stories/`, `ui/src/playground/` |
| Icons for `<twig:ui:Icon>` and stories (read by PHP, ship in the release): Material Symbols, brand logos | `ui/icons/` |
| Twig components (`<twig:ui:*>`) | `src/PrestaShopBundle/Twig/Component/Ui/`, templates in `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/` |
| Pages rendered with the kit | `Admin/Layout/Ui/`, `Admin/Login/Ui/` under `src/PrestaShopBundle/Resources/views/` |
| Page logic | `admin-dev/themes/new-theme/js/pages/` (`*_ui` webpack entries) |

## Conventions

Markup, `data-ps-*` JS hooks and accessibility rules are owned by the kit: read [`ui/.ai/CONVENTIONS.md`](../../../ui/.ai/CONVENTIONS.md) before writing any template, story or script for it.

## Keep Storybook and the back office in sync

Storybook is the reference for the markup. Every change goes to both sides in the same commit:

- **Twig component ↔ story**: `<twig:ui:Alert>` must render exactly the markup of `ui/src/stories/components/Alert.stories.js`, same classes, variants and attributes. A new prop means a new story variant or control, and the other way round. The story header and docs description name the Twig component.
- **Page template ↔ playground mockup**: `Admin/Login/Ui/login.html.twig` mirrors `ui/src/playground/pages/login/login.html` (structure, `ps-` classes, `data-ps-*` attributes). Only the content differs: translated strings and form fields come from PHP.
- **Styles live in `ui/src/scss` only**: the playground has no styles of its own, so Storybook and the back office load the same `ui.css`.
- Check both after a change: `npm run storybook` in `ui/`, and the page with `PS_UI_KIT=1`.

## Non-obvious patterns

- **Toggle**: `PS_UI_KIT` (`0` in `.env`, set it to `1` in `.env.local`) is the `ui_kit` Twig global. A page switches with `{% extends ui_kit ? '…/Ui/page.html.twig' : '…/old_layout.html.twig' %}`. The `Ui/` template uses its own block names, so the old blocks stay untouched and unused.
- **Twig components**: a class in `Twig/Component/Ui/` with `#[AsTwigComponent('ui:Name', template: …)]`, public props validated in a `#[PreMount]` `OptionsResolver` (`setIgnoreUndefined()` so `class` and other attributes pass through). Registered automatically.
- **Icons**: `<twig:ui:Icon name="arrow_back"/>` renders an inline SVG from `ui/icons/` (DECISIONS.md #35): every Material Symbol is committed in `ui/icons/material-symbols/` (`ui/.ai/bin/sync-icons.mjs`), logos in `ui/icons/brand/` (`brand:github`). Iconify is off, so a missing icon fails the render. Stories render the same markup with `ui/src/stories/ui-icon.js`; Content/Icons searches the whole set. No icon font in kit markup.
- **JS ownership**: if Storybook or a module could use it without a PrestaShop back end, it goes to `ui/src/js` (hooks in `selectors.js`). Otherwise it stays in new-theme. Both bind to `data-ps-*` attributes only.
- **`ui.js` is a classic IIFE script**: it sets `window.bootstrap` and registers Bootstrap's jQuery plugins at once (`compat/jquery-plugins.js`, temporary until pages call `bootstrap.Modal`… directly). jQuery comes from core `js/jquery`, loaded before it.
- **Webpack entries** in `admin-dev/themes/new-theme/.webpack/common.js` are grouped: entries loaded only with the toggle off (Bootstrap 4 + prestakit) first, then their `_ui` replacements, then the rest.
- **Forms**: the kit pages render fields with `@PrestaShop/Admin/TwigTemplateForm/ui_kit_layout.html.twig` (Bootstrap 5 plus errors and help linked to their field). Fields rendered one by one rely on `form_end()` to output fields added by modules. Form buttons render `<twig:ui:Button>` (`button_widget`): pass `variant` to `form_widget`, never `btn-*` classes.
- **Build**: `make admin-ui` / `./tools/assets/build.sh admin-ui`. File names are fixed (no hash) because the layouts link them. Watch mode does not empty `dist/`, and Storybook has its own Vite config, so neither wipes the build. Only `ui/dist` ships in a release.

## Skills

Owned by the kit in `ui/.ai/skills/`, linked here as `skills/<name>` (same chain as module-owned skills, see [STRUCTURE.md](../../STRUCTURE.md#adding-a-module-owned-skill)).

| Skill | Path | Trigger |
|-------|------|---------|
| `create-ui-component` | [skills/create-ui-component/SKILL.md](skills/create-ui-component/SKILL.md) | "create a ui component for {Name}" |
| `migrate-page-to-ui` | [skills/migrate-page-to-ui/SKILL.md](skills/migrate-page-to-ui/SKILL.md) | "migrate {page} to the ui kit" |
| `ui-review` | [skills/ui-review/SKILL.md](skills/ui-review/SKILL.md) | "review the UI of {page}", "check this screen" |
| `ui-seed` | [skills/ui-seed/SKILL.md](skills/ui-seed/SKILL.md) | "seed {scenario}", "fill the customers grid", "undo the seed" |
| `ui-wording` | [skills/ui-wording/SKILL.md](skills/ui-wording/SKILL.md) | "reword {page}", "tone of voice pass on {page}" |
| `ui-rework` | [skills/ui-rework/SKILL.md](skills/ui-rework/SKILL.md) | "work on the new ui: {target}", "improve {component}", "fix these ui findings on {page}" — entry point that routes to the others |

## Tools

- `node ui/.ai/bin/missing-translations.mjs [--locale fr-FR] [file …]` — strings of the branch's changed Twig/PHP files missing from the catalogues (new or reworded wording)
- `php ui/.ai/bin/seed.php list|status|up <scenario>|down <scenario>` — reversible review data, in the container as `www-data` (`ui-seed` skill)
- `node ui/.ai/bin/progress.mjs` — regenerates `ui/.ai/PROGRESS.md`
- `node ui/.ai/bin/review-files.mjs [--uncommitted] [filter …]` — files to review for a change, grouped for a web integrator
- ESLint `uiKitFiles` in `admin-dev/themes/new-theme/.eslintrc.js` — kit page scripts never select classes or ids
- `@PrestaShop/Admin/TwigTemplateForm/ui_kit_layout.html.twig` — form theme of the kit pages: links help and errors to their field (`aria-describedby`, `aria-invalid`), form-level errors as `<twig:ui:Alert>`

## Workflows

Owned by the kit in `ui/.ai/workflows/`, linked as `.claude/workflows/<name>.js` (Claude Code saved workflows; other tools follow the `ui-review` skill by hand).

| Workflow | Does | Args |
|----------|------|------|
| `ui-screen-review` | Lists every state of each page from code + story (flashes, config-gated branches; no dark mode, no RTL), reaches the rare ones by reversible setup on the local shop or DOM emulation, screenshots every state × width in Chrome, axe + keyboard pass, reviews through visual / UX-content / a11y-conventions lenses, drops unsupported findings, writes `index.html` with a state coverage table | `{pages: [{name, url, story?, files?, scenarios?}], outDir, reviewsDir?, widths?, setup?}` (`setup: false` stays read-only; `reviewsDir` keeps `ui/.ai/reviews/<page>.json`) |
| `ui-inventory` | Lists every Symfony page template, audits them in batches (plus the shared layout, grid and form themes) for UI patterns, clusters them into ranked component candidates, screenshots the top ones, writes `ui/.ai/INVENTORY.md` | `{repo, outDir, baseUrl?, visual?}` |

## Canonical examples

- `src/PrestaShopBundle/Twig/Component/Ui/Alert.php` + `ui/src/stories/components/Alert.stories.js` — component and its story
- `src/PrestaShopBundle/Twig/Component/Ui/FlashMessages.php` — component composing another (`ui:Alert`), reading the session, rendering nothing when empty
- `Twig/Component/Ui/PasswordField.php` + `password_widget` in `TwigTemplateForm/ui_kit_layout.html.twig` — a form theme block mapping a field type to a component; its toggle state is ARIA only (`aria-pressed` picks the icon in CSS)
- `src/PrestaShopBundle/Resources/views/Admin/Login/Ui/login.html.twig` + `ui/src/playground/pages/login/login.html` — page and its mockup
- `ui/src/js/components/password-toggle.js` — generic behaviour bound to `data-ps-action`

## Related

- [Twig Component](../Twig/CONTEXT.md) — back-office template conventions
- [Javascript Component](../Javascript/CONTEXT.md) — new-theme page JS and webpack
