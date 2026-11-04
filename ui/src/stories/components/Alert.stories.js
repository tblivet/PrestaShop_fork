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
          'Props: `type` (variant), `dismissible`, `icon` (ux:icon name). No outer margin: a layout spaces alerts. Long words break inside the box; links in the message take the alert link color.',
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

// Same rule as alert.html.twig: only a danger alert interrupts screen readers.
const role = (variant) => (variant === 'danger' ? 'alert' : 'status');

export const Default = {
  render: ({ variant, message, dismissible }) => `
    <div class="ps-alert alert alert-${variant}${dismissible ? ' alert-dismissible fade show' : ''}" role="${role(variant)}">
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
          (v) => `<div class="ps-alert alert alert-${v}" role="${role(v)}">A simple <strong>${v}</strong> alert — check it out!</div>`
        )
        .join('')}
    </div>
  `,
};

export const WithIcon = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      <div class="ps-alert alert alert-info d-flex align-items-start gap-2" role="status">
        ${uxIcon(infoCircleFill, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
        <div class="ps-alert__content">An example alert with an icon</div>
      </div>
      <div class="ps-alert alert alert-success d-flex align-items-start gap-2" role="status">
        ${uxIcon(checkCircleFill, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
        <div class="ps-alert__content">A success alert with an icon</div>
      </div>
      <div class="ps-alert alert alert-warning d-flex align-items-start gap-2" role="status">
        ${uxIcon(exclamationTriangleFill, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
        <div class="ps-alert__content">A warning alert with an icon</div>
      </div>
      <div class="ps-alert alert alert-danger d-flex align-items-start gap-2" role="alert">
        ${uxIcon(xCircleFill, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
        <div class="ps-alert__content">A danger alert with an icon</div>
      </div>
      <div class="ps-alert alert alert-warning d-flex align-items-start gap-2 w-50" role="status">
        ${uxIcon(exclamationTriangleFill, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
        <div class="ps-alert__content">A long warning that wraps on several lines keeps its icon on the first line.</div>
      </div>
      <div class="ps-alert alert alert-warning d-flex align-items-start gap-2" style="max-width: 18rem" role="status">
        ${uxIcon(exclamationTriangleFill, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
        <div class="ps-alert__content">Rename the /admin folder, for example to <code>admin482k3j9x2qv8mzt0wpl/</code>. A long word breaks inside the box. <a href="#">A link</a> takes the alert color.</div>
      </div>
    </div>
  `,
};

export const Dismissible = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      <div class="ps-alert alert alert-warning alert-dismissible fade show" role="status">
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="ps-alert alert alert-success alert-dismissible fade show" role="status">
        <strong>Well done!</strong> You successfully read this important alert message.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="ps-alert alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  `,
};
