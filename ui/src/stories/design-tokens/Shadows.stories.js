/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens — box shadow variables
// https://getbootstrap.com/docs/5.3/utilities/shadows/
// ⚠ Keep in sync with _variables.scss whenever shadow tokens change.

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';

export default {
  title: 'Design Tokens/Shadows',
};

const shadows = [
  {
    varName: '--bs-box-shadow-sm',
    utilityClass: '.shadow-sm',
    label: 'Small',
    usage: 'Subtle lift — inline cards, tags, small surfaces',
  },
  {
    varName: '--bs-box-shadow',
    utilityClass: '.shadow',
    label: 'Default',
    usage: 'Standard elevation — dropdowns, popovers, cards',
  },
  {
    varName: '--bs-box-shadow-lg',
    utilityClass: '.shadow-lg',
    label: 'Large',
    usage: 'High elevation — modals, drawers, large overlays',
  },
  {
    varName: '--bs-box-shadow-inset',
    utilityClass: '.shadow-none',
    label: 'Inset',
    usage: 'Pressed / sunken state — inputs on focus, well surfaces',
  },
];

export const BoxShadows = {
  name: 'Box Shadows',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Bootstrap's four box shadow CSS variables. Use
      <code>var(--bs-box-shadow)</code> etc. in custom component SCSS, or apply
      the utility classes directly. The <code>inset</code> variant has no
      dedicated utility class — set it via the CSS variable.
    </p>

    <div class="d-flex flex-wrap gap-4 mb-5">
      ${shadows
        .map(
          ({ varName, label }) => `
        <div class="text-center">
          <div
            class="bg-body d-flex align-items-center justify-content-center"
            style="width:140px;height:90px;box-shadow:var(${varName});border:1px solid var(--bs-border-color)"
          ></div>
          <code class="small d-block mt-2">${label}</code>
        </div>`
        )
        .join('')}
    </div>

    <table class="table table-bordered table-sm align-middle">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Utility class</th>
          <th>Resolved value</th>
          <th>Typical use</th>
        </tr>
      </thead>
      <tbody>
        ${shadows
          .map(
            ({ varName, utilityClass, label, usage }) => `
          <tr>
            <td><code class="small">var(${varName})</code></td>
            <td><code class="small">${utilityClass}</code></td>
            <td><code class="small">${cssVar(varName)}</code></td>
            <td class="small text-body-secondary">${usage}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

  `,
};
