/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import type { Modal as BootstrapModal } from 'bootstrap';
import selectors from '../selectors';

// <twig:ui:ShowcaseModal> (showcase_modal.html.twig): the page renders it while nobody has closed it, and it opens when
// the page loads. Closing it records it closed for the shop (admin_close_showcase_card), so it never shows again.
export default function initShowcaseModals(Modal: typeof BootstrapModal): void {
  document.querySelectorAll<HTMLElement>(selectors.showcaseModal).forEach((dialog) => {
    dialog.addEventListener(
      'hidden.bs.modal',
      () => {
        fetch(String(dialog.dataset.psDataCloseUrl), {
          method: 'POST',
          body: new URLSearchParams({ close: '1', name: String(dialog.dataset.psDataName) }),
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
      },
      { once: true }
    );

    Modal.getOrCreateInstance(dialog).show();
  });
}
