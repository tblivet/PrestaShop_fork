/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// Tells screen readers what changed, without moving the focus, through the page's <twig:ui:Announcer> (announcer.html.twig,
// placed by the kit layouts): a polite status, for progress and results. A blocking error is a visible danger alert instead.

const region = (): Element => {
  let element = document.querySelector(selectors.announcer);

  // A page without a kit layout: a region added now may miss this first message, the next ones are announced
  if (!element) {
    element = document.createElement('div');
    element.className = 'visually-hidden';
    element.setAttribute('role', 'status');
    element.setAttribute('aria-atomic', 'true');
    element.setAttribute('data-ps-target', 'announcer');
    document.body.append(element);
  }

  return element;
};

/**
 * @param {string} message translated text, read once
 */
export const announce = (message: string): void => {
  const element = region();

  // Emptied, then filled on the next frame: the same message twice in a row is read again
  element.textContent = '';
  requestAnimationFrame(() => {
    element.textContent = message;
  });
};

// For scripts outside the kit bundle (new-theme pages, modules):
// document.dispatchEvent(new CustomEvent('ps:announce', {detail: {message}}))
export default function initAnnouncer(): void {
  document.addEventListener('ps:announce', (event) => {
    if (event instanceof CustomEvent && typeof event.detail?.message === 'string') {
      announce(event.detail.message);
    }
  });
}
