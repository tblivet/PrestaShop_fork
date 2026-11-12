/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/icon-link/ with <twig:ui:Icon> (size lg, flipRtl on arrows) as the icon
import arrowBack from '../../../icons/material-symbols/arrow-back.svg?raw';
import arrowForward from '../../../icons/material-symbols/arrow-forward.svg?raw';
import chevronLeft from '../../../icons/material-symbols/chevron-left.svg?raw';
import download from '../../../icons/material-symbols/download.svg?raw';
import openInNew from '../../../icons/material-symbols/open-in-new.svg?raw';
import uiIcon from '../ui-icon';

const ICONS = { arrow_back: arrowBack, arrow_forward: arrowForward, chevron_left: chevronLeft, download, open_in_new: openInNew };
const DIRECTIONAL = ['arrow_back', 'arrow_forward', 'chevron_left'];
const icon = (name) => uiIcon(ICONS[name], { size: 'lg', flipRtl: DIRECTIONAL.includes(name) });

const COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

export default {
  title: 'Helpers/Icon Link',
  args: {
    color: 'primary',
    label: 'Icon link',
    icon: 'arrow_forward',
    hover: false,
  },
  argTypes: {
    color: { control: 'select', options: COLORS },
    label: { control: 'text' },
    icon: { control: 'select', options: Object.keys(ICONS) },
    hover: { control: 'boolean' },
  },
};

export const Default = {
  render: ({ color, label, icon: name, hover }) => `
    <a class="icon-link link-${color}${hover ? ' icon-link-hover' : ''}" href="#">
      ${label}
      ${icon(name)}
    </a>
  `,
};

export const WithHover = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <a class="icon-link icon-link-hover link-primary" href="#">
        Back to start
        ${icon('arrow_forward')}
      </a>
      <a class="icon-link icon-link-hover link-secondary" href="#">
        Learn more
        ${icon('open_in_new')}
      </a>
      <a class="icon-link icon-link-hover link-success" href="#">
        Download
        ${icon('download')}
      </a>
    </div>
  `,
};

export const IconBefore = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <a class="icon-link icon-link-hover link-primary" href="#">
        ${icon('arrow_back')}
        Back to PrestaShop
      </a>
      <a class="icon-link icon-link-hover link-secondary" href="#">
        ${icon('chevron_left')}
        Previous page
      </a>
    </div>
  `,
};

export const AllColors = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      ${COLORS.map(
        (color) => `
      <a class="icon-link link-${color}" href="#">
        ${color.charAt(0).toUpperCase() + color.slice(1)} link
        ${icon('arrow_forward')}
      </a>`
      ).join('')}
    </div>
  `,
};

// A long label wraps; the icon stays on the first line (_icon-link.scss)
export const Wrapping = {
  render: () => `
    <a class="icon-link icon-link-hover link-secondary small" href="#" style="max-width: 16rem">
      ${icon('arrow_back')}
      Back to Maison Dupont et Fils - Épicerie fine artisanale depuis 1887
    </a>
  `,
};
