/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// PrestaShop BO header — an instance of <twig:ui:Header> (see Components/Header)
import { playgroundMeta } from '../../playground.meta.js';
import headerHtml from './header.js';

export default {
  title: 'Playground/Layout/Header',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => headerHtml,
};
