/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/badge/

export default {
  title: 'Components/Badge',
  argTypes: {
    text: {
      control: 'text',
      description: 'Badge label',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Bootstrap contextual variant',
    },
    pill: {
      control: 'boolean',
      description: 'Render as pill (rounded-pill)',
    },
  },
  args: {
    text: 'Badge',
    variant: 'primary',
    pill: false,
  },
};

export const Default = {
  render: ({ text, variant, pill }) => `
    <span class="badge text-${variant}-emphasis bg-${variant}-subtle${pill ? ' rounded-pill' : ''}">${text}</span>
  `,
};

export const AllVariants = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
        .map(
          (v) =>
            `<span class="badge text-${v}-emphasis bg-${v}-subtle">${v.charAt(0).toUpperCase() + v.slice(1)}</span>`
        )
        .join('')}
    </div>
  `,
};

export const Pill = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
        .map(
          (v) =>
            `<span class="badge rounded-pill text-${v}-emphasis bg-${v}-subtle">${v.charAt(0).toUpperCase() + v.slice(1)}</span>`
        )
        .join('')}
    </div>
  `,
};

export const Counter = {
  render: () => `
    <div class="d-flex flex-wrap align-items-center gap-2">
      <span class="badge badge-counter text-bg-danger">3</span>
      <span class="badge badge-counter text-bg-danger">12</span>
      <span class="badge badge-counter text-bg-danger">99+</span>
      <span class="badge badge-counter text-bg-danger">1234</span>
      <span class="badge badge-counter text-bg-primary">7</span>
      <span class="badge badge-counter bg-success-subtle text-success-emphasis">24</span>
    </div>
  `,
};

export const InContext = {
  render: () => `
    <div class="d-flex flex-column gap-4">
      <div>
        <h4>Heading with badge
          <span class="badge text-primary-emphasis bg-primary-subtle">New</span>
        </h4>
        <h5>h5 heading <span class="badge text-primary-emphasis bg-primary-subtle">New</span></h5>
        <h6>h6 heading <span class="badge text-primary-emphasis bg-primary-subtle">New</span></h6>
      </div>
    </div>
  `,
};
