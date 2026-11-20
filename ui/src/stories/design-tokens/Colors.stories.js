/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens — color primitives and semantic theme colors
// Palettes: src/scss/_custom.scss · Tokens: src/scss/_variables.scss
// https://getbootstrap.com/docs/5.3/customize/css-variables/
// ⚠ Keep in sync with _variables.scss, _maps.scss, and _custom.scss whenever colors change.

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const paletteScales = [
  { name: 'primary' },
  { name: 'secondary' },
  { name: 'red' },
  { name: 'yellow' },
  { name: 'amber' },
  { name: 'green' },
  { name: 'blue' },
  { name: 'oceanblue' },
  { name: 'purple' },
];

function swatchCell(varName, step) {
  const isDark = step >= 500;
  const textColor = isDark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.5)';
  return `
    <td style="padding:0;width:10%">
      <div
        style="background:var(${varName});height:64px;position:relative"
        title="${varName}"
      >
        <span style="position:absolute;bottom:4px;left:4px;right:4px;font-size:.5rem;font-family:var(--bs-font-monospace);color:${textColor};line-height:1.3;word-break:break-all">
          ${step}<br>${cssVar(varName)}
        </span>
      </div>
    </td>`;
}

export default {
  title: 'Design Tokens/Colors',
};

// ── Primitive palettes ─────────────────────────────────────────────────────────

