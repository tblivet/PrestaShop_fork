---
name: ui-rework
description: >
  Entry point for any change on the /ui back office kit: names a page or a component and what to do
  (modify, rework, improve, fix review findings), then plans, gets approval at three checkpoints,
  implements, verifies against the done gates and records the change. Trigger: "work on the new ui:
  {target}", "rework {page} in the ui kit", "improve {component}", "fix these ui findings on {page}".
needs: []
produces: "the change on the feature branch, its review JSON, CHANGELOG-UI and PROGRESS entries, the strings to translate"
---

# Work on a /ui kit page or component

Read `ui/README.md` (the process), `ui/.ai/CONVENTIONS.md` (the rules), `ui/.ai/DECISIONS.md` (what is already decided) and `.ai/Component/UiKit/CONTEXT.md` (architecture). This skill orders the work; each step points to the skill, workflow or script that does it.

## Inputs

- **Target**: a page (route, URL or `Ui/` template) or a component (`<twig:ui:Name>`, a story).
- **Intent**: modify (a stated change), rework (rethink the screen), improve (find what to change), or a list of findings to fix.

## 1. Locate

| Target | On the kit? | Route |
|--------|-------------|-------|
| Page | No `Ui/` template yet | `migrate-page-to-ui` (it follows the checkpoints below) |
| Page | Yes | Step 2 |
| Component | In `INVENTORY.md` backlog, or a pattern on 2+ pages | `create-ui-component` (large or new pattern: `ui-component-design` workflow first) |
| Component | Exists | Step 2 |

List what renders it: `Ui/` template and includes, controller and form types, SCSS partial, JS and its selector map, the story or mockup (the reference), and the hooks rendered on the page.

## 2. Plan — checkpoint 1

- **Modify / fix findings**: the list as given.
- **Improve / rework**: a quick `ui-review` of the current screen (or the last report in `ui/.ai/reviews/`).
- Order the changes kit first (`ui/src`, `<twig:ui:*>`, `ui_kit_layout.html.twig`, the page template), page last, so a fix lands once for every page.
- Wording: rewrite with the `ui-wording` rules (tone of voice) and list the strings that change.
- Name the data scenarios the states need (`ui-seed`).

**Stop and present the plan**: changes per file, the strings, the components touched or created, what may break for modules (classes, ids, hooks). Wait for approval.

## 3. Story or mockup — checkpoint 2

Update or create the story (component) or the playground mockup (page) first: it is the reference. **Stop and show it** (Storybook URL or screenshot). Wait for approval.

## 4. Implement

Follow `CONVENTIONS.md`: BEM + utilities + `data-ps-*`, ARIA state, logical properties, the page template slots, `ui_kit_layout.html.twig` for forms. The old theme may break; do not bend kit code to keep it working. Add the page's scripts to `uiKitFiles` in `admin-dev/themes/new-theme/.eslintrc.js`. Keep the story in sync and update the tests.

While working, check with a quick `ui-review` (a few states, inline).

## 5. Done gates

| Gate | How |
|------|-----|
| Builds and lints | `make admin-ui`, `make admin-new-theme`; `npm run lint:scss` in `ui/`, `npm run lint` in `admin-dev/themes/new-theme` |
| Tests | Twig component unit and render tests for touched components; PHP integration tests for changed form types and controllers; Behat untouched. Without the test database, say so instead of skipping silently |
| Storybook parity | The story or mockup matches the page in every reviewed state, and every prop of a component touched is in its story, and its stories show what it renders (`node ui/.ai/bin/story-markup.mjs`, then `story-parity.mjs` and `StoryMarkupTest` pass) |
| Screen review clean | The `ui-screen-review` workflow once on the page with its seed scenarios: no blocker or major finding left, or each one accepted with a reason in `DECISIONS.md` |

Clear the Symfony cache as the web user (`docker exec -u www-data …`), never as root, and hard-reload pages (asset URLs only carry `?<version>`).

## 6. Record — checkpoint 3

1. `ui/.ai/CHANGELOG-UI.md`: classes, ids and markup removed or renamed, hooks moved, strings changed.
2. Strings to translate: `node ui/.ai/bin/missing-translations.mjs --locale fr-FR`.
3. `ui/.ai/reviews/<page>.json` is written by the workflow; regenerate `ui/.ai/PROGRESS.md` with `node ui/.ai/bin/progress.mjs`.
4. A new decision (a pattern chosen, a finding accepted): one entry in `ui/.ai/DECISIONS.md`.
5. Update the BO UI tracker step.
6. The files to review, grouped for a web integrator (templates, form theme, components, layouts, SCSS, stories): `node ui/.ai/bin/review-files.mjs --uncommitted` (or with path filters for one page). Put the list in the report.

**Stop and report**: what changed per finding, the gates and how each was checked, what was not, the strings to translate. Wait for approval before committing on the feature branch.
