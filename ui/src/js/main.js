/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import '../scss/main.scss';
import * as bootstrap from 'bootstrap';
import initAlertDismissFocus from './components/alert-dismiss-focus';
import initAnnouncer from './components/announcer';
import initBusyButtons from './components/busy-button';
import initPasswordToggle from './components/password-toggle';
import initFormValidation from './components/form-validation';
import initHeaderSearch from './components/header-search';
import initKpis from './components/kpi';
import initNotifications from './components/notifications';
import initQuickAccess from './components/quick-access';
import initScrollFade from './components/scroll-fade';
import initShowcaseModals from './components/showcase-modal';
import focusOnLoad from './components/load-focus';
import initSubmitOnce from './components/submit-once';
import initTooltips from './components/tooltips';
import registerJqueryPlugins from './compat/jquery-plugins';

// Single Bootstrap instance shared with the back-office bundles.
window.bootstrap = bootstrap;

registerJqueryPlugins(bootstrap);
initAnnouncer();
initPasswordToggle();
initFormValidation();
initHeaderSearch();
initQuickAccess(bootstrap.Modal);
// The bell is rendered after this script (in <head>)
document.addEventListener('DOMContentLoaded', initNotifications);
initBusyButtons();
initSubmitOnce();
initAlertDismissFocus();
initTooltips(bootstrap.Tooltip);
// The script loads in <head>: the boxes are not there yet
document.addEventListener('DOMContentLoaded', initScrollFade);
document.addEventListener('DOMContentLoaded', () => initShowcaseModals(bootstrap.Modal));
document.addEventListener('DOMContentLoaded', () => initKpis(bootstrap.Tooltip));
// The script loads in <head>: wait for the page
document.addEventListener('DOMContentLoaded', focusOnLoad);
