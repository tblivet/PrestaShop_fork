/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Header> (src/PrestaShopBundle/Twig/Component/Ui/Header.php) renders this markup, keep both in sync.
// The search panel and the side menu drawer use Bootstrap offcanvas-md, the search type menu Bootstrap dropdown.
import bugReport from '../../../icons/material-symbols/bug-report.svg?raw';
import build from '../../../icons/material-symbols/build.svg?raw';
import keyboardArrowDown from '../../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import logout from '../../../icons/material-symbols/logout.svg?raw';
import menu from '../../../icons/material-symbols/menu.svg?raw';
import person from '../../../icons/material-symbols/person.svg?raw';
import search from '../../../icons/material-symbols/search.svg?raw';
import storefront from '../../../icons/material-symbols/storefront.svg?raw';
import dropdownMenu from '../dropdown-menu';
import headerAction from '../header-action';
import uiIcon from '../ui-icon';
import { framedNodes, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const ICONS = { bug_report: bugReport, build, logout, person, storefront };

// Header.php defaults; homeUrl and logo are required
const DEFAULTS = { version: null, menuId: 'ps-side-menu', search: null };

const SEARCH = {
  action: '#search',
  query: '',
  type: 0,
  types: [
    { value: 0, label: 'Everywhere', placeholder: 'Products, orders, customers…' },
    { value: 1, label: 'Catalog', placeholder: 'Product name or reference' },
    { value: 2, label: 'Customers by name', placeholder: 'Name' },
    { value: 3, label: 'Orders', placeholder: 'Order ID' },
  ],
};

const ACCOUNT_ITEMS = [
  { label: 'Your profile', href: '#profile', icon: 'person' },
  { type: 'divider' },
  { label: 'Sign out', href: '#sign-out', icon: 'logout' },
];

const STORE = { label: 'View my shop', icon: 'storefront', href: '#store', external: true };
const ACCOUNT = { label: 'Marc Beier', image: '/playground/avatar.svg', items: ACCOUNT_ITEMS };

const searchMarkup = ({ action, query = '', type = 0, types = [] }) => {
  const current = types.find((item) => item.value === type) ?? null;
  const items = types.map((item) => ({
    label: item.label,
    active: item.value === type,
    attr: { 'data-ps-action': 'set-search-type', 'data-ps-value': item.value, 'data-ps-data-placeholder': item.placeholder },
  }));
  const scope = current
    ? '<button type="button" class="btn ps-header__search-scope" data-bs-toggle="dropdown" aria-expanded="false">'
      + `<span class="visually-hidden">Search in </span><span data-ps-ref="header-search-scope">${current.label}</span>${uiIcon(keyboardArrowDown, { size: 'lg' })}</button>`
      + dropdownMenu({ items, align: 'end' })
    : '';

  return '<div id="ps-header-search" class="ps-header__search offcanvas-md offcanvas-top" tabindex="-1">'
    + `<form class="ps-header__search-form" method="post" action="${action}" role="search" data-ps-ref="header-search">`
    + `<input type="hidden" name="bo_search_type" value="${type}" data-ps-ref="header-search-type">`
    + '<div class="input-group">'
    + `<input type="search" name="bo_query" value="${query}" class="form-control ps-header__search-input" placeholder="${current ? current.placeholder : 'Search'}" aria-label="Search" data-ps-ref="header-search-input">`
    + `${scope}<button type="submit" class="btn ps-header__search-submit" aria-label="Search">${uiIcon(search, { size: 'lg' })}</button>`
    + '</div></form></div>'
    + '<button type="button" class="ps-header__search-toggle" data-bs-toggle="offcanvas" data-bs-target="#ps-header-search" aria-controls="ps-header-search" aria-label="Search">'
    + `${uiIcon(search, { size: 'xl' })}</button>`;
};

// The markup of header.html.twig around its actions (the content, <twig:ui:HeaderAction> calls)
const header = ({ homeUrl = '#home', logo = '/prestashop.svg', version = null, menuId = 'ps-side-menu', search: searchProps = null, actions = [] }) => {
  const nodes = actions.map((props) => headerAction(props, ICONS));

  return {
    html: '<header class="ps-header d-print-none">'
      + `<button type="button" class="ps-header__menu-toggle" data-bs-toggle="offcanvas" data-bs-target="#${menuId}" aria-controls="${menuId}" aria-label="Open the menu">${uiIcon(menu, { size: 'xl' })}</button>`
      + `<a class="ps-header__brand" href="${homeUrl}"><img class="ps-header__logo" src="${logo}" alt="PrestaShop" width="130" height="14"></a>`
      + `${version ? `<span class="ps-header__version">${version}</span>` : ''}`
      + `${searchProps ? searchMarkup(searchProps) : ''}`
      + `<div class="ps-header__actions">${nodes.map((node) => node.html).join('')}</div>`
      + '</header>',
    twig: twigCall('ui:Header', { homeUrl, logo, version, menuId, search: searchProps }, DEFAULTS, nodes),
  };
};

// Story chrome: room for the open menus
const room = (html) => `<div style="min-height: 16rem">${html}</div>`;

export default {
  title: 'Components/Header',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Header homeUrl="{{ ps.defaultTabLink }}" logo="{{ asset(\'prestashop.svg\', \'ui_kit\') }}" version="{{ ps.version }}" :search="{action: …, types: […]}"><twig:ui:HeaderAction …/></twig:ui:Header>`. The top bar of every kit page, rendered once by the page shell (`Component/Layout/Ui/header.html.twig`, fed by the `Header` component), never by a page.',
          '**Props**: `homeUrl` (required: where the logo goes), `logo` (required: URL of the logo image, a dark logo shown white), `version` (default none: the PrestaShop version, shown from md up), `menuId` (default `ps-side-menu`: the `<twig:ui:SideMenu>` its menu button opens below md), `search` (default none: `{action, query, type, types}`. The field posts `bo_query`, the hidden `bo_search_type` takes the chosen type; `types` is a list of `{value, label, placeholder}` picked in a menu after the field, the chosen one sets the placeholder; an unknown `type` falls back to the first). Content: the header actions, `<twig:ui:HeaderAction>`. Other attributes go on the `<header>`.',
          '**Do**: what is about the whole back office (search, the store, the shop state, the employee). **Don\'t**: page actions (they go in the page header), more than five actions.',
          '**States**: the full bar, the shop states (debug, maintenance), without search, long labels. Below md (use the viewport toolbar): the menu button opens the side menu, the search button a panel sliding from the top, actions show their icon only.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    homeUrl: { control: 'text', description: 'Where the logo goes (required)' },
    logo: { control: 'text', description: 'Logo image URL (required)' },
    version: { control: 'text', description: 'PrestaShop version' },
    menuId: { control: 'text', description: 'Id of the side menu it opens below md' },
    search: { control: 'object', description: 'The search form, none without it' },
  }, DEFAULTS),
  args: { homeUrl: '#home', logo: '/prestashop.svg', ...DEFAULTS, version: '9.3.0', search: SEARCH },
};

export const Default = withTwig(({ version, ...args }) => framedNodes([header({ ...args, version: version || null, actions: [STORE, ACCOUNT] })], room));

export const ShopStates = withTwig(() => framedNodes([header({
  version: '9.3.0',
  search: SEARCH,
  actions: [
    { label: 'Debug mode', icon: 'bug_report', href: '#performance', description: 'All PHP errors and messages are shown. Turn debug mode off when you no longer need it.' },
    { label: 'Maintenance mode', icon: 'build', href: '#maintenance', description: 'Your shop is closed to visitors and customers. Turn maintenance mode off when you are ready.' },
    STORE,
    ACCOUNT,
  ],
})], room), { docs: { description: { story: 'Debug and maintenance modes stay visible on every page while they are on; their tooltip says what they mean.' } } });

export const WithoutSearch = withTwig(() => framedNodes([header({ actions: [STORE, ACCOUNT] })], room), {
  docs: { description: { story: 'Without `search` and `version`: the logo and the actions.' } },
});

export const LongLabels = withTwig(() => framedNodes([header({
  version: '9.3.0',
  search: { ...SEARCH, type: 2, types: [...SEARCH.types.slice(0, 2), { value: 2, label: 'Kunden nach Namen', placeholder: 'Vor- oder Nachname des Kunden' }] },
  actions: [
    { ...STORE, label: 'Meinen Shop ansehen' },
    { ...ACCOUNT, label: 'Maximilian Alexander von Hohenzollern-Sigmaringen' },
  ],
})], room), { docs: { description: { story: 'German labels and a long name: the field shrinks first, a long name is cut at 12rem.' } } });
