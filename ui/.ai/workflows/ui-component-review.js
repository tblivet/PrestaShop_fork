export const meta = {
  name: 'ui-component-review',
  description: 'Full review of /ui kit components: Twig, PHP and SCSS code, story and tests up to date, and every case seen in Storybook at mobile, tablet and desktop widths',
  whenToUse: 'Before committing or while reviewing a <twig:ui:*> component, to check its code against the kit conventions, that its props, story, docs and tests are in sync, and how every story and edge case (long text, missing optional props, extreme values) looks in Storybook at 375/768/1280. Args: {components: ["Button", "Layout:Stack", …] (names after "ui:"), outDir, reviewsDir?, storybookUrl?, widths?, date?, fresh?}. Storybook must be running (npm run storybook in ui/). With reviewsDir (absolute, usually <repo>/ui/.ai/reviews), a component already reviewed gets a follow-up (earlier findings re-checked, only new blockers and majors added) unless fresh: true',
  phases: [
    { title: 'Check', detail: 'Storybook is up, story parity, the components\' PHPUnit tests' },
    { title: 'Inventory', detail: 'files, props, stories and the cases to look at, per component' },
    { title: 'Review', detail: 'code, Bootstrap 5.3, story and tests, Storybook QA, then captures at every width looked at for design and RGAA' },
    { title: 'Challenge', detail: 'a skeptic drops findings the evidence does not support' },
    { title: 'Report', detail: 'HTML report with the screenshots, and a JSON summary per component' },
  ],
}

// Rules live in ui/.ai/CONVENTIONS.md and ui/.ai/DECISIONS.md; agents read them, the script only orchestrates.
// The page-level twin is ui-screen-review.js: this one looks at one component in isolation, in Storybook.
// Each step is a kit subagent (ui/.ai/agents/*.md) that carries its own rules; prompts only give the data.

if (!args || !Array.isArray(args.components) || args.components.length === 0 || !args.outDir) {
  throw new Error('Pass args {components: ["Button", "Layout:Stack"], outDir} — names after "ui:", outDir an absolute directory, e.g. the session scratchpad')
}

const components = args.components.map((name) => name.replace(/^ui:/, ''))
const outDir = args.outDir.replace(/\/$/, '')
const widths = args.widths || [375, 768, 1280]
const storybook = (args.storybookUrl || 'http://127.0.0.1:6006').replace(/\/$/, '')
const reviewsDir = args.reviewsDir ? `${args.reviewsDir.replace(/\/$/, '')}/components` : null

const SEVERITIES = ['blocker', 'major', 'minor', 'suggestion']
const BLOCKING = ['blocker', 'major']

const SEVERITY_GUIDE = `Severity, rated by what a page using the component, or a developer using it, loses:
- blocker: the component is broken or unusable in a case it accepts (crash, wrong markup, a prop that does nothing), or a WCAG 2.2 A/AA failure that shuts someone out (no keyboard access, unlabelled control, focus lost).
- major: a case renders wrong (overflow, clipping, broken layout at a width, long text unreadable), the story or its docs lie about the component (missing or wrong prop, wrong default, Twig code in "Show code" that would not render the same), an untested prop or branch, or code that contradicts ui/.ai/CONVENTIONS.md.
- minor: polish on a component that works (an uneven gap, a story that could show a case better, a naming nit). Non-blocking.
- suggestion: an idea; the component is fine without it. Non-blocking.
When in doubt between two levels, pick the lower one.`

const OUT_OF_SCOPE = 'Never report a choice recorded in ui/.ai/DECISIONS.md (read it): RTL is out of scope (#4); Windows forced colours / high contrast mode is not reviewed (#44); Dark mode is not built (DECISIONS.md #5): never review how something looks in dark mode, but dark mode code in the kit (`[data-bs-theme=\'dark\']` rules, `_variables-dark.scss`, dark-only variables, a Storybook dark switch) is dead weight that contradicts #5: report it as minor, with its removal as the fix (Bootstrap\'s own switch is `$enable-dark-mode: false`). Also, button focus rings are the button colour at 50% on purpose (#29), Bootstrap first with every style in its BEM partial and no layout or spacing utilities in markup (#38). Rounded corners are not wanted.'

