export const meta = {
  name: 'ui-screen-review',
  description: 'Screenshot every state of reworked /ui pages, including the hard-to-reach ones, review them as a design/UX/a11y panel and propose improvements',
  whenToUse: 'After a back-office page is reworked with the /ui kit (PS_UI_KIT=1), to see all its states side by side, especially the ones rarely seen while developing, and get reviewed improvement proposals. Args: {pages: [{name, url, story?, files?, scenarios?}], outDir, reviewsDir?, date?, widths?, setup?, fresh?}. With reviewsDir, a page that already has a review is reviewed as a follow-up (earlier findings re-checked, only new blockers and majors added) unless fresh: true. scenarios are ui/.ai/bin/seed.php scenario names; reviewsDir (absolute, usually <repo>/ui/.ai/reviews) keeps a JSON summary per page for PROGRESS.md',
  phases: [
    { title: 'Plan', detail: 'list every state of each page from its code and Storybook story, and how to reach it' },
    { title: 'Capture', detail: 'one page at a time in Chrome: set up, screenshot per state and width, restore, axe, keyboard pass' },
    { title: 'Review', detail: 'visual, UX writing, RGAA, code and Bootstrap 5.3 lenses per page' },
    { title: 'Challenge', detail: 'a skeptic drops findings the evidence does not support' },
    { title: 'Report', detail: 'HTML report: state coverage, screenshots and proposals' },
  ],
}

// Defined by ui/.ai/CONVENTIONS.md and ui/.ai/skills/ui-review/SKILL.md; agents read them, the script only orchestrates.
// Each step is a kit subagent (ui/.ai/agents/*.md) that carries its own rules.
// The point is to show the states a developer rarely sees (rare flashes, throttles, expired links, config-gated warnings),
// so the plan lists every branch and the capture reaches it by setup or emulation rather than skipping it.

if (!args || !Array.isArray(args.pages) || args.pages.length === 0 || !args.outDir) {
  throw new Error('Pass args {pages: [{name, url, story?, files?}], outDir} — outDir is an absolute directory, e.g. the session scratchpad')
}

const pages = args.pages
const outDir = args.outDir.replace(/\/$/, '')
const widths = args.widths || [375, 768, 1280]
const reviewsDir = args.reviewsDir ? args.reviewsDir.replace(/\/$/, '') : null

// Setup (config changes, emails to MailDev, a disposable employee) only ever runs against a local shop.
const isLocal = (url) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|[^/]+\.localhost|[^/]+\.test)(:\d+)?(\/|$)/.test(url)
const setupAllowed = (page) => args.setup !== false && isLocal(page.url)

const SEVERITIES = ['blocker', 'major', 'minor', 'suggestion']
// Only blockers and majors stop a page from being done; minor findings and suggestions are fixed when cheap, or left
const BLOCKING = ['blocker', 'major']

const SEVERITY_GUIDE = `Severity, rated by what the user loses, not by how much you would like it changed:
- blocker: a user cannot finish the task, or a WCAG 2.2 A/AA failure that shuts someone out (no keyboard access, unlabelled control, focus lost).
- major: the task is clearly harder or error-prone (misleading message, broken layout at a width, wrong focus order, an AA contrast failure), or the page contradicts the kit (CONVENTIONS.md, the Storybook reference).
- minor: noticeable polish on a page that works (an uneven gap, a glitch in one rare state). Non-blocking.
- suggestion: an idea or a nit; the page is fine without it. Non-blocking.
When in doubt between two levels, pick the lower one.`

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    states: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'kebab-case, used in file names' },
          title: { type: 'string' },
          why: { type: 'string', description: 'what this state shows that the others do not' },
          source: { type: 'string', description: 'file:line of the branch, flash or message that produces it' },
          reach: {
            type: 'string',
            enum: ['interact', 'setup', 'emulate'],
            description: 'interact: browser steps only; setup: needs a reversible change to the shop (config value, email sent to MailDev, disposable employee); emulate: cannot be produced for real locally, shown by forcing it in the DOM',
          },
          steps: { type: 'string', description: 'exact browser steps to reach it from the page URL, after setup' },
          setup: { type: 'string', description: 'for reach=setup: exact commands (docker exec … php bin/console prestashop:config set …, MailDev API calls, employee creation); empty otherwise' },
          restore: { type: 'string', description: 'for reach=setup: exact commands that put the shop back as it was; empty otherwise' },
        },
        required: ['id', 'title', 'why', 'source', 'reach', 'steps', 'setup', 'restore'],
      },
    },
  },
  required: ['states'],
}

