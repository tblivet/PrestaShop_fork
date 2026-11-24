/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Orders > Orders on the kit: the page head, the KPI row (<twig:ui:Kpi> in .ps-kpi-row), the grid. The KPIs
// as CommonController::renderKpiRowAction renders the core ones.
import { playgroundMeta } from '../../playground.meta.js';
import { boLayout } from '../../layout/bo-layout.js';
import pageHead from '../../../stories/page-head';
import kpi from '../../../stories/kpi';

export default {
  title: 'Playground/Pages/Orders',
  tags: ['!autodocs'],
  ...playgroundMeta,
};

const KPIS = [
  { title: 'Conversion Rate', value: '1.8%', subtitle: '30 days', icon: 'percent', color: 'oceanblue', id: 'box-conversion-rate' },
  { title: 'Abandoned Carts', value: '12', subtitle: 'From 2026-11-22 to 2026-11-23 per unique visitors', icon: 'remove_shopping_cart', color: 'purple', href: '#carts', id: 'box-carts' },
  { title: 'Average Order Value', value: '€45.20', subtitle: '30 days', icon: 'account_balance_wallet', color: 'amber', id: 'box-average-order' },
  { title: 'Net Profit per Visit', value: '€3.10', subtitle: '30 days', icon: 'account_box', color: 'green', id: 'box-net-profit-visit' },
];

const head = pageHead({
  title: 'Orders',
  actions: [{ label: 'Add new order', icon: 'add', href: '#new-order' }],
  help: 'https://docs.prestashop-project.org/',
}).html;

const kpis = `<div class="ps-kpi-row ps-kpi-row--4 ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="Key figures" tabindex="0">${KPIS.map((item) => kpi(item).html).join('')}</div>`;

// Story chrome: what the grid will be
const grid = '<div class="card ps-grid-panel flex-grow-1"><div class="card-body text-body-secondary"><p>Orders grid goes here.</p></div></div>';

export const Default = { render: () => boLayout(head + kpis + grid, { fluid: true }) };