const REPORT_STYLE = `How the report reads (it is for a developer who did not follow the review and must know in one minute what to fix):
- Top: one plain verdict sentence per item ("Button: 2 problems to fix before it is done, 9 small ones"), then a short "What to do first" list of the blocking findings, each a link to its card.
- Then one card per finding, blocking ones first, then "Non-blocking: fix if cheap". Each card: a coloured severity badge (Must fix for blocker and major, Small for minor, Idea for suggestion), the title, where it is (file:line or case + width), what is wrong and who it hurts in one or two sentences, the proposed fix, and ALWAYS its evidence inline, never only a path:
  - a screenshot (in evidence, or a capture of the same case and width): the image itself, 360px wide, click to open full size;
  - a file:line: read the file and show the lines around it (3 before, 3 after) in a <pre> with line numbers, the cited lines highlighted;
  - a command or axe output: the relevant lines in a <pre>.
  A finding whose evidence cannot be shown says so plainly.
- Then the rest, folded in <details> so it does not get in the way: what was checked (tests, parity, cases or states), the gallery of every capture grouped by case or state with one thumbnail per width, and anything not checked with the reason.
- Look: a clean, calm page; system font, 16px text, generous spacing, max-width 72rem centred, a sticky top bar with the counts per severity that filter the cards when clicked; colours only to mean something (red must fix, amber small, grey idea); no rounded corners; readable in light and dark (prefers-color-scheme). Inline CSS and a few lines of inline JS for the filters only, nothing external.`

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const followUp = (name) => (reviewsDir && !args.fresh
  ? `Follow-up review: if ${reviewsDir}/${slug(name)}.json exists, read it and the entries of ui/.ai/CHANGELOG-UI.md dated since its "date". Report (1) each of its "open" findings still true, with the same title; (2) anything listed as fixed that is broken again (a regression, at least major); (3) a NEW problem only if it is a blocker or a major. If the file does not exist, review normally.`
  : '')

const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: SEVERITIES },
          where: { type: 'string', description: 'file:line, or story/case + width' },
          evidence: { type: 'string', description: 'always at least one: the screenshot path(s) for anything visible, the file:line for anything in code, the output lines for a command or axe result' },
          problem: { type: 'string', description: 'what is wrong and who it hurts (or the WCAG criterion)' },
          proposal: { type: 'string', description: 'the concrete fix, in kit terms (prop, BEM class, Bootstrap variable, story args, test)' },
        },
        required: ['title', 'severity', 'where', 'evidence', 'problem', 'proposal'],
      },
    },
  },
  required: ['findings'],
}

const INVENTORY_SCHEMA = {
  type: 'object',
  properties: {
    found: { type: 'boolean', description: 'a <twig:ui:Name> component with this name exists' },
    files: {
      type: 'object',
      properties: {
        php: { type: 'string' },
        template: { type: 'string' },
        scss: { type: 'array', items: { type: 'string' } },
        js: { type: 'array', items: { type: 'string' } },
        story: { type: 'string' },
        unitTest: { type: 'string' },
        integrationTest: { type: 'string' },
        usedIn: { type: 'array', items: { type: 'string' }, description: 'templates that use the component (at most 10)' },
      },
      required: ['php', 'template', 'scss', 'js', 'story', 'unitTest', 'integrationTest', 'usedIn'],
    },
    props: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          default: { type: 'string' },
          allowed: { type: 'string', description: 'allowed values or validation (PreMount, enum), empty if free' },
        },
        required: ['name', 'type', 'default', 'allowed'],
      },
    },
    stories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Storybook id from index.json, e.g. components-button--variants' },
          shows: { type: 'string' },
        },
        required: ['id', 'shows'],
      },
    },
    cases: {
      type: 'array',
      description: 'what to look at in the browser: every story, plus edge cases reached by overriding args',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'kebab-case, used in file names' },
          storyId: { type: 'string' },
          args: { type: 'string', description: 'Storybook URL args to apply (key:value;key2:value2), empty for the story as is' },
          why: { type: 'string', description: 'what this case checks that the others do not' },
        },
        required: ['id', 'storyId', 'args', 'why'],
      },
    },
  },
  required: ['found', 'files', 'props', 'stories', 'cases'],
}

