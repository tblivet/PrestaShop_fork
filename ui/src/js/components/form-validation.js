/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// Symfony's Email constraint (html5 mode), so the client and the server accept the same addresses:
// unlike the browser's own check, it wants a dot in the domain
const EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Fields whose message is shown: they are checked again while the user types, so it goes away once fixed
const shown = new WeakSet();

const slotOf = (field) => (field.getAttribute('aria-describedby') ?? '')
  .split(' ')
  .map((id) => document.getElementById(id))
  .find((element) => element?.matches(selectors.clientError));

const messageFor = (field, slot) => {
  if (field.required && field.value.trim() === '') {
    return slot.dataset.psDataRequired ?? '';
  }

  if (field.type === 'email' && field.value !== '' && !EMAIL.test(field.value)) {
    return slot.dataset.psDataInvalid ?? '';
  }

  return '';
};

// Written when shown, so the live region announces it; emptied otherwise, so the slot takes no room.
// aria-invalid set by something else (a server error, the password policy) is left alone.
const check = (field, slot) => {
  const message = messageFor(field, slot);

  if (message) {
    field.setAttribute('aria-invalid', 'true');
    shown.add(field);
  } else if (shown.has(field)) {
    field.removeAttribute('aria-invalid');
    shown.delete(field);
  }
  slot.textContent = message;

  return message === '';
};

// <form data-ps-action="validate"> (every form of the kit form theme, which also sets novalidate: DECISIONS.md #30):
// on submit, each field with a client error slot is checked for what the browser would have checked (required, email).
// Listening on document in the capture phase runs before the page's own submit handlers and submit-once.
export default function initFormValidation() {
  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.matches(selectors.validate)) {
      return;
    }

    const invalid = Array.from(form.querySelectorAll(selectors.clientError))
      .map((slot) => ({slot, field: form.querySelector(`[aria-describedby~="${slot.id}"]`)}))
      .filter(({slot, field}) => field && !check(field, slot))
      .map(({field}) => field);

    if (invalid.length > 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
      invalid[0].focus();
    }
  }, true);

  document.addEventListener('input', (event) => {
    const field = event.target;
    const slot = shown.has(field) ? slotOf(field) : null;

    if (slot) {
      check(field, slot);
    }
  });
}
