/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/utilities/background/

export default {
  title: 'Utilities/Background',
};

const swatch = (bgClass, label) => `
  <div class="border rounded overflow-hidden" style="min-width:160px">
    <div class="${bgClass}" style="height:64px"></div>
    <div class="px-2 py-1 bg-body border-top">
      <span class="small text-body-secondary">${label}</span>
    </div>
  </div>`;

// ── Native Bootstrap background utilities ────────────────────────────────────

const nativeThemeColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

const nativeSubtleColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

const rawBgColors = ['body', 'body-secondary', 'body-tertiary', 'black', 'white', 'transparent'];

export const Colors = {
  render: () => `
    <p class="small text-body-secondary mb-1">bg-*</p>
    <div class="d-flex flex-wrap gap-2 mb-3">
      ${nativeThemeColors.map((c) => swatch(`bg-${c}`, `.bg-${c}`)).join('')}
    </div>
    <p class="small text-body-secondary mb-1">bg-*-subtle</p>
    <div class="d-flex flex-wrap gap-2 mb-3">
      ${nativeSubtleColors.map((c) => swatch(`bg-${c}-subtle`, `.bg-${c}-subtle`)).join('')}
    </div>
    <p class="small text-body-secondary mb-1">bg-* (raw)</p>
    <div class="d-flex flex-wrap gap-2">
      ${rawBgColors.map((c) => swatch(`bg-${c}`, `.bg-${c}`)).join('')}
    </div>
  `,
};

export const Gradient = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${nativeThemeColors.map((c) => swatch(`bg-${c} bg-gradient`, `.bg-${c}.bg-gradient`)).join('')}
    </div>
  `,
};

export const Opacity = {
  render: () => `
    <div class="d-flex flex-wrap gap-3">
      ${[10, 25, 50, 75, 100]
        .map(
          (v) => `
        <div class="p-3 rounded border" style="min-width: 160px">
          <div class="bg-primary bg-opacity-${v} p-2 rounded text-center">
            <span class="small">.bg-opacity-${v}</span>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};

// ── Custom background utilities ───────────────────────────────────────────────

const paletteColors = ['red', 'yellow', 'amber', 'green', 'blue', 'oceanblue', 'purple'];
const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const Custom = {
  render: () => `
    <p class="small text-body-secondary mb-1">bg-*-subtle (custom)</p>
    <div class="d-flex flex-wrap gap-2 mb-3">
      ${['destructive', 'oceanblue', 'purple', 'amber'].map((c) => swatch(`bg-${c}-subtle`, `.bg-${c}-subtle`)).join('')}
    </div>
    <p class="small text-body-secondary mb-1">bg-{color} · bg-{color}-{step}</p>
    <div style="overflow-x:auto">
      <table class="table table-bordered table-sm text-center align-middle" style="min-width:640px;table-layout:fixed">
        <thead>
          <tr>
            <th style="width:56px"></th>
            ${paletteColors.map((c) => `<th class="small text-capitalize">${c}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="fw-semibold small">base</td>
            ${paletteColors.map((c) => `<td class="bg-${c}" style="height:40px"><span style="font-size:.65rem;opacity:.6;color:#fff">.bg-${c}</span></td>`).join('')}
          </tr>
          ${paletteSteps
            .map(
              (step) => `
            <tr>
              <td class="fw-semibold small">${step}</td>
              ${paletteColors.map((c) => `<td class="bg-${c}-${step}" style="height:40px"><span class="${step >= 500 ? 'text-white' : 'text-dark'}" style="font-size:.65rem;opacity:.6">.bg-${c}-${step}</span></td>`).join('')}
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `,
};
