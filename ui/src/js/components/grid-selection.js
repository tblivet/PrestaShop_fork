/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { announce } from './announcer';

// A <twig:ui:Grid>'s selection (grid.html.twig): a select-all box (in the headings, and in the bulk bar) checks or
// clears the page's rows and shows "some" (indeterminate) when only some are. While a row is checked, the bulk bar
// lies over the headings' row, as tall as it is, the filters left in view: what is checked, the bulk menu, Clear selection; the
// controls it covers leave the tab order (the headings stay for screen readers). The count is announced as it changes.
// Per grid, so a page with several grids keeps them apart; run again on load, as a browser may restore the boxes.

const rowsOf = (grid) => [...grid.querySelectorAll(selectors.gridSelectRow)].filter((box) => !box.disabled);

// The headings' controls under the bar: out of the tab order while it shows
const cover = (grid, covered) => {
  const headings = grid.querySelector('thead tr');

  if (!headings) {
    return;
  }
  headings.querySelectorAll('a, button, input, select, textarea').forEach((control) => {
    if (covered) {
      control.setAttribute('tabindex', '-1');
    } else {
      control.removeAttribute('tabindex');
    }
  });
};

const update = (grid, { speak = false } = {}) => {
  const rows = rowsOf(grid);
  const checked = rows.filter((box) => box.checked).length;
  const count = grid.querySelector(selectors.gridSelectionCount);
  const bar = grid.querySelector(selectors.gridBulk);
  const text = count && (checked > 0 ? count.dataset.psDataSome.replace('%count%', String(checked)) : count.dataset.psDataNone);

  grid.querySelectorAll(selectors.gridSelectAll).forEach((all) => {
    all.checked = rows.length > 0 && checked === rows.length;
    all.indeterminate = checked > 0 && checked < rows.length;
  });
  if (count) {
    count.textContent = text;
  }
  if (bar && bar.hidden !== (checked === 0)) {
    bar.hidden = checked === 0;
    cover(grid, checked > 0);
  }
  if (speak && text) {
    announce(text);
  }
};

// The bar is as tall as the headings' row it lies over
const fitBar = (grid) => {
  const headings = grid.querySelector('thead tr');
  const area = grid.querySelector(selectors.gridBulk)?.parentElement;

  if (!headings || !area) {
    return;
  }
  new ResizeObserver(() => area.style.setProperty('--ps-grid-head-height', `${headings.offsetHeight}px`)).observe(headings);
};

export default function initGridSelection() {
  document.addEventListener('change', (event) => {
    const box = event.target;
    const grid = box instanceof HTMLInputElement ? box.closest(selectors.grid) : null;

    if (!grid) {
      return;
    }
    if (box.matches(selectors.gridSelectAll)) {
      rowsOf(grid).forEach((row) => {
        row.checked = box.checked;
      });
    } else if (!box.matches(selectors.gridSelectRow)) {
      return;
    }
    update(grid, { speak: true });
    // Cleared from the bar, which goes: the focus goes to the headings' select-all it uncovers
    if (box.closest(selectors.gridBulk)?.hidden) {
      grid.querySelector(`thead ${selectors.gridSelectAll}`)?.focus();
    }
  });

  // Clear selection: the bar goes, the focus goes to the headings' select-all it uncovers
  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest(selectors.gridClearSelection) : null;
    const grid = button?.closest(selectors.grid);

    if (!grid) {
      return;
    }
    rowsOf(grid).forEach((row) => {
      row.checked = false;
    });
    update(grid, { speak: true });
    grid.querySelector(`thead ${selectors.gridSelectAll}`)?.focus();
  });

  document.querySelectorAll(selectors.grid).forEach((grid) => {
    fitBar(grid);
    update(grid);
  });
}
