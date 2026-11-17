/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:HeaderAction> (src/PrestaShopBundle/Twig/Component/Ui/HeaderAction.php) renders this markup, keep both in sync.
import bookmarks from '../../../icons/material-symbols/bookmarks.svg?raw';
import bugReport from '../../../icons/material-symbols/bug-report.svg?raw';
import build from '../../../icons/material-symbols/build.svg?raw';
import settings from '../../../icons/material-symbols/settings.svg?raw';
import storefront from '../../../icons/material-symbols/storefront.svg?raw';
import headerAction from '../header-action';
import { framedNodes, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const ICONS = { bookmarks, bug_report: bugReport, build, settings, storefront };

// HeaderAction.php defaults; label and icon are required, and an href or items
const DEFAULTS = { href: null, external: false, items: null, description: null, align: 'end', iconOnly: false, warning: false };

const MENU_ITEMS = [
  { label: 'Orders', href: '#orders' },
  { label: 'New product', href: '#new-product' },
  { type: 'divider' },
  { label: 'Manage quick access', href: '#quick-access', icon: 'settings' },
];

const action = (props) => headerAction(props, ICONS);

// Story chrome: the dark bar the actions sit on, with room for an open menu
const bar = (html) => `<div style="min-height: 12rem"><div class="ps-header justify-content-end">${html}</div></div>`;

export default {
  title: 'Components/HeaderAction',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:HeaderAction icon="storefront" label="{{ \'View my shop\'|trans({}, \'Admin.Navigation.Header\') }}" href="{{ ps.baseUrl }}" external/>`, or a menu: `<twig:ui:HeaderAction icon="bookmarks" label="{{ \'Quick access\'|trans({}, \'Admin.Navigation.Header\') }}" :items="[…]"/>`. An entry of `<twig:ui:Header>`, in its `start` or `actions` block; modules writing to `displayBackOfficeTop` render the same entry.',
          '**Props**: `label` (required: what it is; shown from lg up, below only the icon shows and the label stays its name for screen readers), `icon` (required: a [Material Symbols](https://fonts.google.com/icons) name), `href` (a link) or `items` (a button opening a menu, the items of `<twig:ui:DropdownMenu>`): one of them, `external` (default `false`, links only: opens a new tab and says so), `description` (default none, links only: more about it in a tooltip), `align` (`start`, `end`; default `end`, menus only: the edge of the button the menu lines up with; `start` next to the logo), `iconOnly` (default `false`, links only: the icon alone at every width, the label in the tooltip, as a bold title above its description, and still its name for screen readers), `warning` (default `false`: a state to notice, debug or maintenance mode, as a compact amber chip; with `iconOnly`, an amber square). Tooltips open below the bar. Other attributes (`id`, `data-ps-*`) go on the root.',
          '**Do**: a short noun for the label ("View my shop", "Debug mode"), a menu for a group of links (the quick access), a description that says what a state means and what to do. **Don\'t**: an action of the page (it belongs to the page header), more than five entries, a link and a menu on one entry, an entry with a picture (the employee menu is its own component, `EmployeeDropdown`).',
          '**States**: a link, a link to another tab, a link with a description, a menu, a long label.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    label: { control: 'text', description: 'What it is (required)' },
    icon: { control: 'select', options: Object.keys(ICONS), description: 'Icon (required)' },
    href: { control: 'text', description: 'A link; or items' },
    external: { control: 'boolean', description: 'Opens a new tab (links)' },
    items: { control: 'object', description: 'A menu; or href' },
    description: { control: 'text', description: 'Tooltip (links)' },
    align: { control: 'select', options: ['start', 'end'], description: 'Menu edge (menus)' },
    iconOnly: { control: 'boolean', description: 'Icon alone, label in the tooltip (links)' },
    warning: { control: 'boolean', description: 'A state to notice: amber chip' },
  }, DEFAULTS),
  args: { ...DEFAULTS, label: 'View my shop', icon: 'storefront', href: '#store', external: true, iconOnly: true },
};

export const Default = withTwig(({ items, href, ...args }) => framedNodes(
  [action({ ...args, items: items || null, href: items ? null : (href || '#') })],
  bar,
));

export const WithDescription = withTwig(() => framedNodes(
  [
    action({ label: 'Debug mode', icon: 'bug_report', warning: true, iconOnly: true, href: '#performance', description: 'All PHP errors and messages are shown. Turn debug mode off when you no longer need it.' }),
    action({ label: 'Maintenance mode', icon: 'build', warning: true, iconOnly: true, href: '#maintenance', description: 'Your shop is closed to visitors and customers. Turn maintenance mode off when you are ready.' }),
  ],
  (html) => bar(html),
), { docs: { description: { story: 'Hover or focus: the tooltip says what the state means; the link goes where it can be turned off.' } } });

export const Menu = withTwig(() => framedNodes(
  [action({ label: 'Quick access', icon: 'bookmarks', items: MENU_ITEMS })],
  bar,
), { docs: { description: { story: 'A button (it opens, it does not go anywhere); the menu lines up with the end of the bar, or with its start next to the logo (`align="start"`).' } } });

export const LongLabel = withTwig(() => framedNodes(
  [action({ label: 'Schnellzugriff auf Ihre Seiten', icon: 'bookmarks', items: MENU_ITEMS })],
  bar,
), { docs: { description: { story: 'A long label is cut at 6rem; screen readers read it whole.' } } });