const CAPTURE_SCHEMA = {
  type: 'object',
  properties: {
    kitLoaded: { type: 'boolean', description: 'a ui.css stylesheet was loaded' },
    captures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          state: { type: 'string', description: 'the exact state id from the list, nothing appended; put the variant in observed' },
          width: { type: 'number' },
          how: { type: 'string', enum: ['real', 'emulated'] },
          path: { type: 'string', description: 'absolute path of the copied screenshot' },
          observed: { type: 'string', description: 'one line: what is visible, anything odd' },
        },
        required: ['state', 'width', 'how', 'path', 'observed'],
      },
    },
    skipped: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          state: { type: 'string' },
          reason: { type: 'string' },
          manual: { type: 'string', description: 'how the user can reach it by hand' },
        },
        required: ['state', 'reason', 'manual'],
      },
    },
    restored: {
      type: 'array',
      description: 'every change made to the shop, and whether it was verified as undone',
      items: {
        type: 'object',
        properties: { change: { type: 'string' }, verified: { type: 'boolean' } },
        required: ['change', 'verified'],
      },
    },
    axe: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          state: { type: 'string' },
          id: { type: 'string' },
          impact: { type: 'string' },
          help: { type: 'string' },
          targets: { type: 'array', items: { type: 'string' } },
        },
        required: ['state', 'id', 'impact', 'help', 'targets'],
      },
    },
    keyboard: { type: 'array', items: { type: 'string' }, description: 'observations from the keyboard-only pass' },
    consoleErrors: { type: 'array', items: { type: 'string' } },
  },
  required: ['kitLoaded', 'captures', 'skipped', 'restored', 'axe', 'keyboard', 'consoleErrors'],
}

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
          where: { type: 'string', description: 'state + width, or file:line' },
          evidence: { type: 'string', description: 'always at least one: the screenshot path(s) for anything visible, the file:line for anything in code, the output lines for a command or axe result' },
          problem: { type: 'string', description: 'what is wrong and who it hurts (or the WCAG criterion)' },
          proposal: { type: 'string', description: 'the concrete improvement, in kit terms (component, utility, token, BEM class)' },
        },
        required: ['title', 'severity', 'where', 'evidence', 'problem', 'proposal'],
      },
    },
    outOfScope: {
      type: 'array',
      items: { type: 'string' },
      description: 'at most 3 one-line ideas outside the front end (controller, form type, route, security, business flow); not findings',
    },
  },
  required: ['findings'],
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
          severity: { type: 'string', enum: SEVERITIES, description: 'corrected severity when kept' },
          reason: { type: 'string' },
        },
        required: ['index', 'keep', 'severity', 'reason'],
      },
    },
  },
  required: ['verdicts'],
}

const LENSES = [
  {
    key: 'visual',
    agentType: 'ui-visual-designer',
    brief: 'Visual design and kit consistency. Compare with the Storybook story / playground mockup, which is the reference: spacing rhythm, alignment, typography scale, color tokens, component choice (one style per action), icon use, density, responsive behaviour at each width, overflow or clipping, long translations.',
  },
  {
    key: 'ux',
    agentType: 'ui-ux-writer',
    brief: 'UX and content, with extra attention to the rare states (throttles, expired links, config-gated warnings, required actions, success after a flow): is it obvious what to do, what went wrong and what to do next; error placement and timing; empty, loading and success feedback; destructive actions; field order and defaults; wording against the PrestaShop tone of voice (plain, active, the user\'s words, one verb per action, no blame).',
  },
  {
    key: 'a11y',
    agentType: 'ui-a11y-auditor',
    brief: 'Accessibility against the RGAA (ui/.ai/DECISIONS.md #39). Use the axe results and keyboard notes, then check by hand what axe cannot: color-only state, focus order and visibility, live announcements, labels and aria-describedby, touch targets, reduced motion.',
  },
  {
    key: 'code',
    agentType: 'ui-code-reviewer',
    brief: 'The templates, kit components, SCSS and JS behind the page against ui/.ai/CONVENTIONS.md: BEM, no layout or spacing utilities in markup, data-ps-* hooks, runtime state, logical properties, translatable strings. Use the screenshots only to locate what a visible problem comes from.',
  },
  {
    key: 'bootstrap',
    agentType: 'ui-bootstrap-expert',
    brief: 'Bootstrap 5.3 first: custom CSS, markup or JS behind the page that a Bootstrap 5.3 component, variable, mixin or behaviour already provides, checked against the official 5.3 docs.',
  },
]

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

