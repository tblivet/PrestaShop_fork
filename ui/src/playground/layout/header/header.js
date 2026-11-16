/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The BO header mockup (<twig:ui:Header>, see Components/Header) with its icons drawn
import keyboardArrowDown from '../../../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import logout from '../../../../icons/material-symbols/logout.svg?raw';
import menu from '../../../../icons/material-symbols/menu.svg?raw';
import person from '../../../../icons/material-symbols/person.svg?raw';
import search from '../../../../icons/material-symbols/search.svg?raw';
import storefront from '../../../../icons/material-symbols/storefront.svg?raw';
import { expandIcons } from '../../ui-icons';
import headerHtml from './header.html?raw';

export default expandIcons(headerHtml, {
  keyboard_arrow_down: keyboardArrowDown,
  logout,
  menu,
  person,
  search,
  storefront,
});
