/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// PrestaShop BO login page — https://getbootstrap.com/docs/5.3/components/card/
import { playgroundMeta } from '../../playground.meta.js';
import loginHtml from './login.html?raw';
import facebook from '../../../../icons/bi/facebook.svg?raw';
import github from '../../../../icons/bi/github.svg?raw';
import twitterX from '../../../../icons/bi/twitter-x.svg?raw';
import xCircleFill from '../../../../icons/bi/x-circle-fill.svg?raw';
import uxIcon from '../../../stories/ux-icon';

// login.html marks icons as <!-- ux:icon bi/name -->, rendered from ui/icons like <twig:ux:icon> in the back office
const icons = { 'bi/facebook': facebook, 'bi/github': github, 'bi/twitter-x': twitterX };
const page = loginHtml.replace(/<!-- ux:icon (\S+) -->/g, (_, name) =>
  uxIcon(icons[name], { height: 16, width: 16, 'aria-hidden': 'true' })
);

export default {
  title: 'Playground/Pages/Login',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => page,
};

// Same markup as <twig:ui:Alert type="danger" icon="bi:x-circle-fill" dismissible>, printed under the form title (Admin/Layout/Ui/_flash_alerts.html.twig)
const errorAlert = `
  <div class="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
    ${uxIcon(xCircleFill, { width: 16, height: 16, class: 'flex-shrink-0', 'aria-hidden': 'true' })}
    <div><p class="mb-0">The email address or password is incorrect.</p></div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
`;

export const WithError = {
  render: () => page.replace(/(<h1 class="ps-login__title">[^<]*<\/h1>)/, `$1${errorAlert}`),
};
