export const meta = {
  name: 'ui-component-design',
  description: 'Design a large /ui kit component before building it: map what exists, write competing proposals, judge them, synthesise one design with its build plan',
  whenToUse: 'Before building a large or new /ui kit pattern (grid, page template, wizard, form theme), as create-ui-component asks. Args: {component: "Grid" (name after "ui:"), brief: what it must cover (the INVENTORY.md entry is read too), outDir (absolute, e.g. the session scratchpad), angles?: [{key, focus}] (default: Bootstrap first, accessibility first, dense daily use), date?}. Writes <outDir>/design.md and <outDir>/index.html; nothing in the repository.',
  phases: [
    { title: 'Understand', detail: 'what renders it today, its data, and its variants across the pages' },
    { title: 'Propose', detail: 'one full proposal per angle' },
    { title: 'Judge', detail: 'each judge scores every proposal through one lens' },
    { title: 'Synthesise', detail: 'one design from the winner, the best of the others grafted, and the build plan' },
  ],
}

// Rules live in ui/.ai/CONVENTIONS.md and ui/.ai/DECISIONS.md; agents read them, the script only orchestrates.
// The proposals are written blind to each other, then judged together: the judges need all of them (the barrier).

if (!args || !args.component || !args.outDir) {
  throw new Error('Pass args {component: "Grid", brief: "…", outDir} — the name after "ui:", outDir an absolute directory, e.g. the session scratchpad')
}

const component = args.component.replace(/^ui:/, '')
const outDir = args.outDir.replace(/\/$/, '')
const brief = args.brief || ''
const date = args.date || ''

const ANGLES = args.angles || [
  { key: 'bootstrap-first', focus: 'Bootstrap 5.3 first: its table, pagination, form, dropdown and modal markup and Sass variables as they are, the fewest kit-specific parts, the least custom CSS and JS; the data the page already gets, as it is' },
  { key: 'accessibility-first', focus: 'Accessibility first (RGAA 4.1 / WCAG 2.2 AA): a real data table with its caption and headers, every control named, full keyboard use (sorting, selection, row actions, reordering), states announced, nothing that only works with a mouse' },
  { key: 'daily-use', focus: 'Dense daily use by a merchant at 1280px and wider, usable at 375px: scanning many rows, filtering and acting fast, bulk work, clear empty and no-match states, what stays visible while working; one consistent behaviour on every page' },
]

const CONSTRAINTS = `Constraints that hold for every proposal:
- This is a UI/UX rework: change the PHP as little as possible, but cleanly. The new component reads the data the page already builds (definitions, presenters, filters, form views); a PHP change is acceptable only where the front cannot do it right, each one named with its file, kept small, backward compatible for modules (ADR 0017: no break in a minor version), and justified.
- The old rendering stays for pages not on the kit (PS_UI_KIT=0, DECISIONS.md #12); modules that hook into it keep working. Name every hook, block, class or id a module may rely on and say what happens to it.
- Kit rules (read ui/.ai/CONVENTIONS.md and ui/.ai/DECISIONS.md, do not restate them): Bootstrap first, BEM for look and layout with no layout or spacing utilities in markup (#38), data-ps-* hooks and small vanilla ES modules for behaviour (#13), components never place themselves (#24), no rounded corners, no dark mode (#5), desktop first but fully usable at 375px (#14), a pattern built from existing kit components where they fit, a missing one named as a component to create first.
- Clean: one way to do each thing, no per-page options where one behaviour fits all, nothing kept "just in case".`

const brief0 = `Component: <twig:ui:${component}>. ${brief}
Read its entry in ui/.ai/INVENTORY.md (search "twig:ui:${component}") and the DECISIONS.md entries that name it.`

const MAP_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'what renders it today and how, in a few sentences' },
    files: { type: 'array', items: { type: 'object', properties: { path: { type: 'string' }, role: { type: 'string' } }, required: ['path', 'role'] } },
    dataContract: { type: 'string', description: 'the data a page passes to the rendering today (shape, where it is built), what the new component can read as it is' },
    parts: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, today: { type: 'string', description: 'how it works today: templates, JS, PHP' }, notes: { type: 'string' } }, required: ['name', 'today'] } },
    extensionPoints: { type: 'array', items: { type: 'string' }, description: 'hooks, overridable blocks, classes, ids, JS events modules may rely on' },
    problems: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'files', 'dataContract', 'parts', 'extensionPoints', 'problems'],
}

