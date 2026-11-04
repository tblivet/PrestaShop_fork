/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import checkCircleFill from '../../../icons/bi/check-circle-fill.svg?raw';
import exclamationTriangleFill from '../../../icons/bi/exclamation-triangle-fill.svg?raw';
import xCircleFill from '../../../icons/bi/x-circle-fill.svg?raw';
import uxIcon from '../ux-icon';
// Twig: <twig:ui:FlashMessages> (src/PrestaShopBundle/Twig/Component/Ui/FlashMessages.php) renders this markup, keep both in sync.

const alert = (type, icon, role, message, dismissible) => `
  <div class="alert alert-${type}${dismissible ? ' alert-dismissible fade show' : ''} d-flex align-items-start gap-2" role="${role}" data-ps-ref="flash-alert">
    ${uxIcon(icon, { width: 16, height: 16, class: 'flex-shrink-0 mt-1', 'aria-hidden': 'true' })}
    <div><p class="mb-0">${message}</p></div>
    ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
  </div>`;

export default {
  title: 'Components/FlashMessages',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:FlashMessages/>` prints the session\'s flash messages, one `<twig:ui:Alert>` per type with messages, in the order error, failure, success, warning, info. Reading a type empties it, so each message shows once; with no message it renders nothing.',
          '**Props**: `types` (flash types to print, default all), `dismissible` (default `true`). Other attributes go on the wrapper.',
          '**Do**: place it once per page, where the layout gives it a slot (under the page or form title). **Don\'t**: give it margins or read the flash bag yourself in a template; a second `<twig:ui:FlashMessages/>` on the same page prints nothing.',
          '**States**: one type, several types stacked (spaced by the component), not dismissible.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    dismissible: { control: 'boolean' },
  },
  args: {
    dismissible: true,
  },
};

export const OneType = {
  render: ({ dismissible }) => `
    <div class="ps-flash-messages" data-ps-ref="flash-messages">
      ${alert('danger', xCircleFill, 'alert', 'The email address or password is incorrect.', dismissible)}
    </div>`,
};

export const Stacked = {
  render: ({ dismissible }) => `
    <div class="ps-flash-messages" data-ps-ref="flash-messages">
      ${alert('danger', xCircleFill, 'alert', 'The email address or password is incorrect.', dismissible)}
      ${alert('success', checkCircleFill, 'status', 'Your password has been changed. You can now sign in.', dismissible)}
      ${alert('warning', exclamationTriangleFill, 'status', 'SSL is on, but your IP address is allowed to sign in without it, for maintenance or local access.', dismissible)}
    </div>`,
};

export const NotDismissible = {
  args: { dismissible: false },
  render: ({ dismissible }) => `
    <div class="ps-flash-messages" data-ps-ref="flash-messages">
      ${alert('success', checkCircleFill, 'status', 'Your password has been changed. You can now sign in.', dismissible)}
    </div>`,
};
