/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/buttons/
// Twig: <twig:ui:Button> (src/PrestaShopBundle/Twig/Component/Ui/Button.php) renders this markup, keep both in sync.
import add from '../../../icons/material-symbols/add.svg?raw';
import arrowForward from '../../../icons/material-symbols/arrow-forward.svg?raw';
import deleteIcon from '../../../icons/material-symbols/delete.svg?raw';
import download from '../../../icons/material-symbols/download.svg?raw';
import uiIcon from '../ui-icon';
import { framedNodes, markup, twigCall, withTwig } from '../twig-snippet';
import { NONE, nullableSelect, withDefaults } from '../story-defaults';

// Some <twig:ui:Icon> names a button can show; any icon works (Content/Icons)
const ICONS = { add, arrow_forward: arrowForward, delete: deleteIcon, download };

// Button.php defaults
const DEFAULTS = { variant: 'primary', size: 'md', href: null, type: 'button', icon: null, iconPosition: 'start', loading: false, disabled: false };

const VARIANTS = ['primary', 'secondary', 'outline-primary', 'outline-secondary', 'destructive', 'outline-destructive', 'link'];
const SIZES = ['sm', 'md', 'lg'];

// The markup of button.html.twig for the given props and the Twig call that renders it; the label is the content block,
// other attributes (id, class, data-ps-*…) go on the button like in Twig
const button = ({ label, variant = 'primary', size = 'md', href = null, type = 'button', icon = null, iconPosition = 'start', loading = false, disabled = false, ...attributes }) => {
  const iconSvg = ICONS[icon] ?? null;
  const classes = ['btn', `btn-${variant}`];
  if (size !== 'md') classes.push(`btn-${size}`);
  let attrs;

  if (href === null) {
    attrs = { type, ...(disabled ? { disabled: '' } : {}), ...(loading ? { 'data-ps-state': 'loading', 'aria-busy': 'true', 'aria-disabled': 'true' } : {}) };
  } else if (disabled) {
    classes.push('disabled');
    attrs = { role: 'link', 'aria-disabled': 'true' };
  } else {
    attrs = { href };
  }

  if (attributes.class) classes.push(attributes.class);
  const all = { ...attrs, ...Object.fromEntries(Object.entries(attributes).filter(([name]) => name !== 'class')) };
  const html = Object.entries(all).map(([name, value]) => (value === '' ? ` ${name}` : ` ${name}="${value}"`)).join('');
  const tag = href === null ? 'button' : 'a';
  const iconHtml = iconSvg ? uiIcon(iconSvg, { size: 'lg' }) : '';
  const spinner = loading ? '<span class="spinner-border spinner-border-sm" aria-hidden="true" data-ps-ref="submit-spinner"></span>' : '';

  return {
    html: `<${tag} class="${classes.join(' ')}"${html}>${spinner}${iconPosition === 'start' ? iconHtml : ''}${label}${iconPosition === 'end' ? iconHtml : ''}</${tag}>`,
    twig: twigCall('ui:Button', {
      variant, size, href: href ?? undefined, type: href === null ? type : undefined, icon: iconSvg ? icon : undefined, iconPosition: iconSvg ? iconPosition : undefined, loading, disabled, ...attributes,
    }, DEFAULTS, [markup(label)]),
  };
};

const caption = (text) => `<span class="d-block small text-body-secondary mt-1">${text}</span>`;
const row = (html) => `<div class="d-inline-block me-3 mb-3 align-top">${html}</div>`;