const PROPOSAL_SCHEMA = {
  type: 'object',
  properties: {
    angle: { type: 'string' },
    pitch: { type: 'string', description: 'the idea in three sentences' },
    api: { type: 'string', description: 'the Twig call(s), every prop with its values and default, slots/blocks, sub-components; as Markdown with code' },
    dataContract: { type: 'string', description: 'what it reads and from where; every PHP change with its file, why and how it stays backward compatible' },
    markup: { type: 'string', description: 'the markup skeleton with BEM classes, ARIA and data-ps-* hooks, as Markdown with code' },
    states: { type: 'array', items: { type: 'string' }, description: 'every state and variant it shows, and how' },
    behaviour: { type: 'string', description: 'the JS behaviours, one module each, the hooks they bind to, what replaces the old extensions' },
    accessibility: { type: 'string', description: 'roles, names, keyboard, announcements' },
    responsive: { type: 'string', description: 'at 1280 and at 375' },
    newComponents: { type: 'array', items: { type: 'string' }, description: 'kit components to create first, and the existing ones reused' },
    modules: { type: 'string', description: 'what happens to each extension point modules rely on' },
    buildPlan: { type: 'array', items: { type: 'string' }, description: 'the steps, each shippable and checkable on its own' },
    risks: { type: 'array', items: { type: 'string' } },
  },
  required: ['angle', 'pitch', 'api', 'dataContract', 'markup', 'states', 'behaviour', 'accessibility', 'responsive', 'newComponents', 'modules', 'buildPlan', 'risks'],
}

const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          angle: { type: 'string' },
          score: { type: 'number', description: '0 to 10' },
          strengths: { type: 'array', items: { type: 'string' } },
          weaknesses: { type: 'array', items: { type: 'string' } },
        },
        required: ['angle', 'score', 'strengths', 'weaknesses'],
      },
    },
    graft: { type: 'array', items: { type: 'string' }, description: 'ideas from any proposal that the final design must keep' },
    reject: { type: 'array', items: { type: 'string' }, description: 'ideas from any proposal the final design must not take, with why' },
  },
  required: ['lens', 'scores', 'graft', 'reject'],
}

const JUDGES = [
  { key: 'merchant-a11y', lens: 'the merchant and accessibility: is every task fast and clear at 1280 and possible at 375, is it RGAA 4.1 / WCAG 2.2 AA by construction, are the states (empty, no match, loading, error, long text) handled' },
  { key: 'kit-and-code', lens: 'the kit and the code: does it follow ui/.ai/CONVENTIONS.md and DECISIONS.md, Bootstrap first, BEM, small modules on data-ps-* hooks, the fewest new parts, PHP changed as little as possible and cleanly, testable (unit, render, Storybook story parity)' },
  { key: 'migration-risk', lens: 'migration and modules: can the pages move one by one behind PS_UI_KIT, do modules that extend the old rendering keep working or get a clear path, is the build plan made of steps that each ship and can be checked, what breaks' },
]

const asJson = (value) => JSON.stringify(value, null, 2)

phase('Understand')
const [code, variants] = await parallel([
  () => agent(`${brief0}

Map how this is rendered today, from the code (read-only). Cover the Twig templates and their blocks, the JS (TypeScript components, extensions, events), and the PHP that builds what the templates get (definitions, factories, presenters, filters, form types), with file paths. Say precisely which data a page passes to the rendering and what a new kit component can read as it is, without PHP changes. List every extension point a module may rely on (hooks, overridable blocks, classes, ids, JS events). List the problems you see.`, { label: 'map:code', phase: 'Understand', schema: MAP_SCHEMA }),
  () => agent(`${brief0}

Survey how this is used across the back office pages (read-only): the pages and templates that render or override it, the per-page differences (custom blocks or columns, JS lists picked per page, extra filters, several on one page, embedded in other pages), and what modules typically add. Group the variants, count pages per variant, and name the rare ones that a design must still allow. Put the variants in "parts" (name, how it is done today), and list the problems.`, { label: 'map:variants', phase: 'Understand', schema: MAP_SCHEMA }),
])

