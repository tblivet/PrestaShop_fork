/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Grid> (src/PrestaShopBundle/Twig/Component/Ui/Grid.php) renders this markup, keep both in sync. The
// stories and the test render the same fixture (ui/src/stories/fixtures/order-grid.json, GridFixture.php).
import inbox from '../../../icons/material-symbols/inbox.svg?raw';
import carrierGrid from '../fixtures/carrier-grid.json';
import orderGrid from '../fixtures/order-grid.json';
import alert from '../alert';
import emptyState from '../empty-state';
import grid, { GRID_DEFAULTS } from '../grid';
import { withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';
import keepInStorybook from '../grid-story-chrome';

// A story that shows a fixed case: its controls would change nothing
const fixed = (story) => ({ controls: { disable: true }, docs: { description: { story } } });

// A story of a fixture, some of its keys replaced; with a description, a fixed case
const fixtureStory = (data, name) => (override = {}, props = {}, description = null, blocks = {}) => withTwig((args) => ({
  ...grid({ ...data, ...override }, { ...args, ...props }, blocks),
  fixture: { name, ...(Object.keys(override).length ? { override } : {}) },
}), description ? fixed(description) : {});
const ordersStory = fixtureStory(orderGrid, 'order-grid');
const carriersStory = fixtureStory(carrierGrid, 'carrier-grid');

const EMPTY = { records: [], records_total: 0, pagination: { offset: 0, limit: 50 } };
// A page's own empty state, as its `empty` block writes it
const emptyStateNode = (props) => emptyState(props, { inbox });

export default {
  title: 'Components/Grid',
  decorators: [keepInStorybook],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          '**Twig usage**: a list page renders the grid its controller presents (`GridPresenter::present()`), as it is: `<twig:ui:Grid :grid="orderGrid"/>`; inside a card of a view page: `<twig:ui:Grid :grid="customerOrdersGrid" embedded :headingLevel="3"/>`. Blocks: `before` (above the toolbar), `toolbar` (in the toolbar, before Rearrange/Done), `empty` (the page\'s EmptyState when there is nothing yet), `footer` (after the pages: Back to list). The design: `ui/.ai/designs/grid.md`.',
          '**Props**: `grid` (required: the presented grid), `embedded` (default `false`: in another card, no card and no visible header; its title is for screen readers only), `headingLevel` (2 to 5, default 2: the level of the grid\'s title, visible or not, after the page head\'s h1; its empty states\' titles are one level under). Other attributes (`data-ps-*`, `aria-*`) go on the `<section>`.',
          '**Behaviour**: sorting, pages and rows per page are links on the current URL with the grid\'s prefix (`order[orderBy]`, `order[offset]`…), Filter, at the end of the filter row, submits the filter form (Enter in a filter field too), Clear filters (the filter row\'s icon, once a filter is set) posts the reset; each lands on the grid\'s title (`#order_grid_results`), focused after the reload. The list\'s actions (export, refresh, SQL query) are a menu in the header; a row\'s actions are one Actions menu (⋮), the dangerous ones last after a divider, a submit one sending the hidden action form (`_method` for DELETE) after its confirmation. A row with a `clickable_row` link follows it from its clickable cells (the mouse; the keyboard has the link). A toggle column is a switch posting to its route: saved in place when the route answers JSON (a spinner over it meanwhile, then a toast), the page reloaded when it redirects; sorted by position, rows move by a handle or Move up/down and the page\'s positions are sent as before, Rearrange/Done in the toolbar. Orders: the status is a menu posting `value`; the ID\'s toggle opens the order\'s preview under its row (here, order 1023\'s fails, with Try again). In these stories the links and the form only change the address.',
          '**Do**: the presented grid as the controller gives it; the page\'s own empty state in `empty`. **Don\'t**: a grid built by hand, per-page behaviour options, a grid in a grid.',
          '**States**: a list (sorted, filters, pages, row and list actions, status choice, preview, clickable rows), toggles and positions (Carriers), filtered, no match, nothing yet (the default and a page\'s own), a page past the last one, one page, embedded, every block, a hidden title and centred column, a quick filter.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    grid: { control: false, type: { name: 'object', required: true }, description: 'The presented grid (GridPresenter::present())' },
    embedded: { control: 'boolean', description: 'Inside another card: no card, no visible header' },
    headingLevel: { control: 'select', options: [2, 3, 4, 5], description: 'The title\'s heading level (visible or not); the empty states\' titles are one level under' },
  }, GRID_DEFAULTS),
  args: { ...GRID_DEFAULTS },
};

