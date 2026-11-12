/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Icon> (src/PrestaShopBundle/Twig/Component/Ui/Icon.php) renders this markup, keep both in sync.
import add from '../../../icons/material-symbols/add.svg?raw';
import arrowBack from '../../../icons/material-symbols/arrow-back.svg?raw';
import cancel from '../../../icons/material-symbols/cancel.svg?raw';
import cancelFill from '../../../icons/material-symbols/cancel-fill.svg?raw';
import checkCircle from '../../../icons/material-symbols/check-circle.svg?raw';
import checkCircleFill from '../../../icons/material-symbols/check-circle-fill.svg?raw';
import chevronRight from '../../../icons/material-symbols/chevron-right.svg?raw';
import deleteIcon from '../../../icons/material-symbols/delete.svg?raw';
import edit from '../../../icons/material-symbols/edit.svg?raw';
import home from '../../../icons/material-symbols/home.svg?raw';
import info from '../../../icons/material-symbols/info.svg?raw';
import infoFill from '../../../icons/material-symbols/info-fill.svg?raw';
import openInNew from '../../../icons/material-symbols/open-in-new.svg?raw';
import search from '../../../icons/material-symbols/search.svg?raw';
import settings from '../../../icons/material-symbols/settings.svg?raw';
import visibility from '../../../icons/material-symbols/visibility.svg?raw';
import visibilityOff from '../../../icons/material-symbols/visibility-off.svg?raw';
import warning from '../../../icons/material-symbols/warning.svg?raw';
import warningFill from '../../../icons/material-symbols/warning-fill.svg?raw';
import facebook from '../../../icons/brand/facebook.svg?raw';
import github from '../../../icons/brand/github.svg?raw';
import twitterX from '../../../icons/brand/twitter-x.svg?raw';
import uiIcon from '../ui-icon';
import { framedNodes, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

// Some files of ui/icons, by the name a template passes (filled styles are "-fill" files, see Icon.php); the full
// catalogue is Content/Icons
const FILES = {
  add,
  arrow_back: arrowBack,
  cancel,
  'cancel-fill': cancelFill,
  check_circle: checkCircle,
  'check_circle-fill': checkCircleFill,
  chevron_right: chevronRight,
  delete: deleteIcon,
  edit,
  home,
  info,
  'info-fill': infoFill,
  open_in_new: openInNew,
  search,
  settings,
  visibility,
  visibility_off: visibilityOff,
  warning,
  'warning-fill': warningFill,
  'brand:facebook': facebook,
  'brand:github': github,
  'brand:twitter-x': twitterX,
};

const NAMES = Object.keys(FILES).filter((name) => !name.endsWith('-fill'));

// Icon.php defaults; name is required
const DEFAULTS = { label: null, size: 'md', filled: false, flipRtl: false };

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export default {
  title: 'Components/Icon',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Icon name="arrow_back"/>`, or with a meaning of its own `<twig:ui:Icon name="warning" filled label="{{ \'Warning\'|trans }}"/>`. An inline SVG: it shows with the first paint at its size (no flash of text, no layout shift) and a page only ships the icons it uses.',
          '**Props**: `name` (required: a [Material Symbols](https://fonts.google.com/icons) name, `arrow_back`, or a brand logo, `brand:github`), `label` (default none: the icon is hidden from screen readers; set it when the icon is the only thing saying what it means), `size` (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`: 0.75em, 0.875em, 1em, 1.25em, 1.5em, 2em of the text around it, centred on its capital letters; default `md`; bigger: raise the text size around it, `fs-1`), `filled` (default `false`: the filled style, for status icons; not for brand logos), `flipRtl` (default `false`: mirrored in right-to-left languages, for arrows and chevrons). Other attributes (`class`, `id`, `data-ps-*`) go on the `<svg>`.',
          '**Which icons**: all of them. Every Material Symbols icon ships in `ui/icons/material-symbols/` (synced from Google\'s package by `ui/.ai/bin/sync-icons.mjs`), logos in `ui/icons/brand/`: search them in Content/Icons. A name without a file fails the render: nothing is fetched at runtime.',
          '**Do**: a decorative icon next to a text that says the same (no `label`); a `label` on a status icon standing alone; color it with a text utility (`text-success`), it uses `currentColor`. **Don\'t**: give a label to an icon inside a button or link that already has a text or an `aria-label` (it would be read twice), use an icon font or `<i class="material-symbols-outlined">` in kit templates, or size it with `width`/`height` (use `size`, or the text around it).',
          '**States**: decorative and labelled, the six sizes in a text, outlined and filled, right-to-left, brand logos, and common icons.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    name: { control: 'select', options: NAMES, description: 'Material Symbols name, or brand:… for a logo (all in Content/Icons)' },
    label: { control: 'text', description: 'Accessible name; empty: hidden from screen readers' },
    size: { control: 'select', options: SIZES, description: 'Relative to the text around it' },
    filled: { control: 'boolean', description: 'Filled style (Material Symbols only)' },
    flipRtl: { control: 'boolean', description: 'Mirrored in right-to-left languages' },
  }, DEFAULTS),
  args: { name: 'arrow_back', ...DEFAULTS },
};