if (!code || !variants) {
  throw new Error('The mapping step failed: rerun the workflow')
}

const context = `What exists today (from two read-only surveys):
## Code
${asJson(code)}
## Variants across the pages
${asJson(variants)}`

phase('Propose')
const proposals = (await parallel(ANGLES.map((angle) => () => agent(`${brief0}

${CONSTRAINTS}

${context}

Write one complete design for <twig:ui:${component}> from this angle: ${angle.focus}.
Other designers work on other angles; do not hedge toward them, make this angle's best case, but it must still meet every constraint. Check what you rely on in the code and in Bootstrap 5.3 (ui/node_modules/bootstrap). Be concrete: real prop names, real class names, real file paths, real Twig. Set "angle" to "${angle.key}".`, { label: `propose:${angle.key}`, phase: 'Propose', schema: PROPOSAL_SCHEMA })))).filter(Boolean)

if (proposals.length === 0) {
  throw new Error('No proposal came back: rerun the workflow')
}
log(`${proposals.length} of ${ANGLES.length} proposals written`)

phase('Judge')
const verdicts = (await parallel(JUDGES.map((judge) => () => agent(`${brief0}

${CONSTRAINTS}

${context}

The proposals:
${asJson(proposals)}

Judge every proposal through this lens only: ${judge.lens}. Score each from 0 to 10 and say why, check their claims against the code where it matters (a prop, a class, a hook, a data field that does not exist is a weakness). Then list the ideas the final design must keep, from any proposal, and those it must not take. Set "lens" to "${judge.key}".`, { label: `judge:${judge.key}`, phase: 'Judge', schema: JUDGE_SCHEMA })))).filter(Boolean)

phase('Synthesise')
const result = await agent(`${brief0}

${CONSTRAINTS}

${context}

The proposals:
${asJson(proposals)}

The judges:
${asJson(verdicts)}

Write the final design of <twig:ui:${component}>: start from the proposal with the best total score, graft the ideas the judges asked to keep, drop those they rejected, and settle every disagreement with a stated reason. It is the reference the build will follow, so be complete and concrete.

Write two files:
1. ${outDir}/design.md (Markdown): Decision (which proposal, the scores, what was grafted and rejected, why); API (Twig calls, props with values and defaults, blocks, sub-components); Data (what it reads, every PHP change with file and backward-compatibility note, or "none"); Markup (skeleton with BEM, ARIA, data-ps-*); States and variants; Behaviour (JS modules and hooks, what replaces the old extensions); Accessibility; Responsive; Modules (each extension point and what happens to it); Components to create first (in order); Build plan (numbered steps, each shippable and checkable: what it delivers, its story, its tests, how it is checked); Open questions for the user (only real choices, each with a recommendation); Left aside (with why). ${date ? `Date it ${date}.` : ''}
2. ${outDir}/index.html: the same design as a page a developer reads in ten minutes: a calm, clean page, system font, 16px, max-width 72rem centred, no rounded corners, readable in light and dark (prefers-color-scheme), inline CSS only; top: the decision in three sentences and the scores per proposal and lens as a small table; then the sections of design.md, code in <pre>; the build plan as a numbered list; the open questions highlighted; the three proposals folded in <details> at the end.

Return a short summary: the chosen proposal, the PHP changes (or none), the components to create first, the number of build steps, the open questions.`, { label: 'synthesise', phase: 'Synthesise' })

return { proposals: proposals.map((p) => ({ angle: p.angle, pitch: p.pitch })), verdicts: verdicts.map((v) => ({ lens: v.lens, scores: v.scores.map((s) => `${s.angle}: ${s.score}`) })), result, files: [`${outDir}/design.md`, `${outDir}/index.html`] }
