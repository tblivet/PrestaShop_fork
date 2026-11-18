/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The BO header mockup (<twig:ui:Header>, see Components/Header) with its icons drawn
import allInclusive from '../../../../icons/material-symbols/all-inclusive.svg?raw';
import bookmarkAdd from '../../../../icons/material-symbols/bookmark-add.svg?raw';
import bookmarks from '../../../../icons/material-symbols/bookmarks.svg?raw';
import bugReport from '../../../../icons/material-symbols/bug-report.svg?raw';
import build from '../../../../icons/material-symbols/build.svg?raw';
import keyboardArrowDown from '../../../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import logout from '../../../../icons/material-symbols/logout.svg?raw';
import menu from '../../../../icons/material-symbols/menu.svg?raw';
import notifications from '../../../../icons/material-symbols/notifications.svg?raw';
import person from '../../../../icons/material-symbols/person.svg?raw';
import search from '../../../../icons/material-symbols/search.svg?raw';
import settings from '../../../../icons/material-symbols/settings.svg?raw';
import shoppingBasket from '../../../../icons/material-symbols/shopping-basket.svg?raw';
import store from '../../../../icons/material-symbols/store.svg?raw';
import warning from '../../../../icons/material-symbols/warning.svg?raw';
import pMonogram from '../../../../icons/brand/p-monogram.svg?raw';
import { expandIcons } from '../../ui-icons';
import headerHtml from './header.html?raw';

export default expandIcons(headerHtml, {
  'brand:p-monogram': pMonogram,
  all_inclusive: allInclusive,
  bookmark_add: bookmarkAdd,
  bookmarks,
  bug_report: bugReport,
  build,
  keyboard_arrow_down: keyboardArrowDown,
  logout,
  menu,
  notifications,
  person,
  search,
  settings,
  shopping_basket: shoppingBasket,
  store,
  warning,
});
