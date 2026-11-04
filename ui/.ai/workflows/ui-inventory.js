export const meta = {
  name: 'ui-inventory',
  description: 'Inventory the UI patterns of every Symfony back office page and turn them into a ranked /ui kit component backlog (INVENTORY.md)',
  whenToUse: 'Before building kit components, and again when many pages have changed, to know which back office patterns repeat, where, in which variants, and what to build first. Args: {repo, outDir, baseUrl?, visual?}. repo = absolute repository path; outDir = absolute scratch dir for screenshots.',
  phases: [
    { title: 'Scope', detail: 'list the page templates and pack them into audit batches' },
    { title: 'Audit', detail: 'one agent per batch reads templates, includes, form types and page JS for UI patterns' },
    { title: 'Merge', detail: 'cluster the patterns of all batches into component candidates, ranked' },
    { title: 'Visual', detail: 'screenshot a few occurrences of the top candidates to show the inconsistencies' },
    { title: 'Write', detail: 'write ui/.ai/INVENTORY.md' },
  ],
}

// Rules in ui/.ai/CONVENTIONS.md and ui/.ai/DECISIONS.md; the script only orchestrates.

if (!args || !args.repo || !args.outDir) {
  throw new Error('Pass args {repo: "/abs/path/to/PrestaShop", outDir: "/abs/scratch/dir"}')
}

const repo = args.repo.replace(/\/$/, '')
const outDir = args.outDir.replace(/\/$/, '')
const baseUrl = (args.baseUrl || 'http://localhost:8001/admin-dev').replace(/\/$/, '')
const visual = args.visual !== false
const BATCH_SIZE = 45

const KINDS = ['layout', 'navigation', 'form', 'data', 'feedback', 'overlay', 'content', 'action']

const PAGES_SCHEMA = {
  type: 'object',
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          template: { type: 'string' },
          section: { type: 'string' },
          controller: { type: 'string' },
          kit: { type: ['string', 'null'] },
        },
        required: ['template', 'section', 'controller'],
      },
    },
  },
  required: ['pages'],
}

const PATTERNS_SCHEMA = {
  type: 'object',
  properties: {
    patterns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'short generic name, e.g. "page header with toolbar buttons", "settings form card"' },
          kind: { type: 'string', enum: KINDS },
          description: { type: 'string', description: 'what it is and does for the user' },
          pages: { type: 'array', items: { type: 'string' }, description: 'page templates (as listed) where it appears' },
          occurrences: { type: 'array', items: { type: 'string' }, description: 'file:line of representative markup, at most 5' },
          variants: { type: 'array', items: { type: 'string' }, description: 'differences between occurrences: options, sizes, extra parts, inconsistent markup' },
          behaviour: { type: 'string', description: 'JS behaviour and where it lives, or "none"' },
          problems: { type: 'array', items: { type: 'string' }, description: 'UX, a11y or consistency problems seen in the code' },
        },
        required: ['name', 'kind', 'description', 'pages', 'occurrences', 'variants', 'behaviour', 'problems'],
      },
    },
  },
  required: ['patterns'],
}

const CANDIDATES_SCHEMA = {
  type: 'object',
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          component: { type: 'string', description: 'proposed <twig:ui:Name> for a component, <twig:ui:Layout:Name> for a layout (ui:Layout:Page for the page template)' },
          role: { type: 'string', enum: ['component', 'layout'], description: 'component: one element with its look and behaviour; layout: only places other elements (spacing, alignment, columns, stacking, slots)' },
          kind: { type: 'string', enum: KINDS },
          summary: { type: 'string' },
          pageCount: { type: 'number' },
          sections: { type: 'array', items: { type: 'string' } },
          pages: { type: 'array', items: { type: 'string' }, description: 'every page template using it' },
          occurrences: { type: 'array', items: { type: 'string' }, description: 'file:line, at most 6' },
          variants: { type: 'array', items: { type: 'string' }, description: 'variants to support as props, and inconsistencies to harmonize away' },
          existing: { type: 'string', description: 'kit component, form theme block or Bootstrap component it builds on, or "none"' },
          dependsOn: { type: 'array', items: { type: 'string' }, description: 'other candidates it needs first' },
          complexity: { type: 'string', enum: ['S', 'M', 'L', 'XL'] },
          priority: { type: 'number', description: '1 = build first; from page count, dependencies and the most-used pages (Orders, Products, Customers)' },
          problems: { type: 'array', items: { type: 'string' } },
          designWorkflow: { type: 'boolean', description: 'true if large or new enough to go through the ui-component-design workflow first' },
        },
        required: ['component', 'role', 'kind', 'summary', 'pageCount', 'sections', 'pages', 'occurrences', 'variants', 'existing', 'dependsOn', 'complexity', 'priority', 'problems', 'designWorkflow'],
      },
    },
    notComponents: {
      type: 'array',
      description: 'back office patterns seen on fewer than 2 pages, which stay page markup for now',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, reason: { type: 'string' } },
        required: ['name', 'reason'],
      },
    },
  },
  required: ['candidates', 'notComponents'],
}

