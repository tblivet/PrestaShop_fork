/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// A modal opened from a menu item (a list action, a bulk action): when it closes, Bootstrap gives focus back to the
// item, but the item went away with its closed menu, so focus fell to the page. It goes back to the menu's toggle.
const toggleOf = (trigger) => {
  const menu = trigger instanceof Element ? trigger.closest('.dropdown-menu') : null;

  return menu?.parentElement?.querySelector(':scope > [data-bs-toggle="dropdown"]') ?? null;
};

export default function initModalReturnFocus() {
  let toggle = null;

  document.addEventListener('show.bs.modal', (event) => {
    toggle = toggleOf(event.relatedTarget);
  });
  document.addEventListener('hidden.bs.modal', () => {
    if (toggle?.isConnected && toggle.getClientRects().length > 0) {
      toggle.focus();
    }
    toggle = null;
  });
}
