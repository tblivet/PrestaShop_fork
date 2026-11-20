/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { announce } from './announcer';

// Laid over the label by the kit's busy button state (_buttons.scss), so the button keeps its size
const SPINNER = '<span class="spinner-border spinner-border-sm" aria-hidden="true" data-ps-ref="submit-spinner"></span>';

// A button waiting for the server, as <twig:ui:Button loading> renders it: a spinner over the label, and "Loading..."
// (data-ps-data-busy-label) said through the page's <twig:ui:Announcer>, a live region in the page from the start: one
// created inside the button now would not be announced reliably. No aria-busy: it asks screen readers to wait for the
// element to be ready. It stays focusable, since disabling it would drop the keyboard focus to <body>: initBusyButtons
// ignores it instead.
export const setButtonBusy = (button, busy) => {
  if (busy) {
    button.setAttribute('data-ps-state', 'loading');
    button.setAttribute('aria-disabled', 'true');
    button.insertAdjacentHTML('afterbegin', SPINNER);
    announce(button.dataset.psDataBusyLabel ?? '');

    return;
  }

  button.removeAttribute('data-ps-state');
  button.removeAttribute('aria-disabled');
  button.querySelector(selectors.submitSpinner)?.remove();
  // The hidden text of a button rendered busy
  button.querySelector(selectors.busyText)?.remove();
};

// A busy button does nothing until its action ends. Enter and Space fire a click on a button, so one guard covers the
// pointer and the keyboard; on document in the capture phase, it runs before the page's own handlers.
export default function initBusyButtons() {
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest(selectors.busyButton)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, { capture: true });
}
