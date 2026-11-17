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
import cancelFill from '../../../../icons/material-symbols/cancel-fill.svg?raw';
import visibility from '../../../../icons/material-symbols/visibility.svg?raw';
import visibilityOff from '../../../../icons/material-symbols/visibility-off.svg?raw';
import uiIcon from '../../../stories/ui-icon';
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
    <div class="ps-alert alert alert-danger alert-dismissible fade show ps-alert--icon" role="alert" data-ps-ref="flash-alert">
      ${uiIcon(cancelFill, { class: 'mt-1' })}
      <div class="ps-alert__content"><p class="mb-0">The email address or password is incorrect.</p></div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>
`;

export const WithError = {
  render: () => page.replace(/(<h1 class="ps-login__title[^"]*">[^<]*<\/h1>)/, `$1${errorAlert}`),
};