const VISUAL_SCHEMA = {
  type: 'object',
  properties: {
    shots: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          component: { type: 'string' },
          url: { type: 'string' },
          path: { type: 'string' },
          observed: { type: 'string', description: 'what differs from the other occurrences' },
        },
        required: ['component', 'url', 'path', 'observed'],
      },
    },
    skipped: { type: 'array', items: { type: 'string' } },
  },
  required: ['shots', 'skipped'],
}

phase('Scope')
const scope = await agent(
  `In ${repo}, run "node ui/.ai/bin/progress.mjs --pages-json" and return its pages unchanged (template, section, controller, kit). Do nothing else.`,
  { label: 'scope', phase: 'Scope', schema: PAGES_SCHEMA, effort: 'low' },
)

// Batches keep a section (first two path segments) together, so one agent sees all of its variants
const bySection = new Map()
scope.pages.forEach((page) => {
  const key = page.template.split('/').slice(0, 2).join('/')
  bySection.set(key, [...(bySection.get(key) || []), page])
})
const batches = []
;[...bySection.entries()].sort().forEach(([key, list]) => {
  const last = batches[batches.length - 1]
  if (last && last.pages.length + list.length <= BATCH_SIZE) {
    last.keys.push(key)
    last.pages.push(...list)
  } else {
    batches.push({ keys: [key], pages: [...list] })
  }
})
// The shared shell, grid and form themes are where most patterns live: one batch of their own
batches.push({ keys: ['shared'], pages: [], shared: true })
log(`${scope.pages.length} pages in ${batches.length} audit batches`)

const audits = await parallel(batches.map((batch, i) => () => agent(
  batch.shared
    ? `Audit the SHARED back office UI of the repository at ${repo}: the layout (src/PrestaShopBundle/Resources/views/Admin/Layout, including Ui/), the page header and toolbar, the Common/Grid blocks and grid JS (admin-dev/themes/new-theme/js/components/grid), the form themes (src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm), the shared helpers (Admin/Helpers, Admin/Common), the existing kit Twig components (src/PrestaShopBundle/Twig/Component/Ui) and the Storybook stories (ui/src/stories).

List every UI pattern they define (page header, breadcrumb, toolbar buttons, tabs, grid parts — filters, bulk actions, row actions, pagination, empty state —, form rows and widgets, cards, modals, alerts, help…). For "pages", name the shared template; page counts come later.`
    : `Audit these Symfony back office page templates of the repository at ${repo} (paths relative to src/PrestaShopBundle/Resources/views/Admin/):
${batch.pages.map((p) => `- ${p.template} (controller ${p.controller})`).join('\n')}

For each page, read the template and the partials it includes or embeds, the form types it renders when the markup comes from them, and its page JS (admin-dev/themes/new-theme/js/pages). List the UI patterns: page header and actions, tabs, cards and panels, grids and their parts, forms (rows, widgets, translatable fields, switches, choice trees, file uploads), modals, alerts and help, empty states, KPIs, wizards. Note the variants and the inconsistencies between pages (two markups for the same thing), and UX/a11y problems visible in the code.`,
  { label: `audit:${batch.keys.join('+').slice(0, 40)}`, phase: 'Audit', schema: PATTERNS_SCHEMA },
).then((r) => (r ? r.patterns.map((p) => ({ ...p, batch: i })) : []))))

const patterns = audits.filter(Boolean).flat()
log(`${patterns.length} patterns found across batches`)

