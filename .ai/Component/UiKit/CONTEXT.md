# UiKit Component

## Purpose

`/ui` is the back-office design system: Bootstrap 5.3 customised from bootstrap-play, built with Vite into `ui/dist` (`css/ui.css`, `js/ui.js`, fonts, brand images) and documented in Storybook. New-theme Symfony pages load it instead of Bootstrap 4 + prestakit when the `PS_UI_KIT` toggle is on. It holds styles and generic UI behaviour only: page logic stays in new-theme, and the legacy `default` theme is out of scope.

## Layers

| Layer | Path |
|-------|------|
| Design tokens, Bootstrap overrides, components | `ui/src/scss/` (`_variables.scss`, `components/`, `forms/`) |
| Back-office frame and page styles (`ps-` classes) | `ui/src/scss/layout/`, `ui/src/scss/pages/` |
| Generic UI JS, `data-ps-*` hooks | `ui/src/js/` (`components/`, `selectors.js`, `compat/`) |
| Storybook stories and page mockups | `ui/src/stories/`, `ui/src/playground/` |
| Icons for `<twig:ux:icon>` and stories (read by PHP, ship in the release) | `ui/icons/` |
| Twig components (`<twig:ui:*>`) | `src/PrestaShopBundle/Twig/Component/Ui/`, templates in `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/` |
| Pages rendered with the kit | `Admin/Layout/Ui/`, `Admin/Login/Ui/` under `src/PrestaShopBundle/Resources/views/` |
| Page logic | `admin-dev/themes/new-theme/js/pages/` (`*_ui` webpack entries) |

## Keep Storybook and the back office in sync

Storybook is the reference for the markup. Every change goes to both sides in the same commit:

- **Twig component ↔ story**: `<twig:ui:Alert>` must render exactly the markup of `ui/src/stories/components/Alert.stories.js`, same classes, variants and attributes. A new prop means a new story variant or control, and the other way round. The story header and docs description name the Twig component.
- **Page template ↔ playground mockup**: `Admin/Login/Ui/login.html.twig` mirrors `ui/src/playground/pages/login/login.html` (structure, `ps-` classes, `data-ps-*` attributes). Only the content differs: translated strings and form fields come from PHP.
- **Styles live in `ui/src/scss` only**: the playground has no styles of its own, so Storybook and the back office load the same `ui.css`.
- Check both after a change: `npm run storybook` in `ui/`, and the page with `PS_UI_KIT=1`.

## Non-obvious patterns

- **Toggle**: `PS_UI_KIT` (`0` in `.env`, set it to `1` in `.env.local`) is the `ui_kit` Twig global. A page switches with `{% extends ui_kit ? '…/Ui/page.html.twig' : '…/old_layout.html.twig' %}`. The `Ui/` template uses its own block names, so the old blocks stay untouched and unused.
- **Twig components**: a class in `Twig/Component/Ui/` with `#[AsTwigComponent('ui:Name', template: …)]`, public props validated in a `#[PreMount]` `OptionsResolver` (`setIgnoreUndefined()` so `class` and other attributes pass through). Registered automatically.
- **Icons**: `<twig:ux:icon name="bi:…">` reads local SVGs from `ui/icons/` (commit new ones, never rely on the Iconify fallback). Stories import the same files through `ui/src/stories/ux-icon.js`. Kit markup uses the Material Symbols font (`material-symbols-outlined`), not `material-icons`.
- **JS ownership**: if Storybook or a module could use it without a PrestaShop back end, it goes to `ui/src/js` and binds to `data-ps-*` attributes listed in `selectors.js`, never to CSS classes. Otherwise it stays in new-theme.
- **`ui.js` is a classic IIFE script**: it sets `window.bootstrap` and registers Bootstrap's jQuery plugins at once (`compat/jquery-plugins.js`, temporary until pages call `bootstrap.Modal`… directly). jQuery comes from core `js/jquery`, loaded before it.
- **Webpack entries** in `admin-dev/themes/new-theme/.webpack/common.js` are grouped: entries loaded only with the toggle off (Bootstrap 4 + prestakit) first, then their `_ui` replacements, then the rest.
- **Forms**: the kit pages render fields with Symfony's `bootstrap_5_layout`. Fields rendered one by one rely on `form_end()` to output fields added by modules.
- **Build**: `make admin-ui` / `./tools/assets/build.sh admin-ui`. File names are fixed (no hash) because the layouts link them. Watch mode does not empty `dist/`, and Storybook has its own Vite config, so neither wipes the build. Only `ui/dist` ships in a release.

## Canonical examples

- `src/PrestaShopBundle/Twig/Component/Ui/Alert.php` + `ui/src/stories/components/Alert.stories.js` — component and its story
- `src/PrestaShopBundle/Resources/views/Admin/Login/Ui/login.html.twig` + `ui/src/playground/pages/login/login.html` — page and its mockup
- `ui/src/js/components/password-toggle.js` — generic behaviour bound to `data-ps-action`

## Related

- [Twig Component](../Twig/CONTEXT.md) — back-office template conventions
- [Javascript Component](../Javascript/CONTEXT.md) — new-theme page JS and webpack
