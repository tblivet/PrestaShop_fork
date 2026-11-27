/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// A <twig:ui:Grid> sorted by position (Grid/cell/position_handle.html.twig): a row moves by its handle (drag) or by Move
// up and Move down; then the page's positions go to the update URL as the old grids sent them (positions[i][rowId],
// [oldPosition], [newPosition], in the rows' new order, each row taking the position its new place had), through the
// grid's action form, and the page reloads with its message. Moves stay within the page.

const handles = (grid: Element): HTMLElement[] => [...grid.querySelectorAll<HTMLElement>(selectors.gridPosition)];

const send = (grid: HTMLElement): void => {
  const all = handles(grid);
  const form = grid.querySelector<HTMLFormElement>(selectors.gridActionForm);

  if (!all.length || !form) {
    return;
  }
  const places = all.map((handle) => Number(handle.dataset.psDataPosition)).sort((a, b) => a - b);
  const field = (name: string, value: string | number | undefined): void => {
    const input = document.createElement('input');

    input.type = 'hidden';
    input.name = name;
    input.value = String(value);
    form.append(input);
  };
  const method = all[0].dataset.psDataMethod || 'POST';

  form.replaceChildren();
  all.forEach((handle, index) => {
    field(`positions[${index}][rowId]`, handle.dataset.psDataId);
    field(`positions[${index}][oldPosition]`, handle.dataset.psDataPosition);
    field(`positions[${index}][newPosition]`, places[index]);
  });
  if (!['GET', 'POST'].includes(method)) {
    field('_method', method);
  }
  form.action = all[0].dataset.psDataUrl ?? '';
  form.method = method === 'GET' ? 'get' : 'post';
  grid.dataset.psState = 'loading';
  form.submit();
};

// The row next to this one that can move, the preview rows skipped
const neighbour = (row: Element, direction: string | undefined): Element | null => {
  let next = direction === 'up' ? row.previousElementSibling : row.nextElementSibling;

  while (next && !next.querySelector(selectors.gridPosition)) {
    next = direction === 'up' ? next.previousElementSibling : next.nextElementSibling;
  }

  return next;
};

// A row with the preview row that belongs to it, as moved together
const withPreview = (row: Element): Element[] => {
  const preview = row.nextElementSibling?.matches(selectors.gridPreviewRow) ? row.nextElementSibling : null;

  return preview ? [row, preview] : [row];
};

export default function initGridPosition(): void {
  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>(selectors.gridMove) : null;
    const row = button?.closest('tr');
    const grid = row?.closest<HTMLElement>(selectors.grid);

    if (!button || !row || !grid || grid.dataset.psState === 'loading') {
      return;
    }
    const direction = button.dataset.psDataDirection;
    const other = neighbour(row, direction);

    if (!other) {
      return;
    }
    if (direction === 'up') {
      other.before(...withPreview(row));
    } else {
      withPreview(other)
        .at(-1)
        ?.after(...withPreview(row));
    }
    send(grid);
  });

  // Drag: only from the handle, the row follows the pointer over the others
  let dragged: HTMLTableRowElement | null = null;
  let moved = false;

  document.addEventListener('pointerdown', (event) => {
    const handle = event.target instanceof Element ? event.target.closest(selectors.gridDrag) : null;
    const row = handle?.closest('tr');

    if (row) {
      row.draggable = true;
    }
  });
  document.addEventListener('dragstart', (event) => {
    const row = event.target instanceof HTMLTableRowElement && event.target.draggable ? event.target : null;

    if (!row?.closest(selectors.grid)) {
      return;
    }
    dragged = row;
    moved = false;
    row.dataset.psState = 'dragging';
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', '');
    }
  });
  document.addEventListener('dragover', (event) => {
    const over = dragged && event.target instanceof Element ? event.target.closest('tr') : null;

    if (
      !over ||
      !dragged ||
      over === dragged ||
      over.parentElement !== dragged.parentElement ||
      !over.querySelector(selectors.gridPosition)
    ) {
      if (dragged && event.target instanceof Element && event.target.closest('tbody') === dragged.parentElement) {
        event.preventDefault();
      }

      return;
    }
    event.preventDefault();
    const { top, height } = over.getBoundingClientRect();

    if (event.clientY < top + height / 2) {
      over.before(...withPreview(dragged));
    } else {
      withPreview(over)
        .at(-1)
        ?.after(...withPreview(dragged));
    }
    moved = true;
  });
  document.addEventListener('drop', (event) => {
    if (dragged) {
      event.preventDefault();
    }
  });
  document.addEventListener('dragend', () => {
    if (!dragged) {
      return;
    }
    const row = dragged;
    const grid = row.closest<HTMLElement>(selectors.grid);

    dragged = null;
    row.draggable = false;
    delete row.dataset.psState;
    if (moved && grid) {
      send(grid);
    }
  });
}
