/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Header> (src/PrestaShopBundle/Twig/Component/Ui/Header.php) renders this markup, keep both in sync.
// The search panel and the side menu drawer use Bootstrap offcanvas-md, the search type menu Bootstrap dropdown.
import bookmarkAdd from '../../../icons/material-symbols/bookmark-add.svg?raw';
import bookmarks from '../../../icons/material-symbols/bookmarks.svg?raw';
import bugReport from '../../../icons/material-symbols/bug-report.svg?raw';
import build from '../../../icons/material-symbols/build.svg?raw';
import menu from '../../../icons/material-symbols/menu.svg?raw';
import pMonogram from '../../../icons/brand/p-monogram.svg?raw';
import settings from '../../../icons/material-symbols/settings.svg?raw';
import warning from '../../../icons/material-symbols/warning.svg?raw';
import headerAction from '../header-action';
import headerSearch, { SEARCH_ICONS, SEARCH_TYPES } from '../header-search';
import uiIcon from '../ui-icon';
import { framedNodes, markup, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const ICONS = { bookmark_add: bookmarkAdd, bookmarks, bug_report: bugReport, build, settings, warning };

// Header.php defaults; homeUrl and logo are required
const DEFAULTS = { menuId: 'ps-side-menu' };

// The <twig:ui:HeaderSearch> props
const SEARCH = { action: '#search', types: SEARCH_TYPES };

// The page shell's actions (Component/Layout/Ui/header.html.twig), icon only: the shop state when a mode is on, the
// quick access (Component/Layout/Ui/quick_access.html.twig)
const SHOP_STATE = {
  label: 'Shop state',
  icon: 'warning',
  warning: true,
  iconOnly: true,
  items: [
    { label: 'Debug mode', href: '#performance', icon: 'bug_report' },
    { type: 'text', label: 'All PHP errors and messages are shown. Turn debug mode off when you no longer need it.' },
    { type: 'divider' },
    { label: 'Maintenance mode', href: '#maintenance', icon: 'build' },
    { type: 'text', label: 'Your shop is closed to visitors and customers. Turn maintenance mode off when you are ready.' },
  ],
};

const QUICK_ACCESS = {
  label: 'Quick access',
  icon: 'bookmarks',
  iconOnly: true,
  items: [
    { label: 'Orders', href: '#orders' },
    { label: 'New product', href: '#new-product' },
    { type: 'divider' },
    { label: 'Add this page to quick access', icon: 'bookmark_add' },
    { label: 'Manage quick access', href: '#quick-access', icon: 'settings' },
  ],
};

// A <twig:block> of the Header and its content
const block = (name, nodes) => markup(`<twig:block name="${name}">\n${nodes.map((node) => node.twig.split('\n').map((line) => `  ${line}`).join('\n')).join('\n')}\n</twig:block>`);

// The markup of header.html.twig around its blocks: a <twig:ui:HeaderSearch> in search (props), <twig:ui:HeaderAction>
// props in actions
const header = ({ homeUrl = '#home', logo = '/prestashop.svg', menuId = 'ps-side-menu', search = SEARCH, actions = [] }) => {
  const searchNode = headerSearch(search, SEARCH_ICONS);
  const actionNodes = actions.map((props) => headerAction(props, ICONS));
  const blocks = [
    block('search', [searchNode]),
    ...(actionNodes.length ? [block('actions', actionNodes)] : []),
  ];

  return {
    html: '<header class="ps-header d-print-none">'
      + `<button type="button" class="ps-header__menu-toggle" data-bs-toggle="offcanvas" data-bs-target="#${menuId}" aria-controls="${menuId}" aria-label="Open the menu">${uiIcon(menu, { size: 'xl' })}</button>`
      + `<a class="ps-header__brand" href="${homeUrl}">${uiIcon(pMonogram, { label: 'PrestaShop', size: 'xl', class: 'ps-header__monogram' })}<img class="ps-header__logo" src="${logo}" alt="PrestaShop" width="130" height="14"></a>`
      + searchNode.html
      + `<div id="header_infos" class="ps-header__actions">${actionNodes.map((node) => node.html).join('')}</div>`
      + '</header>',
    twig: twigCall('ui:Header', { homeUrl, logo, menuId }, DEFAULTS, blocks),
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
          '**Twig usage**: `<twig:ui:Header homeUrl="{{ ps.defaultTabLink }}" logo="{{ asset(\'prestashop.svg\', \'ui_kit\') }}"><twig:block name="search"><twig:ui:HeaderSearch …/></twig:block><twig:block name="actions"><twig:ui:HeaderAction …/></twig:block></twig:ui:Header>`. The top bar of every kit page, rendered once by the page shell (`Component/Layout/Ui/header.html.twig`, fed by the `Header` component), never by a page.',
          '**Props**: `homeUrl` (required: where the logo goes), `logo` (required: URL of the logo image, a dark logo shown white), `menuId` (default `ps-side-menu`: the `<twig:ui:SideMenu>` its menu button opens below md). Blocks: `search` (a `<twig:ui:HeaderSearch>`, see Components/HeaderSearch, on every back office page), `actions` (the header actions at the end of the bar, `<twig:ui:HeaderAction>`). Content outside these blocks is not shown. The version and View my shop are at the bottom of the side menu. Other attributes go on the `<header>`.',
          '**Do**: what is about the whole back office, icon only so the bar keeps its room at every width: the shop state first (amber, only when a mode is on), then the quick access; the page shell ends the `actions` block with the notifications and the employee menu, components of their own (`NotificationsCenter`, `EmployeeDropdown`), shown in the playground. **Don\'t**: page actions (they go in the page header), more than five actions.',
          '**States**: the bar, the shop state (debug and maintenance on), long labels. Below sm the PrestaShop mark replaces the logo. Below md (use the viewport toolbar): the menu button opens the side menu, the search button a panel sliding from the top, actions show their icon only.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    homeUrl: { control: 'text', description: 'Where the logo goes (required)' },
    logo: { control: 'text', description: 'Logo image URL (required)' },
    menuId: { control: 'text', description: 'Id of the side menu it opens below md' },
    search: { control: 'object', description: 'Story only: the <twig:ui:HeaderSearch> props of the search block' },
  }, DEFAULTS),
  args: { homeUrl: '#home', logo: '/prestashop.svg', ...DEFAULTS, search: SEARCH },
};

export const Default = withTwig((args) => framedNodes([header({ ...args, actions: [QUICK_ACCESS] })], room));

export const ShopState = withTwig(() => framedNodes([header({ actions: [SHOP_STATE, QUICK_ACCESS] })], room), {
  docs: { description: { story: 'Debug or maintenance mode on: one amber square, first, on every page while a mode is on; its menu says what each mode means and links to where it is turned off.' } },
});

export const LongLabels = withTwig(() => framedNodes([header({
  search: { ...SEARCH, type: 2, types: [...SEARCH.types.slice(0, 2), { value: 2, label: 'Kunden nach Namen', placeholder: 'Vor- oder Nachname des Kunden', icon: 'group' }] },
  actions: [QUICK_ACCESS],
})], room), { docs: { description: { story: 'A German search type: the field shrinks first.' } } });
