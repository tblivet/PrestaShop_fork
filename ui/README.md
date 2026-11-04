# /ui — the back office UI kit

The new back office design system: Bootstrap 5.3 customised for PrestaShop, built with Vite into `ui/dist`, documented in Storybook. Symfony back office pages render with it when the `PS_UI_KIT` toggle is on. This README is how the team reworks the back office with it, with or without AI.

- Rules for markup, styles, JS hooks and accessibility: [`.ai/CONVENTIONS.md`](.ai/CONVENTIONS.md)
- What is already decided, and why: [`.ai/DECISIONS.md`](.ai/DECISIONS.md)
- Architecture (toggle, assets, Twig components, webpack entries): [`../.ai/Component/UiKit/CONTEXT.md`](../.ai/Component/UiKit/CONTEXT.md)

## Set up

| Step | Command |
|------|---------|
| Turn the kit on | `PS_UI_KIT=1` in `.env.local` |
| Build the kit (CSS, JS, fonts, icons) | `make admin-ui` |
| Build page scripts and the Bootstrap 4 theme | `make admin-new-theme` |
| Storybook, the reference | `npm run storybook` in `ui/` (port 6006) |
| Lint | `npm run lint:scss` in `ui/`, `npm run lint` in `admin-dev/themes/new-theme` |
| Emails (password reset…) | MailDev on http://localhost:1080 |

Build through `make` (it runs in Docker): the host's `node_modules` are Linux builds. Asset URLs only carry `?<version>`, so hard-reload after a build. Clear the Symfony cache as the web user (`docker exec -u www-data …`), never as root.

## The order of the work

1. **Inventory**: the `ui-inventory` workflow lists the patterns of every Symfony page and writes the ranked backlog, [`.ai/INVENTORY.md`](.ai/INVENTORY.md).
2. **Form theme**: every form field type (Symfony's and PrestaShop's: switch, translatable fields, choice tree, money…) gets a Bootstrap 5 block in `ui_kit_layout.html.twig` that calls a kit component, so forms follow the kit on every page (`INVENTORY.md`, "Form theme").
3. **Shell, layouts and big components**: the page template (the top layout, with fixed slots: title, breadcrumb, actions, tabs, content), the layouts that place components (stack, row of actions, columns, form section) and the new grid, each designed in Storybook first. Components and layouts stay separate: a component never says where it sits, a layout never changes the components it places.
4. **Components**: the backlog, top first. Every element the back office uses goes through a `<twig:ui:*>` component, Bootstrap ones included (button, badge, modal…); a back office pattern becomes one once it appears on a second page. Components are flexible enough that pages never fall back to raw markup.
5. **Pages**: most used first (Orders, Products, Customers), assembled from the components.

Everything lands on the feature branch `feat/introduce-new-ui-kit` behind the toggle. The Bootstrap 4 theme may break there; what breaks is written down.

## One rework, step by step

The same steps for a person or an AI. With Claude Code, ask for it in plain words ("work on the new ui: the customers listing", "fix these findings on the login page") and the `ui-rework` skill runs them, stopping at the three checkpoints.

| # | Step | Output | Checkpoint |
|---|------|--------|------------|
| 1 | **Locate** what renders the target: `Ui/` template, controller, form types, SCSS, JS, story, hooks | file list | |
| 2 | **Plan** the changes, kit first and page last, the strings to reword, the data scenarios needed | plan | ✋ approve the plan |
| 3 | **Story or mockup** first: it is the reference | Storybook entry | ✋ approve the story |
| 4 | **Implement** following the conventions; quick `ui-review` while working | code, tests | |
| 5 | **Done gates** (below) | results | |
| 6 | **Record**: `CHANGELOG-UI.md`, strings to translate, review JSON, `PROGRESS.md`, tracker, and the list of files to review (`review-files.mjs`) | records | ✋ review the files, approve before commit |

A page not on the kit yet starts with `migrate-page-to-ui`; a new component with `create-ui-component`.

## Done gates

A page or component is done when:

- **Builds and lints pass**: stylelint (logical properties, BEM, no `data-ps-*` in SCSS but `data-ps-state`) and ESLint (kit scripts never select classes or ids).
- **Tests pass**: Twig component unit and render tests; PHP integration tests for changed form types and controllers. Behat is untouched; Playwright waits for the end of the project.
- **Storybook matches the page** in every reviewed state.
- **The screen review is clean**: the `ui-screen-review` workflow leaves no blocker or major finding, or each one is accepted in `DECISIONS.md` with a reason.

## AI tools

All live in `ui/.ai/` and are linked for Claude Code (`.claude/skills`, `.claude/workflows`). Other tools read the same files.

| Name | Kind | Use it to |
|------|------|-----------|
| `ui-rework` | skill | Any change on a kit page or component; the entry point |
| `migrate-page-to-ui` | skill | Move a Symfony page onto the kit |
| `create-ui-component` | skill | Add a `<twig:ui:*>` component with its story, styles and tests |
| `ui-review` | skill | Quick review of a screen while working |
| `ui-seed` | skill | Put the local shop in a data scenario and undo it |
| `ui-wording` | skill | Reword a screen to the tone of voice and record the strings |
| `ui-screen-review` | workflow | Full review of a page: every state captured, three reviewer lenses, a skeptic, an HTML report (about 30 min) |
| `ui-inventory` | workflow | Refresh the pattern inventory and the component backlog |

Scripts:

| Command | Does |
|---------|------|
| `php ui/.ai/bin/seed.php list` (in the container, as `www-data`) | Data scenarios: full listings, long names, limited employee, another language, multistore |
| `node ui/.ai/bin/missing-translations.mjs --locale fr-FR` | Strings of the branch missing from the catalogues |
| `node ui/.ai/bin/progress.mjs` | Regenerates `PROGRESS.md` |
| `node ui/.ai/bin/review-files.mjs [--uncommitted] [filter …]` | The files to review for a change, grouped for a web integrator |

## Records

| File | Holds | Updated by |
|------|-------|------------|
| [`.ai/DECISIONS.md`](.ai/DECISIONS.md) | Decisions and why | Anyone deciding; never rewritten, replaced by a new entry |
| [`.ai/INVENTORY.md`](.ai/INVENTORY.md) | Pattern inventory and component backlog | `ui-inventory` workflow; checkboxes ticked as components land |
| [`.ai/PROGRESS.md`](.ai/PROGRESS.md) | Pages on the kit, component adoption, open findings | `progress.mjs`, never by hand |
| [`.ai/CHANGELOG-UI.md`](.ai/CHANGELOG-UI.md) | Markup, hooks, behaviour and strings that changed for modules, tests and translators | Every rework |
| `.ai/reviews/<page>.json` | Last screen review of a page | `ui-screen-review` with `reviewsDir` |

The BO UI tracker is the board for the whole migration; each rework updates its step.

## When things look wrong

| Symptom | Cause |
|---------|-------|
| The old login page shows | `PS_UI_KIT=0`, or the cache still has the old value |
| Styles or scripts did not change | Browser cache: hard-reload; or the asset was built on the host instead of with `make` |
| 500 "Directory … purifier not writable" | Cache cleared as root: `chown -R www-data:www-data var/cache/dev` in the container |
| A state is hard to reach | `ui-seed` scenario, a `prestashop:config` change restored afterwards, or MailDev for emails |
| A workflow skips the signed-in pages | Agents do not read or type credentials: sign in to the local back office in Chrome before running it, they reuse that session |