// The review is about the UI rework: what the user sees and does, and its front-end causes. The plan still reads the
// controllers, which is how rare states are found, but findings never ask for back-end or flow changes.
const SCOPE = `Scope: the front end. Report what the user sees and does, caused by Twig templates, SCSS, kit components and their JS behaviour, accessibility, or wording (rewording a string is in scope wherever it is defined). Do not propose changes to controllers, form types, routes, security or the business flow (when a token is checked, where a redirect goes, what the server sends or validates); if such an idea matters to the user, put it in outOfScope, one line each, at most 3. Do not dig into PHP or deep JS beyond what explains a visible problem.`

// A page already reviewed converges instead of starting over: earlier findings are re-checked, fixes must hold,
// and only new blockers or majors are added.
const followUp = (page) => (reviewsDir && !args.fresh
  ? `Follow-up review: if ${reviewsDir}/${slug(page.name)}.json exists, read it and the entries of ui/.ai/CHANGELOG-UI.md dated since its "date". Report (1) each of its "open" findings that is still visible, with the same title; (2) anything the changelog lists as fixed that is broken again (a regression, at least major); (3) a NEW problem only if it is a blocker or a major. Do not report new minor issues or suggestions. If the file does not exist, review normally.`
  : '')

const pageBrief = (page) => [
  `Page "${page.name}": ${page.url}`,
  page.story ? `Reference story / mockup: ${page.story}` : 'Reference: find its Storybook story or playground mockup under ui/src/stories or ui/src/playground (may not exist).',
  page.files && page.files.length ? `Source files: ${page.files.join(', ')}` : 'Find the template, SCSS and JS that render it (Ui/ templates, ui/src/scss, admin-dev/themes/new-theme/js), and the controller behind it.',
  page.scenarios && page.scenarios.length ? `Data scenarios (ui/.ai/bin/seed.php, see ui/.ai/skills/ui-seed/SKILL.md): ${page.scenarios.join(', ')}` : '',
].filter(Boolean).join('\n')

// All capture agents drive the same Chrome and the same shop, so they run one at a time.
let browserLock = Promise.resolve()
const withBrowser = (fn) => {
  const run = browserLock.then(fn)
  browserLock = run.catch(() => {})
  return run
}

// A review of stale bundles judges code that is not the one in the tree: check the builds before anything else
const builds = await agent(
  'From the repository root, run exactly: node ui/.ai/bin/check-builds.mjs. Return its exit code and its full output. Run nothing else and change nothing.',
  {
    label: 'check-builds',
    phase: 'Plan',
    effort: 'low',
    schema: {
      type: 'object',
      properties: { exitCode: { type: 'number' }, output: { type: 'string' } },
      required: ['exitCode', 'output'],
    },
  },
)
if (builds.exitCode !== 0) {
  throw new Error(`${builds.output.trim()}\nRebuild, clear the cache as www-data, then run the review again.`)
}