export const PrimitivePalettes = {
  name: 'Primitive Palettes',
  render: () => `
    <p class="text-body-secondary small mb-1">
      Custom palette primitives exposed at <code>:root</code> in
      <code>src/scss/_custom.scss</code>. Consume via
      <code>var(--bs-{color}-{step})</code>.
      Steps range from <code>50</code> (lightest) to <code>900</code> (darkest).
    </p>
    <p class="text-body-secondary small mb-4">
      Resolved values shown for the <strong>current color mode</strong> — toggle
      dark mode to see dark-mode values.
    </p>
    <div class="overflow-x-auto">
      <table class="table table-bordered mb-0" style="min-width:640px;table-layout:fixed">
        <thead class="table-light">
          <tr>
            <th style="width:90px" class="small">Scale</th>
            ${steps.map((s) => `<th class="text-center small">${s}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${paletteScales
            .map(
              ({ name }) => `
            <tr>
              <td class="fw-semibold small align-middle text-capitalize">${name}</td>
              ${steps.map((step) => swatchCell(`--bs-${name}-${step}`, step)).join('')}
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="text-body-secondary small mt-3 mb-0">
      Example usage in a custom component:
      <code>background-color: var(--bs-blue-100);</code> ·
      <code>color: var(--bs-red-700);</code>
    </p>
  `,
};

// ── Gray scale ─────────────────────────────────────────────────────────────────

export const GrayScale = {
  name: 'Gray Scale',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Bootstrap's native gray scale, overridden in
      <code>src/scss/_variables.scss</code> with the brand palette.
      Accessible via <code>var(--bs-gray-{step})</code>.
    </p>
    <div class="overflow-x-auto">
      <table class="table table-bordered mb-0" style="min-width:640px;table-layout:fixed">
        <thead class="table-light">
          <tr>
            <th style="width:90px" class="small">Scale</th>
            ${steps.map((s) => `<th class="text-center small">${s}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="fw-semibold small align-middle">gray</td>
            ${steps.map((step) => swatchCell(`--bs-gray-${step}`, step)).join('')}
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-body-secondary small mt-3 mb-0">
      Example: <code>border-color: var(--bs-gray-400);</code> ·
      <code>color: var(--bs-gray-600);</code>
    </p>
  `,
};

// ── Theme colors ───────────────────────────────────────────────────────────────

const themeColors = [
  { name: 'primary', note: '$gray-800 (brand)' },
  { name: 'secondary', note: '$gray-600 (brand-secondary)' },
  { name: 'success', note: '$green-500' },
  { name: 'danger', note: '$red-500' },
  { name: 'warning', note: '$yellow-500' },
  { name: 'info', note: '$blue-500' },
  { name: 'light', note: 'Bootstrap default' },
  { name: 'dark', note: 'Bootstrap default' },
  { name: 'destructive', note: '$red-500 · custom (src/scss/_maps.scss)' },
];

export const ThemeColors = {
  name: 'Theme Colors',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Bootstrap semantic theme colors. These drive all component variants
      (<code>.btn-primary</code>, <code>.badge-success</code>, <code>.alert-danger</code>, etc.).
      <code>destructive</code> is a custom addition defined in
      <code>src/scss/_maps.scss</code>.
    </p>
    <table class="table table-bordered table-sm align-middle">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th style="width:56px">Swatch</th>
          <th>Resolved value</th>
          <th><code>-rgb</code> variable</th>
          <th class="d-none d-lg-table-cell">SCSS source</th>
        </tr>
      </thead>
      <tbody>
        ${themeColors
          .map(
            ({ name, note }) => `
          <tr>
            <td><code class="small">var(--bs-${name})</code></td>
            <td>
              <div style="background:var(--bs-${name});height:32px;border:1px solid rgba(0,0,0,.08)"></div>
            </td>
            <td><code class="small">${cssVar(`--bs-${name}`)}</code></td>
            <td><code class="small text-body-secondary">var(--bs-${name}-rgb)</code><br><code class="small text-body-secondary" style="font-size:.6rem">${cssVar(`--bs-${name}-rgb`)}</code></td>
            <td class="d-none d-lg-table-cell text-body-secondary small">${note}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  `,
};

// ── Surface & text tokens ──────────────────────────────────────────────────────

export const SurfaceTokens = {
  name: 'Surface & Text Tokens',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Global surface and text CSS variables (the back office has no dark mode, DECISIONS.md #5).
      Always prefer these over hardcoded colors for background and text in custom
      components.
    </p>
    <table class="table table-bordered table-sm align-middle">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th style="width:56px">Swatch</th>
          <th>Resolved value</th>
          <th>Typical use</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { name: '--bs-body-bg', purpose: 'Page / component default background' },
          { name: '--bs-body-color', purpose: 'Default body text color' },
          { name: '--bs-secondary-bg', purpose: 'Muted surface — inputs, disabled states' },
          { name: '--bs-secondary-color', purpose: 'Muted / de-emphasised text' },
          { name: '--bs-tertiary-bg', purpose: 'Subtle surface — zebra rows, tooltips' },
          { name: '--bs-tertiary-color', purpose: 'Placeholder / very muted text' },
          { name: '--bs-emphasis-color', purpose: 'High-contrast text — headings' },
          { name: '--bs-border-color', purpose: 'Default border / divider ($gray-400)' },
          { name: '--bs-link-color', purpose: 'Anchor default color' },
          { name: '--bs-link-hover-color', purpose: 'Anchor hover color' },
          { name: '--bs-code-color', purpose: 'Inline <code> text color' },
        ]
          .map(
            ({ name, purpose }) => `
          <tr>
            <td><code class="small">var(${name})</code></td>
            <td>
              <div style="background:var(${name});height:32px;border:1px solid rgba(0,0,0,.08)"></div>
            </td>
            <td><code class="small">${cssVar(name)}</code></td>
            <td class="small text-body-secondary">${purpose}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  `,
};

// ── Subtle variants ────────────────────────────────────────────────────────────

const subtleColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'destructive'];

export const SubtleVariants = {
  name: 'Subtle Variants',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Semantic subtle tokens for muted, contextual UI surfaces. Use the utility
      classes directly (<code>.bg-{color}-subtle</code>,
      <code>.border-{color}-subtle</code>, <code>.text-{color}-emphasis</code>)
      or the CSS variables in custom component SCSS.
    </p>
    <table class="table table-bordered table-sm align-middle">
      <thead class="table-light">
        <tr>
          <th style="width:110px">Color</th>
          <th><code>-bg-subtle</code></th>
          <th><code>-border-subtle</code></th>
          <th><code>-text-emphasis</code></th>
        </tr>
      </thead>
      <tbody>
        ${subtleColors
          .map(
            (name) => `
          <tr>
            <td class="fw-semibold small">${name}</td>
            <td>
              <div style="background:var(--bs-${name}-bg-subtle);padding:.375rem .5rem;border:1px solid rgba(0,0,0,.06)">
                <code style="font-size:.6rem">var(--bs-${name}-bg-subtle)</code>
                <br><code style="font-size:.55rem;color:var(--bs-secondary-color)">${cssVar(`--bs-${name}-bg-subtle`)}</code>
              </div>
            </td>
            <td>
              <div style="border:2px solid var(--bs-${name}-border-subtle);padding:.375rem .5rem">
                <code style="font-size:.6rem">var(--bs-${name}-border-subtle)</code>
                <br><code style="font-size:.55rem;color:var(--bs-secondary-color)">${cssVar(`--bs-${name}-border-subtle`)}</code>
              </div>
            </td>
            <td>
              <span style="color:var(--bs-${name}-text-emphasis)">
                <code style="font-size:.6rem">var(--bs-${name}-text-emphasis)</code>
                <br><code style="font-size:.55rem;opacity:.7">${cssVar(`--bs-${name}-text-emphasis`)}</code>
              </span>
            </td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <h6 class="mt-4 mb-2">Extended palette — bg-subtle only</h6>
    <p class="text-body-secondary small mb-3">
      Non-theme palette colors that expose a <code>bg-subtle</code> token.
      Use <code>.bg-{color}-subtle</code> or
      <code>var(--bs-{color}-bg-subtle)</code>.
    </p>
    <div class="d-flex flex-wrap gap-3">
      ${['oceanblue', 'purple', 'amber']
        .map(
          (name) => `
        <div style="background:var(--bs-${name}-bg-subtle);padding:.75rem 1.25rem;border:1px solid rgba(0,0,0,.06);min-width:190px">
          <code style="font-size:.65rem;display:block">var(--bs-${name}-bg-subtle)</code>
          <code style="font-size:.6rem;color:var(--bs-secondary-color)">${cssVar(`--bs-${name}-bg-subtle`)}</code>
        </div>`
        )
        .join('')}
    </div>
  `,
};
