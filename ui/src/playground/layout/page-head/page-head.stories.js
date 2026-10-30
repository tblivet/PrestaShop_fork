/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Page content head — icon + title with a small-buttons actions zone
import { playgroundMeta } from '../../playground.meta.js';

export default {
  title: 'Playground/Layout/PageHead',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => `
    <header class="ps-page-head">
      <h1 class="ps-page-head__title">
        <span class="icon ps-page-head__icon" aria-hidden="true">shopping_basket</span>
        Orders
      </h1>
      <div class="ps-page-head__actions">
        <button type="button" class="btn btn-outline-secondary btn-sm">
          <span class="icon" aria-hidden="true">download</span>
          Export
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm">
          <span class="icon" aria-hidden="true">upload</span>
          Import
        </button>
        <button type="button" class="btn btn-primary btn-sm">
          <span class="icon" aria-hidden="true">add</span>
          Add new order
        </button>
      </div>
    </header>
  `,
};
