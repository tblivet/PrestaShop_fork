/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// A <twig:ui:Grid>'s selection (grid.html.twig): the select-all box checks or clears the page's rows, and shows "some"
// (indeterminate) when only some are; the status line says how many are checked; the bulk menu is off until one is.
// Per grid, so a page with several grids keeps them apart; run again on load, as a browser may restore the boxes.

const update = (grid) => {
  const rows = [...grid.querySelectorAll(selectors.gridSelectRow)].filter((box) => !box.disabled);
  const checked = rows.filter((box) => box.checked).length;
  const all = grid.querySelector(selectors.gridSelectAll);
  const count = grid.querySelector(selectors.gridSelectionCount);
  const toggle = grid.querySelector(`${selectors.gridBulkActions} ${selectors.dropdownToggle}`);

  if (all) {
    all.checked = rows.length > 0 && checked === rows.length;
    all.indeterminate = checked > 0 && checked < rows.length;
  }
  if (count) {
    count.textContent = checked > 0 ? count.dataset.psDataSome.replace('%count%', String(checked)) : count.dataset.psDataNone;
  }
  if (toggle) {
    toggle.disabled = checked === 0;
  }
};

export default function initGridSelection() {
  document.addEventListener('change', (event) => {
    const box = event.target;
    const grid = box instanceof HTMLInputElement ? box.closest(selectors.grid) : null;

    if (!grid) {
      return;
    }
    if (box.matches(selectors.gridSelectAll)) {
      grid.querySelectorAll(selectors.gridSelectRow).forEach((row) => {
        if (!row.disabled) {
          row.checked = box.checked;
        }
      });
    } else if (!box.matches(selectors.gridSelectRow)) {
      return;
    }
    update(grid);
  });

  document.querySelectorAll(selectors.grid).forEach(update);
}
