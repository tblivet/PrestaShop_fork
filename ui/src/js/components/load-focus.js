/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

const isShown = (element) => element.getClientRects().length > 0;

// How the last page was left, a click or a key, for this tab only (the storage may be refused: then a key)
const INPUT = 'ps-last-input';
const remember = (input) => {
  try {
    window.sessionStorage.setItem(INPUT, input);
  } catch {
    // no storage: the landing focus shows its ring
  }
};
const leftByPointer = () => {
  try {
    return window.sessionStorage.getItem(INPUT) === 'pointer';
  } catch {
    return false;
  }
};

// Focus where reading resumes; after a click, without the focus ring (data-ps-state="quiet-focus", until it leaves):
// the ring tells keyboard users where they are, a mouse user would read it as a selection
const land = (target) => {
  if (leftByPointer()) {
    target.setAttribute('data-ps-state', 'quiet-focus');
    target.addEventListener('blur', () => target.removeAttribute('data-ps-state'), { once: true });
  }
  target.focus();
};

// A page rendered after a submit or a redirect starts on what the user must read first (DECISIONS.md #31), so keyboard
// users start there and screen readers read it, since a message rendered with the page is not announced:
// the first field marked aria-invalid in a form, otherwise the first flash message of any type, or a form-level error,
// otherwise the results summary of a grid the address names (#order_grid_results: its sorting, pages and filters land
// there), not on a reload, the fragment then dropped. A message takes focus without joining the tab order.
export default function focusOnLoad() {
  document.addEventListener('pointerdown', () => remember('pointer'), true);
  document.addEventListener('keydown', () => remember('keyboard'), true);

  const field = Array.from(document.querySelectorAll(selectors.invalidField)).find(isShown);

  if (field) {
    field.focus();

    return;
  }

  const message = Array.from(document.querySelectorAll(`${selectors.flashAlert}, ${selectors.formError}`)).find(isShown);

  if (message) {
    message.setAttribute('tabindex', '-1');
    land(message);

    return;
  }

  const results = window.location.hash.length > 1 ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;

  if (!results?.matches(selectors.gridResults)) {
    return;
  }
  // Once: the address drops the fragment, so a reload or a later visit starts at the top like any page
  window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
  if (performance.getEntriesByType('navigation')[0]?.type !== 'reload') {
    land(results);
  }
}
