/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/utilities/colors/
import { inkOn, token } from '../design-tokens/color-swatch';

export default {
  title: 'Utilities/Colors',
};

const colorFamilies = ['red', 'yellow', 'amber', 'green', 'blue', 'oceanblue', 'purple', 'gray'];

const colorSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const ColorPalette = {
  render: () => `
    <div style="overflow-x:auto">
      <table class="table table-bordered table-sm text-center align-middle small" style="min-width:720px;table-layout:fixed">
        <thead>
          <tr>
            <th></th>
            ${colorFamilies.map((c) => `<th class="text-capitalize">${c}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${colorSteps
            .map(
              (step) => `
            <tr>
              <td class="fw-semibold">${step}</td>
              ${colorFamilies
                .map(
                  (color) => `
                <td style="background-color:var(${token(`${color}-${step}`)});height:48px">
                  <span style="color:${inkOn(`var(${token(`${color}-${step}`)})`)};font-size:.7rem">${step}</span>
                </td>`
                )
                .join('')}
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `,
};

// ── Native Bootstrap text utilities ──────────────────────────────────────────

const nativeTextColors = [
  'primary',
  'primary-emphasis',
  'secondary',
  'secondary-emphasis',
  'success',
  'success-emphasis',
  'danger',
  'danger-emphasis',
  'warning',
  'warning-emphasis',
  'info',
  'info-emphasis',
  'light',
  'dark',
  'body',
  'body-emphasis',
  'body-secondary',
  'body-tertiary',
  'black',
  'white',
];

// text-bg-* applies both background and a contrasting text color automatically.
const nativeTextBgColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

export const TextColors = {
  render: () => `
    <div>
      ${nativeTextColors.map((c) => `<p class="text-${c}${c === 'white' || c === 'light' ? ' bg-dark p-1' : ''}">.text-${c}</p>`).join('')}
    </div>
  `,
};

export const TextBg = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${nativeTextBgColors
        .map(
          (c) => `
        <div class="p-3 text-bg-${c} border" style="min-width:140px">
          <small>.text-bg-${c}</small>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};

// ── Custom text utilities ─────────────────────────────────────────────────────

const paletteColors = ['red', 'yellow', 'amber', 'green', 'blue', 'oceanblue', 'purple'];
const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const Custom = {
  render: () => `
    <p class="small text-body-secondary mb-1">text-{color} · text-{color}-{step}</p>
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
            ${paletteColors.map((c) => `<td style="height:40px"><span class="text-${c} fw-semibold" style="font-size:.75rem">.text-${c}</span></td>`).join('')}
          </tr>
          ${paletteSteps
            .map(
              (step) => `
            <tr>
              <td class="fw-semibold small">${step}</td>
              ${paletteColors.map((c) => `<td style="height:40px"><span class="text-${c}-${step} fw-semibold" style="font-size:.75rem">.text-${c}-${step}</span></td>`).join('')}
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `,
};

export const LinkColors = {
  render: () => `
    <div>
      ${['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'body-emphasis'].map((c) => `<p><a href="#" class="link-${c}${c === 'light' ? ' bg-dark p-1' : ''}">.link-${c}</a></p>`).join('')}
    </div>
  `,
};

export const ColorOpacity = {
  render: () => `
    <div>
      <p class="text-primary">Default primary text</p>
      <p class="text-primary text-opacity-75">75% opacity primary text</p>
      <p class="text-primary text-opacity-50">50% opacity primary text</p>
      <p class="text-primary text-opacity-25">25% opacity primary text</p>

      <p class="text-success">Default success text</p>
      <p class="text-success text-opacity-75">75% opacity success text</p>
      <p class="text-success text-opacity-50">50% opacity success text</p>
      <p class="text-success text-opacity-25">25% opacity success text</p>
    </div>
  `,
};