// The markup of icon.html.twig and the Twig call that renders it; other props are attributes (class…)
const icon = ({ name, filled = false, ...props }) => ({
  html: uiIcon(FILES[filled ? `${name}-fill` : name], props),
  twig: twigCall('ui:Icon', { name, filled, ...props }, DEFAULTS),
});

const caption = (text) => `<span class="small text-body-secondary">${text}</span>`;

export const Default = withTwig((args) => icon(args));

export const DecorativeOrLabelled = withTwig(() => {
  const decorative = icon({ name: 'open_in_new' });
  const labelled = icon({ name: 'warning', filled: true, label: 'Warning', class: 'text-warning' });

  return {
    html: `
      <p><a href="#" class="icon-link">Documentation ${decorative.html}</a> ${caption('decorative: the link text says it')}</p>
      <p class="mb-0">${labelled.html} Stock below 5 units ${caption('labelled: the icon adds "Warning"')}</p>`,
    twig: `${decorative.twig}\n\n${labelled.twig}`,
    rendered: decorative.html + labelled.html,
  };
}, { docs: { description: { story: 'Most icons repeat what a text next to them says: they stay hidden from screen readers. Give a `label` only when the icon carries a meaning nothing else says.' } } });

export const Sizes = withTwig(() => framedNodes(
  SIZES.map((size) => icon({ name: 'settings', size })),
  (html, index) => `<p class="${index === SIZES.length - 1 ? 'mb-0' : 'mb-2'}">${html} Settings ${caption(`size="${SIZES[index]}"`)}</p>`,
), { docs: { description: { story: 'Relative to the text and centred on its capital letters, so the same icon follows a heading, a button or small text without moving off the line.' } } });

export const OutlinedAndFilled = withTwig(() => framedNodes(
  ['check_circle', 'cancel', 'warning', 'info'].flatMap((name) => [icon({ name, class: 'fs-4' }), icon({ name, filled: true, class: 'fs-4' })]),
  (html) => `<span class="d-inline-block me-3">${html}</span>`,
), { docs: { description: { story: 'Outlined is the default; `filled` is for status icons (alerts, flash messages). Each filled style is its own file (`check_circle-fill`).' } } });

export const RightToLeft = withTwig(() => {
  const nodes = [icon({ name: 'arrow_back', flipRtl: true }), icon({ name: 'chevron_right', flipRtl: true })];

  return {
    html: `<div dir="rtl" class="d-flex gap-3 fs-4">${nodes.map((node) => node.html).join('')}</div>${caption('dir="rtl": both point the other way')}`,
    twig: nodes.map((node) => node.twig).join('\n\n'),
    rendered: nodes.map((node) => node.html).join(''),
  };
}, { docs: { description: { story: 'Arrows and chevrons that mean "back" or "next" point the reading direction. Icons of objects (a trash, a cog) never flip.' } } });

export const BrandLogos = withTwig(() => framedNodes(
  ['brand:twitter-x', 'brand:facebook', 'brand:github'].map((name) => icon({ name, class: 'fs-4' })),
  (html) => `<span class="d-inline-block me-3">${html}</span>`,
), { docs: { description: { story: 'Logos are not in Material Symbols: they are files of `ui/icons/brand/`.' } } });

export const CommonIcons = withTwig(() => framedNodes(
  NAMES.map((name) => icon({ name, class: 'fs-4' })),
  (html, index) => `<div class="d-inline-flex flex-column align-items-center gap-1 text-center me-2 mb-3" style="width: 6.5rem">${html}${caption(NAMES[index])}</div>`,
), { docs: { description: { story: 'A few icons the back office uses often. Every other Material Symbols icon is available too: search them in Content/Icons.' } } });
