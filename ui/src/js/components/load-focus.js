/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

const isShown = (element) => element.getClientRects().length > 0;

// A page rendered after a submit or a redirect starts on what the user must read first (DECISIONS.md #31), so keyboard
// users start there and screen readers read it, since a message rendered with the page is not announced:
// the first field marked aria-invalid in a form, otherwise the first flash message of any type, or a form-level error,
// otherwise the results summary of a grid the address names (#order_grid_results: its sorting, pages and filters land
// there). A message takes focus without joining the tab order.
export default function focusOnLoad() {
  const field = Array.from(document.querySelectorAll(selectors.invalidField)).find(isShown);

  if (field) {
    field.focus();

    return;
  }

  const message = Array.from(document.querySelectorAll(`${selectors.flashAlert}, ${selectors.formError}`)).find(isShown);

  if (message) {
    message.setAttribute('tabindex', '-1');
    message.focus();

    return;
  }

  const results = window.location.hash.length > 1 ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;

  if (results?.matches(selectors.gridResults)) {
    results.focus();
  }
}
