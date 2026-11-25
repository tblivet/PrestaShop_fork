/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// A <twig:ui:Grid>'s bulk actions that are not a form submit (grid.html.twig, Grid::getBulkItems()):
// - a button tells the page: ps:grid-bulk-action on the grid, detail {gridId, actionId, ids} (Orders opens the tabs);
// - a modal form (data-bs-target, the page's modal): when that modal's form is sent, the checked rows go with it, one
//   input each from the prototype of its [data-prototype] block named by data-bulk-inputs-id, as on the old grids.

const checkedIds = (grid) => [...grid.querySelectorAll(selectors.gridSelectRow)].filter((box) => box.checked).map((box) => box.value);

export default function initGridBulk() {
  // The grid whose modal form is open
  let modalGrid = null;

  document.addEventListener('click', (event) => {
    const item = event.target instanceof Element ? event.target.closest(`${selectors.gridBulkButton}, ${selectors.gridBulkModal}`) : null;
    const grid = item?.closest(selectors.grid);

    if (!grid) {
      return;
    }
    if (item.matches(selectors.gridBulkModal)) {
      modalGrid = grid;

      return;
    }
    grid.dispatchEvent(new CustomEvent('ps:grid-bulk-action', {
      bubbles: true,
      detail: { gridId: grid.dataset.psDataGridId, actionId: item.dataset.psDataActionId, ids: checkedIds(grid) },
    }));
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    const block = modalGrid && form instanceof HTMLFormElement && form.closest('.modal') && form.dataset.bulkInputsId
      ? form.querySelector(`#${form.dataset.bulkInputsId}`)
      : null;

    if (!block) {
      return;
    }
    form.querySelectorAll('[data-ps-ref="grid-bulk-input"]').forEach((input) => input.remove());
    checkedIds(modalGrid).forEach((id) => {
      const template = document.createElement('template');

      template.innerHTML = block.dataset.prototype.replace(/__name__/g, id);
      const input = template.content.firstElementChild;

      input.value = id;
      input.setAttribute('data-ps-ref', 'grid-bulk-input');
      form.append(input);
    });
  }, true);
}
