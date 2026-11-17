/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/dropdowns/#menu-items
// Twig: <twig:ui:DropdownMenu> (src/PrestaShopBundle/Twig/Component/Ui/DropdownMenu.php) renders this markup, keep both in sync.
import contentCopy from '../../../icons/material-symbols/content-copy.svg?raw';
import deleteIcon from '../../../icons/material-symbols/delete.svg?raw';
import download from '../../../icons/material-symbols/download.svg?raw';
import edit from '../../../icons/material-symbols/edit.svg?raw';
import visibility from '../../../icons/material-symbols/visibility.svg?raw';
import dropdownMenu from '../dropdown-menu';
import { stackClasses } from '../layouts/layout-classes';
import { framedNodes, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const ICONS = { content_copy: contentCopy, delete: deleteIcon, download, edit, visibility };

// DropdownMenu.php defaults
const DEFAULTS = { items: null, align: 'start' };

const ACTIONS = [
  { label: 'View', href: '#view', icon: 'visibility' },
  { label: 'Edit', href: '#edit', icon: 'edit' },
  { label: 'Duplicate', icon: 'content_copy', attr: { 'data-ps-action': 'duplicate' } },
  { type: 'divider' },
  { label: 'Delete', icon: 'delete', attr: { 'data-ps-action': 'delete' } },
];

// children: the content nodes ({html, twig}) of a menu without items
const menu = ({ items = null, align = 'start', children = [], ...attributes }) => ({
  html: dropdownMenu({ items, align, content: children.map((node) => node.html).join(''), ...attributes }, ICONS),
  twig: twigCall('ui:DropdownMenu', { items, align, ...attributes }, DEFAULTS, children),
});

// The content of the form story: a field and a switch, then its button, in a stack
const FILTER_FIELDS = '<div><label class="form-label" for="story-menu-filter-ref">Reference</label><input type="text" class="form-control" id="story-menu-filter-ref" name="reference"></div>'
  + '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="story-menu-filter-stock" name="in_stock"><label class="form-check-label" for="story-menu-filter-stock">In stock only</label></div>';
const FILTER_FORM = [{
  html: `<form><div class="${stackClasses({})}">${FILTER_FIELDS}<button class="btn btn-primary" type="submit">Filter</button></div></form>`,
  twig: [
    '<form>',
    '  <twig:ui:Layout:Stack>',
    `    ${FILTER_FIELDS}`,
    '    <twig:ui:Button type="submit">Filter</twig:ui:Button>',
    '  </twig:ui:Layout:Stack>',
    '</form>',
  ].join('\n'),
}];

// Story chrome: the menu shown open in the page instead of floating under a trigger
const open = (html) => `<style>.ps-story-open-menu > .dropdown-menu { position: static; display: block; }</style><div class="ps-story-open-menu">${html}</div>`;

export default {
  title: 'Components/DropdownMenu',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<button type="button" class="…" data-bs-toggle="dropdown" aria-expanded="false">…</button><twig:ui:DropdownMenu :items="[…]"/>`, both inside an element with `class="dropdown"`. The menu of a trigger that is not a button: a header link, an avatar. For a button that opens a menu, use `<twig:ui:Dropdown>`, which renders this menu.',
          '**Props**: `items` (default none: a list of items. An item is `{label, href, icon, active, disabled, external, attr}`: with `href` a link, without a button (its action through `attr`, e.g. `{\'data-ps-action\': \'delete\'}`); `{type: \'divider\'}` a line; `{type: \'heading\', label}` a title over the next items; `{type: \'text\', label}` a line of plain text. `icon` is a [Material Symbols](https://fonts.google.com/icons) name, `active` marks the chosen item (`aria-current`), `disabled` turns it off (a link loses its `href`), `external` opens a link in a new tab and says so), `align` (`start`, `end`; default `start`: the side the menu lines up with, `end` for a trigger at the end of a row). Content, without `items`: any markup the menu holds (a form, text), in a `<div>` with room around it; give the trigger `data-bs-auto-close="outside"` when it holds a form, or a click in a field closes it. Other attributes (`id`, `data-ps-*`) go on the `<ul>` or the `<div>`.',
          '**Do**: secondary actions of one thing, most used first and the destructive one last after a divider; links to go somewhere, buttons to act; `active` for a menu that picks one value (a search scope). Content for what items cannot say: a short form (filters, a setting), text. **Don\'t**: the main action of a page (keep it a visible button), a menu with one item, a long form (use a modal or a page), `items` and content together (the content is not shown).',
          '**States**: actions with icons, every item kind (heading, text, active, disabled, external), long labels, aligned to the end, a form as content.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    items: { control: 'object', description: 'Items: links, buttons, dividers, headings, text; none: the content' },
    align: { control: 'select', options: ['start', 'end'], description: 'The side the menu lines up with' },
  }, DEFAULTS),
  args: { ...DEFAULTS, items: ACTIONS },
};

export const Default = withTwig((args) => framedNodes([menu(args)], open));

export const ItemKinds = withTwig(() => framedNodes([menu({
  items: [
    { type: 'text', label: 'Pick where to search.' },
    { type: 'heading', label: 'Search in' },
    { label: 'Everywhere', active: true, attr: { 'data-ps-value': '0' } },
    { label: 'Catalog', attr: { 'data-ps-value': '1' } },
    { type: 'divider' },
    { label: 'Export to CSV', href: '#export', icon: 'download', disabled: true },
    { label: 'Print', disabled: true },
    { label: 'Read the documentation', href: 'https://docs.prestashop-project.org', external: true },
  ],
})], open), { docs: { description: { story: 'A line of text, a heading over a group, the chosen value (`active`), a disabled link and button, an external link that says it opens a new tab.' } } });

export const LongLabels = withTwig(() => framedNodes([menu({
  items: [
    { label: 'Bestellungen mit allen Rechnungen und Lieferscheinen exportieren', href: '#export', icon: 'download' },
    { label: 'Duplizieren', icon: 'content_copy' },
    { label: 'Produktdatenblattvorschauanzeige', href: '#preview', icon: 'visibility' },
  ],
})], open), { docs: { description: { story: 'The menu is at most 20rem wide: long labels (here in German) wrap, a long word breaks, the icon stays on the first line.' } } });

export const AlignEnd = withTwig(() => framedNodes(
  [menu({ items: ACTIONS, align: 'end' })],
  (html) => `<div class="d-flex justify-content-end" style="min-height: 15rem"><div class="dropdown"><button type="button" class="btn btn-secondary" data-bs-toggle="dropdown" aria-expanded="false">Actions (story trigger)</button>${html}</div></div>`,
), { docs: { description: { story: 'For a trigger at the end of a row: the menu lines up with its end and stays on screen. Open it with the stand-in trigger.' } } });

export const Content = withTwig(() => framedNodes(
  [menu({ children: FILTER_FORM })],
  (html) => `<div style="min-height: 18rem"><div class="dropdown"><button type="button" class="btn btn-secondary" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Filter (story trigger)</button>${html}</div></div>`,
), { docs: { description: { story: 'Without `items`, the menu holds its content: here a short form. Its trigger has `data-bs-auto-close="outside"`, so typing in the field keeps it open; Esc or a click outside closes it.' } } });
