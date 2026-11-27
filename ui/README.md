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
| Lint | `npm run lint:scss` and `npm run typecheck` in `ui/`, `npm run lint` in `admin-dev/themes/new-theme` |
| Emails (password reset…) | MailDev on http://localhost:1080 |

Build through `make` (it runs in Docker): the host's `node_modules` are Linux builds. Asset URLs only carry `?<version>`, so hard-reload after a build. Clear the Symfony cache as the web user (`docker exec -u www-data …`), never as root.

## The order of the work

1. **Inventory**: the `ui-inventory` workflow lists the patterns of every Symfony page and writes the ranked backlog, [`.ai/INVENTORY.md`](.ai/INVENTORY.md).
2. **Form theme**: every form field type (Symfony's and PrestaShop's: switch, translatable fields, choice tree, money…) gets a Bootstrap 5 block in `ui_kit_layout.html.twig` that calls a kit component, so forms follow the kit on every page (`INVENTORY.md`, "Form theme").
3. **Shell, layouts and big components**: the page template (the top layout: the page head with its title, icon, sub-pages, actions and help, then the content), the layouts that place components (stack, row of actions, columns, form section) and the new grid, each designed in Storybook first. Components and layouts stay separate: a component never says where it sits, a layout never changes the components it places.
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
| `ui-screen-review` | workflow | Full review of a page: every state captured, five reviewer lenses on the front end only (visual, UX writing, RGAA, code, Bootstrap 5.3), a skeptic, an HTML report (about 30 min). A page already reviewed gets a follow-up (earlier findings re-checked, only new blockers and majors added); `fresh: true` starts over |
| `ui-component-review` | workflow | Full review of one or more `<twig:ui:*>` components, see below |
| `ui-inventory` | workflow | Refresh the pattern inventory and the component backlog |
| `ui-component-design` | workflow | Design a large component before building it: maps what exists, three proposals from different angles, three judges, one design with its build plan (`ui/.ai/designs/<name>.md`) |

### Subagents

Each step of the two review workflows is a kit subagent, defined in `ui/.ai/agents/` (linked in `.claude/agents`). Each carries its own rules and tools, so the reviewers cannot change files and only the capture agents drive Chrome. They can also be asked for alone ("ask ui-a11y-auditor to check the header").

