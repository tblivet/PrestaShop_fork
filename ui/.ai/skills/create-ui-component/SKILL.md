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

Follow "Component API" in `ui/.ai/CONVENTIONS.md`. For each part, decide: reuse an existing component as it is, or own the part as a BEM element when it only makes sense inside this one (do not add a one-parent prop to a generic component). A part with its own props, options or JS is a component of its own placed in a named block, not an array prop (CONVENTIONS.md, "A part that is a feature of its own"). Write down, before any code: the props and their allowed values (variants are BEM modifiers, never runtime state), the slots / content block, the runtime states and whether an ARIA attribute already expresses each, the `data-ps-*` hooks if it is interactive, and the accessibility contract (role, name, keyboard). Check Bootstrap 5.3 already has the component: then wrap its markup, don't reinvent it.

## 2. Story first

`ui/src/stories/components/{Name}.stories.js` (a form control, as `ui:Check`: `ui/src/stories/forms/`, Storybook "Forms", next to Bootstrap's reference for it), the reference the page will be checked against. Its docs page holds:

- **Twig usage and props**: the `<twig:ui:{Name}>` call, every prop with its allowed values and default, the content block and slots.
- **Defaults and Twig code**: `const DEFAULTS = {…}` with the PHP defaults, `argTypes: withDefaults({…}, DEFAULTS)` and `args: DEFAULTS` (`ui/src/stories/story-defaults.js`), so the controls table shows each default; a prop whose PHP default is `null` takes `nullableSelect(options, description)` with its arg set to `NONE` (the select reads "none", the story gets `null`; numbers go as `{ h2: 2 }` labels), never a `null` option or an `=== 'none'` test in the story; every story built with `withTwig` (`ui/src/stories/twig-snippet.js`), so "Show code" gives the HTML then the `<twig:ui:{Name}>` call (see `Cluster.stories.js`). Labels or a frame around the component go in the HTML only, with `rendered` giving the bare markup; session data the render reads (flash messages) goes in `session`. A `.stories.js` file exports only stories (Storybook shows every named export as one): the builder, its defaults and sample data another story reuses go in a helper, `ui/src/stories/{name}.js` (see `header-search.js`, used by the HeaderSearch and Header stories).
- **Do / Don't**: when to use it, when another component fits better, and the misuses to avoid, each with a short example.
- **States**: one story per variant and per state (empty, loading, error, disabled, long content, long translation), with controls for each prop.

Icons through `ui/src/stories/ux-icon.js`. Check it in Storybook, including the a11y panel.

## 3. Styles

`ui/src/scss/components/_{name}.scss` starting with `$component-name: ps-{name};` then `.#{$component-name} { … }` (layouts: `ui/src/scss/layout/`), imported in `ui/src/scss/main.scss` in alphabetical order. In the order of CONVENTIONS.md "Bootstrap first": a Bootstrap component class in the markup, tuned by its Sass variable in `ui/src/scss/_variables.scss` or its CSS variable; the component's own look and inner layout as BEM rules here, written with Bootstrap's values (`var(--#{$prefix}…)`, `$spacers`, `media-breakpoint-up`). No layout or spacing utilities in its template.

## 4. Twig component

| File | From |
|------|------|
| `src/PrestaShopBundle/Twig/Component/Ui/{Name}.php` | `Alert.php`: `#[AsTwigComponent('ui:{Name}', template: …)]`, typed public props, `#[PreMount]` `OptionsResolver` with `setIgnoreUndefined()` |
| `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/{name}.html.twig` | `alert.html.twig`: same markup as the story, `attributes.defaults(…)` so callers can add classes and attributes, translated labels |

New icons: commit the SVG in `ui/icons/` (never the Iconify fallback).

## 5. Behaviour (interactive components only)

Generic behaviour goes to `ui/src/js/components/{name}.ts` (strict TypeScript), its hooks to `ui/src/js/selectors.ts`, initialised from `ui/src/js/main.ts`; see `password-toggle.ts`. Page-specific logic stays in new-theme.

## 6. Tests

| Test | From |
|------|------|
| `tests/Unit/PrestaShopBundle/Twig/Component/Ui/{Name}Test.php` | `AlertTest.php`: prop validation, defaults, rejected values |
| `tests/Integration/PrestaShopBundle/Twig/Component/Ui/{Name}ComponentTest.php` | `AlertComponentTest.php`: rendered markup per variant, attributes passed through |

## 7. Verify

`node ui/.ai/bin/story-markup.mjs` then `node ui/.ai/bin/story-parity.mjs` (every prop in the story's Props line and controls, every story with Twig code, snapshot current), `StoryMarkupTest` (the stories show what the component renders), `make admin-ui`, the two PHPUnit tests, `php vendor/bin/php-cs-fixer fix` and `phpstan` on the new PHP, the story in Storybook, then one real page using the component with `PS_UI_KIT=1`. Run the `ui-review` skill on that page.
