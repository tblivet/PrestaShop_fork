/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Page content head — icon + title with a small-buttons actions zone
import add from '../../../../icons/material-symbols/add.svg?raw';
import download from '../../../../icons/material-symbols/download.svg?raw';
import shoppingBasket from '../../../../icons/material-symbols/shopping-basket.svg?raw';
import upload from '../../../../icons/material-symbols/upload.svg?raw';
import uiIcon from '../../../stories/ui-icon';
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
        ${uiIcon(shoppingBasket, { size: 'lg', class: 'ps-page-head__icon' })}
        Orders
      </h1>
      <div class="ps-page-head__actions">
        <button type="button" class="btn btn-outline-secondary btn-sm">
          ${uiIcon(download, { size: 'lg' })}
          Export
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm">
          ${uiIcon(upload, { size: 'lg' })}
          Import
        </button>
        <button type="button" class="btn btn-primary btn-sm">
          ${uiIcon(add, { size: 'lg' })}
          Add new order
        </button>
      </div>
    </header>
  `,
};
