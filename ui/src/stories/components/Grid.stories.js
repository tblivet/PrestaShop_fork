/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Grid> (src/PrestaShopBundle/Twig/Component/Ui/Grid.php) renders this markup, keep both in sync. The
// stories and the test render the same fixture (ui/src/stories/fixtures/order-grid.json, GridFixture.php).
import orderGrid from '../fixtures/order-grid.json';
import grid, { GRID_DEFAULTS } from '../grid';
import { withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

// A story that shows a fixed case: its controls would change nothing
const fixed = (story) => ({ controls: { disable: true }, docs: { description: { story } } });

// A story of the Orders fixture, some of its keys replaced; with a description, a fixed case
const ordersStory = (override = {}, props = {}, description = null) => withTwig((args) => ({
  ...grid({ ...orderGrid, ...override }, { ...args, ...props }),
  fixture: { name: 'order-grid', ...(Object.keys(override).length ? { override } : {}) },
}), description ? fixed(description) : {});

// Story chrome: the links and the filter form stay in Storybook, the address showing where they would go
const keepInStorybook = (render) => {
  requestAnimationFrame(() => document.querySelectorAll('[data-ps-ref="grid"]').forEach((section) => {
    section.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="?"]') : null;

      if (link) {
        event.preventDefault();
        window.location.hash = link.getAttribute('href').split('#')[0];
      }
    });
    section.addEventListener('submit', (event) => {
      event.preventDefault();
      window.location.hash = 'filtered';
    });
  }));

  return render();
};

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
          '**Props**: `grid` (required: the presented grid), `embedded` (default `false`: in another card, no card and no visible header; the table\'s caption names it), `headingLevel` (2 to 6, default 2: the title\'s level, after the page head\'s h1). Other attributes (`data-ps-*`, `aria-*`) go on the `<section>`.',
          '**Behaviour**: sorting, pages and rows per page are links on the current URL with the grid\'s prefix (`order[orderBy]`, `order[offset]`…), Search submits the filter form, Clear filters posts the reset; each lands on the results summary (`#order_grid_results`), focused after the reload. In these stories the links and the form only change the address.',
          '**Do**: the presented grid as the controller gives it; the page\'s own empty state in `empty`. **Don\'t**: a grid built by hand, per-page behaviour options, a grid in a grid.',
          '**States**: a list (sorted, filters, pages), filtered, no match, nothing yet, one page, embedded.',
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
