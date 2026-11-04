/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
const isShown = (element) => element.getClientRects().length > 0;

// A page the server renders again with errors starts on the first thing to fix, so keyboard users start there and screen
// readers read it: the first field marked aria-invalid in a form, otherwise a danger alert (role="alert") in a form,
// which takes focus without joining the tab order.
export default function focusServerError() {
  const field = Array.from(document.querySelectorAll('form [aria-invalid="true"]')).find(isShown);

  if (field) {
    field.focus();

    return;
  }

  const alert = Array.from(document.querySelectorAll('form [role="alert"]')).find(isShown);

  if (alert) {
    alert.setAttribute('tabindex', '-1');
    alert.focus();
  }
}
