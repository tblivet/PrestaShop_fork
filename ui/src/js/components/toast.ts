/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import type { Toast as ToastClass } from 'bootstrap';
import selectors from '../selectors';
import { announce } from './announcer';

// Shows a <twig:ui:Toast> in the page's <twig:ui:ToastStack> (toast_stack.html.twig, placed by the kit layouts): a copy
// of the stack's template of that type, the message in it, removed once hidden. Screen readers hear the message through
// the page's <twig:ui:Announcer>, so a toast is not a live region of its own. For the result of an action that does not
// reload the page; after a reload, a flash message says it.

export type ToastType = 'success' | 'info' | 'warning' | 'danger';

export interface ToastMessage {
  type?: ToastType;
  // Translated text
  message: string;
}

let Toast: typeof ToastClass | null = null;

const templateOf = (stack: Element, type: ToastType): HTMLTemplateElement | undefined =>
  [...stack.querySelectorAll<HTMLTemplateElement>(selectors.toastTemplate)].find(
    (template) => template.dataset.psDataType === type
  );

export const showToast = ({ type = 'success', message }: ToastMessage): void => {
  announce(message);

  const stack = document.querySelector(selectors.toastStack);
  const toast = stack && templateOf(stack, type)?.content.firstElementChild?.cloneNode(true);
  const text = toast instanceof HTMLElement ? toast.querySelector(selectors.toastMessage) : null;

  // A page without a kit layout: the message is still announced
  if (!stack || !Toast || !(toast instanceof HTMLElement) || !text) {
    return;
  }
  text.textContent = message;
  toast.addEventListener('hidden.bs.toast', () => toast.remove());
  stack.append(toast);
  Toast.getOrCreateInstance(toast).show();
};

// For scripts outside the kit bundle (new-theme pages, modules):
// document.dispatchEvent(new CustomEvent('ps:toast', {detail: {type: 'success', message}}))
export default function initToasts(BootstrapToast: typeof ToastClass): void {
  Toast = BootstrapToast;
  document.addEventListener('ps:toast', (event) => {
    if (event instanceof CustomEvent && typeof event.detail?.message === 'string') {
      showToast(event.detail);
    }
  });
}
