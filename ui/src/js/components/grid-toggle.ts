/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { showToast } from './toast';

// A <twig:ui:Grid> toggle cell (Grid/cell/toggle.html.twig): a switch that posts to its URL when flipped. The routes
// answer one of two ways, both handled: JSON {status, message} (the switch stays and a toast says the message; on a
// false status it flips back and a danger toast says why) or a redirect with a flash (the page reloads on the list, the
// flash shown). While saving, the cell shows a spinner over the switch and the switch keeps the focus but takes no
// click; once a reload is asked, no switch of the page takes one any more: a click then would post again and its
// flash would show on the next page.

let reloading = false;

const cellOf = (box: HTMLInputElement): HTMLElement | null => box.closest<HTMLElement>(selectors.gridToggleCell);

const busy = (box: HTMLInputElement): boolean => reloading || cellOf(box)?.dataset.psState === 'loading';

const setBusy = (box: HTMLInputElement, on: boolean): void => {
  const cell = cellOf(box);

  if (on) {
    box.setAttribute('aria-disabled', 'true');
    if (cell) {
      cell.dataset.psState = 'loading';
    }
  } else {
    box.removeAttribute('aria-disabled');
    if (cell) {
      delete cell.dataset.psState;
    }
  }
};

const save = async (box: HTMLInputElement): Promise<void> => {
  setBusy(box, true);
  // What a danger toast says when the switch flips back: the route's own message, else the page's (never a network
  // error's text, "Failed to fetch")
  let failure: string | null = null;

  try {
    const response = await fetch(box.dataset.psDataUrl ?? '', {
      method: 'POST',
      redirect: 'manual',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (response.type === 'opaqueredirect') {
      reloading = true;
      window.location.reload();

      return;
    }
    const body: { status?: boolean; message?: string } | null = response.headers.get('Content-Type')?.includes('json')
      ? await response.json()
      : null;

    if (!response.ok || !body?.status) {
      failure = body?.message || box.dataset.psDataError || '';
    } else if (body.message) {
      showToast({ type: 'success', message: body.message });
    }
  } catch {
    failure = box.dataset.psDataError ?? '';
  }
  setBusy(box, false);
  if (failure !== null) {
    box.checked = !box.checked;
    showToast({ type: 'danger', message: failure });
  }
};

export default function initGridToggle(): void {
  // A switch being saved, or any once the page reloads, stays as it is: the click (Space too) is cancelled
  document.addEventListener('click', (event) => {
    const box = event.target;

    if (box instanceof HTMLInputElement && box.matches(selectors.gridToggle) && busy(box)) {
      event.preventDefault();
    }
  });
  document.addEventListener('change', (event) => {
    const box = event.target;

    if (box instanceof HTMLInputElement && box.matches(selectors.gridToggle)) {
      save(box);
    }
  });
}
