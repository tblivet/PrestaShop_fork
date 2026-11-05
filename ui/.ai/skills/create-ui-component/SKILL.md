---
name: create-ui-component
description: >
  Creates a /ui kit component end to end: <twig:ui:Name> Twig component and template, Storybook
  story, BEM SCSS partial, optional data-ps JS behaviour, unit and render tests, kept in sync.
  Trigger: "create a ui component for {Name}", "add <twig:ui:{Name}>", "add {Name} to the kit".
argument-hint: "[ComponentName]"
needs: []
produces: "Twig component class + template, story, SCSS partial, tests (and JS when interactive)"
---

# Create a /ui kit component

Read `.ai/Component/UiKit/CONTEXT.md` (Twig components, icons, JS ownership, Storybook sync) and `ui/.ai/CONVENTIONS.md` (classes, hooks, state, accessibility). Follow `Alert` as the reference for every file below.

## 0. Component or layout?

Decide first (`ui/.ai/CONVENTIONS.md`, "Components and layouts"): an element with its own look and behaviour is a **component** (`ui:{Name}`); something that only places other elements (spacing, alignment, columns, stacking, page slots) is a **layout** (`ui:Layout:{Name}`, `Twig/Component/Ui/Layout/`, `scss/layout/`, Storybook "Layouts"). A candidate that does both is split in two: the parts, and the layout that places them.


- **Everything the back office uses** (`ui/.ai/DECISIONS.md` #23): Bootstrap elements (button, icon button, badge, breadcrumb, pagination, modal) as well as back office patterns (page header, form row, empty state, grid). Build it to the "Component API" rules of `ui/.ai/CONVENTIONS.md`, so pages never need raw markup.
- **Two pages or more**: extract a pattern once it appears on a second page. Check `ui/.ai/INVENTORY.md` first: the pattern may already be in the backlog with its pages and variants.
- **A large or new pattern** (grid, page template, wizard): run the `ui-component-design` workflow first and build the proposal that was picked.

## 1. Design the API first

Follow "Component API" in `ui/.ai/CONVENTIONS.md`. For each part, decide: reuse an existing component as it is, or own the part as a BEM element when it only makes sense inside this one (do not add a one-parent prop to a generic component). Write down, before any code: the props and their allowed values (variants are BEM modifiers, never runtime state), the slots / content block, the runtime states and whether an ARIA attribute already expresses each, the `data-ps-*` hooks if it is interactive, and the accessibility contract (role, name, keyboard). Check Bootstrap 5.3 already has the component: then wrap its markup, don't reinvent it.

## 2. Story first

`ui/src/stories/components/{Name}.stories.js`, the reference the page will be checked against. Its docs page holds:

- **Twig usage and props**: the `<twig:ui:{Name}>` call, every prop with its allowed values and default, the content block and slots.
- **Do / Don't**: when to use it, when another component fits better, and the misuses to avoid, each with a short example.
- **States**: one story per variant and per state (empty, loading, error, disabled, long content, long translation), with controls for each prop.

Icons through `ui/src/stories/ux-icon.js`. Check it in Storybook, including the a11y panel.

## 3. Styles

`ui/src/scss/components/_{name}.scss` starting with `$component-name: ps-{name};` then `.#{$component-name} { … }` (layouts: `ui/src/scss/layout/`), imported in `ui/src/scss/main.scss` in alphabetical order. Only what utilities and Bootstrap cannot express.

## 4. Twig component

| File | From |
|------|------|
| `src/PrestaShopBundle/Twig/Component/Ui/{Name}.php` | `Alert.php`: `#[AsTwigComponent('ui:{Name}', template: …)]`, typed public props, `#[PreMount]` `OptionsResolver` with `setIgnoreUndefined()` |
| `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/{name}.html.twig` | `alert.html.twig`: same markup as the story, `attributes.defaults(…)` so callers can add classes and attributes, translated labels |

New icons: commit the SVG in `ui/icons/` (never the Iconify fallback).

## 5. Behaviour (interactive components only)

Generic behaviour goes to `ui/src/js/components/{name}.js`, its hooks to `ui/src/js/selectors.js`, initialised from `ui/src/js/main.js`; see `password-toggle.js`. Page-specific logic stays in new-theme.

## 6. Tests

| Test | From |
|------|------|
| `tests/Unit/PrestaShopBundle/Twig/Component/Ui/{Name}Test.php` | `AlertTest.php`: prop validation, defaults, rejected values |
| `tests/Integration/PrestaShopBundle/Twig/Component/Ui/{Name}ComponentTest.php` | `AlertComponentTest.php`: rendered markup per variant, attributes passed through |

## 7. Verify

`node ui/.ai/bin/story-parity.mjs` (every prop in the story's Props line and controls), `make admin-ui`, the two PHPUnit tests, `php vendor/bin/php-cs-fixer fix` and `phpstan` on the new PHP, the story in Storybook, then one real page using the component with `PS_UI_KIT=1`. Run the `ui-review` skill on that page.
