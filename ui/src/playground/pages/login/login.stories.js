/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// PrestaShop BO login page — https://getbootstrap.com/docs/5.3/components/card/
import { playgroundMeta } from '../../playground.meta.js';
import loginHtml from './login.html?raw';

export default {
  title: 'Playground/Pages/Login',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => loginHtml,
};
