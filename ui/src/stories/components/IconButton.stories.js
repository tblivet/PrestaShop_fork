/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:IconButton> (src/PrestaShopBundle/Twig/Component/Ui/IconButton.php) renders this markup, keep both in sync.
import add from '../../../icons/material-symbols/add.svg?raw';
import deleteIcon from '../../../icons/material-symbols/delete.svg?raw';
import edit from '../../../icons/material-symbols/edit.svg?raw';
import moreVert from '../../../icons/material-symbols/more-vert.svg?raw';
import refresh from '../../../icons/material-symbols/refresh.svg?raw';
import github from '../../../icons/brand/github.svg?raw';
import uiIcon from '../ui-icon';
import { framedNodes, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

// Some <twig:ui:Icon> names an icon button can show; any icon works (Content/Icons)
const ICONS = { add, delete: deleteIcon, edit, more_vert: moreVert, refresh, 'brand:github': github };

// IconButton.php defaults; icon and label are required
const DEFAULTS = { tooltip: false, variant: 'secondary', size: 'md', href: null, type: 'button', loading: false, disabled: false };

const VARIANTS = ['primary', 'secondary', 'outline-primary', 'outline-secondary', 'destructive', 'outline-destructive', 'link'];
const SIZES = ['sm', 'md', 'lg'];

// The markup of icon_button.html.twig (a <twig:ui:Button> holding only the icon) and the Twig call that renders it;
// other attributes (id, class, data-ps-*…) go on the button like in Twig
const iconButton = ({ icon, label, tooltip = false, variant = 'secondary', size = 'md', href = null, type = 'button', loading = false, disabled = false, ...attributes }) => {
  const classes = ['btn', `btn-${variant}`, ...(size !== 'md' ? [`btn-${size}`] : []), 'ps-icon-button', ...(attributes.class ? [attributes.class] : [])];
  let attrs;

  if (href === null) {
    attrs = { type, ...(disabled ? { disabled: '' } : {}), ...(loading ? { 'data-ps-state': 'loading', 'aria-busy': 'true', 'aria-disabled': 'true' } : {}) };
  } else if (disabled) {
    classes.push('disabled');
    attrs = { role: 'link', 'aria-disabled': 'true' };
  } else {
    attrs = { href };
  }

  const all = {
    ...attrs,
    'aria-label': label,
    ...(tooltip ? { 'data-bs-toggle': 'tooltip', 'data-bs-title': label } : {}),
    ...Object.fromEntries(Object.entries(attributes).filter(([name]) => name !== 'class')),
  };
  const html = Object.entries(all).map(([name, value]) => (value === '' ? ` ${name}` : ` ${name}="${value}"`)).join('');
  const tag = href === null ? 'button' : 'a';
  const spinner = loading ? '<span class="spinner-border spinner-border-sm" aria-hidden="true" data-ps-ref="submit-spinner"></span>' : '';

  return {
    html: `<${tag} class="${classes.join(' ')}"${html}>${spinner}${uiIcon(ICONS[icon], { size: 'lg' })}</${tag}>`,
    twig: twigCall('ui:IconButton', {
      icon, label, tooltip, variant, size, href: href ?? undefined, type: href === null ? type : undefined, loading, disabled, ...attributes,
    }, DEFAULTS),
  };
};

const caption = (text) => `<span class="d-block small text-body-secondary mt-1">${text}</span>`;
const cell = (html, text) => `<div class="d-inline-block text-center me-3 mb-3 align-top">${html}${text ? caption(text) : ''}</div>`;

export default {
  title: 'Components/IconButton',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:IconButton icon="delete" label="{{ \'Delete\'|trans({}, \'Admin.Actions\') }}" variant="link" tooltip/>`. A `<twig:ui:Button>` that shows only its icon, square at every size.',
          '**Props**: `icon` (required: a [Material Symbols](https://fonts.google.com/icons) name, or `brand:…`, see Components/Icon), `label` (required: what the button does, its only name for screen readers, read as its `aria-label`), `tooltip` (default `false`: shows the label on hover and focus), and the props of `<twig:ui:Button>`: `variant` (`primary`, `secondary`, `outline-primary`, `outline-secondary`, `destructive`, `outline-destructive`, `link`; default `secondary`), `size` (`sm`, `md`, `lg`; default `md`), `href` (default none; set: an `<a>`), `type` (`button`, `submit`, `reset`; default `button`; not with `href`), `loading` (default `false`; not with `href`), `disabled` (default `false`). Other attributes (`id`, `aria-controls`, `aria-expanded`, `data-ps-*`, a `class`) go on the button.',
          '**Do**: an icon everybody reads the same way (edit, delete, refresh, more actions) in a row of many where text would not fit; a `label` that names the action ("Delete", not "Trash icon"); `tooltip` when sighted users may not know the icon. **Don\'t**: an icon button for the main action of a page (use `<twig:ui:Button>` with text), a label made of the icon\'s name, two icon buttons with the same label in one row without saying what each acts on ("Delete Summer sale").',
          '**States**: the variants, three sizes, with a tooltip, as a link, disabled and loading.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    icon: { control: 'select', options: Object.keys(ICONS), description: '<twig:ui:Icon> name (required)' },
    label: { control: 'text', description: 'Accessible name, and tooltip text (required)' },
    tooltip: { control: 'boolean', description: 'Shows the label on hover and focus' },
    variant: { control: 'select', options: VARIANTS, description: 'As <twig:ui:Button>' },
    size: { control: 'select', options: SIZES, description: 'As <twig:ui:Button>' },
    href: { control: 'text', description: 'Set: renders an <a>' },
    type: { control: 'select', options: ['button', 'submit', 'reset'], description: 'Button type (not with href)' },
    loading: { control: 'boolean', description: 'Busy: spinner over the icon (not with href)' },
    disabled: { control: 'boolean', description: 'Disabled; a link loses its href' },
  }, DEFAULTS),
  args: { icon: 'edit', label: 'Edit', ...DEFAULTS },
};

export const Default = withTwig(({ href, ...args }) => iconButton({ ...args, href: href || null }));

export const Variants = withTwig(() => framedNodes(
  VARIANTS.map((variant) => iconButton({ icon: variant.includes('destructive') ? 'delete' : 'edit', label: variant.includes('destructive') ? 'Delete' : 'Edit', variant })),
  (html, index) => cell(html, VARIANTS[index]),
), { docs: { description: { story: '`link` for row actions and toolbars, where many icon buttons sit together; a filled or outlined variant when the button stands alone.' } } });

export const Sizes = withTwig(() => framedNodes(
  SIZES.map((size) => iconButton({ icon: 'more_vert', label: 'More actions', variant: 'outline-secondary', size })),
  (html, index) => cell(html, `size="${SIZES[index]}"`),
), { docs: { description: { story: 'Square at every size, the same height as a `<twig:ui:Button>` of that size, so both line up in a toolbar.' } } });

export const WithTooltip = withTwig(() => framedNodes(
  [
    iconButton({ icon: 'refresh', label: 'Refresh the list', variant: 'outline-secondary', tooltip: true }),
    iconButton({ icon: 'delete', label: 'Delete', variant: 'link', tooltip: true }),
  ],
  (html) => cell(html),
), { docs: { description: { story: 'Hover or focus a button: the tooltip shows its label. Screen readers read the label once, as the button\'s name (the tooltip is not linked to it a second time).' } } });

export const AsLink = withTwig(() => framedNodes(
  [
    iconButton({ icon: 'add', label: 'Add new product', variant: 'primary', href: '#products/new' }),
    iconButton({ icon: 'brand:github', label: 'PrestaShop on GitHub', variant: 'link', href: 'https://github.com/PrestaShop/PrestaShop', class: 'link-secondary' }),
  ],
  (html) => cell(html),
), { docs: { description: { story: 'With `href` it is a link: it opens a page.' } } });

export const DisabledAndLoading = withTwig(() => framedNodes(
  [
    iconButton({ icon: 'delete', label: 'Delete', variant: 'outline-destructive', disabled: true }),
    iconButton({ icon: 'edit', label: 'Edit', href: '#edit', disabled: true }),
    iconButton({ icon: 'refresh', label: 'Refresh the list', variant: 'outline-secondary', loading: true }),
  ],
  (html, index) => cell(html, ['disabled', 'disabled link', 'loading'][index]),
), { docs: { description: { story: 'The same states as `<twig:ui:Button>`: a disabled link has no `href`, a busy button shows a spinner over its icon and keeps its size.' } } });