const results = await pipeline(
  pages,

  (page) => agent(
    `${pageBrief(page)}

List EVERY state of this page, so the user sees the ones they cannot easily reach or may have missed. Walk the code, not only the story: every template condition ({% if %} and the variables behind it), every flash the controller adds (addFlash, error/info/warning/success), every other template the controller can render for this route (e.g. a required-actions page), every configuration value that changes the page (SSL, throttles such as PS_PASSWD_TIME_BACK, shop name, maintenance), every form field constraint and validation message (client and server), JS feedback (loading, disabled, toggled panels, popovers), and long content and long translations. RTL is out of scope: leave the dir="rtl" branch out.

Do not leave a state out because it is hard to reach. Pick how to reach it:
- interact: browser steps only, nothing saved.
- setup: a reversible change to the local shop, with exact setup and restore commands. Configuration through docker exec on the prestashop container with "php bin/console prestashop:config get|set KEY --value …" (restore the value read first). Emails go to MailDev (http://localhost:1080, REST API /email). An account-changing flow (password reset, required actions) uses a disposable employee created for the run, never the main admin employee.
- emulate: when it cannot be produced for real locally (e.g. a submitting/loading state the server answers too fast for: block the request after the page's own handlers ran), say exactly how to force it in the DOM.

Merge states that look identical. Read only; do not open the browser and do not change anything.`,
    { label: `plan:${page.name}`, phase: 'Plan', schema: PLAN_SCHEMA, agentType: 'ui-state-hunter' },
  ),

  (plan, page) => {
    const allowed = setupAllowed(page)
    const states = plan.states.filter((s) => allowed || s.reach !== 'setup')
    const dropped = plan.states.filter((s) => !allowed && s.reach === 'setup')
    if (dropped.length) log(`${page.name}: not a local shop or setup: false — ${dropped.length} setup state(s) listed as skipped: ${dropped.map((s) => s.id).join(', ')}`)
    const dir = `${outDir}/${slug(page.name)}`

    return withBrowser(() => agent(
      `${pageBrief(page)}

Capture this page in the user's Chrome with the claude-in-chrome tools (load them in one ToolSearch call; call tabs_context_mcp first, work in a NEW tab you create, close it at the end). The goal is to show the user every state, especially the rare ones, so reach each one rather than skipping it.

Preconditions: the /ui kit must be on (a stylesheet URL containing "ui.css"); if not, return kitLoaded=false with no captures. If the page needs sign-in on localhost, reuse the session the user already has in Chrome. If there is none, do not try to read or type credentials: skip the signed-in pages and say "sign in to the local back office in Chrome, then rerun". Never sign in anywhere else.

States to capture:
${states.map((s) => `- ${s.id} [${s.reach}] — steps: ${s.steps}${s.setup ? ` — setup: ${s.setup} — restore: ${s.restore}` : ''}`).join('\n')}

Data scenarios: ${page.scenarios && page.scenarios.length && allowed ? `before capturing, put each one up with "docker exec -u www-data -w /var/www/html <prestashop container> php ui/.ai/bin/seed.php up <scenario>" (scenarios: ${page.scenarios.join(', ')}); capture the states they enable (full listing, long names, limited employee with the credentials from var/ui-seed/limited-employee.json…), then put each one down and check "seed.php status" says nothing is up. Report each as a "restored" entry.` : 'none.'}

Setup rules (local shop only):
- Run every command in the container as the web user (docker exec -u www-data …), above all bin/console cache:clear: a cache written by root breaks the shop with a 500 error. Before returning, check the page still answers 200.
- Before any change, record the current value (prestashop:config get, or the row you will touch). After capturing the state, run its restore and check the value is back. Report every change in "restored" with verified true/false. Restore before moving to the next setup state, and again at the very end for anything left over.
- Before triggering an email, check the shop's SMTP points at MailDev (PS_MAIL_SERVER = maildev, PS_MAIL_METHOD = SMTP); if not, skip the state and say why. Read reset links from the MailDev API, never from a real inbox.
- A state that needs a file in the working tree (e.g. an install/ folder, config/defines_custom.inc.php) may create it only if it does not exist; never edit a tracked file; delete it right after the capture and report it in "restored".
- An account-changing flow uses a disposable employee you create for the run with an obviously fake address (ui-review@example.test) and a generated test password; delete it at the end. Never change the main admin employee, never change anything else in the shop.

Emulated states: force them as described in the plan, mark the capture how="emulated", and say in "observed" what was forced.

For every state × width ${JSON.stringify(widths)}: set the width (resize_window does not change the viewport; load the page in a same-origin iframe sized to the width and screenshot or zoom on it), reach the state, take a screenshot with save_to_disk, then copy the file with Bash to ${dir}/<state>--<width>.jpg (mkdir -p first). Skip a state only if it truly cannot be reached nor emulated; then give the reason and how the user can reach it by hand. Do not trigger browser alert/confirm dialogs.

Keyboard and mouse events only reach the page when its tab is the active, focused tab in the front window: switch to your tab first, and if keys still have no effect, say so in "keyboard" before falling back to focus() calls.

Chrome may autofill saved credentials: before any interaction, clear every email/password field and type the values the state needs (obviously wrong ones, nobody@example.com / wrong-password, unless the state needs the disposable employee). During the keyboard pass, read document.activeElement before each key and never press Enter or Space on a submit button.

Also: run axe-core on the most complete state and on each state that shows an alert or error (inject https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js, run it with the RGAA rule sets of your instructions), do one keyboard-only pass (Tab through to the end and back: order, visible focus, Enter/Space, Escape, traps), and read console errors.

Return only what you actually captured and observed.`,
      { label: `capture:${page.name}`, phase: 'Capture', schema: CAPTURE_SCHEMA, agentType: 'ui-browser-capturer' },
    )).then((capture) => {
      const leftovers = capture ? capture.restored.filter((r) => !r.verified) : []
      if (leftovers.length) log(`${page.name}: NOT RESTORED, check by hand: ${leftovers.map((r) => r.change).join('; ')}`)
      const notReached = dropped.map((s) => ({ state: s.id, reason: 'needs setup on a non-local shop or setup: false', manual: `${s.setup} then ${s.steps}` }))
      return { plan, capture: capture && { ...capture, skipped: [...capture.skipped, ...notReached] }, dir }
    })
  },

  ({ plan, capture, dir }, page) => {
    if (!capture || !capture.kitLoaded) {
      log(`${page.name}: /ui kit not loaded or capture failed — no review`)
      return { page, plan, capture, dir, findings: [] }
    }
    const evidence = JSON.stringify({ states: plan.states, captures: capture.captures, skipped: capture.skipped, axe: capture.axe, keyboard: capture.keyboard, consoleErrors: capture.consoleErrors }, null, 1)

    return parallel(LENSES.map((lens) => () => agent(
      `${pageBrief(page)}

You review this page through ONE lens: ${lens.brief}

Evidence (captured states, screenshot paths, axe and keyboard results; how="emulated" captures were forced in the DOM, judge what they show, not how they were produced):
${evidence}

Open the screenshots with the Read tool (it shows images) and compare states and widths. Read ui/.ai/CONVENTIONS.md and the reference story or mockup. Report only problems you can point to in a screenshot or a file:line, each with a concrete improvement in kit terms. Stay inside your lens; an empty list is a valid answer.

${SEVERITY_GUIDE}

${SCOPE}
${followUp(page)} Never report a choice recorded in ui/.ai/DECISIONS.md (read it): RTL is out of scope (#4). Dark mode is not built (DECISIONS.md #5): never review how something looks in dark mode, but dark mode code in the kit (\`[data-bs-theme='dark']\` rules, \`_variables-dark.scss\`, dark-only variables, a Storybook dark switch) is dead weight that contradicts #5: report it as minor, with its removal as the fix (Bootstrap's own switch is \`$enable-dark-mode: false\`). Also, button focus rings are the button color at 50% on purpose (#29).`,
      { label: `review:${lens.key}:${page.name}`, phase: 'Review', schema: FINDINGS_SCHEMA, agentType: lens.agentType },
    ).then((r) => (r ? { findings: r.findings.map((f) => ({ ...f, lens: lens.key })), outOfScope: r.outOfScope || [] } : { findings: [], outOfScope: [] }))))
      .then((byLens) => ({
        page, plan, capture, dir,
        findings: byLens.flatMap((r) => r.findings),
        outOfScope: [...new Set(byLens.flatMap((r) => r.outOfScope))],
      }))
  },

  (reviewed, page) => {
    if (!reviewed.findings.length) return { ...reviewed, kept: [] }
    return agent(
      `${pageBrief(page)}

You are a skeptical design lead. For each finding below, open its evidence (screenshots with the Read tool, files at the given lines) and try to refute it: not visible in the evidence, an artefact of emulation rather than of the page, contradicted by the Storybook reference (which wins), a duplicate of another finding (same problem seen through another lens or state: keep the clearest one, merged with the others' evidence, and drop the rest), a matter of taste with no user impact, out of scope (RTL, how something looks in dark mode, a choice recorded in ui/.ai/DECISIONS.md, or a fix; a finding asking to remove dark mode code stays that needs a controller, form type, route, security or business-flow change rather than a front-end one), or a proposal that breaks ui/.ai/CONVENTIONS.md. Keep it only if it survives; correct its severity if it is over- or under-rated against this scale. When unsure, drop it.
${SEVERITY_GUIDE}
${followUp(page) ? `This is a follow-up review: also drop a new finding (not one of the earlier open findings, not a regression) that is below major.\n${followUp(page)}` : ''}

Findings:
${reviewed.findings.map((f, i) => `[${i}] (${f.lens}, ${f.severity}) ${f.title} — ${f.where} — evidence: ${f.evidence} — ${f.problem} — proposal: ${f.proposal}`).join('\n')}`,
      { label: `challenge:${page.name}`, phase: 'Challenge', schema: VERDICTS_SCHEMA, agentType: 'ui-skeptic' },
    ).then((v) => {
      const verdicts = new Map((v ? v.verdicts : []).map((x) => [x.index, x]))
      const kept = reviewed.findings
        .map((f, i) => ({ f, v: verdicts.get(i) }))
        .filter(({ v }) => v && v.keep)
        .map(({ f, v }) => ({ ...f, severity: v.severity, challenge: v.reason }))
      log(`${page.name}: ${kept.length}/${reviewed.findings.length} findings kept after challenge`)
      return { ...reviewed, kept }
    })
  },
)

