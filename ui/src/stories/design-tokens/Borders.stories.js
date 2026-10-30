/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens — border variables
// $enable-rounded: false → all radius variables resolve to 0 in this design system
// https://getbootstrap.com/docs/5.3/utilities/borders/
// ⚠ Keep in sync with _variables.scss if $enable-rounded or $border-* is changed.

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';

export default {
  title: 'Design Tokens/Borders',
};

// ── Border properties ──────────────────────────────────────────────────────────

export const BorderProperties = {
  name: 'Border Properties',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Global border CSS variables. <code>--bs-border-color</code> maps to
      <code>$gray-400</code> and switches in dark mode.
      Use these variables in custom component SCSS instead of hardcoding
      border values.
    </p>
    <table class="table table-bordered table-sm align-middle mb-4">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Resolved value</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { name: '--bs-border-width', purpose: 'Default border width (1px)' },
          { name: '--bs-border-style', purpose: 'Default border style (solid)' },
          { name: '--bs-border-color', purpose: 'Default border color ($gray-400) — switches in dark mode' },
          {
            name: '--bs-border-color-translucent',
            purpose: 'Semi-transparent variant for overlapping borders',
          },
        ]
          .map(
            ({ name, purpose }) => `
          <tr>
            <td><code class="small">var(${name})</code></td>
            <td><code class="small">${cssVar(name)}</code></td>
            <td class="small text-body-secondary">${purpose}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <h6 class="mb-3">Border color utility classes</h6>
    <div class="d-flex flex-wrap gap-2">
      ${[
        'border-primary',
        'border-secondary',
        'border-success',
        'border-danger',
        'border-warning',
        'border-info',
        'border-destructive',
      ]
        .map(
          (cls) => `
        <div class="border border-2 ${cls} p-2" style="min-width:120px">
          <code class="small">.${cls}</code>
        </div>`
        )
        .join('')}
    </div>
  `,
};

// ── Border radius ──────────────────────────────────────────────────────────────

export const BorderRadius = {
  name: 'Border Radius',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Border radius variables. All resolve to <code>0</code> in this design system
      because <code>$enable-rounded: false</code> is set in
      <code>src/scss/_variables.scss</code>. To use rounding on a specific custom
      component, override <code>--bs-border-radius</code> locally on that component's
      root element — this keeps the global default sharp while allowing exceptions.
    </p>
    <table class="table table-bordered table-sm align-middle mb-4">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Utility class</th>
          <th>Resolved value</th>
          <th>Bootstrap default</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { varName: '--bs-border-radius', cls: '.rounded', bsDefault: '0.375rem' },
          { varName: '--bs-border-radius-sm', cls: '.rounded-sm', bsDefault: '0.25rem' },
          { varName: '--bs-border-radius-lg', cls: '.rounded-lg', bsDefault: '0.5rem' },
          { varName: '--bs-border-radius-xl', cls: '.rounded-xl', bsDefault: '1rem' },
          { varName: '--bs-border-radius-xxl', cls: '.rounded-xxl', bsDefault: '2rem' },
          { varName: '--bs-border-radius-pill', cls: '.rounded-pill', bsDefault: '50rem' },
        ]
          .map(
            ({ varName, cls, bsDefault }) => `
          <tr>
            <td><code class="small">var(${varName})</code></td>
            <td><code class="small">${cls}</code></td>
            <td><code class="small">${cssVar(varName)}</code></td>
            <td><code class="small text-body-secondary">${bsDefault}</code></td>
            <td>
              <div
                style="width:56px;height:28px;background:var(--bs-primary);border-radius:var(${varName})"
              ></div>
            </td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

  `,
};

// ── Focus ring ────────────────────────────────────────────────────────────────

export const FocusRing = {
  name: 'Focus Ring',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Focus ring variables control the accessible keyboard focus indicator.
      Override <code>--bs-focus-ring-color</code> per component to match its
      context color.
    </p>
    <table class="table table-bordered table-sm align-middle mb-4">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Resolved value</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { name: '--bs-focus-ring-width', purpose: 'Outline width (0.25rem)' },
          { name: '--bs-focus-ring-opacity', purpose: 'Ring alpha (0.25)' },
          { name: '--bs-focus-ring-color', purpose: 'Ring color (rgba primary)' },
        ]
          .map(
            ({ name, purpose }) => `
          <tr>
            <td><code class="small">var(${name})</code></td>
            <td><code class="small">${cssVar(name)}</code></td>
            <td class="small text-body-secondary">${purpose}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <h6 class="mb-3">Demo — click or tab to the button to see the focus ring</h6>
    <div class="d-flex gap-3 flex-wrap align-items-center">
      <button class="btn btn-primary">Default focus ring</button>
      <button
        class="btn btn-success"
        style="--bs-focus-ring-color: rgba(var(--bs-success-rgb), 0.25)"
      >
        Custom color focus ring
      </button>
    </div>
  `,
};
