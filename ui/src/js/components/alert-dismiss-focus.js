/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Closing an alert (Bootstrap's data-bs-dismiss) removes the focused close button, which leaves focus nowhere:
// it moves to the next focusable element after the alert, or the previous one when the alert is the last.
export default function initAlertDismissFocus() {
  document.addEventListener('close.bs.alert', (event) => {
    const alert = event.target;

    if (!alert.contains(document.activeElement)) {
      return;
    }

    const focusable = Array.from(document.querySelectorAll(FOCUSABLE))
      .filter((element) => !alert.contains(element) && element.getClientRects().length > 0);
    const isAfter = (element) => alert.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING;
    const next = focusable.find(isAfter) ?? focusable.filter((element) => !isAfter(element)).pop();

    // Bootstrap fires "closed" on the removed alert, so it does not reach document
    alert.addEventListener('closed.bs.alert', () => next?.focus(), {once: true});
  });
}
