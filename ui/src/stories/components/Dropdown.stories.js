/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/dropdowns/
// Twig: <twig:ui:Dropdown> (src/PrestaShopBundle/Twig/Component/Ui/Dropdown.php) renders this markup, keep both in sync.
import contentCopy from '../../../icons/material-symbols/content-copy.svg?raw';
import deleteIcon from '../../../icons/material-symbols/delete.svg?raw';
import download from '../../../icons/material-symbols/download.svg?raw';
import edit from '../../../icons/material-symbols/edit.svg?raw';
import keyboardArrowDown from '../../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import keyboardArrowUp from '../../../icons/material-symbols/keyboard-arrow-up.svg?raw';
import moreVert from '../../../icons/material-symbols/more-vert.svg?raw';
import print from '../../../icons/material-symbols/print.svg?raw';
import settings from '../../../icons/material-symbols/settings.svg?raw';
import visibility from '../../../icons/material-symbols/visibility.svg?raw';
import dropdownMenu from '../dropdown-menu';
import uiIcon from '../ui-icon';
import { framedNodes, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const ICONS = { content_copy: contentCopy, delete: deleteIcon, download, edit, more_vert: moreVert, print, settings, visibility };
const TRIGGER_ICONS = { more_vert: moreVert, settings };

// Dropdown.php defaults; label and items are required
const DEFAULTS = { icon: null, variant: 'secondary', size: 'md', align: 'start', direction: 'down', disabled: false };

const VARIANTS = ['primary', 'secondary', 'outline-primary', 'outline-secondary', 'destructive', 'outline-destructive', 'link'];

const ACTIONS = [
  { label: 'View', href: '#view', icon: 'visibility' },
  { label: 'Edit', href: '#edit', icon: 'edit' },
  { label: 'Duplicate', icon: 'content_copy', attr: { 'data-ps-action': 'duplicate' } },
  { type: 'divider' },
  { label: 'Delete', icon: 'delete', attr: { 'data-ps-action': 'delete' } },
];

const EXPORTS = [
  { label: 'Export to CSV', href: '#csv', icon: 'download' },
  { label: 'Print', icon: 'print', attr: { 'data-ps-action': 'print' } },
];

// The markup of dropdown.html.twig: a <twig:ui:Button> (or <twig:ui:IconButton> with icon) and a <twig:ui:DropdownMenu>
const dropdown = ({ label, items, icon = null, variant = 'secondary', size = 'md', align = 'start', direction = 'down', disabled = false, ...attributes }) => {
  const classes = ['btn', `btn-${variant}`, ...(size !== 'md' ? [`btn-${size}`] : []), ...(icon ? ['ps-icon-button'] : [])].join(' ');
  const toggle = `type="button"${disabled ? ' disabled' : ''}${icon ? ` aria-label="${label}"` : ''} data-bs-toggle="dropdown" aria-expanded="false"`;
  const arrow = uiIcon(direction === 'up' ? keyboardArrowUp : keyboardArrowDown, { size: 'lg' });
  const trigger = icon
    ? `<button class="${classes}" ${toggle}>${uiIcon(TRIGGER_ICONS[icon], { size: 'lg' })}</button>`
    : `<button class="${classes}" ${toggle}>${label}${arrow}</button>`;
  const wrapperClasses = [direction === 'up' ? 'dropup' : 'dropdown', attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');

  return {
    html: `<div class="${wrapperClasses}"${extra}>${trigger}${dropdownMenu({ items, align }, ICONS)}</div>`,
    twig: twigCall('ui:Dropdown', { label, items, icon, variant, size, align, direction, disabled, ...attributes }, DEFAULTS),
  };
};

// Story chrome: room for the open menu
const room = (html, height = '16rem') => `<div style="min-height: ${height}">${html}</div>`;
const cell = (html, text) => `<div class="d-inline-block align-top me-4 mb-3">${html}<span class="d-block small text-body-secondary mt-1">${text}</span></div>`;

export default {
  title: 'Components/Dropdown',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Dropdown label="{{ \'Export\'|trans({}, \'Admin.Actions\') }}" :items="[…]"/>`; icon only: `<twig:ui:Dropdown icon="more_vert" label="{{ \'More actions\'|trans({}, \'Admin.Actions\') }}" :items="[…]" align="end"/>`. A button that opens a menu of actions: a `<twig:ui:Button>` (with `icon`, a `<twig:ui:IconButton>`) and a `<twig:ui:DropdownMenu>`. Keyboard and positioning come from Bootstrap.',
          '**Props**: `label` (required: the trigger text, or its accessible name when it shows only an icon), `items` (required: the items of `<twig:ui:DropdownMenu>`, see Components/DropdownMenu), `icon` (default none; set: the trigger shows only this icon, square, no arrow), `variant` and `size` (as `<twig:ui:Button>`; default `secondary`, `md`), `align` (`start`, `end`; default `start`), `direction` (`down`, `up`; default `down`: `up` near the bottom of the screen, the arrow points up), `disabled` (default `false`). Other attributes (`id`, `data-ps-*`) go on the wrapper.',
          '**Do**: a label that names the group ("Export", "More actions"), the icon-only trigger at the end of a row with `align="end"`, at most one dropdown per row. **Don\'t**: hide the page\'s main action in a menu, an icon-only trigger without a clear label, a dropdown to switch between pages (use tabs or links).',
          '**States**: text and icon-only triggers, the variants and sizes, opening up, disabled, long labels.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    label: { control: 'text', description: 'Trigger text, or its accessible name (required)' },
    items: { control: 'object', description: 'Menu items, see Components/DropdownMenu (required)' },
    icon: { control: 'select', options: [null, ...Object.keys(TRIGGER_ICONS)], description: 'Icon-only trigger' },
    variant: { control: 'select', options: VARIANTS, description: 'As <twig:ui:Button>' },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'As <twig:ui:Button>' },
    align: { control: 'select', options: ['start', 'end'], description: 'The side the menu lines up with' },
    direction: { control: 'select', options: ['down', 'up'], description: 'Where the menu opens' },
    disabled: { control: 'boolean', description: 'Disabled trigger' },
  }, DEFAULTS),
  args: { label: 'Actions', items: ACTIONS, ...DEFAULTS },
};

export const Default = withTwig((args) => framedNodes([dropdown(args)], (html) => room(html)));

export const IconOnly = withTwig(() => framedNodes(
  [dropdown({ label: 'More actions', icon: 'more_vert', items: ACTIONS, variant: 'link', align: 'end' })],
  (html) => room(`<div class="d-flex justify-content-end">${html}</div>`),
), { docs: { description: { story: 'At the end of a row (a grid line, a card header): a kebab named "More actions" for screen readers, the menu aligned to the end.' } } });

export const Variants = withTwig(() => framedNodes(
  [
    dropdown({ label: 'Export', items: EXPORTS, variant: 'primary' }),
    dropdown({ label: 'Export', items: EXPORTS, variant: 'outline-secondary', size: 'sm' }),
    dropdown({ label: 'Settings', icon: 'settings', items: EXPORTS, variant: 'outline-secondary' }),
  ],
  (html, index) => cell(html, ['variant="primary"', 'variant="outline-secondary" size="sm"', 'icon="settings"'][index]),
), { docs: { description: { story: 'The trigger takes the variants and sizes of `<twig:ui:Button>`.' } } });

export const DirectionUp = withTwig(() => framedNodes(
  [dropdown({ label: 'Export', items: EXPORTS, direction: 'up' })],
  (html) => `<div style="padding-top: 8rem">${html}</div>`,
), { docs: { description: { story: 'Near the bottom of the screen (a sticky footer bar), the menu opens up and the arrow points up.' } } });

export const Disabled = withTwig(() => framedNodes(
  [dropdown({ label: 'Bulk actions', items: EXPORTS, variant: 'outline-secondary', disabled: true })],
  (html) => html,
), { docs: { description: { story: 'Off until it can act, e.g. bulk actions until a row is selected. Say why next to it when it is not obvious.' } } });

export const LongLabels = withTwig(() => framedNodes(
  [dropdown({
    label: 'Weitere Aktionen für die ausgewählten Bestellungen',
    items: [
      { label: 'Bestellungen mit allen Rechnungen und Lieferscheinen exportieren', href: '#export', icon: 'download' },
      { label: 'Produktdatenblattvorschauanzeige', href: '#preview', icon: 'visibility' },
    ],
  })],
  (html) => room(html, '14rem'),
), { docs: { description: { story: 'A long trigger label stays on one line like any button; long items wrap in a menu at most 20rem wide.' } } });