const CAPTURE_SCHEMA = {
  type: 'object',
  properties: {
    captures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          case: { type: 'string', description: 'the exact case id, or "docs"' },
          width: { type: 'number' },
          path: { type: 'string', description: 'absolute path of the copied screenshot' },
          observed: { type: 'string', description: 'one line: what is visible, anything odd' },
        },
        required: ['case', 'width', 'path', 'observed'],
      },
    },
    skipped: {
      type: 'array',
      items: {
        type: 'object',
        properties: { case: { type: 'string' }, reason: { type: 'string' } },
        required: ['case', 'reason'],
      },
    },
    axe: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          case: { type: 'string' },
          id: { type: 'string' },
          impact: { type: 'string' },
          help: { type: 'string' },
          targets: { type: 'array', items: { type: 'string' } },
        },
        required: ['case', 'id', 'impact', 'help', 'targets'],
      },
    },
    keyboard: { type: 'array', items: { type: 'string' } },
    consoleErrors: { type: 'array', items: { type: 'string' } },
  },
  required: ['captures', 'skipped', 'axe', 'keyboard', 'consoleErrors'],
}

const VERDICTS_SCHEMA = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: { type: 'number' },
          keep: { type: 'boolean' },
          severity: { type: 'string', enum: SEVERITIES },
          reason: { type: 'string' },
        },
        required: ['index', 'keep', 'severity', 'reason'],
      },
    },
  },
  required: ['verdicts'],
}

// Storybook, the tests and story parity are checked once for all the components
phase('Check')
const check = await agent(
  `From the repository root, read only, change nothing:
1. Fetch ${storybook}/index.json (curl). storybookUp = it answers 200 with entries.
2. Run: node ui/.ai/bin/story-parity.mjs. Return its exit code and full output.
3. For each component of ${JSON.stringify(components)} (<twig:ui:Name>, "Layout:Stack" is ui:Layout:Stack), find its PHPUnit tests: tests/Unit/PrestaShopBundle/Twig/Component/Ui/**/<Name>Test.php and tests/Integration/PrestaShopBundle/Twig/Component/Ui/**/<Name>ComponentTest.php (layouts share Layout/LayoutComponentsTest.php), plus StoryMarkupTest.php. Find the PrestaShop container of this repository with docker ps (the one whose name contains "prestashop" and mounts this working tree). Run them in it as the web user, e.g. docker exec -u www-data -w /var/www/html <container> php -d date.timezone=UTC vendor/bin/phpunit -c tests/Unit/phpunit.xml <files>, and -c tests/Integration/phpunit.xml for the integration ones. If the integration suite cannot boot (no test database), do not create one: report it as notRun with the reason. Never clear caches as root.`,
  {
    label: 'check',
    phase: 'Check',
    effort: 'low',
    schema: {
      type: 'object',
      properties: {
        storybookUp: { type: 'boolean' },
        parityExitCode: { type: 'number' },
        parityOutput: { type: 'string' },
        tests: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              component: { type: 'string' },
              suite: { type: 'string', enum: ['unit', 'integration', 'story-markup'] },
              result: { type: 'string', enum: ['pass', 'fail', 'notRun', 'missing'] },
              output: { type: 'string', description: 'failures or the reason it did not run, trimmed' },
            },
            required: ['component', 'suite', 'result', 'output'],
          },
        },
      },
      required: ['storybookUp', 'parityExitCode', 'parityOutput', 'tests'],
    },
  },
)
if (!check || !check.storybookUp) {
  throw new Error(`Storybook does not answer on ${storybook}: run "npm run storybook" in ui/, then run the review again.`)
}
const testsOf = (name) => check.tests.filter((t) => t.component === name || t.component === `ui:${name}` || t.suite === 'story-markup')

// All capture agents drive the same Chrome, so they run one at a time
let browserLock = Promise.resolve()
const withBrowser = (fn) => {
  const run = browserLock.then(fn)
  browserLock = run.catch(() => {})
  return run
}

const brief = (name, inv) => `Component <twig:ui:${name}>.
Files: ${JSON.stringify(inv.files)}
Props: ${JSON.stringify(inv.props)}
Stories: ${JSON.stringify(inv.stories)}`

