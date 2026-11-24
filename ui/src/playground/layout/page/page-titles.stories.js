/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Every core page title of the page head with its icon (Toolbar::KIT_TITLE_ICONS), by side menu entry, to check them
// side by side: a group with sub-pages shows its name and icon on each of them, a page without sub-pages its own.
import { playgroundMeta } from '../../playground.meta.js';
import { boLayout } from '../bo-layout.js';
import pageHead from '../../../stories/page-head';
import uiIcon from '../../../stories/ui-icon';

// Only the icons of the table are loaded
const files = import.meta.glob('../../../../icons/material-symbols/*.svg', { query: '?raw', import: 'default' });
const path = (name) => `../../../../icons/material-symbols/${name.replaceAll('_', '-')}.svg`;

export default {
  title: 'Playground/Layout/Page titles',
  tags: ['!autodocs'],
  ...playgroundMeta,
};

// [side menu entry, its icon (NavBar), [[title, icon, sub-pages]]], as Toolbar::KIT_TITLE_ICONS and the menu of 9.x
const MENU = [
  ['Dashboard', 'home', [['Dashboard', 'home']]],
  ['Orders', 'shopping_basket', [
    ['Orders', 'shopping_basket'], ['Invoices', 'receipt_long'], ['Credit Slips', 'currency_exchange'],
    ['Delivery Slips', 'package_2'], ['Shopping Carts', 'shopping_cart'],
  ]],
  ['Catalog', 'store', [
    ['Products', 'inventory_2'], ['Categories', 'category'], ['Monitoring', 'monitor_heart'],
    ['Attributes & Features', 'style', 'Attributes | Features'], ['Brands & Suppliers', 'factory', 'Brands | Suppliers'],
    ['Files', 'attach_file'], ['Discounts', 'sell', 'Cart Rules | Catalog Price Rules'], ['Stock', 'warehouse'],
  ]],
  ['Customers', 'group', [['Customers', 'group'], ['Addresses', 'home_pin']]],
  ['Customer Service', 'support_agent', [
    ['Customer Service', 'support_agent'], ['Order Messages', 'sms'], ['Merchandise Returns', 'assignment_return'],
  ]],
  ['Stats', 'monitoring', [['Stats', 'monitoring']]],
  ['Modules', 'extension', [['Module Manager', 'extension', 'Modules | Alerts | Updates']]],
  ['Design', 'palette', [
    ['Theme & Logo', 'brush', 'Theme & Logo | Pages Configuration | Advanced Customization'], ['Email Theme', 'drafts'],
    ['Pages', 'description'], ['Positions', 'anchor'], ['Image Settings', 'image'],
  ]],
  ['Shipping', 'local_shipping', [['Carriers', 'local_shipping'], ['Preferences', 'delivery_truck_speed']]],
  ['Payment', 'payments', [['Payment Methods', 'payments'], ['Preferences', 'credit_card']]],
  ['International', 'public', [
    ['Localization', 'flag', 'Localization | Languages | Currencies | Geolocation'], ['Locations', 'location_on', 'Zones | Countries | States'],
    ['Taxes', 'percent', 'Taxes | Tax Rules'], ['Translations', 'translate'],
  ]],
  ['Shop Parameters', 'settings', [
    ['General', 'settings', 'General | Maintenance'], ['Order Settings', 'fact_check', 'Order Settings | Statuses'],
    ['Product Settings', 'inventory'], ['Customer Settings', 'manage_accounts', 'Customer Settings | Groups | Titles'],
    ['Contact', 'contact_mail', 'Contacts | Stores'], ['Traffic & SEO', 'travel_explore', 'SEO & URLs | Search Engines'],
    ['Search', 'search', 'Search | Aliases | Tags'],
  ]],
  ['Advanced Parameters', 'tune', [
    ['Information', 'info'], ['Performance', 'speed'], ['Administration', 'admin_panel_settings'], ['E-mail', 'mail'],
    ['Import', 'upload'], ['Team', 'badge', 'Employees | Roles | Permissions'], ['Database', 'database', 'SQL Manager | DB Backup'],
    ['Logs', 'history'], ['Webservice', 'api'], ['Extra Properties', 'data_object'], ['Admin API', 'key'],
    ['New & Experimental Features', 'science'], ['Security', 'shield', 'Security | Employee Sessions | Customer Sessions'],
  ]],
];

// Story chrome: a table of the titles as the page head shows them
const table = (svg) => {
  const title = (label, icon) => `<span class="ps-page-head__title">${uiIcon(svg[icon], { class: 'ps-page-head__icon' })}${label}</span>`;

  return `
  <div class="card">
    <div class="card-body">
      <table class="table align-middle">
        <thead><tr><th scope="col">Side menu</th><th scope="col">Page title</th><th scope="col">Icon</th><th scope="col">Sub-pages</th></tr></thead>
        <tbody>${MENU.map(([entry, entryIcon, pages]) => pages.map(([label, icon, subPages = ''], index) => `
          <tr>
            <td>${index === 0 ? `${uiIcon(svg[entryIcon])} ${entry}` : ''}</td>
            <td>${title(label, icon)}</td>
            <td><code>${icon}</code></td>
            <td class="text-body-secondary">${subPages}</td>
          </tr>`).join('')).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
};

const names = [...new Set(MENU.flatMap(([, entryIcon, pages]) => [entryIcon, ...pages.map(([, icon]) => icon)]))];

export const AllTitles = {
  loaders: [async () => ({ svg: Object.fromEntries(await Promise.all(names.map(async (name) => [name, await files[path(name)]()]))) })],
  render: (args, { loaded: { svg } }) => boLayout(pageHead({ title: 'Page titles' }).html + table(svg)),
};
