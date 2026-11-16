/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:HeaderAction> (src/PrestaShopBundle/Twig/Component/Ui/HeaderAction.php) renders this markup, keep both in sync.
import bugReport from '../../../icons/material-symbols/bug-report.svg?raw';
import build from '../../../icons/material-symbols/build.svg?raw';
import logout from '../../../icons/material-symbols/logout.svg?raw';
import person from '../../../icons/material-symbols/person.svg?raw';
import storefront from '../../../icons/material-symbols/storefront.svg?raw';
import headerAction from '../header-action';
import { framedNodes, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const ICONS = { bug_report: bugReport, build, logout, person, storefront };

// HeaderAction.php defaults; label is required, and an icon or an image, an href or items
const DEFAULTS = { icon: null, image: null, href: null, external: false, items: null, description: null, align: 'end' };

const ACCOUNT_ITEMS = [
  { label: 'Your profile', href: '#profile', icon: 'person' },
  { type: 'divider' },
  { label: 'Sign out', href: '#sign-out', icon: 'logout' },
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
          '**Twig usage**: `<twig:ui:HeaderAction icon="storefront" label="{{ \'View my shop\'|trans({}, \'Admin.Navigation.Header\') }}" href="{{ ps.baseUrl }}" external/>`, or a menu: `<twig:ui:HeaderAction image="{{ employee.imageUrl }}" label="{{ employee.firstName }}" :items="[…]"/>`. An entry of `<twig:ui:Header>`, placed in its content; modules writing to `displayBackOfficeTop` render the same entry.',
          '**Props**: `label` (required: what it is; shown from lg up, below only the icon shows and the label stays its name for screen readers), `icon` (a [Material Symbols](https://fonts.google.com/icons) name) or `image` (URL of a round picture, the employee\'s avatar): one of them, `href` (a link) or `items` (a button opening a menu, the items of `<twig:ui:DropdownMenu>`): one of them, `external` (default `false`, links only: opens a new tab and says so), `description` (default none, links only: more about it in a tooltip), `align` (`start`, `end`; default `end`, menus only: the edge of the button the menu lines up with; `start` next to the logo). Other attributes (`id`, `data-ps-*`) go on the root.',
          '**Do**: a short noun for the label ("View my shop", "Debug mode"), a menu for things about the employee, a description that says what a state means and what to do. **Don\'t**: an action of the page (it belongs to the page header), more than five entries, a link and a menu on one entry.',
          '**States**: a link, a link to another tab, a link with a description, a menu with an avatar, a long name.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    label: { control: 'text', description: 'What it is (required)' },
    icon: { control: 'select', options: [null, ...Object.keys(ICONS)], description: 'Icon; or image' },
    image: { control: 'text', description: 'Round picture URL; or icon' },
    href: { control: 'text', description: 'A link; or items' },
    external: { control: 'boolean', description: 'Opens a new tab (links)' },
    items: { control: 'object', description: 'A menu; or href' },
    description: { control: 'text', description: 'Tooltip (links)' },
    align: { control: 'select', options: ['start', 'end'], description: 'Menu edge (menus)' },
  }, DEFAULTS),
  args: { ...DEFAULTS, label: 'View my shop', icon: 'storefront', href: '#store', external: true },
};

export const Default = withTwig(({ image, items, href, ...args }) => framedNodes(
  [action({ ...args, image: image || null, items: items || null, href: items ? null : (href || '#') })],
  bar,
));

export const WithDescription = withTwig(() => framedNodes(
  [
    action({ label: 'Debug mode', icon: 'bug_report', href: '#performance', description: 'All PHP errors and messages are shown. Turn debug mode off when you no longer need it.' }),
    action({ label: 'Maintenance mode', icon: 'build', href: '#maintenance', description: 'Your shop is closed to visitors and customers. Turn maintenance mode off when you are ready.' }),
  ],
  (html) => bar(html),
), { docs: { description: { story: 'Hover or focus: the tooltip says what the state means; the link goes where it can be turned off.' } } });

export const Menu = withTwig(() => framedNodes(
  [action({ label: 'Marc Beier', image: '/playground/avatar.svg', items: ACCOUNT_ITEMS })],
  bar,
), { docs: { description: { story: 'A button (it opens, it does not go anywhere) with the employee\'s avatar; the menu lines up with the end of the bar.' } } });

export const LongName = withTwig(() => framedNodes(
  [action({ label: 'Maximilian Alexander von Hohenzollern-Sigmaringen', image: '/playground/avatar.svg', items: ACCOUNT_ITEMS })],
  bar,
), { docs: { description: { story: 'A long label is cut at 12rem; screen readers read it whole.' } } });
