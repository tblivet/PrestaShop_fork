/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import '../scss/main.scss';
import * as bootstrap from 'bootstrap';
import initPasswordToggle from './components/password-toggle';
import registerJqueryPlugins from './compat/jquery-plugins';

// Single Bootstrap instance shared with the back-office bundles.
window.bootstrap = bootstrap;

registerJqueryPlugins(bootstrap);
initPasswordToggle();
