/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// Laid over the label by the kit's busy button state (_buttons.scss), so the button keeps its size
const SPINNER = '<span class="spinner-border spinner-border-sm" aria-hidden="true" data-ps-ref="submit-spinner"></span>';

const setBusy = (form, button, busy) => {
  if (busy) {
    form.setAttribute('data-ps-state', 'loading');
    button?.setAttribute('data-ps-state', 'loading');
    button?.setAttribute('aria-disabled', 'true');
    button?.setAttribute('aria-busy', 'true');
    button?.insertAdjacentHTML('afterbegin', SPINNER);

    return;
  }

  form.removeAttribute('data-ps-state');
  form.querySelectorAll('[aria-busy="true"]').forEach((busyButton) => {
    busyButton.removeAttribute('data-ps-state');
    busyButton.removeAttribute('aria-disabled');
    busyButton.removeAttribute('aria-busy');
    busyButton.querySelector(selectors.submitSpinner)?.remove();
  });
};

// <form data-ps-action="submit-once">: once a submit goes through (no page script blocked it), its button shows it is busy and
// further submits are ignored, so a slow server does not get the form twice. Listening on document runs after the form's own
// checks, which block an invalid submit with preventDefault.
export default function initSubmitOnce() {
  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.matches(selectors.submitOnce)) {
      return;
    }

    if (form.getAttribute('data-ps-state') === 'loading') {
      event.preventDefault();

      return;
    }

    if (!event.defaultPrevented) {
      setBusy(form, event.submitter ?? form.querySelector('[type="submit"]'), true);
    }
  });

  // Back to the page from the browser history: the form is usable again
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.querySelectorAll(selectors.submitOnce).forEach((form) => setBusy(form, null, false));
    }
  });
}
