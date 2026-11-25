/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/utilities/borders/

export default {
  title: 'Utilities/Borders',
};

const box = (cls, label) =>
  `<div class="${cls} bg-body-secondary d-inline-flex align-items-center justify-content-center" style="width:80px;height:80px;font-size:0.7rem">${label || cls.replace('border', '').trim() || 'border'}</div>`;

export const Additive = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 align-items-start">
      ${box('border', 'border')}
      ${box('border-top', 'border-top')}
      ${box('border-end', 'border-end')}
      ${box('border-bottom', 'border-bottom')}
      ${box('border-start', 'border-start')}
    </div>
  `,
};

export const Subtractive = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 align-items-start">
      ${box('border border-0', 'border-0')}
      ${box('border border-top-0', 'border-top-0')}
      ${box('border border-end-0', 'border-end-0')}
      ${box('border border-bottom-0', 'border-bottom-0')}
      ${box('border border-start-0', 'border-start-0')}
    </div>
  `,
};

// ── Native Bootstrap border color utilities ───────────────────────────────────

const nativeBorderColors = [
  'primary',
  'primary-subtle',
  'secondary',
  'secondary-subtle',
  'success',
  'success-subtle',
  'danger',
  'danger-subtle',
  'warning',
  'warning-subtle',
  'info',
  'info-subtle',
  'light',
  'dark',
  'black',
  'white',
];

export const Color = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 align-items-start">
      ${nativeBorderColors.map((c) => box(`border border-${c}`, `.border-${c}`)).join('')}
    </div>
  `,
};

// ── Custom border color utilities ─────────────────────────────────────────────

const paletteColors = ['red', 'yellow', 'amber', 'green', 'blue', 'oceanblue', 'purple'];
const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const Custom = {
  render: () => `
    <p class="small text-body-secondary mb-1">border-{color} · border-{color}-{step}</p>
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
            ${paletteColors.map((c) => `<td style="height:40px;border-bottom:3px solid var(--psk-${c}-500)"><span style="font-size:.65rem">.border-${c}</span></td>`).join('')}
          </tr>
          ${paletteSteps
            .map(
              (step) => `
            <tr>
              <td class="fw-semibold small">${step}</td>
              ${paletteColors.map((c) => `<td style="height:40px;border-bottom:3px solid var(--psk-${c}-${step})"><span style="font-size:.65rem">.border-${c}-${step}</span></td>`).join('')}
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `,
};

export const Width = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 align-items-start">
      ${[1, 2, 3, 4, 5].map((w) => `<div class="border border-${w} border-primary bg-body-secondary d-inline-flex align-items-center justify-content-center" style="width:80px;height:80px;font-size:0.7rem">border-${w}</div>`).join('')}
    </div>
  `,
};

// Corners are square (radius tokens 0, Design Tokens/Borders): only the circle and the pill are round
export const Radius = {
  render: () => `
    <p class="small text-body-secondary">Square corners: <code>.rounded</code>, <code>.rounded-{side}</code> and <code>.rounded-{1…5}</code> are 0. Only <code>.rounded-circle</code> (avatars) and <code>.rounded-pill</code> (pill badges, counters) are round.</p>
    <div class="d-flex flex-wrap gap-3 align-items-center">
      <div class="bg-primary rounded" style="width:80px;height:80px"></div>
      <div class="bg-info rounded-circle" style="width:80px;height:80px"></div>
      <div class="bg-dark rounded-pill" style="width:120px;height:60px"></div>
    </div>
  `,
};
