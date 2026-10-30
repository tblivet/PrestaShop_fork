/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// PrestaShop BO homepage — content composed into the generic BO layout (header + sidebar + content)
import { playgroundMeta } from '../../playground.meta.js';
import { boLayout } from '../../layout/bo-layout.js';
import homeHtml from './home.html?raw';

export default {
  title: 'Playground/Pages/Home',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => boLayout(homeHtml),
};

export const FullWidth = {
  render: () => boLayout(homeHtml, { fluid: true }),
};