const tail = (name) => `${SEVERITY_GUIDE}
${OUT_OF_SCOPE}
${followUp(name)}`

const withLens = (lens) => (r) => (r ? r.findings.map((f) => ({ ...f, lens })) : [])

const results = await pipeline(
  components,

  (name) => agent(
    `Inventory the /ui kit component <twig:ui:${name}> (AsTwigComponent "ui:${name}"). Storybook index: ${storybook}/index.json. Fill found=false if no such component exists.`,
    { label: `inventory:${name}`, phase: 'Inventory', schema: INVENTORY_SCHEMA, agentType: 'ui-state-hunter' },
  ),

  (inv, name) => {
    if (!inv || !inv.found) {
      log(`${name}: no <twig:ui:${name}> component found — skipped`)
      return null
    }
    const dir = `${outDir}/${slug(name)}`

    // Code-only lenses start at once; the browser ones queue on the lock
    const code = agent(
      `${brief(name, inv)}\n\nReview the code of this component.\n\n${tail(name)}`,
      { label: `code:${name}`, phase: 'Review', schema: FINDINGS_SCHEMA, agentType: 'ui-code-reviewer' },
    ).then(withLens('code'))

    const bootstrap = agent(
      `${brief(name, inv)}\n\nFind what this component writes itself that Bootstrap 5.3 already provides.\n\n${tail(name)}`,
      { label: `bootstrap:${name}`, phase: 'Review', schema: FINDINGS_SCHEMA, agentType: 'ui-bootstrap-expert' },
    ).then(withLens('bootstrap'))

    const story = agent(
      `${brief(name, inv)}

Check that the story, its docs and the tests are up to date with the component. Already gathered:
- story-parity.mjs (exit ${check.parityExitCode}): ${check.parityOutput}
- tests: ${JSON.stringify(testsOf(name))}

${tail(name)}`,
      { label: `story:${name}`, phase: 'Review', schema: FINDINGS_SCHEMA, agentType: 'ui-storybook-keeper' },
    ).then(withLens('story'))

    const qa = withBrowser(() => agent(
      `${brief(name, inv)}

Test the Storybook of this component at ${storybook}: every story, every control, the docs page, "Show code", the canvas at ${JSON.stringify(widths)}, the console. Save screenshots of anything wrong to ${dir}/qa-<what>.jpg.

${tail(name)}`,
      { label: `storybook-qa:${name}`, phase: 'Review', schema: FINDINGS_SCHEMA, agentType: 'ui-storybook-qa' },
    )).then(withLens('storybook'))

    const visual = withBrowser(() => agent(
      `${brief(name, inv)}

Capture this component in Storybook (${storybook}). Cases:
${inv.cases.map((c) => `- ${c.id}: ${c.storyId}${c.args ? ` with args ${c.args}` : ''} — ${c.why}`).join('\n')}

For each case × width ${JSON.stringify(widths)}, save the screenshot to ${dir}/<case>--<width>.jpg. Run axe on the most complete case and each interactive one, and the keyboard pass if the component is interactive.`,
      { label: `capture:${name}`, phase: 'Review', schema: CAPTURE_SCHEMA, agentType: 'ui-browser-capturer' },
    )).then((capture) => {
      if (!capture) return { capture: null, findings: [] }
      const evidence = `Captures, axe, keyboard and console:\n${JSON.stringify(capture, null, 1)}\n\nCases: ${JSON.stringify(inv.cases)}`
      return parallel([
        () => agent(
          `${brief(name, inv)}\n\nReview how this component renders, case by case and width by width.\n${evidence}\n\n${tail(name)}`,
          { label: `visual:${name}`, phase: 'Review', schema: FINDINGS_SCHEMA, agentType: 'ui-visual-designer' },
        ).then(withLens('visual')),
        () => agent(
          `${brief(name, inv)}\n\nAudit the accessibility of this component (RGAA) from the evidence below and its code.\n${evidence}\n\n${tail(name)}`,
          { label: `a11y:${name}`, phase: 'Review', schema: FINDINGS_SCHEMA, agentType: 'ui-a11y-auditor' },
        ).then(withLens('a11y')),
      ]).then((lenses) => ({ capture, findings: lenses.filter(Boolean).flat() }))
    })

    return Promise.all([code, bootstrap, story, qa, visual]).then(([c, b, s, q, v]) => ({
      name, inv, dir, capture: v.capture,
      findings: [...c, ...b, ...s, ...q, ...v.findings],
    }))
  },

  (reviewed, name) => {
    if (!reviewed) return null
    if (!reviewed.findings.length) return { ...reviewed, kept: [] }
    return agent(
      `${brief(name, reviewed.inv)}

Challenge the findings of this review.
${SEVERITY_GUIDE}
${OUT_OF_SCOPE}
${followUp(name) ? `This is a follow-up review: also drop a new finding (not an earlier open one, not a regression) below major.\n${followUp(name)}` : ''}

Findings:
${reviewed.findings.map((f, i) => `[${i}] (${f.lens}, ${f.severity}) ${f.title} — ${f.where} — evidence: ${f.evidence} — ${f.problem} — proposal: ${f.proposal}`).join('\n')}`,
      { label: `challenge:${name}`, phase: 'Challenge', schema: VERDICTS_SCHEMA, agentType: 'ui-skeptic' },
    ).then((v) => {
      const verdicts = new Map((v ? v.verdicts : []).map((x) => [x.index, x]))
      const kept = reviewed.findings
        .map((f, i) => ({ f, v: verdicts.get(i) }))
        .filter(({ v }) => v && v.keep)
        .map(({ f, v }) => ({ ...f, severity: v.severity, challenge: v.reason }))
        .sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity))
      log(`${name}: ${kept.length}/${reviewed.findings.length} findings kept after challenge`)
      return { ...reviewed, kept }
    })
  },
)

