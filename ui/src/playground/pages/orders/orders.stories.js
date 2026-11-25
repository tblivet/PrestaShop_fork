/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Orders > Orders on the kit: the page head, the KPI row (<twig:ui:Kpi> in .ps-kpi-row), the grid (<twig:ui:Grid>
// of the Orders fixture: status choice, preview, bulk and row actions). The KPIs as CommonController::renderKpiRowAction
// renders the core ones.
import { playgroundMeta } from '../../playground.meta.js';
import { boLayout } from '../../layout/bo-layout.js';
import pageHead from '../../../stories/page-head';
import kpi from '../../../stories/kpi';
import grid from '../../../stories/grid';
import keepInStorybook from '../../../stories/grid-story-chrome';
import orderGrid from '../../../stories/fixtures/order-grid.json';
import emptyState from '../../../stories/empty-state';
import receiptLong from '../../../../icons/material-symbols/receipt-long.svg?raw';

export default {
  title: 'Playground/Pages/Orders',
  tags: ['!autodocs'],
  ...playgroundMeta,
  decorators: [keepInStorybook],
};

const KPIS = [
  { title: 'Conversion Rate', value: '1.8%', subtitle: '30 days', icon: 'monitoring', color: 'oceanblue', id: 'box-conversion-rate' },
  { title: 'Abandoned Carts', value: '12', subtitle: 'Yesterday', icon: 'remove_shopping_cart', color: 'purple', href: '#carts', id: 'box-carts' },
  { title: 'Average Order Value', value: '€45.20', subtitle: '30 days, tax excl.', icon: 'account_balance_wallet', color: 'amber', id: 'box-average-order' },
  { title: 'Net Profit per Visit', value: '€3.10', subtitle: '30 days', icon: 'account_box', color: 'green', id: 'box-net-profit-visit' },
];

const head = pageHead({
  title: 'Orders',
  actions: [{ label: 'Add new order', icon: 'add', href: '#new-order' }],
  help: 'https://docs.prestashop-project.org/',
}).html;

const kpis = `<div class="ps-kpi-row ps-kpi-row--4 ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="Key figures">${KPIS.map((item) => kpi(item).html).join('')}</div>`;

const list = grid(orderGrid).html;

export const Default = { render: () => boLayout(head + kpis + list, { fluid: true }) };

export const NoOrderYet = {
  render: () => boLayout(head + kpis + grid({
    ...orderGrid, records: [], records_total: 0, is_empty_state: true, pagination: { offset: 0, limit: 50 },
  }, {}, {
    // The page's own empty state (Blocks/EmptyState/order.html.twig today)
    empty: emptyState({
      title: 'Manage your orders',
      icon: 'receipt_long',
      headingLevel: 3,
      message: 'Find all your orders on this page and access their main information in one click: check the cart total, the payment method, the shipping details, or if it comes from a new client. You can even update the status from the listing!',
    }, { receipt_long: receiptLong }),
  }).html, { fluid: true }),
};
