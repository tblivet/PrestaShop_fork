/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import '../scss/main.scss';
import * as bootstrap from 'bootstrap';
import initAlertDismissFocus from './components/alert-dismiss-focus';
import initPasswordToggle from './components/password-toggle';
import focusServerError from './components/server-error-focus';
import initSubmitOnce from './components/submit-once';
import registerJqueryPlugins from './compat/jquery-plugins';

// Single Bootstrap instance shared with the back-office bundles.
window.bootstrap = bootstrap;

registerJqueryPlugins(bootstrap);
initPasswordToggle();
initSubmitOnce();
initAlertDismissFocus();
// The script loads in <head>: wait for the page
document.addEventListener('DOMContentLoaded', focusServerError);