export default {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Button variant="primary" type="submit">{{ \'Save\'|trans({}, \'Admin.Actions\') }}</twig:ui:Button>`, or a link that looks like a button: `<twig:ui:Button href="{{ path(\'admin_products_create\') }}" icon="add">…</twig:ui:Button>`. The label is the content. Kit form buttons (`SubmitType`, `ButtonType`) render it too: `{{ form_widget(form.save, {variant: \'primary\'}) }}`.',
          '**Props**: `variant` (`primary`, `secondary`, `outline-primary`, `outline-secondary`, `destructive`, `outline-destructive`, `link`; default `primary`), `size` (`sm`, `md`, `lg`; default `md`), `href` (default none: a `<button>`; set: an `<a>`, for an action that opens a page), `type` (`button`, `submit`, `reset`; default `button`, so a button never sends a form by accident; not with `href`), `icon` (default none: a [Material Symbols](https://fonts.google.com/icons) name, decorative, see Components/Icon), `iconPosition` (`start`, `end`; default `start`), `loading` (default `false`: busy, the spinner covers the label and the button keeps its size; not with `href`), `disabled` (default `false`; a disabled link loses its `href`). Other attributes (`id`, `name`, `value`, `form`, `data-ps-*`, `aria-*`, a `class`) go on the button.',
          '**Do**: one `primary` per area (the action most people take there), `secondary` for the others (drawn like the primary\'s outline with a light grey hover, so Cancel beside Save reads as one filled, one outlined), `outline-secondary` for a minor one, `destructive` for an action that deletes or cannot be undone; a label that says the action ("Save", "Send reset link"); `href` when the button opens a page, a `<button>` when it does something on this one. **Don\'t**: `<a href="#">` or `javascript:void(0)` for an action (use a button), `btn-*` classes written by hand in kit templates, two `primary` side by side, an icon-only button (`<twig:ui:IconButton>`, it needs a label), margins on the button (a layout places it: `<twig:ui:Layout:Cluster>`).',
          '**States**: the seven variants, three sizes, icon before or after the label, links, disabled, loading, and a long translation.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    label: { control: 'text', description: 'Content block: the button text' },
    variant: { control: 'select', options: VARIANTS, description: 'Meaning of the button' },
    size: { control: 'select', options: SIZES, description: 'Button size' },
    href: { control: 'text', description: 'Set: renders an <a>' },
    type: { control: 'select', options: ['button', 'submit', 'reset'], description: 'Button type (not with href)' },
    icon: nullableSelect(Object.keys(ICONS), '<twig:ui:Icon> name, decorative'),
    iconPosition: { control: 'select', options: ['start', 'end'], description: 'Icon before or after the label' },
    loading: { control: 'boolean', description: 'Busy: spinner over the label, aria-busy (not with href)' },
    disabled: { control: 'boolean', description: 'Disabled; a link loses its href' },
  }, DEFAULTS),
  args: { label: 'Save', ...DEFAULTS, icon: NONE },
};

export const Default = withTwig(({ href, ...args }) => button({ ...args, href: href || null }));

export const Variants = withTwig(() => framedNodes(
  VARIANTS.map((variant) => button({ label: variant === 'destructive' || variant === 'outline-destructive' ? 'Delete' : 'Save', variant })),
  (html, index) => row(`${html}${caption(VARIANTS[index])}`),
), { docs: { description: { story: '`primary` for the main action of an area, `secondary` and the outlines for the others, `destructive` for deleting, `link` for a minor action that should not draw the eye.' } } });

export const Sizes = withTwig(() => framedNodes(
  SIZES.map((size) => button({ label: 'Save', variant: 'primary', size })),
  (html, index) => row(`${html}${caption(`size="${SIZES[index]}"`)}`),
), { docs: { description: { story: '`md` almost everywhere; `sm` in dense rows (grid toolbars), `lg` rarely.' } } });

export const WithIcon = withTwig(() => framedNodes(
  [
    button({ label: 'Add new product', variant: 'primary', icon: 'add' }),
    button({ label: 'Export', variant: 'outline-secondary', icon: 'download' }),
    button({ label: 'Next', variant: 'outline-primary', icon: 'arrow_forward', iconPosition: 'end' }),
    button({ label: 'Delete', variant: 'destructive', icon: 'delete', size: 'sm' }),
  ],
  (html) => row(html),
), { docs: { description: { story: 'The icon repeats the label, so it stays hidden from screen readers. It goes before the label; after it only for a direction ("Next").' } } });

export const Links = withTwig(() => framedNodes(
  [
    button({ label: 'Add new product', variant: 'primary', href: '#products/new', icon: 'add' }),
    button({ label: 'View catalog', href: '#catalog', disabled: true }),
  ],
  (html, index) => row(`${html}${caption(index === 0 ? 'href: an <a>' : 'disabled: no href, not focusable')}`),
), { docs: { description: { story: 'With `href` the button is a link: it opens a page (Add new product goes to the creation form). A disabled link has no `href`, so it can\'t be focused or followed.' } } });

export const Disabled = withTwig(() => framedNodes(
  ['primary', 'secondary', 'outline-secondary', 'destructive'].map((variant) => button({ label: 'Save', variant, disabled: true })),
  (html) => row(html),
), { docs: { description: { story: 'Disable a button only while its action is impossible, and say why next to it; prefer an error after the click when the user can fix something.' } } });

export const Loading = withTwig(() => framedNodes(
  [
    button({ label: 'Send reset link', variant: 'primary', type: 'submit', loading: true }),
    button({ label: 'Add new product', variant: 'outline-primary', icon: 'add', loading: true }),
  ],
  (html) => row(html),
), { docs: { description: { story: 'Busy while its action runs: the spinner covers the label and the icon, the button keeps its size so nothing moves, and it ignores clicks. Kit forms with `data-ps-action="submit-once"` set the same state on their submit button.' } } });

export const LongTranslation = withTwig(() => framedNodes(
  [button({ label: 'Envoyer le lien de réinitialisation du mot de passe', variant: 'primary', icon: 'arrow_forward', iconPosition: 'end' })],
  (html) => `<div style="max-width: 16rem">${html}</div>`,
), { docs: { description: { story: 'A label longer than the room it has wraps; the icon stays centred beside it.' } } });
