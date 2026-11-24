/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Kpi> renders (kpi.html.twig) and its Twig call, for the Kpi story and the playground pages.
import accountBalanceWallet from '../../icons/material-symbols/account-balance-wallet.svg?raw';
import accountBox from '../../icons/material-symbols/account-box.svg?raw';
import bookmark from '../../icons/material-symbols/bookmark.svg?raw';
import calendarToday from '../../icons/material-symbols/calendar-today.svg?raw';
import info from '../../icons/material-symbols/info.svg?raw';
import mail from '../../icons/material-symbols/mail.svg?raw';
import percent from '../../icons/material-symbols/percent.svg?raw';
import person from '../../icons/material-symbols/person.svg?raw';
import removeShoppingCart from '../../icons/material-symbols/remove-shopping-cart.svg?raw';
import shoppingBasket from '../../icons/material-symbols/shopping-basket.svg?raw';
import shoppingCart from '../../icons/material-symbols/shopping-cart.svg?raw';
import toggleOff from '../../icons/material-symbols/toggle-off.svg?raw';
import uiIcon from './ui-icon';
import { twigCall } from './twig-snippet';

// Kpi.php defaults; title is required
export const KPI_DEFAULTS = {
  value: null, subtitle: null, icon: null, color: 'oceanblue', href: null, tooltip: null, refreshUrl: null,
};

export const KPI_COLORS = ['oceanblue', 'purple', 'amber', 'green'];

// The icons of the core KPIs the stories show
export const KPI_ICONS = {
  account_balance_wallet: accountBalanceWallet,
  account_box: accountBox,
  bookmark,
  calendar_today: calendarToday,
  mail,
  percent,
  person,
  remove_shopping_cart: removeShoppingCart,
  shopping_basket: shoppingBasket,
  shopping_cart: shoppingCart,
  toggle_off: toggleOff,
};

const attributes = (entries) => Object.entries(entries).filter(([, value]) => value !== null && value !== undefined).map(([name, value]) => ` ${name}="${value}"`).join('');

/**
 * @param {object} props the props as in Twig: title, value, subtitle, icon, color, href, tooltip, refreshUrl; id
 */
export default function kpi({
  title, value = null, subtitle = null, icon = null, color = 'oceanblue', href = null, tooltip = null, refreshUrl = null, id = null,
}) {
  const tag = href ? 'a' : 'div';
  const root = attributes({
    class: `card ps-kpi ps-kpi--${color}`,
    'data-ps-ref': 'kpi',
    href,
    'data-bs-toggle': href && tooltip ? 'tooltip' : null,
    'data-bs-title': href && tooltip ? tooltip : null,
    'data-ps-data-refresh-url': refreshUrl,
    id,
  });
  const iconHtml = icon ? `<span class="ps-kpi__icon">${uiIcon(KPI_ICONS[icon] ?? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"></svg>', { size: 'lg' })}</span>` : '';
  const infoButton = tooltip && !href
    ? `<button class="btn btn-link btn-sm ps-button ps-icon-button ps-kpi__info" type="button" data-ps-data-busy-label="Loading..." aria-label="${tooltip}" data-bs-toggle="tooltip" data-bs-title="${tooltip}" data-ps-ref="kpi-info">${uiIcon(info, { size: 'lg' })}</button>`
    : '';
  const valueHtml = refreshUrl
    ? '<p class="ps-kpi__value placeholder-glow" data-ps-ref="kpi-value" aria-busy="true"><span class="placeholder ps-kpi__placeholder" aria-hidden="true"></span></p>'
    : `<p class="ps-kpi__value" data-ps-ref="kpi-value">${value ?? '—'}</p>`;
  const subtitleHtml = subtitle ? `<p class="ps-kpi__subtitle">${subtitle}</p>` : '';

  return {
    html: `<${tag}${root}><div class="card-body ps-kpi__body">${iconHtml}<div class="ps-kpi__text"><p class="ps-kpi__title">${title}${infoButton}</p>${valueHtml}${subtitleHtml}</div></div></${tag}>`,
    twig: twigCall('ui:Kpi', { title, value, subtitle, icon, color, href, tooltip, refreshUrl, ...(id ? { id } : {}) }, KPI_DEFAULTS),
  };
}