phase('Report')
const done = results.filter(Boolean)
const reportData = done.map((r) => ({
  component: r.name,
  dir: r.dir,
  files: r.inv.files,
  props: r.inv.props,
  cases: r.inv.cases,
  tests: testsOf(r.name),
  captures: r.capture ? r.capture.captures : [],
  skipped: r.capture ? r.capture.skipped : [],
  axe: r.capture ? r.capture.axe : [],
  consoleErrors: r.capture ? r.capture.consoleErrors : [],
  findings: r.kept,
}))

const reportPath = await agent(
  `Write a self-contained HTML review report to ${outDir}/index.html (overwrite it) from this data:
${JSON.stringify(reportData, null, 1)}

story-parity.mjs exit code: ${check.parityExitCode}.
Only blocker and major findings block a component (${JSON.stringify(BLOCKING)}).

Per component, also say: files and props (name, type, default, allowed values), the tests and story-parity results, and the skipped cases with their reason; these go in the folded part.
${REPORT_STYLE}${reviewsDir ? `

Then, for each component, write ${reviewsDir}/<slug>.json (mkdir -p first, overwrite), 2-space indented JSON: {"component": name, "date": ${JSON.stringify(args.date || '')} or today's date (YYYY-MM-DD) if empty, "report": the HTML path, "tests": {"unit", "integration", "storyMarkup"} results, "cases": {"total", "captured", "skipped": [ids]}, "findings": {"blocker": n, "major": n, "minor": n, "suggestion": n}, "open": [{"severity", "title", "where"}] for every finding, "note": the note of the existing file if it has one}. Slugs: ${JSON.stringify(reportData.map((r) => ({ name: r.component, slug: slug(r.component) })))}.` : ''}
Then open the report in the user's browser with Bash: open "${outDir}/index.html".
Return only the absolute path of the HTML file.`,
  { label: 'report', phase: 'Report' },
)

return {
  report: reportPath,
  parity: check.parityExitCode === 0 ? 'ok' : 'gaps',
  components: reportData.map((r) => ({
    component: r.component,
    tests: r.tests.map((t) => `${t.suite}: ${t.result}`),
    cases: r.cases.length,
    screenshots: r.captures.length,
    skipped: r.skipped.map((s) => s.case),
    findings: SEVERITIES.reduce((acc, s) => ({ ...acc, [s]: r.findings.filter((f) => f.severity === s).length }), {}),
    done: !r.findings.some((f) => BLOCKING.includes(f.severity)),
  })),
}
