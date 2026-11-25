/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/ratio/
export default {
  title: 'Helpers/Ratio',
};

const ratioBox = (cls, label) => `
  <div>
    <p class="small text-body-secondary mb-1"><code>.ratio .${cls}</code> — ${label}</p>
    <div class="ratio ${cls} bg-body-secondary border rounded" style="max-width:240px;">
      <div class="d-flex align-items-center justify-content-center text-body-secondary small">${label}</div>
    </div>
  </div>
`;

export const AllRatios = {
  render: () => `
    <div class="d-flex flex-wrap gap-4">
      ${ratioBox('ratio-1x1', '1×1')}
      ${ratioBox('ratio-4x3', '4×3')}
      ${ratioBox('ratio-16x9', '16×9')}
      ${ratioBox('ratio-21x9', '21×9')}
    </div>
  `,
};

export const CustomRatio = {
  render: () => `
    <p class="text-body-secondary small mb-3">Custom ratio via <code>--psk-aspect-ratio</code> CSS variable.</p>
    <div class="ratio bg-body-secondary border rounded" style="--psk-aspect-ratio:75%;max-width:240px;">
      <div class="d-flex align-items-center justify-content-center text-body-secondary small">4×3 custom (75%)</div>
    </div>
  `,
};
