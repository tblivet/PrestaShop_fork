/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import alert from '../alert';
import { twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';
// Twig: <twig:ui:FlashMessages> (src/PrestaShopBundle/Twig/Component/Ui/FlashMessages.php) renders this markup, keep both in sync.

// FlashMessages::TYPES: flash bag type => alert, in display order; one sample message each
const TYPES = {
  error: ['danger', 'cancel', 'The email address or password is incorrect.'],
  failure: ['danger', 'cancel', 'We couldn\'t send the reset link. Try again later.'],
  success: ['success', 'check_circle', 'Your password has been changed. You can now sign in.'],
  warning: ['warning', 'warning', 'SSL is on, but your IP address is allowed to sign in without it, for maintenance or local access.'],
  info: ['info', 'info', '<strong>Check your inbox.</strong><br/>If an account exists for this email address, you\'ll receive a link to reset your password.'],
};

// The markup of flash_messages.html.twig when the flash bag holds one message of each of the given types, and its call
const flashMessages = ({ types, dismissible }) => {
  const printed = Object.keys(TYPES).filter((type) => types.length === 0 || types.includes(type));

  return {
    html: `
    <div class="ps-flash-messages" data-ps-ref="flash-messages">
      ${printed.map((type) => {
        const [alertType, icon, message] = TYPES[type];

        return alert({ type: alertType, icon, dismissible, 'data-ps-ref': 'flash-alert', content: `<p>${message}</p>` }).html;
      }).join('')}
    </div>`,
    twig: twigCall('ui:FlashMessages', { types, dismissible }, DEFAULTS),
    // One message of every type in the flash bag: the types the call leaves out are not printed
    session: { flashes: Object.fromEntries(Object.entries(TYPES).map(([type, [, , message]]) => [type, [message]])) },
  };
};

// FlashMessages.php defaults (no type checked: all of them)
const DEFAULTS = { types: [], dismissible: true };

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
  argTypes: withDefaults({
    types: {
      control: 'check',
      options: Object.keys(TYPES),
      description: 'Flash types to print (none checked: all of them)',
    },
    dismissible: { control: 'boolean' },
  }, DEFAULTS),
  args: DEFAULTS,
};

export const Default = withTwig((args) => flashMessages(args));

export const OneType = {
  args: { types: ['error'] },
  ...withTwig((args) => flashMessages(args)),
};

export const NotDismissible = {
  args: { types: ['success'], dismissible: false },
  ...withTwig((args) => flashMessages(args)),
};
