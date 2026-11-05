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

const ICONS = {
  none: null,
  'bi:info-circle-fill': infoCircleFill,
  'bi:check-circle-fill': checkCircleFill,
  'bi:exclamation-triangle-fill': exclamationTriangleFill,
  'bi:x-circle-fill': xCircleFill,
};

// Same rule as alert.html.twig: only a danger alert interrupts screen readers.
const role = (type) => (type === 'danger' ? 'alert' : 'status');

// The markup of alert.html.twig for the given props; the content is the component's content block
const alert = ({ type, icon, dismissible, content }) => {
  const iconSvg = ICONS[icon] ?? null;
  const classes = ['ps-alert', 'alert', `alert-${type}`];
  if (dismissible) classes.push('alert-dismissible', 'fade', 'show');
  if (iconSvg) classes.push('d-flex', 'align-items-start', 'gap-2');

  return `
    <div class="${classes.join(' ')}" role="${role(type)}">
      ${iconSvg ? `${uxIcon(iconSvg, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}<div class="ps-alert__content">${content}</div>` : content}
      ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
    </div>`;
};

export default {
  title: 'Components/Alert',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Alert type="danger" icon="bi:x-circle-fill" dismissible>…message…</twig:ui:Alert>`. The content block is the message: text, a list, links; there is no title prop, emphasise a first sentence with `<strong>` in the message.',
          '**Props**: `type` (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`; default `info`), `icon` (a ux:icon name from `ui/icons`, e.g. `bi:x-circle-fill`; default none), `dismissible` (default `false`). Other attributes (`id`, `data-ps-*`, `aria-*`) go on the alert.',
          '**Do**: let a layout or `<twig:ui:FlashMessages>` space alerts (the alert has no outer margin); use `danger` only for errors, it is the only type announced at once (`role="alert"`). **Don\'t**: add margins or `.alert-link` by hand: links in the message take the alert link color.',
          '**States**: each type, with and without icon, dismissible, long text wrapping with its icon on the first line, a long unbreakable word (path, token) breaking inside the box, a link and `<code>` in the message, a first sentence in `<strong>`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Bootstrap contextual type',
    },
    icon: {
      control: 'select',
      options: Object.keys(ICONS),
      description: 'ux:icon name, none by default',
    },
    dismissible: { control: 'boolean', description: 'Close button' },
    content: { control: 'text', description: 'The content block (HTML)' },
  },
  args: {
    type: 'info',
    icon: 'none',
    dismissible: false,
    content: 'A simple alert — check it out!',
  },
};

export const Default = { render: (args) => alert(args) };

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

// A flash message whose first sentence is its point, in <strong> (LoginController's "Check your inbox.")
export const StrongFirstSentence = {
  render: () => alert({
    type: 'info',
    icon: 'bi:info-circle-fill',
    dismissible: true,
    content: '<p class="mb-0"><strong>Check your inbox.</strong><br/>If an account exists for this email address, you\'ll receive a link to reset your password. You can request a new link every 6 hours.</p>',
  }),
};

