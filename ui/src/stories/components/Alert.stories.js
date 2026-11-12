/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/alerts/
import cancelFill from '../../../icons/material-symbols/cancel-fill.svg?raw';
import checkCircleFill from '../../../icons/material-symbols/check-circle-fill.svg?raw';
import infoFill from '../../../icons/material-symbols/info-fill.svg?raw';
import warningFill from '../../../icons/material-symbols/warning-fill.svg?raw';
import uiIcon from '../ui-icon';
import { joinNodes, markup, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';
// Twig: <twig:ui:Alert> (src/PrestaShopBundle/Twig/Component/Ui/Alert.php) renders this markup, keep both in sync.

// <twig:ui:Icon> names the alert shows filled; any icon works, these are the status ones
const ICONS = {
  none: null,
  info: infoFill,
  check_circle: checkCircleFill,
  warning: warningFill,
  cancel: cancelFill,
};

// Same rule as alert.html.twig: only a danger alert interrupts screen readers.
const role = (type) => (type === 'danger' ? 'alert' : 'status');

// The markup of alert.html.twig for the given props and the Twig call that renders it; the content is the content block,
// attributes (class, style…) go on the alert like in Twig
const alert = ({ type, icon, dismissible, content, ...attributes }) => {
  const iconSvg = ICONS[icon] ?? null;
  const classes = ['ps-alert', 'alert', `alert-${type}`];
  if (dismissible) classes.push('alert-dismissible', 'fade', 'show');
  if (iconSvg) classes.push('d-flex', 'align-items-start', 'gap-2');
  if (attributes.class) classes.push(attributes.class);
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');

  return {
    html: `
    <div class="${classes.join(' ')}" role="${role(type)}"${extra}>
      ${iconSvg ? `${uiIcon(iconSvg, { class: 'mt-1' })}<div class="ps-alert__content">${content}</div>` : content}
      ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
    </div>`,
    twig: twigCall('ui:Alert', { type, icon: iconSvg ? icon : undefined, dismissible, ...attributes }, DEFAULTS, [markup(content)]),
  };
};

const column = (html) => `<div class="d-flex flex-column gap-2">${html}</div>`;

// Alert.php defaults (no icon: the control's "none")
const DEFAULTS = { type: 'info', icon: null, dismissible: false };

export default {
  title: 'Components/Alert',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Alert type="danger" icon="cancel" dismissible>…message…</twig:ui:Alert>`. The content block is the message: text, a list, links; there is no title prop, emphasise a first sentence with `<strong>` in the message.',
          '**Props**: `type` (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`; default `info`), `icon` (a `<twig:ui:Icon>` name, shown filled: `info`, `check_circle`, `warning`, `cancel` for the status ones; default none), `dismissible` (default `false`). Other attributes (`id`, `data-ps-*`, `aria-*`) go on the alert.',
          '**Do**: let a layout or `<twig:ui:FlashMessages>` space alerts (the alert has no outer margin); use `danger` only for errors, it is the only type announced at once (`role="alert"`). **Don\'t**: add margins or `.alert-link` by hand: links in the message take the alert link color.',
          '**States**: each type, with and without icon, dismissible, long text wrapping with its icon on the first line, a long unbreakable word (path, token) breaking inside the box, a link and `<code>` in the message, a first sentence in `<strong>`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Bootstrap contextual type',
    },
    icon: {
      control: 'select',
      options: Object.keys(ICONS),
      description: '<twig:ui:Icon> name, shown filled; none by default',
    },
    dismissible: { control: 'boolean', description: 'Close button' },
    content: { control: 'text', description: 'The content block (HTML)' },
  }, DEFAULTS),
  args: {
    ...DEFAULTS,
    icon: 'none',
    content: 'A simple alert — check it out!',
  },
};

export const Default = withTwig((args) => alert(args));

export const AllVariants = withTwig(() => joinNodes(
  ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    .map((type) => alert({ type, content: `A simple <strong>${type}</strong> alert — check it out!` })),
  column,
));

export const WithIcon = withTwig(() => joinNodes([
  alert({ type: 'info', icon: 'info', content: 'An example alert with an icon' }),
  alert({ type: 'success', icon: 'check_circle', content: 'A success alert with an icon' }),
  alert({ type: 'warning', icon: 'warning', content: 'A warning alert with an icon' }),
  alert({ type: 'danger', icon: 'cancel', content: 'A danger alert with an icon' }),
  alert({ type: 'warning', icon: 'warning', class: 'w-50', content: 'A long warning that wraps on several lines keeps its icon on the first line.' }),
  alert({ type: 'warning', icon: 'warning', style: 'max-width: 18rem', content: 'Rename the /admin folder, for example to <code>admin482k3j9x2qv8mzt0wpl/</code>. A long word breaks inside the box. <a href="#">A link</a> takes the alert color.' }),
], column));

export const Dismissible = withTwig(() => joinNodes([
  alert({ type: 'warning', dismissible: true, content: '<strong>Holy guacamole!</strong> You should check in on some of those fields below.' }),
  alert({ type: 'success', dismissible: true, content: '<strong>Well done!</strong> You successfully read this important alert message.' }),
  alert({ type: 'danger', dismissible: true, content: '<strong>Oh snap!</strong> Change a few things up and try submitting again.' }),
], column));

// A flash message whose first sentence is its point, in <strong> (LoginController's "Check your inbox.")
export const StrongFirstSentence = withTwig(() => alert({
  type: 'info',
  icon: 'info',
  dismissible: true,
  content: '<p class="mb-0"><strong>Check your inbox.</strong><br/>If an account exists for this email address, you\'ll receive a link to reset your password. You can request a new link every 6 hours.</p>',
}));
