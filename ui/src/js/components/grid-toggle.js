/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { announce } from './announcer';

// A <twig:ui:Grid> toggle cell (Grid/cell/toggle.html.twig): a switch that posts to its URL when flipped. The routes
// answer one of two ways, both handled: JSON {status, message} (the switch stays, the message is announced; on a false
// status it flips back and the message is announced) or a redirect with a flash (the page reloads on the list, the
// flash shown). While saving the switch is busy and off; any failure flips it back and says so.

const save = async (box) => {
  box.dataset.psState = 'loading';
  box.disabled = true;

  try {
    const response = await fetch(box.dataset.psDataUrl, {
      method: 'POST',
      redirect: 'manual',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (response.type === 'opaqueredirect') {
      window.location.reload();

      return;
    }
    const body = response.headers.get('Content-Type')?.includes('json') ? await response.json() : null;

    if (!response.ok || !body?.status) {
      throw new Error(body?.message ?? '');
    }
    if (body.message) {
      announce(body.message);
    }
  } catch (error) {
    box.checked = !box.checked;
    announce(error.message || box.dataset.psDataError);
  } finally {
    delete box.dataset.psState;
    box.disabled = false;
  }
};

export default function initGridToggle() {
  document.addEventListener('change', (event) => {
    const box = event.target;

    if (box instanceof HTMLInputElement && box.matches(selectors.gridToggle)) {
      save(box);
    }
  });
}
