/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/icon-link/
// Twig: <twig:ui:Link> (src/PrestaShopBundle/Twig/Component/Ui/Link.php) renders this markup, keep both in sync.
import arrowBack from '../../../icons/material-symbols/arrow-back.svg?raw';
import arrowForward from '../../../icons/material-symbols/arrow-forward.svg?raw';
import download from '../../../icons/material-symbols/download.svg?raw';
import openInNew from '../../../icons/material-symbols/open-in-new.svg?raw';
import uiIcon from '../ui-icon';
import { framedNodes, markup, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

// Some <twig:ui:Icon> names a link can show; any icon works (Content/Icons)
const ICONS = { none: null, arrow_forward: arrowForward, download, open_in_new: openInNew };

// Link.php defaults; href is required
const DEFAULTS = { icon: null, iconPosition: 'start', back: false, external: false };

// The markup of link.html.twig for the given props and the Twig call that renders it; the text is the content block,
// other attributes (class, id, data-ps-*…) go on the link like in Twig
const link = ({ label, href = '#', icon = null, iconPosition = 'start', back = false, external = false, ...attributes }) => {
  const svg = back ? arrowBack : (ICONS[icon] ?? null);
  const atStart = back || iconPosition === 'start';
  const classes = [];
  if (svg) classes.push('icon-link', 'icon-link-hover', ...(atStart ? ['icon-link-hover-start'] : []));
  if (attributes.class) classes.push(attributes.class);
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');
  const iconHtml = svg ? uiIcon(svg, { size: 'lg', flipRtl: back }) : '';
  const hidden = external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : '';

  return {
    html: `<a href="${href}"${classes.length ? ` class="${classes.join(' ')}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${extra}>${atStart ? iconHtml : ''}${label}${hidden}${atStart ? '' : iconHtml}</a>`,
    twig: twigCall('ui:Link', {
      href, icon: svg && !back ? icon : undefined, iconPosition: svg && !back ? iconPosition : undefined, back, external, ...attributes,
    }, DEFAULTS, [markup(label)]),
  };
};

const caption = (text) => `<span class="d-block small text-body-secondary mt-1">${text}</span>`;
const row = (html, text) => `<div class="mb-3">${html}${text ? caption(text) : ''}</div>`;

export default {
  title: 'Components/Link',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Link href="{{ path(\'admin_orders_index\') }}" back>{{ \'Back to orders\'|trans({}, \'Admin.Actions\') }}</twig:ui:Link>`, `<twig:ui:Link href="{{ docUrl }}" external>…</twig:ui:Link>`. The text is the content: it says where the link goes.',
          '**Props**: `href` (required), `icon` (default none: a [Material Symbols](https://fonts.google.com/icons) name, decorative, see Components/Icon), `iconPosition` (`start`, `end`; default `start`), `back` (default `false`: a link to the previous page or list, an arrow before the text that points the reading direction; no `icon` with it), `external` (default `false`: opens in a new tab with `rel="noopener noreferrer"`, and tells screen readers "(opens in a new tab)"). Other attributes (`class`, `id`, `data-ps-*`, `aria-*`) go on the link: a color with `link-secondary`, a size with `small`.',
          '**Do**: a link to go somewhere (another page, a document), with a text that names it ("Back to orders", "Read the documentation"); `back` for every back link, so they all look and move the same; `external` for any link that opens a new tab. **Don\'t**: a link for an action on this page (use `<twig:ui:Button>`; `variant="link"` if it should look like a link), `target="_blank"` written by hand (use `external`), a raw URL as the text, "click here".',
          '**States**: plain, with an icon before or after, back, external, a color, and a long text that wraps.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    label: { control: 'text', description: 'Content block: the link text' },
    href: { control: 'text', description: 'Where the link goes (required)' },
    icon: { control: 'select', options: Object.keys(ICONS), description: '<twig:ui:Icon> name, decorative (not with back)' },
    iconPosition: { control: 'select', options: ['start', 'end'], description: 'Icon before or after the text; the hover moves it that way' },
    back: { control: 'boolean', description: 'Back link: arrow before the text, mirrored in right-to-left languages' },
    external: { control: 'boolean', description: 'Opens in a new tab, and says so to screen readers' },
  }, DEFAULTS),
  args: { label: 'View the order', href: '#', ...DEFAULTS, icon: 'none' },
};

export const Default = withTwig(({ icon, back, ...args }) => link({ ...args, back, icon: back || icon === 'none' ? null : icon }));

export const WithIcon = withTwig(() => framedNodes(
  [
    link({ label: 'Download the invoice', icon: 'download' }),
    link({ label: 'See all orders', icon: 'arrow_forward', iconPosition: 'end' }),
  ],
  (html, index) => row(html, index === 0 ? 'iconPosition="start": moves toward the start on hover' : 'iconPosition="end": moves toward the end on hover'),
), { docs: { description: { story: 'The icon repeats the text, so screen readers skip it. Hover or focus moves it a little the way it sits: toward the start before the text, toward the end after it.' } } });

export const Back = withTwig(() => framedNodes(
  [link({ label: 'Back to orders', back: true })],
  (html) => `${row(html)}<div dir="rtl" lang="ar">${row(html, 'in a right-to-left language, the arrow points the other way')}</div>`,
), { docs: { description: { story: 'Every back link: `arrow_back` before the text, mirrored in right-to-left languages, moving toward the start on hover.' } } });

export const External = withTwig(() => framedNodes(
  [
    link({ label: 'Read the documentation', href: 'https://docs.prestashop-project.org', external: true }),
    link({ label: 'PrestaShop Marketplace', href: 'https://addons.prestashop.com', icon: 'open_in_new', iconPosition: 'end', external: true }),
  ],
  (html, index) => row(html, index === 0 ? 'screen readers hear "Read the documentation (opens in a new tab)"' : 'with open_in_new, sighted users see it too'),
), { docs: { description: { story: '`external` opens a new tab, keeps the new page from reaching this one (`rel="noopener noreferrer"`) and says it to screen readers. Add the `open_in_new` icon where a new tab would surprise.' } } });

export const Colors = withTwig(() => framedNodes(
  [
    link({ label: 'View the order' }),
    link({ label: 'Back to sign in', class: 'link-secondary small' }),
  ],
  (html, index) => row(html, index === 0 ? 'default' : 'class="link-secondary small"'),
), { docs: { description: { story: 'The kit link color by default; `link-secondary` for a quiet link (footers, secondary navigation), `small` beside small text.' } } });

export const LongText = withTwig(() => framedNodes(
  [link({ label: 'Back to Maison Dupont et Fils - Épicerie fine artisanale depuis 1887', back: true, class: 'link-secondary small' })],
  (html) => `<div style="max-width: 16rem">${html}</div>`,
), { docs: { description: { story: 'A long text wraps; the icon stays on its first line.' } } });
