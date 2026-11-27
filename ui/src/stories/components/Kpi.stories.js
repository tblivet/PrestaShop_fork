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
  { title: 'Conversion Rate', value: '1.8%', subtitle: '30 days', icon: 'monitoring', color: 'oceanblue', id: 'box-conversion-rate' },
  { title: 'Abandoned Carts', value: '12', subtitle: 'Yesterday', icon: 'remove_shopping_cart', color: 'purple', href: '#carts', id: 'box-carts' },
  { title: 'Average Order Value', value: '€45.20', subtitle: '30 days, tax excl.', icon: 'account_balance_wallet', color: 'amber', id: 'box-average-order' },
  { title: 'Net Profit per Visit', value: '€3.10', subtitle: '30 days', icon: 'account_box', color: 'green', id: 'box-net-profit-visit' },
];

// A row as kpi_row.html.twig renders it: up to four a line; on a phone two or more scroll sideways, a lone one takes the
// whole width; scroll-fade.ts makes it a tab stop while it scrolls
const row = (items) => {
  const nodes = items.map(kpi);
  const columns = Math.min(items.length, 4);
  const open = `<div class="ps-kpi-row ps-kpi-row--${columns} ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="Key figures">`;

  return {
    html: `${open}${nodes.map((node) => node.html).join('')}</div>`,
    twig: `${open}\n${nodes.map((node) => `  ${node.twig}`).join('\n')}\n</div>`,
  };
};

// A story that shows a fixed case: its controls would change nothing
const fixed = (story) => ({ controls: { disable: true }, docs: { description: { story } } });

export default {
  title: 'Components/Kpi',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: a page shows its KPI row with `render(controller(\'PrestaShopBundle\\\\Controller\\\\Admin\\\\CommonController::renderKpiRowAction\', {kpiRow: …}))`; on a kit page it renders each core KPI (`KpiDataInterface`) as a `<twig:ui:Kpi>` in `.ps-kpi-row`, up to four a line, two or more scrolling sideways on a phone, a lone one the whole width; a module\'s KPI keeps its own HTML. Called directly:',
          '```twig\n<twig:ui:Kpi\n  title="{{ \'Conversion Rate\'|trans({}, \'Admin.Global\') }}"\n  value="1.8%"\n  subtitle="{{ \'30 days\'|trans({}, \'Admin.Global\') }}"\n  icon="monitoring"\n  color="oceanblue"\n/>\n```',
          '**Props**: `title` (required), `value` (default none: a long dash, "No value" for screen readers, also when blank; not shown with a `refreshUrl`), `subtitle` (default none: the period or the scope, "30 days", "All time"), `icon` (default none: any [Material Symbols](https://fonts.google.com/icons) name, decorative), `color` (`oceanblue`, `purple`, `amber`, `green`; default `oceanblue`: the KPI\'s place in its row), `href` (default none: the card is a link to where the figure comes from), `refreshUrl` (default none: the value is out of date; a placeholder, named "Loading..." for screen readers, stands until `kpi.ts` sets the fresh one, fetched from it when the page loads, JSON `{value}`, its HTML entities read as text, or a long dash if none comes). Other attributes (`id`) go on the card.',
          '**Colour**: a line on the card\'s top edge and the tint of its icon tell a KPI from the others of its row; the four line steps weigh the same on white.',
          '**Do**: a short title, a value with its unit, the period in the subtitle; the four colours in their order in a row. **Don\'t**: a sentence as a value, a KPI alone where a figure in the page would do.',
          '**States**: a row of four (Orders), of three, of two, a lone KPI, a linked KPI, without an icon, without a value, a value loading then refreshed, a long value.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    title: { control: 'text', type: { name: 'string', required: true }, description: 'What the figure is' },
    value: { control: 'text', description: 'The figure, with its unit; none or blank: a long dash', table: { type: { summary: 'string' } } },
    subtitle: { control: 'text', description: 'The period or the scope', table: { type: { summary: 'string' } } },
    icon: nullableSelect(Object.keys(KPI_ICONS), 'Any Material Symbols name (`<twig:ui:Icon>`), decorative; the list has those of the stories'),
    color: { control: 'select', options: KPI_COLORS, description: 'The colour of its place in the row' },
    href: { control: 'text', description: 'Where the figure comes from: the card is a link', table: { type: { summary: 'string' } } },
    refreshUrl: { control: 'text', description: 'URL of a fresh value (JSON), fetched on load', table: { type: { summary: 'string' } } },
  }, KPI_DEFAULTS),
  args: { title: 'Conversion Rate', value: '1.8%', subtitle: '30 days', icon: 'monitoring', color: 'oceanblue' },
};

export const Default = withTwig((args) => kpi(args));

export const OrdersRow = withTwig(() => row(ORDERS), fixed('The Orders page: four KPIs, one colour each, four a line from xl, two from md; on a phone they scroll sideways, the next one showing and the hidden edge fading. "Abandoned Carts" links to the carts.'));

export const ThreeInARow = withTwig(() => row([
  { title: 'Enabled Languages', value: '3', icon: 'percent', color: 'oceanblue', href: '#languages' },
  { title: 'Main Country', value: 'France', subtitle: '30 days', icon: 'person', color: 'purple' },
  { title: 'Average Age', value: '34 years', subtitle: 'All time', icon: 'calendar_today', color: 'amber' },
]), fixed('An odd count: three KPIs, three a line from lg; two a line on md, the third alone on its line; scrolling sideways on a phone.'));

// Without the ids of the Orders row: both stories are on the docs page
export const TwoInARow = withTwig(() => row(ORDERS.slice(0, 2).map(({ id, ...item }) => item)), fixed('Two KPIs: two a line from md; on a phone they already scroll sideways, the second one showing.'));

export const Alone = withTwig(() => row([
  { title: 'Total Cart', value: '€128.40', subtitle: 'Tax incl.', icon: 'shopping_cart', color: 'oceanblue' },
]), fixed('A lone KPI (a cart\'s page): the whole width at every size, nothing to scroll.'));

export const Linked = withTwig(() => kpi({
  title: 'Empty Categories', value: '4', icon: 'bookmark', color: 'purple', href: '#empty-categories',
}), fixed('The card is a link to the list behind the figure; its title underlines on hover, Bootstrap\'s focus ring goes around it.'));

export const WithoutIcon = withTwig(() => kpi({
  title: 'Newsletter Registrations', value: '1,204', subtitle: 'All time', color: 'green',
}), fixed('No icon: the text takes the card; the colour line still tells it from the others.'));

export const WithoutValue = withTwig(() => kpi({
  title: 'Main Country', subtitle: '30 days', icon: 'person', color: 'purple',
}), fixed('No value (or a blank one): a long dash, "No value" for screen readers.'));

export const Refreshing = withTwig(() => kpi({
  title: 'Average Age', subtitle: 'All time', icon: 'calendar_today', color: 'green', refreshUrl: 'data:application/json,{"value":"34 years"}',
}), fixed('An out-of-date value: a placeholder, "Loading..." for screen readers, until `kpi.ts` sets the fresh one from the refresh URL (here a JSON data URL, so it comes at once); a long dash if none comes.'));

export const LongValue = withTwig(() => kpi({
  title: 'Top Category', value: 'Home Accessories and Decoration for the Living Room', subtitle: '30 days', icon: 'shopping_basket', color: 'amber',
}), fixed('A long value wraps.'));
