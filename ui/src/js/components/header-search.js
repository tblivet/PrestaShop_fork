/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// The header search (<twig:ui:HeaderSearch>): picking where to search fills the hidden bo_search_type field, the button text and icon
// and the field's placeholder, then goes back to the field. On a phone the search is a panel: opening it focuses the
// field.
export default function initHeaderSearch() {
  document.addEventListener('click', (event) => {
    const choice = event.target instanceof Element ? event.target.closest(selectors.setSearchType) : null;
    const form = choice?.closest(selectors.headerSearch);

    if (!form) {
      return;
    }

    form.querySelector(selectors.headerSearchType).value = choice.dataset.psValue;
    form.querySelector(selectors.headerSearchScope).textContent = choice.textContent.trim();

    // The button shows the chosen type's icon: a copy of the one in its menu item, with the button icon's class
    const scopeIcon = form.querySelector(selectors.headerSearchScopeIcon);
    const choiceIcon = choice.querySelector('svg');
    if (scopeIcon && choiceIcon) {
      const icon = choiceIcon.cloneNode(true);

      icon.setAttribute('class', scopeIcon.getAttribute('class'));
      icon.dataset.psRef = 'header-search-scope-icon';
      scopeIcon.replaceWith(icon);
    }
    form.querySelectorAll(selectors.setSearchType).forEach((item) => {
      if (item === choice) {
        item.setAttribute('aria-current', 'true');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    const input = form.querySelector(selectors.headerSearchInput);
    input.placeholder = choice.dataset.psDataPlaceholder;
    input.focus();
  });

  document.addEventListener('shown.bs.offcanvas', (event) => {
    event.target.querySelector(`${selectors.headerSearch} ${selectors.headerSearchInput}`)?.focus();
  });
}