| Agent | Does | Tools | In |
|-------|------|-------|----|
| `ui-state-hunter` | Lists every state of a page or every case of a component (branches, flashes, config, props, long text, missing optional props) and how to reach it | read | both, first step |
| `ui-browser-capturer` | Screenshots every state or case at 375/768/1280, axe, keyboard pass, console; restores any shop change | Chrome | both |
| `ui-storybook-qa` | Tests Storybook itself: every story renders, every control changes the render, docs page, "Show code", console | Chrome | component |
| `ui-code-reviewer` | PHP, Twig, SCSS, JS against `CONVENTIONS.md` | read | both |
| `ui-bootstrap-expert` | What Bootstrap 5.3 already provides, from the official 5.3 docs and the installed sources (#38) | read, web | both |
| `ui-storybook-keeper` | Story, docs, defaults, Twig in "Show code" and tests up to date, from the code | read | component |
| `ui-visual-designer` | The screenshots: spacing, alignment, typography, responsive, long text, kit consistency | read | both |
| `ui-a11y-auditor` | RGAA audit, each finding with its RGAA and WCAG criteria; WCAG 2.2 additions non-blocking (#39) | read, web | both |
| `ui-ux-writer` | Labels, messages and announced text against the tone of voice and the back office terms | read | page |
| `ui-skeptic` | Tries to refute every finding, applies `DECISIONS.md`, fixes severities | read | both, last step |

### Reviewing a component

The `ui-component-review` workflow reviews components one by one, in isolation, the way `ui-screen-review` reviews a page. Start Storybook first (`npm run storybook` in `ui/`), then ask Claude Code, for example: "run the ui-component-review workflow on Button and SideMenu, reviewsDir ui/.ai/reviews".

| Step | What it checks |
|------|----------------|
| Check | Storybook answers, `story-parity.mjs`, the component's unit, render and `StoryMarkupTest` tests |
| Inventory | Its files, props (type, default, allowed values), stories, and the cases to look at: every story plus edge cases set through URL args (long text, optional props left out, extreme values) |
| Review, code | `ui-code-reviewer` (conventions) and `ui-bootstrap-expert` (Bootstrap 5.3) |
| Review, story | `ui-storybook-keeper` (story, docs and tests from the code) and `ui-storybook-qa` (Storybook live: stories, controls, docs, "Show code") |
| Review, render | `ui-browser-capturer` screenshots every case at 375, 768 and 1280 px with axe and a keyboard pass, then `ui-visual-designer` and `ui-a11y-auditor` (RGAA) look at them |
| Challenge | `ui-skeptic` drops what the evidence does not support |
| Report | An HTML report with the screenshots, and `.ai/reviews/components/<name>.json` with `reviewsDir` |

Args: `components` (names after `ui:`, e.g. `Button`, `Layout:Stack`), `outDir` (absolute), and optionally `reviewsDir`, `storybookUrl` (default `http://127.0.0.1:6006`), `widths`, `fresh`. A component already reviewed gets a follow-up: earlier findings re-checked, only new blockers and majors added; `fresh: true` starts over. A component is done when no blocker or major is left.

Scripts:

| Command | Does |
|---------|------|
| `php ui/.ai/bin/seed.php list` (in the container, as `www-data`) | Data scenarios: full listings, long names, limited employee, another language, multistore |
| `node ui/.ai/bin/missing-translations.mjs --locale fr-FR` | Strings of the branch missing from the catalogues |
| `node ui/.ai/bin/story-parity.mjs` | Says which `<twig:ui:*>` props are missing from their story (Props line or controls); CI runs it |
| `node ui/.ai/bin/check-builds.mjs` | Says whether `ui/dist` and `new-theme/public` are older than their sources, and which `make` target to run; reviews run it first |
| `node ui/.ai/bin/progress.mjs` | Regenerates `PROGRESS.md` |
| `node ui/.ai/bin/review-files.mjs [--uncommitted] [filter …]` | The files to review for a change, grouped for a web integrator |

## Records

| File | Holds | Updated by |
|------|-------|------------|
| [`.ai/DECISIONS.md`](.ai/DECISIONS.md) | Decisions and why | Anyone deciding; never rewritten, replaced by a new entry |
| [`.ai/INVENTORY.md`](.ai/INVENTORY.md) | Pattern inventory and component backlog | `ui-inventory` workflow; checkboxes ticked as components land |
| [`.ai/PROGRESS.md`](.ai/PROGRESS.md) | Pages on the kit, component adoption, open findings | `progress.mjs`, never by hand |
| [`.ai/CHANGELOG-UI.md`](.ai/CHANGELOG-UI.md) | Markup, hooks, behaviour and strings that changed for modules, tests and translators | Every rework |
| `.ai/designs/<name>.md` | The design a large component is built from | `ui-component-design`, then kept by hand |
| `.ai/reviews/<page>.json` | Last screen review of a page | `ui-screen-review` with `reviewsDir` |
| `.ai/reviews/components/<name>.json` | Last review of a component | `ui-component-review` with `reviewsDir` |

The BO UI tracker is the board for the whole migration; each rework updates its step.

## When things look wrong

| Symptom | Cause |
|---------|-------|
| The old login page shows | `PS_UI_KIT=0`, or the cache still has the old value |
| Styles or scripts did not change | Browser cache: hard-reload; or the asset was built on the host instead of with `make` |
| 500 "Directory … purifier not writable" | Cache cleared as root: `chown -R www-data:www-data var/cache/dev` in the container |
| A state is hard to reach | `ui-seed` scenario, a `prestashop:config` change restored afterwards, or MailDev for emails |
| A workflow skips the signed-in pages | Agents do not read or type credentials: sign in to the local back office in Chrome before running it, they reuse that session |
