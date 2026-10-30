/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// PrestaShop BO header — composes Bootstrap navbar — https://getbootstrap.com/docs/5.3/components/navbar/
import { playgroundMeta } from '../../playground.meta.js';
import headerHtml from './header.html?raw';

export default {
  title: 'Playground/Layout/Header',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => headerHtml,
};
