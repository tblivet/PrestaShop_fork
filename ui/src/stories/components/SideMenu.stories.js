/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:SideMenu> (src/PrestaShopBundle/Twig/Component/Ui/SideMenu.php) renders this markup, keep both in sync.
// Submenus use Bootstrap collapse, the drawer Bootstrap offcanvas-lg.
import campaign from '../../../icons/material-symbols/campaign.svg?raw';
import extension from '../../../icons/material-symbols/extension.svg?raw';
import group from '../../../icons/material-symbols/group.svg?raw';
import home from '../../../icons/material-symbols/home.svg?raw';
import keyboardArrowDown from '../../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import palette from '../../../icons/material-symbols/palette.svg?raw';
import settings from '../../../icons/material-symbols/settings.svg?raw';
import shoppingBasket from '../../../icons/material-symbols/shopping-basket.svg?raw';
import store from '../../../icons/material-symbols/store.svg?raw';
import tune from '../../../icons/material-symbols/tune.svg?raw';
import openInNew from '../../../icons/material-symbols/open-in-new.svg?raw';
import pMonogram from '../../../icons/brand/p-monogram.svg?raw';
import storefront from '../../../icons/material-symbols/storefront.svg?raw';
import uiIcon from '../ui-icon';
import { framedNodes, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const ICONS = { campaign, extension, group, home, palette, settings, shopping_basket: shoppingBasket, store, tune };

// SideMenu.php defaults; sections is required
const DEFAULTS = { label: null, shopUrl: null, version: null };

// A shortened back office menu: a section without a title (Dashboard), then titled sections
const SECTIONS = [
  { items: [{ label: 'Dashboard', href: '#dashboard', icon: 'home' }] },
  {
    title: 'Sell',
    items: [
      {
        label: 'Orders',
        icon: 'shopping_basket',
        children: [
          { label: 'Orders', href: '#orders' },
          { label: 'Invoices', href: '#invoices' },
          { label: 'Credit slips', href: '#credit-slips' },
        ],
      },
      { label: 'Catalog', href: '#catalog', icon: 'store' },
      { label: 'Customers', href: '#customers', icon: 'group' },
    ],
  },
  {
    title: 'Improve',
    items: [
      { label: 'Modules', href: '#modules', icon: 'extension' },
      { label: 'Design', href: '#design', icon: 'palette' },
      { label: 'Marketing', href: '#marketing', icon: 'campaign' },
    ],
  },
  {
    title: 'Configure',
    items: [
      { label: 'Shop parameters', href: '#shop-parameters', icon: 'settings' },
      { label: 'Advanced parameters', href: '#advanced-parameters', icon: 'tune' },
    ],
  },
];

// The sections with one page marked current, as a page passes them
const withCurrent = (sections, current) => sections.map((section) => ({
  ...section,
  items: section.items.map((item) => (item.children
    ? { ...item, children: item.children.map((child) => (child.label === current && child.href ? { ...child, current: true } : child)) }
    : (item.label === current ? { ...item, current: true } : item))),
}));

const iconOf = (name) => ICONS[name] ?? extension;
const currentAttr = (current) => (current ? ' aria-current="page"' : '');
const badge = (tag) => (tag
  ? `<span class="ps-side-menu__badge">${tag.logo ? uiIcon(pMonogram, { class: 'ps-side-menu__badge-logo' }) : ''}<span class="ps-side-menu__badge-label">${tag.label}</span></span>`
  : '');

const item = (entry, id) => {
  const icon = uiIcon(iconOf(entry.icon), { size: 'lg', class: 'ps-side-menu__icon' });
  const label = `<span class="ps-side-menu__label">${entry.label}</span>`;

  if (!entry.children) {
    return `<li class="ps-side-menu__item"><a class="ps-side-menu__link" href="${entry.href}"${currentAttr(entry.current)}>${icon}${label}${badge(entry.badge)}</a></li>`;
  }

  const open = entry.children.some((child) => child.current);
  const children = entry.children
    .map((child) => `<li><a class="ps-side-menu__sublink" href="${child.href}"${currentAttr(child.current)}><span class="ps-side-menu__label">${child.label}</span>${badge(child.badge)}</a></li>`)
    .join('');

  return `<li class="ps-side-menu__item">`
    + `<button type="button" class="ps-side-menu__link ps-side-menu__link--parent" data-bs-toggle="collapse" data-bs-target="#${id}" aria-controls="${id}" aria-expanded="${open}">`
    + `${icon}${label}${uiIcon(keyboardArrowDown, { size: 'lg', class: 'ps-side-menu__chevron' })}</button>`
    + `<div class="collapse${open ? ' show' : ''}" id="${id}"><ul class="ps-side-menu__submenu">${children}</ul></div>`
    + '</li>';
};

// The pinned footer: View my shop, then the version
const footer = (shopUrl, version) => {
  if (!shopUrl && !version) {
    return '';
  }
  const shop = shopUrl
    ? `<a class="ps-side-menu__link" href="${shopUrl}" target="_blank" rel="noopener noreferrer">${uiIcon(storefront, { size: 'lg', class: 'ps-side-menu__icon' })}`
      + `<span class="ps-side-menu__label">View my shop<span class="visually-hidden"> (opens in a new tab)</span>${uiIcon(openInNew, { size: 'sm', class: 'ps-side-menu__external' })}</span></a>`
    : '';
  const versionHtml = version ? `<p class="ps-side-menu__version">PrestaShop <span class="badge ps-badge ps-badge--oceanblue">${version}</span></p>` : '';

  return `<div class="ps-side-menu__footer">${shop}${versionHtml}</div>`;
};

// The markup of side_menu.html.twig and the Twig call that renders it; other attributes (id, class…) go on the <nav>
const sideMenu = ({ sections, label = null, shopUrl = null, version = null, ...attributes }) => {
  const id = attributes.id ?? 'ps-side-menu';
  const extra = Object.entries(attributes)
    .filter(([name]) => name !== 'id' && name !== 'class')
    .map(([name, value]) => ` ${name}="${value}"`)
    .join('');
  const body = sections.map((section, sectionIndex) => '<div class="ps-side-menu__section">'
    + `${section.title ? `<h2 class="ps-side-menu__heading">${section.title}</h2>` : ''}`
    + `<ul class="ps-side-menu__list">${section.items.map((entry, index) => item(entry, `${id}-submenu-${sectionIndex}-${index}`)).join('')}</ul>`
    + '</div>').join('');
  const classes = ['ps-side-menu', 'offcanvas-lg', 'offcanvas-start', ...(attributes.class ? [attributes.class] : [])].join(' ');

  return {
    html: `<nav id="${id}" class="${classes}" tabindex="-1" aria-label="${label ?? 'Main menu'}"${extra}><div class="ps-side-menu__body ps-scroll-fade ps-scroll-fade--y" data-ps-action="scroll-fade">${body}</div>${footer(shopUrl, version)}</nav>`,
    twig: twigCall('ui:SideMenu', { sections, label, shopUrl, version, ...attributes }, DEFAULTS),
  };
};

// Story chrome: the menu takes the height of its container, like the page column
const column = (html) => `<div class="d-flex" style="height: 34rem">${html}</div>`;

export default {
  title: 'Components/SideMenu',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:SideMenu :sections="this.sections">{{ renderhook(\'displayAdminNavBarBeforeEnd\') }}</twig:ui:SideMenu>`. The back office main menu: rendered once by the page shell (`NavBar` builds the sections from the tabs), never by a page.',
          '**Props**: `sections` (required: a list of `{title, items}`; `title` is optional, a section without one has no heading. Each item is `{label, href, icon, current}` or, with a submenu, `{label, icon, children: [{label, href, current}]}`: a parent opens its submenu and has no `href` of its own), `label` (default "Main menu": the name of the navigation for screen readers), `shopUrl` (default none: View my shop, pinned under the menu, opens the shop in a new tab and says so, its icon after the label\'s last word so a long translation keeps the row), `version` (default none: the PrestaShop version, "PrestaShop" in small muted text and the number in an `oceanblue` badge, under View my shop; both centred under a line); the menu scrolls under them and fades just above. `icon` is a [Material Symbols](https://fonts.google.com/icons) name; none, or a name with no SVG file (tab icons come from modules), shows `extension`; the old names `assessment` and `payment` show `analytics` and `credit_card`. `current` marks the page shown (`aria-current="page"`); the submenu holding it starts open. `badge` (optional, on an item without children or a sub-item, never on a parent): `{label, logo}`, a short tag after the label ("New"), with the PrestaShop mark when `logo` is `true`. Content: what modules add at the end of the menu (the `displayAdminNavBarBeforeEnd` hook). Other attributes (`id`, default `ps-side-menu`) go on the `<nav>`; the header\'s menu button opens the drawer by this id.',
          '**Do**: one item per page or group of pages, with the name the page has in its title; a submenu when a group has several pages. **Don\'t**: a second menu in a page (use tabs), an item that runs an action, a submenu inside a submenu.',
          '**States**: current page, current page inside a submenu (open), badges, long labels, unknown icon, drawer below md. Collapsed to icons only comes later.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    sections: { control: 'object', description: 'Sections of items (required)' },
    label: { control: 'text', description: 'Accessible name of the navigation' },
    shopUrl: { control: 'text', description: 'View my shop, pinned under the menu' },
    version: { control: 'text', description: 'PrestaShop version, pinned under the menu' },
  }, DEFAULTS),
  args: { sections: withCurrent(SECTIONS, 'Dashboard'), ...DEFAULTS, shopUrl: '#store', version: '9.3.0' },
};

export const Default = withTwig(
  ({ label, ...args }) => framedNodes([sideMenu({ ...args, label: label || null })], column),
);

export const CurrentInSubmenu = withTwig(
  () => framedNodes([sideMenu({ sections: withCurrent(SECTIONS, 'Invoices') })], column),
  { docs: { description: { story: 'The submenu holding the current page starts open, and its parent reads as current. Activating a parent opens or closes its submenu (`aria-expanded`).' } } },
);

export const Badges = withTwig(
  () => framedNodes([sideMenu({
    sections: [{
      title: 'Sell',
      items: [
        {
          label: 'Orders',
          icon: 'shopping_basket',
          children: [
            { label: 'Orders', href: '#orders' },
            { label: 'Invoices', href: '#invoices', current: true, badge: { label: 'New', logo: true } },
            { label: 'Credit slips', href: '#credit-slips' },
          ],
        },
        { label: 'Marketing', href: '#marketing', icon: 'campaign', badge: { label: 'New' } },
        { label: 'Modules', href: '#modules', icon: 'extension', badge: { label: 'Plus', logo: true } },
      ],
    }, {
      title: 'Long content',
      items: [
        { label: 'Kundenservice und Kundenanfragen verwalten', href: '#customer-service', icon: 'group', badge: { label: 'Neu', logo: true } },
        { label: 'Marketing', href: '#marketing-long', icon: 'campaign', badge: { label: 'Neue Funktion verfügbar', logo: true } },
        { label: 'Rücksendungen und Gutschriften verwalten', href: '#returns', icon: 'store', badge: { label: 'Jetzt kostenlos testen' } },
      ],
    }],
  })], column),
  { docs: { description: { story: 'A badge flags a page after its label, never a parent with a submenu (it would not say which page, and it would crowd the arrow): "New" for a page just added, with the PrestaShop mark for a PrestaShop feature or offer. Keep it to one short word; the label says what the page is. A long label wraps beside the badge; a badge takes at most half the row and a longer one is cut (screen readers still read it whole). Not used by the core menu yet.' } } },
);

export const LongLabels = withTwig(
  () => framedNodes([sideMenu({
    sections: [
      { items: [{ label: 'Übersicht', href: '#dashboard', icon: 'home', current: true }] },
      {
        title: 'Verkaufen und Kundenbeziehungen verwalten',
        items: [
          {
            label: 'Bestellungen und Rechnungen',
            icon: 'shopping_basket',
            children: [
              { label: 'Rücksendungen und Gutschriften verwalten', href: '#credit-slips' },
              { label: 'Lieferscheine', href: '#delivery-slips' },
            ],
          },
          { label: 'Kundenservice und Kundenanfragen', href: '#customer-service', icon: 'group' },
        ],
      },
    ],
  })], column),
  { docs: { description: { story: 'Long labels (here in German) wrap under their first line; the icon and the arrow stay on that line.' } } },
);

export const UnknownIcon = withTwig(
  () => framedNodes([sideMenu({
    sections: [{
      title: 'Modules',
      items: [
        { label: 'Icon from a module', href: '#module-a', icon: 'icon_from_an_old_module' },
        { label: 'No icon', href: '#module-b' },
      ],
    }],
  })], column),
  { docs: { description: { story: 'A module tab with no icon, or a name no SVG file matches, shows `extension` instead of failing the page.' } } },
);

export const Drawer = withTwig(
  () => framedNodes(
    [sideMenu({ sections: withCurrent(SECTIONS, 'Dashboard'), id: 'story-drawer-menu' })],
    (html) => '<button type="button" class="btn btn-secondary d-md-none mb-3" data-bs-toggle="offcanvas" data-bs-target="#story-drawer-menu" aria-controls="story-drawer-menu">Open the menu</button>'
      + `<p class="small text-body-secondary d-none d-md-block">Resize below 768px: the menu becomes a drawer.</p>${column(html)}`,
  ),
  { docs: { description: { story: 'Below md the menu is a drawer, opened by the header\'s menu button (here a stand-in) and closed with `Escape` or a click outside.' } } },
);
