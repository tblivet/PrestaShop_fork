/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// ps-scroll-fade (_scroll-fade.scss) and its behaviour (scroll-fade.js): a box that scrolls fades the ends that hide content.

const chips = (count) => Array.from({ length: count }, (_, index) => `<span class="badge ps-badge ps-badge--oceanblue">Filter ${index + 1}</span>`).join('');
const lines = Array.from({ length: 20 }, (_, index) => `<li>Line ${index + 1}</li>`).join('');

// Story chrome: a bordered frame, so the borders can be seen not to fade
const frame = 'border: 1px solid var(--psk-border-color); padding: .5rem;';

export default {
  title: 'Helpers/Scroll Fade',
  parameters: {
    docs: {
      description: {
        component: [
          '**Markup**: `class="ps-scroll-fade ps-scroll-fade--x"` (sideways) or `ps-scroll-fade--y` (up and down), with `data-ps-action="scroll-fade"`, on the box that scrolls; the modifier also makes it scroll on its axis. Give it a size that makes it overflow (a `max-height`, a row that does not wrap).',
          '**Behaviour**: an end fades out while content is hidden there and fades back in once scrolled to it, so nothing stays covered; at the start, no fade before anything is scrolled. A mask, not a coloured layer: it works on any background, and the box\'s own borders never fade. `scroll-fade.js` sets `data-ps-state` (`more-before`, `more-after`) on scroll, resize and content change, RTL included; boxes added later are watched too.',
          '**Size**: `--psk-scroll-fade-size` (default `1.5rem`) on the box or its block (the side menu uses `2rem`).',
          '**Used by**: the notification filters (x) and list (y), the side menu (y).',
        ].join('\n\n'),
      },
    },
  },
};

export const Sideways = {
  render: () => `<div class="ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" style="${frame} display: flex; gap: .25rem; max-width: 20rem; white-space: nowrap;">${chips(12)}</div>`,
  parameters: { docs: { description: { story: 'Scroll sideways: the start fades in once scrolled, the end fades out at the last chip.' } } },
};

export const UpAndDown = {
  render: () => `<ul class="ps-scroll-fade ps-scroll-fade--y" data-ps-action="scroll-fade" style="${frame} max-height: 12rem; max-width: 20rem; margin: 0;">${lines}</ul>`,
  parameters: { docs: { description: { story: 'Scroll down: the top fades in, the bottom fades out at the last line.' } } },
};

export const FitsWithoutScrolling = {
  render: () => `<div class="ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" style="${frame} display: flex; gap: .25rem; max-width: 20rem;">${chips(3)}</div>`,
  parameters: { docs: { description: { story: 'Nothing hidden: no fade at all.' } } },
};
