/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Kpi> (src/PrestaShopBundle/Twig/Component/Ui/Kpi.php) renders this markup, keep both in sync.
import kpi, { KPI_COLORS, KPI_DEFAULTS, KPI_ICONS } from '../kpi';
import { withTwig } from '../twig-snippet';
import { nullableSelect, withDefaults } from '../story-defaults';

// The Orders row (CommonController::renderKpiRowAction renders it from the core KPIs)
const ORDERS = [
  { title: 'Conversion Rate', value: '1.8%', subtitle: '30 days', icon: 'percent', color: 'oceanblue', id: 'box-conversion-rate' },
  { title: 'Abandoned Carts', value: '12', subtitle: 'From 2026-11-22 to 2026-11-23 per unique visitors', icon: 'remove_shopping_cart', color: 'purple', href: '#carts', id: 'box-carts' },
  { title: 'Average Order Value', value: '€45.20', subtitle: '30 days', icon: 'account_balance_wallet', color: 'amber', id: 'box-average-order' },
  { title: 'Net Profit per Visit', value: '€3.10', subtitle: '30 days', icon: 'account_box', color: 'green', id: 'box-net-profit-visit' },
];

// A row as kpi_row.html.twig renders it: up to four a line, scrolling sideways on a phone
const row = (items, columns) => {
  const nodes = items.map(kpi);
  const open = `<div class="ps-kpi-row ps-kpi-row--${columns} ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="Key figures" tabindex="0">`;

  return {
    html: `${open}${nodes.map((node) => node.html).join('')}</div>`,
    twig: `${open}\n${nodes.map((node) => `  ${node.twig}`).join('\n')}\n</div>`,
  };
};

export default {
  title: 'Components/Kpi',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: a page shows its KPI row with `render(controller(\'PrestaShopBundle\\\\Controller\\\\Admin\\\\CommonController::renderKpiRowAction\', {kpiRow: …}))`; on a kit page it renders each core KPI (`KpiDataInterface`) as a `<twig:ui:Kpi>` in `.ps-kpi-row`, up to four a line and scrolling sideways on a phone, and a module\'s KPI with its own HTML. Called directly:',
          '```twig\n<twig:ui:Kpi\n  title="{{ \'Conversion Rate\'|trans({}, \'Admin.Global\') }}"\n  value="1.8%"\n  subtitle="{{ \'30 days\'|trans({}, \'Admin.Global\') }}"\n  icon="percent"\n  color="oceanblue"\n/>\n```',
          '**Props**: `title` (required), `value` (default none: a long dash; not shown with a `refreshUrl`), `subtitle` (default none: the period or the scope, "30 days", "All time"), `icon` (default none: a [Material Symbols](https://fonts.google.com/icons) name, decorative), `color` (`oceanblue`, `purple`, `amber`, `green`; default `oceanblue`: the KPI\'s place in its row), `href` (default none: the card is a link to where the figure comes from), `tooltip` (default none: what the figure means; on an info button, or on the link), `refreshUrl` (default none: the value is out of date; a placeholder stands until `kpi.js` sets the fresh one, fetched from it when the page loads, JSON `{value, tooltip}`, or a long dash if none comes). Other attributes (`id`) go on the card.',
          '**Colour**: a line on the card\'s top edge and the tint of its icon tell a KPI from the others of its row; the four line steps weigh the same on white.',
          '**Do**: a short title, a value with its unit, the period in the subtitle; the four colours in their order in a row. **Don\'t**: a sentence as a value, a KPI alone where a figure in the page would do.',
          '**States**: a row of four (Orders), a linked KPI, a tooltip, a value loading, a long value, each colour.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    title: { control: 'text', type: { name: 'string', required: true }, description: 'What the figure is' },
    value: { control: 'text', description: 'The figure, with its unit; none: a long dash', table: { type: { summary: 'string' } } },
    subtitle: { control: 'text', description: 'The period or the scope', table: { type: { summary: 'string' } } },
    icon: nullableSelect(Object.keys(KPI_ICONS), '`<twig:ui:Icon>` name, decorative'),
    color: { control: 'select', options: KPI_COLORS, description: 'The colour of its place in the row' },
    href: { control: 'text', description: 'Where the figure comes from: the card is a link', table: { type: { summary: 'string' } } },
    tooltip: { control: 'text', description: 'What the figure means', table: { type: { summary: 'string' } } },
    refreshUrl: { control: 'text', description: 'URL of a fresh value (JSON), fetched on load', table: { type: { summary: 'string' } } },
  }, KPI_DEFAULTS),
  args: { title: 'Conversion Rate', value: '1.8%', subtitle: '30 days', icon: 'percent', color: 'oceanblue' },
};

export const Default = withTwig((args) => kpi(args));

export const OrdersRow = withTwig(() => row(ORDERS, 4), {
  docs: { description: { story: 'The Orders page: four KPIs, one colour each, four a line from xl, two from md; on a phone they scroll sideways, the next one showing and the hidden edge fading. "Abandoned Carts" links to the carts.' } },
});

export const ThreeInARow = withTwig(() => row([
  { title: 'Enabled Languages', value: '3', icon: 'percent', color: 'oceanblue', href: '#languages' },
  { title: 'Main Country', value: 'France', subtitle: '30 days', icon: 'person', color: 'purple' },
  { title: 'Front Office Translations', value: '98%', icon: 'mail', color: 'amber' },
], 3), { docs: { description: { story: 'International > Translations: three KPIs, three a line from lg.' } } });

export const Linked = withTwig(() => kpi({
  title: 'Empty Categories', value: '4', icon: 'bookmark', color: 'purple', href: '#empty-categories',
}), { docs: { description: { story: 'The card is a link to the list behind the figure; its title underlines on hover.' } } });

export const WithTooltip = withTwig(() => kpi({
  title: 'Disabled Products', value: '12%', subtitle: 'All time', icon: 'toggle_off', color: 'amber', tooltip: '12% of your products are disabled and not visible to your customers',
}), { docs: { description: { story: 'What the figure means, on an info button beside the title.' } } });

export const Refreshing = withTwig(() => kpi({
  title: 'Average Age', subtitle: 'All time', icon: 'calendar_today', color: 'green', refreshUrl: '#refresh',
}), { docs: { description: { story: 'An out-of-date value: a placeholder until `kpi.js` sets the fresh one (here the URL gives none, so a long dash replaces it).' } } });

export const LongValue = withTwig(() => kpi({
  title: 'Top Category', value: 'Home Accessories and Decoration for the Living Room', subtitle: '30 days', icon: 'shopping_basket', color: 'amber',
}), { docs: { description: { story: 'A long value wraps.' } } });
