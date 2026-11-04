/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/icon-link/

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
    icon: { control: 'text' },
    hover: { control: 'boolean' },
  },
};

export const Default = {
  render: ({ color, label, icon, hover }) => `
    <a class="icon-link link-${color}${hover ? ' icon-link-hover' : ''}" href="#">
      ${label}
      <i class="material-symbols-outlined" aria-hidden="true">${icon}</i>
    </a>
  `,
};

export const WithHover = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <a class="icon-link icon-link-hover link-primary" href="#">
        Back to start
        <i class="material-symbols-outlined" aria-hidden="true">arrow_forward</i>
      </a>
      <a class="icon-link icon-link-hover link-secondary" href="#">
        Learn more
        <i class="material-symbols-outlined" aria-hidden="true">open_in_new</i>
      </a>
      <a class="icon-link icon-link-hover link-success" href="#">
        Download
        <i class="material-symbols-outlined" aria-hidden="true">download</i>
      </a>
    </div>
  `,
};

export const IconBefore = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <a class="icon-link icon-link-hover link-primary" href="#">
        <i class="material-symbols-outlined" aria-hidden="true">arrow_back</i>
        Back to PrestaShop
      </a>
      <a class="icon-link icon-link-hover link-secondary" href="#">
        <i class="material-symbols-outlined" aria-hidden="true">chevron_left</i>
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
        <i class="material-symbols-outlined" aria-hidden="true">arrow_forward</i>
      </a>`
      ).join('')}
    </div>
  `,
};

// A long label wraps; the icon stays on the first line (_icon-link.scss)
export const Wrapping = {
  render: () => `
    <a class="icon-link icon-link-hover link-secondary small" href="#" style="max-width: 16rem">
      <i class="material-symbols-outlined" aria-hidden="true">arrow_back</i>
      Back to Maison Dupont et Fils - Épicerie fine artisanale depuis 1887
    </a>
  `,
};
