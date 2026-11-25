/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// The page's <twig:ui:ConfirmDialog> (confirm_dialog.html.twig) for every button or link with data-ps-confirm="question":
// the click is held and the dialog asks, titled data-ps-data-confirm-title, its action named data-ps-data-confirm-label
// and red with data-ps-data-confirm-variant="danger" (focus then starts on Cancel). Confirm submits the button's form
// with the button (its name, value and formaction go with it), follows the link (in its target), or clicks a plain
// button again. Cancel, Esc or a click outside do nothing; focus goes back to the trigger, or to the toggle of the
// dropdown menu it was in. While the dialog asks, other triggers are held: one Confirm, one action.

const BUTTON_VARIANTS = { primary: 'btn-primary', danger: 'btn-destructive' };

const defaults = new WeakMap();

const parts = (dialog) => ({
  title: dialog.querySelector(selectors.modalTitle),
  message: dialog.querySelector(selectors.confirmMessage),
  accept: dialog.querySelector(selectors.confirmAccept),
  cancel: dialog.querySelector(selectors.confirmCancel),
});

const act = (trigger, pass) => {
  if (trigger.form && trigger.type === 'submit') {
    trigger.form.requestSubmit(trigger);
  } else if (trigger instanceof HTMLAnchorElement && trigger.href) {
    if (trigger.target && trigger.target !== '_self') {
      window.open(trigger.href, trigger.target, 'noopener');
    } else {
      window.location.assign(trigger.href);
    }
  } else {
    pass.add(trigger);
    trigger.click();
  }
};

export default function initConfirmDialog(Modal, Dropdown) {
  // A trigger confirmed and clicked again goes through once
  const pass = new WeakSet();
  let asking = false;

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest(selectors.confirmTrigger) : null;
    const dialog = document.querySelector(selectors.confirmDialog);

    if (!trigger || !dialog) {
      return;
    }
    if (pass.has(trigger)) {
      pass.delete(trigger);

      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    if (asking) {
      return;
    }
    asking = true;

    // The click no longer reaches Bootstrap: close the dropdown menu the trigger is in, focus comes back to its toggle
    const toggle = [...document.querySelectorAll(selectors.openDropdownToggle)].find((open) => open.parentElement.contains(trigger));

    if (toggle) {
      Dropdown.getOrCreateInstance(toggle).hide();
    }

    const { title, message, accept, cancel } = parts(dialog);

    if (!defaults.has(dialog)) {
      defaults.set(dialog, { title: title.textContent, label: accept.textContent });
    }
    const danger = trigger.dataset.psDataConfirmVariant === 'danger';

    title.textContent = trigger.dataset.psDataConfirmTitle || defaults.get(dialog).title;
    message.textContent = trigger.dataset.psConfirm;
    accept.textContent = trigger.dataset.psDataConfirmLabel || defaults.get(dialog).label;
    accept.classList.remove(...Object.values(BUTTON_VARIANTS));
    accept.classList.add(BUTTON_VARIANTS[danger ? 'danger' : 'primary']);

    const modal = Modal.getOrCreateInstance(dialog);
    const controller = new AbortController();
    const { signal } = controller;

    dialog.addEventListener('shown.bs.modal', () => (danger ? cancel : accept).focus(), { signal, once: true });
    accept.addEventListener('click', () => {
      // Bootstrap ignores hide() while the dialog fades in: it closes once shown
      dialog.addEventListener('shown.bs.modal', () => modal.hide(), { signal, once: true });
      modal.hide();
      act(trigger, pass);
    }, { signal, once: true });
    dialog.addEventListener('hidden.bs.modal', () => {
      controller.abort();
      asking = false;
      (toggle ?? trigger).focus();
    }, { signal, once: true });

    modal.show(trigger);
  }, true);
}
