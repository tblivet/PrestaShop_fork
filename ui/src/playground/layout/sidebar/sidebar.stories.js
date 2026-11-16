/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// PrestaShop BO menu — an instance of <twig:ui:SideMenu> (see Components/SideMenu)
import { playgroundMeta } from '../../playground.meta.js';
import sidebarHtml from './sidebar.js';

export default {
  title: 'Playground/Layout/Sidebar',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => `<div class="vh-100 d-flex">${sidebarHtml}</div>`,
};
