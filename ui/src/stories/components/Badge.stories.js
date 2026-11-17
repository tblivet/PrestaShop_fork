/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/badge/
// Twig: <twig:ui:Badge> (src/PrestaShopBundle/Twig/Component/Ui/Badge.php) renders this markup, keep both in sync.
import block from '../../../icons/material-symbols/block.svg?raw';
import check from '../../../icons/material-symbols/check.svg?raw';
import schedule from '../../../icons/material-symbols/schedule.svg?raw';
import badge from '../badge';
import { framedNodes, joinNodes, withTwig } from '../twig-snippet';
import { NONE, nullableSelect, withDefaults } from '../story-defaults';

// Some <twig:ui:Icon> names a badge can show; any icon works (Content/Icons)
const ICONS = { check, schedule, block };

// Badge.php defaults
const DEFAULTS = { variant: 'primary', icon: null, pill: false, counter: false };

const VARIANTS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'oceanblue', 'purple', 'amber'];

const node = (props) => badge(props, ICONS);
// Story chrome: the badges side by side
const cluster = (html) => `<div class="d-flex flex-wrap align-items-center gap-2">${html}</div>`;

export default {
  title: 'Components/Badge',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Badge variant="success" icon="check">{{ \'Paid\'|trans({}, \'Admin.Orderscustomers.Feature\') }}</twig:ui:Badge>`, `<twig:ui:Badge counter>{{ count }}</twig:ui:Badge>`. The text is the content: it says the state, the count or the flag. Its size follows the text around it (font size and padding in em): larger in a heading, smaller in a table cell; a count keeps one size.',
          '**Props**: `variant` (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`, then the kit palette colors `oceanblue`, `purple`, `amber`; default `primary`; each a subtle background with a darker text of the same color; `oceanblue` is the light brand blue of the current menu entry), `icon` (default none: a [Material Symbols](https://fonts.google.com/icons) name before the text, decorative), `pill` (default `false`: round ends; the kit has square corners), `counter` (default `false`: a number, round while short, a pill as it grows). Other attributes (`class`, `id`, `data-ps-*`) go on the `<span>`.',
          '**Do**: a short state ("Paid", "Disabled"), a count, a version; an icon with a state so its meaning is not carried by the color only; the same variant for the same meaning everywhere. **Don\'t**: a badge as a button or a link (it is not interactive), a sentence, a color as the only meaning ("green" for paid, without the word), a count in a heading without words around it for screen readers.',
          '**States**: every variant, in context (heading, text, table cell), with an icon, pill, counters from 3 to 1234, a long translation.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    label: { control: 'text', description: 'Content block: the text' },
    variant: { control: 'select', options: VARIANTS, description: 'Color' },
    icon: nullableSelect(Object.keys(ICONS), '<twig:ui:Icon> name before the text, decorative'),
    pill: { control: 'boolean', description: 'Round ends' },
    counter: { control: 'boolean', description: 'A number: round while short' },
  }, DEFAULTS),
  args: { label: 'Badge', ...DEFAULTS, icon: NONE },
};

export const Default = withTwig((args) => node(args));

export const Variants = withTwig(() => joinNodes(
  VARIANTS.map((variant) => node({ label: variant.charAt(0).toUpperCase() + variant.slice(1), variant })),
  cluster,
), { docs: { description: { story: 'The Bootstrap theme colors, then the kit palette colors Bootstrap does not have: `oceanblue` (the light brand blue of the current menu entry, used for the version in the header), `purple`, `amber`.' } } });

export const WithIcon = withTwig(() => joinNodes(
  [
    node({ label: 'Paid', variant: 'success', icon: 'check' }),
    node({ label: 'Awaiting payment', variant: 'warning', icon: 'schedule' }),
    node({ label: 'Canceled', variant: 'danger', icon: 'block' }),
  ],
  cluster,
), { docs: { description: { story: 'A state says itself with its word and its icon, not only with its color.' } } });

// Story chrome: the text a badge sits in
const contexts = (html, index) => [
  (badgeHtml) => `<h2 class="h3 mb-3">Order #1024 ${badgeHtml}</h2>`,
  (badgeHtml) => `<p class="mb-3">Payment ${badgeHtml}</p>`,
  (badgeHtml) => `<table class="table table-sm w-auto"><tbody><tr><td>FR-1024</td><td>${badgeHtml}</td></tr></tbody></table>`,
][index](html);

export const InContext = withTwig(() => framedNodes(
  [node({ label: 'Paid', variant: 'success' }), node({ label: 'Paid', variant: 'success' }), node({ label: 'Paid', variant: 'success' })],
  contexts,
), { docs: { description: { story: 'The same badge in a heading, in body text and in a small table cell: it follows the text size, with the same proportions.' } } });

export const Pill = withTwig(() => joinNodes(
  ['primary', 'success', 'oceanblue'].map((variant) => node({ label: 'New', variant, pill: true })),
  cluster,
));

export const Counter = withTwig(() => joinNodes(
  ['3', '12', '99+', '1234'].map((label) => node({ label, variant: 'danger', counter: true })),
  cluster,
), { docs: { description: { story: 'Round while short, a pill as the number grows; the size stays the same in a heading or in a button.' } } });

export const LongTranslation = withTwig(() => joinNodes(
  [node({ label: 'Zahlung wird erwartet', variant: 'warning', icon: 'schedule' }), node({ label: '9.3.0-beta.1', variant: 'oceanblue' })],
  cluster,
));
