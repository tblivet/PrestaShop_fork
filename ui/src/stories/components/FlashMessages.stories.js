/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import checkCircleFill from '../../../icons/bi/check-circle-fill.svg?raw';
import exclamationTriangleFill from '../../../icons/bi/exclamation-triangle-fill.svg?raw';
import infoCircleFill from '../../../icons/bi/info-circle-fill.svg?raw';
import xCircleFill from '../../../icons/bi/x-circle-fill.svg?raw';
import uxIcon from '../ux-icon';
// Twig: <twig:ui:FlashMessages> (src/PrestaShopBundle/Twig/Component/Ui/FlashMessages.php) renders this markup, keep both in sync.

const alert = (type, icon, role, message, dismissible) => `
  <div class="ps-alert alert alert-${type}${dismissible ? ' alert-dismissible fade show' : ''} d-flex align-items-start gap-2" role="${role}" data-ps-ref="flash-alert">
    ${uxIcon(icon, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
    <div class="ps-alert__content"><p class="mb-0">${message}</p></div>
    ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
  </div>`;

// FlashMessages::TYPES: flash bag type => alert, in display order; one sample message each
const TYPES = {
  error: ['danger', xCircleFill, 'alert', 'The email address or password is incorrect.'],
  failure: ['danger', xCircleFill, 'alert', 'We couldn\'t send the reset link. Try again later.'],
  success: ['success', checkCircleFill, 'status', 'Your password has been changed. You can now sign in.'],
  warning: ['warning', exclamationTriangleFill, 'status', 'SSL is on, but your IP address is allowed to sign in without it, for maintenance or local access.'],
  info: ['info', infoCircleFill, 'status', '<strong>Check your inbox.</strong><br/>If an account exists for this email address, you\'ll receive a link to reset your password.'],
};

// The markup of flash_messages.html.twig when the flash bag holds one message of each of the given types
const flashMessages = ({ types, dismissible }) => {
  const printed = Object.keys(TYPES).filter((type) => types.length === 0 || types.includes(type));

  return `
    <div class="ps-flash-messages" data-ps-ref="flash-messages">
      ${printed.map((type) => alert(...TYPES[type], dismissible)).join('')}
    </div>`;
};

export default {
  title: 'Components/FlashMessages',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:FlashMessages/>` prints the session\'s flash messages, one `<twig:ui:Alert>` per type with messages, in the order error, failure, success, warning, info. Reading a type empties it, so each message shows once; with no message it renders nothing.',
          '**Props**: `types` (flash types to print, default all), `dismissible` (default `true`). Other attributes go on the wrapper.',
          '**Do**: place it once per page, where the layout gives it a slot (under the page or form title). **Don\'t**: give it margins or read the flash bag yourself in a template; a second `<twig:ui:FlashMessages/>` on the same page prints nothing.',
          '**States**: every type stacked in display order (spaced by the component), one type, not dismissible; the info message shows a first sentence in `<strong>`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    types: {
      control: 'check',
      options: Object.keys(TYPES),
      description: 'Flash types to print (none checked: all of them)',
    },
    dismissible: { control: 'boolean' },
  },
  args: {
    types: [],
    dismissible: true,
  },
};

export const Default = { render: (args) => flashMessages(args) };

export const OneType = {
  args: { types: ['error'] },
  render: (args) => flashMessages(args),
};

export const NotDismissible = {
  args: { types: ['success'], dismissible: false },
  render: (args) => flashMessages(args),
};