phase('Report')
const done = results.filter(Boolean)
const reportData = done.map((r) => {
  const captures = r.capture ? r.capture.captures : []
  const skipped = r.capture ? r.capture.skipped : []
  return {
    page: r.page,
    dir: r.dir,
    coverage: r.plan.states.map((s) => {
      const ofState = (x) => x.state === s.id || x.state.startsWith(`${s.id} `)
      const shots = captures.filter(ofState)
      const skip = skipped.find(ofState)
      return {
        id: s.id,
        title: s.title,
        why: s.why,
        source: s.source,
        reach: s.reach,
        status: shots.length ? (shots.some((c) => c.how === 'real') ? 'captured' : 'emulated') : 'missing',
        reason: skip ? skip.reason : (shots.length ? '' : 'not captured, no reason given'),
        manual: skip ? skip.manual : '',
      }
    }),
    captures,
    restored: r.capture ? r.capture.restored : [],
    axe: r.capture ? r.capture.axe : [],
    consoleErrors: r.capture ? r.capture.consoleErrors : [],
    findings: r.kept.sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity)),
    outOfScope: r.outOfScope || [],
  }
})

const reportPath = await agent(
  `Write a self-contained HTML review report to ${outDir}/index.html (overwrite it) from this data:
${JSON.stringify(reportData, null, 1)}

Only blocker and major findings block a page (${JSON.stringify(BLOCKING)}); minor and suggestion are non-blocking: fix them if cheap, leave them otherwise.

Per page, the folded part also holds: the state coverage (every state with its status captured, emulated or missing, why it matters, its source file:line, and for missing ones the reason and how to reach it by hand; rare states first-class, they are why the report exists), the shop changes made for setup and whether each was restored (highlight any not restored, outside the fold), and "Out of scope": the page's outOfScope ideas (back end or business flow), clearly not findings. Each reviewer wrote its own: merge the lines that say the same thing into one, then keep at most 3, those that matter most to the user.
${REPORT_STYLE}${reviewsDir ? `

Then, for each page, write ${reviewsDir}/<page slug>.json (mkdir -p first, overwrite), 2-space indented JSON: {"page": name, "url", "date": ${JSON.stringify(args.date || '')} or today's date (YYYY-MM-DD) if empty, "report": the HTML path, "states": {"total", "captured", "emulated", "missing": [ids]}, "findings": {"blocker": n, "major": n, "minor": n, "suggestion": n}, "open": [{"severity", "title", "where"}] for every finding, "outOfScope": the same merged list of at most 3 lines as in the report, "note": the note of the existing file if it has one}. Page slugs: ${JSON.stringify(reportData.map((r) => ({ name: r.page.name, slug: slug(r.page.name) })))}.` : ''}
Then open the report in the user's browser with Bash: open "${outDir}/index.html".
Return only the absolute path of the HTML file.`,
  { label: 'report', phase: 'Report' },
)

return {
  report: reportPath,
  pages: reportData.map((r) => ({
    page: r.page.name,
    states: r.coverage.length,
    captured: r.coverage.filter((s) => s.status === 'captured').length,
    emulated: r.coverage.filter((s) => s.status === 'emulated').length,
    missing: r.coverage.filter((s) => s.status === 'missing').map((s) => s.id),
    screenshots: r.captures.length,
    notRestored: r.restored.filter((x) => !x.verified).map((x) => x.change),
    findings: SEVERITIES.reduce((acc, s) => ({ ...acc, [s]: r.findings.filter((f) => f.severity === s).length }), {}),
    done: !r.findings.some((f) => BLOCKING.includes(f.severity)),
  })),
}
