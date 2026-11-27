/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:ConfirmDialog> renders (confirm_dialog.html.twig, a <twig:ui:Modal>) and its Twig call, for the
// ConfirmDialog story. The kit layout places one per page; confirm-dialog.ts fills it from the button or link clicked.
import modal, { modalButton } from './modal';
import { markup, twigCall } from './twig-snippet';

// ConfirmDialog.php defaults
export const CONFIRM_DIALOG_DEFAULTS = { id: 'ps-confirm-dialog' };

export default function confirmDialog({ id = 'ps-confirm-dialog', ...attributes } = {}) {
  const node = modal({
    id,
    title: 'Are you sure?',
    body: markup(`<p class="ps-confirm-dialog__message" id="${id}-message" data-ps-target="confirm-message"></p>`),
    footer: [
      modalButton({ label: 'Cancel', variant: 'link', 'data-bs-dismiss': 'modal', 'data-ps-ref': 'confirm-cancel' }),
      modalButton({ label: 'Confirm', variant: 'primary', 'data-ps-ref': 'confirm-accept' }),
    ],
    'data-ps-ref': 'confirm-dialog',
    'aria-describedby': `${id}-message`,
    ...attributes,
    class: ['ps-confirm-dialog', attributes.class].filter(Boolean).join(' '),
  });

  return { html: node.html, twig: twigCall('ui:ConfirmDialog', { id, ...attributes }, CONFIRM_DIALOG_DEFAULTS) };
}
