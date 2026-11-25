/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// A <twig:ui:Grid> row with a link (its first link action with clickable_row, grid.html.twig): a click on one of its
// clickable cells follows it, Ctrl/Cmd or the middle button in a new tab. Not on a control, not when the click ends a
// text selection or a drag. The keyboard has the action's own link, so the row is not focusable.

const followed = (event) => {
  const cell = event.target instanceof Element ? event.target.closest(selectors.gridClickableCell) : null;
  const row = cell?.closest(selectors.gridRowLink);

  if (!row || event.target.closest('a, button, input, select, textarea, label, [tabindex]')) {
    return null;
  }
  if (String(window.getSelection() ?? '') !== '') {
    return null;
  }

  return row.dataset.psDataHref;
};

export default function initGridRowLink() {
  document.addEventListener('click', (event) => {
    const href = event.button === 0 ? followed(event) : null;

    if (!href) {
      return;
    }
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      window.open(href, '_blank', 'noopener');
    } else {
      window.location.assign(href);
    }
  });
  document.addEventListener('auxclick', (event) => {
    const href = event.button === 1 ? followed(event) : null;

    if (href) {
      window.open(href, '_blank', 'noopener');
    }
  });
}