// Needs every batch at once: clustering across sections is the point
phase('Merge')
const merged = await agent(
  `You merge a UI audit of the PrestaShop back office into the component backlog of the /ui kit (repository ${repo}). Read ui/.ai/DECISIONS.md and ui/.ai/CONVENTIONS.md first: Storybook is the reference; Twig components for every element the back office uses, Bootstrap ones included (button, badge, modal…), and for back office patterns once on 2+ pages, each flexible enough that pages never fall back to raw markup; one page template with fixed slots (title, breadcrumb, actions, tabs, content); a new grid component designed from scratch; most-used pages (Orders, Products, Customers) first.

Separate components from layouts (CONVENTIONS.md "Components and layouts", DECISIONS.md #24): an element with its own look and behaviour is a component and never carries placement; what only places elements (page template, stacks, rows of actions, columns, form sections) is a layout. Split a pattern that does both into its parts and the layout that places them.

Cluster these patterns (from ${batches.length} batches, the last one being the shared layout, grid and form themes) into component candidates: merge the same pattern seen under different names, sum the pages, keep every variant and inconsistency, and say what it builds on. Put back office patterns seen on fewer than 2 pages in notComponents with the reason. For each candidate, list in variants the props, slots and attribute pass-through it needs to cover every occurrence. Rank by priority (dependencies first, then page count weighted towards the most-used pages). Mark designWorkflow for large or new ones (page template, grid, wizard…).

Patterns:
${JSON.stringify(patterns)}`,
  { label: 'merge', phase: 'Merge', schema: CANDIDATES_SCHEMA },
)
const candidates = merged.candidates.sort((a, b) => a.priority - b.priority)
log(`${candidates.length} component candidates, ${merged.notComponents.length} patterns left as markup`)

let shots = { shots: [], skipped: ['visual pass disabled'] }
if (visual) {
  phase('Visual')
  const top = candidates.slice(0, 10)
  shots = await agent(
    `Show the visual inconsistencies of the top back office component candidates in the user's Chrome with the claude-in-chrome tools (load them in one ToolSearch call; call tabs_context_mcp first, work in a NEW tab, close it at the end). The shop is ${baseUrl} on localhost. If the page needs sign-in on localhost, reuse the session the user already has in Chrome. If there is none, do not try to read or type credentials: skip the signed-in pages and say "sign in to the local back office in Chrome, then rerun". Never sign in anywhere else. Chrome may autofill saved credentials: clear the fields first. Read only: never submit a form, never click save, delete, toggle or bulk actions, never trigger dialogs.

For each candidate, open 2 or 3 pages that use it (find their URL from the controller route in ${repo}, or through the menu), at 1280 px wide, take a screenshot with save_to_disk, and copy it with Bash to ${outDir}/<component slug>--<n>.jpg (mkdir -p first). Say in one line what differs between occurrences.

Candidates:
${top.map((c) => `- ${c.component}: ${c.summary} — pages: ${c.pages.slice(0, 6).join(', ')}`).join('\n')}`,
    { label: 'visual', phase: 'Visual', schema: VISUAL_SCHEMA },
  ) || shots
}

phase('Write')
const written = await agent(
  `Write ${repo}/ui/.ai/INVENTORY.md (overwrite it) from the data below. It is the /ui kit component backlog, read by people and by the create-ui-component and ui-component-design skills, and kept up to date.

Structure:
1. Title, one paragraph saying how it was produced (ui-inventory workflow, ${scope.pages.length} pages, ${batches.length} batches) and how to refresh it, and that screenshots stay out of the repo (${outDir}).
2. "Backlog": two tables ranked by priority, "Layouts" then "Components" — status checkbox (- [ ]), name, kind, pages, sections, complexity, depends on, design workflow (yes/no).
3. "Candidates": one section per candidate — summary, builds on, variants to support as props, inconsistencies to harmonize, problems, occurrences (file:line), pages (collapsed in a <details> block when more than 8), and the visual note if any.
4. "Left as markup": the notComponents with reasons.
Keep it factual, no filler. Use repository-relative paths.

Data:
${JSON.stringify({ candidates, notComponents: merged.notComponents, shots: shots.shots })}

Return only the path of the file.`,
  { label: 'write', phase: 'Write', effort: 'low' },
)

return {
  inventory: written,
  pages: scope.pages.length,
  batches: batches.length,
  patterns: patterns.length,
  candidates: candidates.map((c) => `${c.priority}. ${c.component} (${c.pageCount} pages, ${c.complexity})`),
  screenshots: shots.shots.length,
}
