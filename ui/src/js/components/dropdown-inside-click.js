/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// A click in an open Bootstrap menu closes it only on what acts (an item, a link, a button): Bootstrap's autoClose
// closes it on any click inside, its padding, a divider or a heading included, which reads as a menu shutting by
// itself. A click outside still closes it.
const ACTS = 'a, button, [role="menuitem"], .dropdown-item';

export default function initDropdownInsideClick() {
  document.addEventListener('hide.bs.dropdown', (event) => {
    const click = event.clickEvent;
    const menu = event.target.parentElement?.querySelector(':scope > .dropdown-menu');

    if (click && menu?.contains(click.target) && !click.target.closest(ACTS)) {
      event.preventDefault();
    }
  });
}
