/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens — spacing scale
// Based on $spacer: 1rem · steps 0–5 compiled in Bootstrap utility classes
// https://getbootstrap.com/docs/5.3/utilities/spacing/
// ⚠ Keep in sync with _variables.scss if $spacer or $spacers map is overridden.

export default {
  title: 'Design Tokens/Spacing',
};

function measureSpacing(cls) {
  const el = document.createElement('div');
  el.className = cls;
  el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden';
  document.body.appendChild(el);
  const val = getComputedStyle(el).paddingTop;
  document.body.removeChild(el);
  return val;
}

const spacers = [0, 1, 2, 3, 4, 5];

export const SpacingScale = {
  name: 'Spacing Scale',
  render: () => {
    const rows = spacers.map((n) => {
      const computed = measureSpacing(`p-${n}`);
      const px = parseInt(computed, 10);
      const remApprox = px / 16;
      return { n, px, remApprox };
    });

    const maxPx = Math.max(...rows.map((r) => r.px));

    return `
      <p class="text-body-secondary small mb-2">
        Bootstrap spacing is compiled from <code>$spacer: 1rem</code> and the
        <code>$spacers</code> map. Values are <strong>not</strong> exposed as CSS
        custom properties — apply them only through utility classes
        (<code>m-{n}</code>, <code>p-{n}</code>, <code>gap-{n}</code>) or
        Bootstrap's spacing SCSS mixins.
      </p>
      <p class="text-body-secondary small mb-4">
        Pixel values are measured from the compiled CSS at the current viewport
        font size (<code>1rem = ${parseInt(measureSpacing('p-3'), 10) / 1}px</code> root).
      </p>

      <table class="table table-bordered align-middle mb-4">
        <thead class="table-light">
          <tr>
            <th style="width:60px">Step</th>
            <th style="width:80px">px</th>
            <th style="width:90px">rem (÷16)</th>
            <th>Visual scale</th>
            <th>Example classes</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ({ n, px, remApprox }) => `
            <tr>
              <td class="fw-semibold">${n}</td>
              <td><code class="small">${px}px</code></td>
              <td><code class="small">${remApprox}rem</code></td>
              <td>
                <div style="height:8px;width:${maxPx > 0 ? Math.round((px / maxPx) * 240) : 2}px;min-width:${px > 0 ? 4 : 2}px;background:var(--bs-primary)"></div>
              </td>
              <td class="small"><code>m-${n} p-${n} gap-${n} mb-${n}</code></td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>

      <h6 class="mb-3">Spacing in practice</h6>
      <div class="d-flex flex-wrap gap-3">
        ${rows
          .filter((r) => r.n > 0)
          .map(
            ({ n, px }) => `
          <div>
            <div
              class="bg-primary-subtle border border-primary-subtle"
              style="display:inline-block;padding:var(--bs-spacer, 1rem);padding:0"
            >
              <div class="bg-primary p-${n}" style="min-width:40px;min-height:40px"></div>
            </div>
            <code class="small d-block text-center mt-1">.p-${n} (${px}px)</code>
          </div>`
          )
          .join('')}
      </div>
    `;
  },
};

// ── Gap & layout spacing ───────────────────────────────────────────────────────

export const GapScale = {
  name: 'Gap Scale',
  render: () => {
    const gaps = [0, 1, 2, 3, 4, 5];
    return `
      <p class="text-body-secondary small mb-4">
        The same spacing scale applies to <code>gap-{n}</code> in flex/grid layouts.
        Use <code>.d-flex.gap-{n}</code> or <code>.d-grid.gap-{n}</code>.
      </p>
      ${gaps
        .map(
          (n) => `
        <div class="mb-3">
          <code class="small d-block mb-1">.gap-${n}</code>
          <div class="d-flex gap-${n}">
            ${[1, 2, 3, 4].map(() => `<div class="bg-primary" style="width:48px;height:32px"></div>`).join('')}
          </div>
        </div>`
        )
        .join('')}
    `;
  },
};
