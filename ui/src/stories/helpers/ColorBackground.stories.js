/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/color-background/
// text-bg-* sets both background-color AND a foreground color with sufficient
// contrast automatically — no need to pair bg-* + text-* manually.
export default {
  title: 'Helpers/Color & Background',
};

const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

export const TextBg = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${variants
        .map(
          (v) => `
        <span class="p-3 rounded text-bg-${v}">.text-bg-${v}</span>
      `
        )
        .join('')}
    </div>
  `,
};

export const OnCards = {
  render: () => `
    <div class="d-flex flex-wrap gap-3">
      ${variants
        .map(
          (v) => `
        <div class="card text-bg-${v}" style="max-width:180px;">
          <div class="card-body">
            <h6 class="card-title">.text-bg-${v}</h6>
            <p class="card-text small">Text color is chosen automatically for contrast.</p>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};

export const OnBadges = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${variants.map((v) => `<span class="badge text-bg-${v}">${v}</span>`).join('')}
    </div>
  `,
};

export const VsManualPairing = {
  render: () => `
    <p class="text-body-secondary small mb-3">
      <code>text-bg-*</code> vs manual <code>bg-* text-*</code> pairing — same result, less markup.
    </p>
    <div class="d-flex flex-wrap gap-2 mb-2">
      <span class="p-2 rounded text-bg-primary">text-bg-primary</span>
      <span class="p-2 rounded bg-primary text-white">bg-primary text-white (manual)</span>
    </div>
    <div class="d-flex flex-wrap gap-2">
      <span class="p-2 rounded text-bg-warning">text-bg-warning</span>
      <span class="p-2 rounded bg-warning text-dark">bg-warning text-dark (manual)</span>
    </div>
  `,
};
