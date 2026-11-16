/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The page shell every back office page shares: header, side menu and the content area, here with placeholder content
import { playgroundMeta } from '../../playground.meta.js';
import { boLayout } from '../bo-layout.js';
import pageHtml from './page.html?raw';

export default {
  title: 'Playground/Layout/Page',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => boLayout(pageHtml),
};

export const FullWidth = {
  render: () => boLayout(pageHtml, { fluid: true }),
};
