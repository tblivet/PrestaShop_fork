/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens — border variables: widths and colour, square corners (radius 0 but the pill), the focus ring
// https://getbootstrap.com/docs/5.3/utilities/borders/
// ⚠ Keep in sync with _variables.scss if $enable-rounded, $border-* or $focus-ring-* change.

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';

export default {
  title: 'Design Tokens/Borders',
};

// ── Border properties ──────────────────────────────────────────────────────────

export const BorderProperties = {
  name: 'Border Properties',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Global border CSS variables. <code>--psk-border-color</code> maps to
      <code>$gray-400</code>.
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
          { name: '--psk-border-width', purpose: 'Default border width (1px)' },
          { name: '--psk-border-style', purpose: 'Default border style (solid)' },
          { name: '--psk-border-color', purpose: 'Default border color ($gray-400)' },
          {
            name: '--psk-border-color-translucent',
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
      Corners are square: <code>$enable-rounded: false</code> keeps components from drawing a radius, and the radius
      tokens are <code>0</code> (<code>src/scss/_variables.scss</code>), so the <code>.rounded</code> utilities are square
      too. The only round shapes are the pill (pill badges, counters, progress bars, switches) and the circle
      (<code>.rounded-circle</code>, avatars).
    </p>
    <table class="table table-bordered table-sm align-middle mb-4">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Utility class</th>
          <th>Resolved value</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { varName: '--psk-border-radius', cls: '.rounded' },
          { varName: '--psk-border-radius-sm', cls: '.rounded-1' },
          { varName: '--psk-border-radius-lg', cls: '.rounded-3' },
          { varName: '--psk-border-radius-xl', cls: '.rounded-4' },
          { varName: '--psk-border-radius-xxl', cls: '.rounded-5' },
          { varName: '--psk-border-radius-pill', cls: '.rounded-pill' },
        ]
          .map(
            ({ varName, cls }) => `
          <tr>
            <td><code class="small">var(${varName})</code></td>
            <td><code class="small">${cls}</code></td>
            <td><code class="small">${cssVar(varName)}</code></td>
            <td>
              <div
                style="width:56px;height:28px;background:var(--psk-primary);border-radius:var(${varName})"
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
      The keyboard focus indicator (DECISIONS.md #29). Bootstrap's ring, <code>$focus-ring-width</code> wide, in the brand
      at 50% (<code>$focus-ring-color</code>, 3.3:1 on white) instead of Bootstrap's 25%, which the near-black brand
      made invisible. A button's ring is a 2px gap in the page colour, then the button's own colour at 50%. In SCSS,
      <code>box-shadow: $focus-ring-box-shadow</code>; a focus room of <code>$focus-ring-width</code> keeps it from
      being cut by a box that scrolls.
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
          { name: '--psk-focus-ring-width', purpose: 'Ring width ($focus-ring-width)' },
          { name: '--psk-focus-ring-color', purpose: 'Ring colour: the brand at 50% ($focus-ring-color)' },
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

    <h6 class="mb-3">Tab to each control to see its ring</h6>
    <div class="d-flex gap-3 flex-wrap align-items-center">
      <button type="button" class="btn btn-primary">Primary button</button>
      <button type="button" class="btn btn-secondary">Secondary button</button>
      <button type="button" class="btn btn-destructive">Destructive button</button>
      <input class="form-control" style="max-width:14rem" placeholder="A field" aria-label="A field">
      <a href="#focus-ring">A link</a>
    </div>
  `,
};
