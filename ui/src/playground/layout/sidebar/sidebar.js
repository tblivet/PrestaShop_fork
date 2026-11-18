/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The BO menu mockup (<twig:ui:SideMenu>, see Components/SideMenu) with its icons drawn
import campaign from '../../../../icons/material-symbols/campaign.svg?raw';
import extension from '../../../../icons/material-symbols/extension.svg?raw';
import group from '../../../../icons/material-symbols/group.svg?raw';
import home from '../../../../icons/material-symbols/home.svg?raw';
import keyboardArrowDown from '../../../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import localShipping from '../../../../icons/material-symbols/local-shipping.svg?raw';
import monitoring from '../../../../icons/material-symbols/monitoring.svg?raw';
import openInNew from '../../../../icons/material-symbols/open-in-new.svg?raw';
import palette from '../../../../icons/material-symbols/palette.svg?raw';
import payments from '../../../../icons/material-symbols/payments.svg?raw';
import publicIcon from '../../../../icons/material-symbols/public.svg?raw';
import settings from '../../../../icons/material-symbols/settings.svg?raw';
import shoppingBasket from '../../../../icons/material-symbols/shopping-basket.svg?raw';
import store from '../../../../icons/material-symbols/store.svg?raw';
import storefront from '../../../../icons/material-symbols/storefront.svg?raw';
import supportAgent from '../../../../icons/material-symbols/support-agent.svg?raw';
import tune from '../../../../icons/material-symbols/tune.svg?raw';
import pMonogram from '../../../../icons/brand/p-monogram.svg?raw';
import { expandIcons } from '../../ui-icons';
import sidebarHtml from './sidebar.html?raw';

export default expandIcons(sidebarHtml, {
  'brand:p-monogram': pMonogram,
  campaign,
  extension,
  group,
  home,
  keyboard_arrow_down: keyboardArrowDown,
  local_shipping: localShipping,
  monitoring,
  open_in_new: openInNew,
  palette,
  payments,
  public: publicIcon,
  settings,
  shopping_basket: shoppingBasket,
  store,
  storefront,
  support_agent: supportAgent,
  tune,
});
