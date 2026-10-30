/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/alerts/
import checkCircleFill from '../../../icons/bi/check-circle-fill.svg?raw';
import exclamationTriangleFill from '../../../icons/bi/exclamation-triangle-fill.svg?raw';
import infoCircleFill from '../../../icons/bi/info-circle-fill.svg?raw';
import xCircleFill from '../../../icons/bi/x-circle-fill.svg?raw';
import uxIcon from '../ux-icon';
// Twig: <twig:ui:Alert> (src/PrestaShopBundle/Twig/Component/Ui/Alert.php) renders this markup, keep both in sync.

export default {
  title: 'Components/Alert',
  parameters: {
    docs: {
      description: {
        component:
          'Back office: `<twig:ui:Alert type="danger" icon="bi:x-circle-fill" dismissible>…</twig:ui:Alert>`. ' +
          'Props: `type` (variant), `dismissible`, `icon` (ux:icon name).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Bootstrap contextual variant',
    },
    message: {
      control: 'text',
      description: 'Alert message content',
    },
    dismissible: {
      control: 'boolean',
      description: 'Show dismiss button',
    },
  },
  args: {
    variant: 'primary',
    message: 'A simple alert — check it out!',
    dismissible: false,
  },
};

export const Default = {
  render: ({ variant, message, dismissible }) => `
    <div class="alert alert-${variant}${dismissible ? ' alert-dismissible fade show' : ''}" role="alert">
      ${message}
      ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
    </div>
  `,
};

export const AllVariants = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      ${['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
        .map(
          (v) => `<div class="alert alert-${v}" role="alert">A simple <strong>${v}</strong> alert — check it out!</div>`
        )
        .join('')}
    </div>
  `,
};

export const WithIcon = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      <div class="alert alert-info d-flex align-items-center gap-2" role="alert">
        ${uxIcon(infoCircleFill, { width: 16, height: 16, class: 'flex-shrink-0', 'aria-hidden': 'true' })}
        <div>An example alert with an icon</div>
      </div>
      <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
        ${uxIcon(checkCircleFill, { width: 16, height: 16, class: 'flex-shrink-0', 'aria-hidden': 'true' })}
        <div>A success alert with an icon</div>
      </div>
      <div class="alert alert-warning d-flex align-items-center gap-2" role="alert">
        ${uxIcon(exclamationTriangleFill, { width: 16, height: 16, class: 'flex-shrink-0', 'aria-hidden': 'true' })}
        <div>A warning alert with an icon</div>
      </div>
      <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
        ${uxIcon(xCircleFill, { width: 16, height: 16, class: 'flex-shrink-0', 'aria-hidden': 'true' })}
        <div>A danger alert with an icon</div>
      </div>
    </div>
  `,
};

export const Dismissible = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Well done!</strong> You successfully read this important alert message.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  `,
};
