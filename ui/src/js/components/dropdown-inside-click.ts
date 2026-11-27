/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// A click in an open Bootstrap menu closes it only on what acts (an item, a link, a button): Bootstrap's autoClose
// closes it on any click inside, its padding, a divider or a heading included, which reads as a menu shutting by
// itself. A click outside still closes it.
const ACTS = 'a, button, [role="menuitem"], .dropdown-item';

// Bootstrap's hide.bs.dropdown carries the click that closes the menu, if any
type DropdownHideEvent = Event & { clickEvent?: MouseEvent };

export default function initDropdownInsideClick(): void {
  document.addEventListener('hide.bs.dropdown', (event) => {
    const click = (event as DropdownHideEvent).clickEvent;
    const menu =
      event.target instanceof Element ? event.target.parentElement?.querySelector(':scope > .dropdown-menu') : null;

    if (click && click.target instanceof Element && menu?.contains(click.target) && !click.target.closest(ACTS)) {
      event.preventDefault();
    }
  });
}