export const Default = ordersStory();

export const Filtered = ordersStory({ filter_data: { reference: 'XKB' }, records: orderGrid.records.slice(0, 1), records_total: 1, pagination: { offset: 0, limit: 50 } }, {}, 'A filter set: its field shows its value, Clear filters appears beside Filter; one result, no pages.');

export const NoMatch = ordersStory({ filter_data: { reference: 'ZZZ' }, ...EMPTY }, {}, 'Filters hide every order: the headers and the filters stay, a small empty state under the table says so, with Clear filters; no sort links.');

export const NothingYet = ordersStory({ ...EMPTY, is_empty_state: true }, {}, 'No order yet: the header stays, the body is the empty state (the page gives its own in the `empty` block; here the default).');

export const NothingYetPageEmptyState = ordersStory({ ...EMPTY, is_empty_state: true }, {}, 'No order yet, with the page\'s own empty state in the `empty` block: it replaces the default and a `Grid/empty/{id}` template.', {
  empty: emptyStateNode({ title: 'No orders yet', icon: 'inbox', headingLevel: 3, message: '<p>Orders placed in your store show here.</p>' }),
});

export const PastTheLastPage = ordersStory({ records: [], records_total: 3, pagination: { offset: 50, limit: 50 } }, {}, 'A page past the last one (its rows deleted since, or an old link): a small empty state under the table, with Go to the last page; no pages.');

export const OnePage = ordersStory({ records_total: 3, pagination: { offset: 0, limit: 50 } }, {}, 'Three orders: no pages, no rows per page, no footer.');

export const Embedded = ordersStory({ records_total: 3, pagination: { offset: 0, limit: 50 } }, { embedded: true, headingLevel: 3 }, 'In a card of a view page (a customer\'s orders): no card, no visible header; the section is named by its title, for screen readers only.');

// The blocks: as a page writes them, with kit components
const linkButton = (label, href) => ({ html: `<a class="btn btn-link ps-button" href="${href}">${label}</a>`, twig: `<twig:ui:Button variant="link" href="${href}">${label}</twig:ui:Button>` });
const plainButton = (label) => ({ html: `<button class="btn btn-outline-secondary ps-button" type="button" data-ps-data-busy-label="Loading...">${label}</button>`, twig: `<twig:ui:Button variant="outline-secondary">${label}</twig:ui:Button>` });

export const WithBlocks = ordersStory({ records_total: 3, pagination: { offset: 0, limit: 50 } }, { headingLevel: 3 }, 'Three blocks: `before` (an alert above the toolbar), `toolbar` (a button in the toolbar), `footer` (Back to list), here with a title at level 3; the fourth, `empty`, in Nothing yet with the page\'s empty state.', {
  before: alert({ type: 'info', content: 'Orders of the last 30 days only: older ones are archived.' }),
  toolbar: plainButton('Export'),
  footer: linkButton('Back to list', '#back'),
});

export const HiddenTitleCentredColumn = ordersStory({
  view_options: { display_name: false },
  columns: orderGrid.columns.map((column) => (column.id === 'new' ? { ...column, options: { ...column.options, alignment: 'center' } } : column)),
  records_total: 3,
  pagination: { offset: 0, limit: 50 },
}, {}, '`display_name: false` in the definition: the title for screen readers only, the header band kept for the list\'s actions (without any, no band). A column with `alignment: center`.');

export const TogglesAndPositions = carriersStory({}, {}, 'Carriers, sorted by position: a switch per toggle column (posted at once, announced; flipped back when it fails), and each row moves by its handle or Move up and Move down (the page\'s positions sent, the page reloaded). Done goes back to the ID order.');

export const PositionsNotSorted = carriersStory({ sorting: { order_by: 'id_carrier', order_way: 'asc' }, columns: carrierGrid.columns.filter((column) => column.type !== 'position_handle') }, {}, 'Carriers sorted by ID: no handles (the presenter adds them only when sorted by position), Rearrange sorts by position.');

export const QuickFilter = ordersStory({
  filters: [...orderGrid.filters, {
    name: 'period_filter', type: 'filter_link', options: { default_value: 'all', filter_options: { all: 'All', active: 'Active', scheduled: 'Scheduled', expired: 'Expired' } },
  }],
  filter_data: { period_filter: 'active' },
}, {}, 'A quick filter (Discounts\' period, `FilterLinkFilterType`): a group of choices that submit the filter form, the current one pressed with a check.');
