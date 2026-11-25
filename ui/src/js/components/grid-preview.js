/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// A <twig:ui:Grid> row's preview (Orders, grid.html.twig): its toggle shows or hides the preview row under it, and
// fetches it on the first open (JSON {preview}, as the old grids). While loading the row is busy and says so; on
// failure an alert with Try again, the toggle keeping focus. Once loaded, ps:grid-preview-loaded on the grid
// ({gridId, row, previewRow}): Orders' products toggler listens to it.

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const load = async (toggle, previewRow) => {
  const content = previewRow.querySelector(selectors.gridPreviewContent);
  const grid = toggle.closest(selectors.grid);

  previewRow.dataset.psState = 'loading';
  previewRow.setAttribute('aria-busy', 'true');
  content.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">${escape(toggle.dataset.psDataLoading ?? 'Loading...')}</span></div>`;

  try {
    const response = await fetch(toggle.dataset.psDataUrl, { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const { preview } = await response.json();

    content.innerHTML = preview;
    previewRow.dataset.psState = 'loaded';
    grid?.dispatchEvent(new CustomEvent('ps:grid-preview-loaded', {
      bubbles: true,
      detail: { gridId: grid.dataset.psDataGridId, row: toggle.closest('tr'), previewRow },
    }));
  } catch {
    previewRow.dataset.psState = 'error';
    content.innerHTML = `<div class="ps-alert alert alert-danger ps-grid__preview-error" role="alert"><div class="ps-alert__content">${escape(toggle.dataset.psDataError)} `
      + `<button type="button" class="btn btn-link ps-button" data-ps-action="grid-preview-retry">${escape(toggle.dataset.psDataRetry)}</button></div></div>`;
  } finally {
    previewRow.removeAttribute('aria-busy');
  }
};

const toggleFor = (element) => element.closest('tr').previousElementSibling?.querySelector(selectors.gridPreview);

export default function initGridPreview() {
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const retry = target?.closest(selectors.gridPreviewRetry);
    const toggle = retry ? toggleFor(retry) : target?.closest(selectors.gridPreview);

    if (!toggle) {
      return;
    }
    const previewRow = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!previewRow) {
      return;
    }
    if (retry) {
      toggle.focus();
      load(toggle, previewRow);

      return;
    }

    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    previewRow.hidden = !open;
    if (open && !['loaded', 'loading'].includes(previewRow.dataset.psState)) {
      load(toggle, previewRow);
    }
  });
}
