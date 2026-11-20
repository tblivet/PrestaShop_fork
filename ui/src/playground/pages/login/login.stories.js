/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// PrestaShop BO login page — https://getbootstrap.com/docs/5.3/components/card/
import { playgroundMeta } from '../../playground.meta.js';
import loginHtml from './login.html?raw';
import facebook from '../../../../icons/brand/facebook.svg?raw';
import github from '../../../../icons/brand/github.svg?raw';
import twitterX from '../../../../icons/brand/twitter-x.svg?raw';
import arrowBack from '../../../../icons/material-symbols/arrow-back.svg?raw';
import visibility from '../../../../icons/material-symbols/visibility.svg?raw';
import visibilityOff from '../../../../icons/material-symbols/visibility-off.svg?raw';
import alert from '../../../stories/alert';
import { expandIcons } from '../../ui-icons';

const icons = {
  arrow_back: arrowBack,
  visibility,
  visibility_off: visibilityOff,
  'brand:facebook': facebook,
  'brand:github': github,
  'brand:twitter-x': twitterX,
};
const page = expandIcons(loginHtml, icons);

export default {
  title: 'Playground/Pages/Login',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => page,
};

// Same markup as <twig:ui:FlashMessages/> with one error, printed under the form title (Login/Ui/login.html.twig)
const errorAlert = `
  <div class="ps-flash-messages" data-ps-ref="flash-messages">
    ${alert({ type: 'danger', icon: 'cancel', dismissible: true, 'data-ps-ref': 'flash-alert', content: '<p>The email address or password is incorrect.</p>' }).html}
  </div>
`;

export const WithError = {
  render: () => page.replace(/(<h1 class="ps-login__title[^"]*">[^<]*<\/h1>)/, `$1${errorAlert}`),
};
