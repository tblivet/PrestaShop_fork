/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens — typography variables
// Source: src/scss/_variables.scss
// https://getbootstrap.com/docs/5.3/content/typography/
// ⚠ Keep in sync with _variables.scss whenever font or type tokens change.

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';

export default {
  title: 'Design Tokens/Typography',
};

// ── Font families ──────────────────────────────────────────────────────────────

export const FontFamilies = {
  name: 'Font Families',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Font family CSS variables available at <code>:root</code>.
      <code>--bs-body-font-family</code> is the compiled result of
      <code>$font-family-sans-serif</code> (IBM Plex Sans with system fallbacks).
    </p>
    <table class="table table-bordered align-middle">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Resolved value</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        ${[
          {
            varName: '--bs-body-font-family',
            label: 'Body / sans-serif',
            sample: 'The quick brown fox jumps over the lazy dog. 0123456789',
          },
          {
            varName: '--bs-font-sans-serif',
            label: 'Sans-serif stack (Bootstrap alias)',
            sample: 'The quick brown fox jumps over the lazy dog. 0123456789',
          },
          {
            varName: '--bs-font-monospace',
            label: 'Monospace',
            sample: "const token = 'var(--bs-primary)'; // #1d1d1b",
          },
        ]
          .map(
            ({ varName, label, sample }) => `
          <tr>
            <td>
              <code class="small d-block">var(${varName})</code>
              <small class="text-body-secondary">${label}</small>
            </td>
            <td><code class="small">${cssVar(varName)}</code></td>
            <td style="font-family:var(${varName})">${sample}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  `,
};

// ── Body tokens ────────────────────────────────────────────────────────────────

export const BodyTokens = {
  name: 'Body Tokens',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Global body-level CSS variables defined by Bootstrap at <code>:root</code>.
      These drive the base typographic rhythm and switch automatically in dark mode.
    </p>
    <table class="table table-bordered table-sm align-middle">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Resolved value</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { name: '--bs-body-font-family', purpose: 'Default font stack for all body text' },
          { name: '--bs-body-font-size', purpose: 'Base font size (1rem = 16px at browser default)' },
          { name: '--bs-body-font-weight', purpose: 'Default text weight (400 = regular)' },
          { name: '--bs-body-line-height', purpose: 'Default line height (1.5)' },
          { name: '--bs-body-color', purpose: 'Default text color — adapts in dark mode' },
          { name: '--bs-body-bg', purpose: 'Default background color — adapts in dark mode' },
          { name: '--bs-emphasis-color', purpose: 'High-contrast text (headings, labels)' },
          { name: '--bs-secondary-color', purpose: 'Muted / helper text color' },
          { name: '--bs-tertiary-color', purpose: 'Very muted text (placeholders)' },
          { name: '--bs-heading-color', purpose: 'Heading color (inherits from body by default)' },
          { name: '--bs-link-color', purpose: 'Anchor tag default color' },
          { name: '--bs-link-hover-color', purpose: 'Anchor tag hover color' },
          { name: '--bs-code-color', purpose: 'Inline <code> element color' },
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
  `,
};

// ── Type scale ─────────────────────────────────────────────────────────────────

export const TypeScale = {
  name: 'Type Scale',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Heading and body type hierarchy. Sizes are compiled from
      <code>$font-size-base × scale</code> in <code>src/scss/_variables.scss</code>
      and are <strong>not</strong> exposed as CSS custom properties.
      Apply with semantic tags or the <code>.h1</code>–<code>.h6</code> utility classes.
    </p>
    <table class="table table-bordered align-middle">
      <thead class="table-light">
        <tr>
          <th style="width:80px">Level</th>
          <th style="width:110px">Compiled size</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>h1</code></td><td><code class="small">2.5rem</code></td><td><h1 class="mb-0">Heading 1</h1></td></tr>
        <tr><td><code>h2</code></td><td><code class="small">2rem</code></td><td><h2 class="mb-0">Heading 2</h2></td></tr>
        <tr><td><code>h3</code></td><td><code class="small">1.75rem</code></td><td><h3 class="mb-0">Heading 3</h3></td></tr>
        <tr><td><code>h4</code></td><td><code class="small">1.5rem</code></td><td><h4 class="mb-0">Heading 4</h4></td></tr>
        <tr><td><code>h5</code></td><td><code class="small">1.25rem</code></td><td><h5 class="mb-0">Heading 5</h5></td></tr>
        <tr><td><code>h6</code></td><td><code class="small">1rem</code></td><td><h6 class="mb-0">Heading 6</h6></td></tr>
        <tr>
          <td><code>p</code></td>
          <td><code class="small">1rem</code></td>
          <td>Body text — default paragraph size for all running copy in the UI.</td>
        </tr>
        <tr>
          <td><code>.lead</code></td>
          <td><code class="small">1.25rem</code></td>
          <td><p class="lead mb-0">Lead paragraph — introductory or prominent copy.</p></td>
        </tr>
        <tr>
          <td><code>small</code></td>
          <td><code class="small">0.875em</code></td>
          <td><small>Small text — helper text, labels, captions.</small></td>
        </tr>
      </tbody>
    </table>
  `,
};

// ── Font weights ───────────────────────────────────────────────────────────────

export const FontWeights = {
  name: 'Font Weights',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Font weight CSS variables exposed at <code>:root</code> in
      <code>src/scss/_custom.scss</code>, seeded from Bootstrap's
      <code>$font-weight-*</code> Sass variables. IBM Plex Sans supports
      weights <strong>100–700</strong>.
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
          { varName: '--bs-font-weight-lighter', cls: 'fw-lighter', note: 'relative' },
          { varName: '--bs-font-weight-light', cls: 'fw-light' },
          { varName: '--bs-font-weight-normal', cls: 'fw-normal' },
          { varName: '--bs-font-weight-medium', cls: 'fw-medium' },
          { varName: '--bs-font-weight-semibold', cls: 'fw-semibold' },
          { varName: '--bs-font-weight-bold', cls: 'fw-bold' },
          { varName: '--bs-font-weight-bolder', cls: 'fw-bolder', note: 'relative' },
        ]
          .map(
            ({ varName, cls, note }) => `
          <tr>
            <td>
              <code class="small">var(${varName})</code>
              ${note ? `<br><small class="text-body-secondary">${note} — inherits from parent</small>` : ''}
            </td>
            <td><code class="small">.${cls}</code></td>
            <td><code class="small">${cssVar(varName)}</code></td>
            <td style="font-weight:var(${varName})">The quick brown fox</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

  `,
};
