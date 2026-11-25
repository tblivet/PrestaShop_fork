/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { announce } from './announcer';
import { setButtonBusy } from './busy-button';

// A <twig:ui:Grid>'s Clear filters (grid.html.twig): posts the reset (data-ps-data-url), as the old grids did, then goes
// to the list (data-ps-data-redirect) on its results summary (data-ps-data-fragment), which load-focus.js focuses. The
// button stays busy meanwhile; if the reset fails, it is back as it was and the page's Announcer says so
// (data-ps-data-error).
export default function initGridFilters() {
  document.addEventListener('click', async (event) => {
    const button = event.target instanceof Element ? event.target.closest(selectors.gridResetFilters) : null;

    if (!button) {
      return;
    }

    event.preventDefault();
    setButtonBusy(button, true);

    try {
      const response = await fetch(button.dataset.psDataUrl, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' } });

      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const redirect = new URL(button.dataset.psDataRedirect, window.location.href);

      redirect.hash = button.dataset.psDataFragment ?? '';
      window.location.assign(redirect.toString());
    } catch {
      setButtonBusy(button, false);
      announce(button.dataset.psDataError);
    }
  });
}
