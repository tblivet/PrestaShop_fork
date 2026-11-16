/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The BO header mockup (<twig:ui:Header>, see Components/Header) with its icons drawn
import bookmarkAdd from '../../../../icons/material-symbols/bookmark-add.svg?raw';
import bookmarks from '../../../../icons/material-symbols/bookmarks.svg?raw';
import keyboardArrowDown from '../../../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import logout from '../../../../icons/material-symbols/logout.svg?raw';
import menu from '../../../../icons/material-symbols/menu.svg?raw';
import person from '../../../../icons/material-symbols/person.svg?raw';
import search from '../../../../icons/material-symbols/search.svg?raw';
import settings from '../../../../icons/material-symbols/settings.svg?raw';
import shoppingBasket from '../../../../icons/material-symbols/shopping-basket.svg?raw';
import store from '../../../../icons/material-symbols/store.svg?raw';
import storefront from '../../../../icons/material-symbols/storefront.svg?raw';
import pMonogram from '../../../../icons/brand/p-monogram.svg?raw';
import { expandIcons } from '../../ui-icons';
import headerHtml from './header.html?raw';

export default expandIcons(headerHtml, {
  'brand:p-monogram': pMonogram,
  bookmark_add: bookmarkAdd,
  bookmarks,
  keyboard_arrow_down: keyboardArrowDown,
  logout,
  menu,
  person,
  search,
  settings,
  shopping_basket: shoppingBasket,
  store,
  storefront,
});
