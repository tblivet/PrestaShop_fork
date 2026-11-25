/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Grid> (src/PrestaShopBundle/Twig/Component/Ui/Grid.php) renders this markup, keep both in sync. The
// stories and the test render the same fixture (ui/src/stories/fixtures/order-grid.json, GridFixture.php).
import orderGrid from '../fixtures/order-grid.json';
import alert from '../alert';
import grid, { GRID_DEFAULTS } from '../grid';
import { withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';
import keepInStorybook from '../grid-story-chrome';

// A story that shows a fixed case: its controls would change nothing
const fixed = (story) => ({ controls: { disable: true }, docs: { description: { story } } });

// A story of the Orders fixture, some of its keys replaced; with a description, a fixed case
const ordersStory = (override = {}, props = {}, description = null, blocks = {}) => withTwig((args) => ({
  ...grid({ ...orderGrid, ...override }, { ...args, ...props }, blocks),
  fixture: { name: 'order-grid', ...(Object.keys(override).length ? { override } : {}) },
}), description ? fixed(description) : {});

const EMPTY = { records: [], records_total: 0, pagination: { offset: 0, limit: 50 } };

export default {
  title: 'Components/Grid',
  decorators: [keepInStorybook],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          '**Twig usage**: a list page renders the grid its controller presents (`GridPresenter::present()`), as it is: `<twig:ui:Grid :grid="orderGrid"/>`; inside a card of a view page: `<twig:ui:Grid :grid="customerOrdersGrid" embedded :headingLevel="3"/>`. Blocks: `before` (above the toolbar), `toolbar` (beside Search), `empty` (the page\'s EmptyState when there is nothing yet), `footer` (after the pages: Back to list). The design: `ui/.ai/designs/grid.md`.',
          '**Props**: `grid` (required: the presented grid), `embedded` (default `false`: in another card, no card and no visible header; its title is for screen readers only), `headingLevel` (2 to 6, default 2: the level of the grid\'s title, visible or not, after the page head\'s h1; its empty states\' titles are one level under). Other attributes (`data-ps-*`, `aria-*`) go on the `<section>`.',
          '**Behaviour**: sorting, pages and rows per page are links on the current URL with the grid\'s prefix (`order[orderBy]`, `order[offset]`…), Search submits the filter form, Clear filters posts the reset; each lands on the results summary (`#order_grid_results`), focused after the reload. The list\'s actions (export, refresh, SQL query) are a menu in the header; a row\'s actions are icon buttons (those with `use_inline_display`, then the first other one) and a More actions menu, a submit one sending the hidden action form (`_method` for DELETE) after its confirmation. A row with a `clickable_row` link follows it from its clickable cells (the mouse; the keyboard has the link). Orders: the status is a menu posting `value`; the ID\'s toggle opens the order\'s preview under its row (here, order 1023\'s fails, with Try again). In these stories the links and the form only change the address.',
          '**Do**: the presented grid as the controller gives it; the page\'s own empty state in `empty`. **Don\'t**: a grid built by hand, per-page behaviour options, a grid in a grid.',
          '**States**: a list (sorted, filters, pages, row and list actions, status choice, preview, clickable rows), filtered, no match, nothing yet, one page, embedded, every block, a hidden title and centred column.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    grid: { control: false, type: { name: 'object', required: true }, description: 'The presented grid (GridPresenter::present())' },
    embedded: { control: 'boolean', description: 'Inside another card: no card, no visible header' },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6], description: 'The title\'s heading level' },
  }, GRID_DEFAULTS),
  args: { ...GRID_DEFAULTS },
};

export const Default = ordersStory();

export const Filtered = ordersStory({ filter_data: { reference: 'XKB' }, records: orderGrid.records.slice(0, 1), records_total: 1, pagination: { offset: 0, limit: 50 } }, {}, 'A filter set: its field shows its value, Clear filters appears beside Search; one result, no pages.');

export const NoMatch = ordersStory({ filter_data: { reference: 'ZZZ' }, ...EMPTY }, {}, 'Filters hide every order: the headers and the filters stay, a small empty state in the table says so, with Clear filters; no sort links.');

export const NothingYet = ordersStory({ ...EMPTY, is_empty_state: true }, {}, 'No order yet: the header stays, the body is the empty state (the page gives its own in the `empty` block; here the default).');

export const OnePage = ordersStory({ records_total: 3, pagination: { offset: 0, limit: 50 } }, {}, 'Three orders: no pages, no rows per page, no footer.');

export const Embedded = ordersStory({ records_total: 3, pagination: { offset: 0, limit: 50 } }, { embedded: true, headingLevel: 3 }, 'In a card of a view page (a customer\'s orders): no card, no visible header; the section is named by the table\'s caption.');

// The blocks: as a page writes them, with kit components
const linkButton = (label, href) => ({ html: `<a class="btn btn-link ps-button" href="${href}">${label}</a>`, twig: `<twig:ui:Button variant="link" href="${href}">${label}</twig:ui:Button>` });
const plainButton = (label) => ({ html: `<button class="btn btn-outline-secondary ps-button" type="button" data-ps-data-busy-label="Loading...">${label}</button>`, twig: `<twig:ui:Button variant="outline-secondary">${label}</twig:ui:Button>` });

export const WithBlocks = ordersStory({ records_total: 3, pagination: { offset: 0, limit: 50 } }, { headingLevel: 3 }, 'The four blocks: `before` (an alert above the toolbar), `toolbar` (a button beside Search), `footer` (Back to list), here with a title at level 3; `empty` replaces the default empty state (Nothing yet).', {
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
