/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// Dependencies

// jQuery (js/jquery) and Bootstrap (the /ui kit) are loaded before this bundle
import 'select2';
import 'jquery-ui-dist/jquery-ui';
import 'bootstrap-tokenfield';
import 'eonasdan-bootstrap-datetimepicker';
import 'jwerty';
import 'magnific-popup';
import 'dropzone';
import 'typeahead.js/dist/typeahead.jquery';
import 'typeahead.js/dist/bloodhound.min';
import 'jquery-serializejson';

// this needs to be ported into the UI kit
import '@js/clickable-dropdown';

import '@js/maintenance-page';
import '@js/translation-page/index';

import initDatePickers from '@js/app/utils/datepicker';
import initInvalidFields from '@js/app/utils/fields';
import initEmailFields from '@js/app/utils/email-idn';
import initNumberCommaTransformer from '@js/app/utils/number-comma-transformer';
import initPrestashopComponents from '@app/utils/init-components';
import watchSymfonyDebugBar from '@app/utils/watch-symfony-debug-bar';

const {$} = window;

// Theme Javascript
window.Dropzone.autoDiscover = false;

// The kit renders its own header and menu (<twig:ui:Header>, <twig:ui:SideMenu>): the old NavBar and Header scripts are
// not loaded. Notifications and quick access come back with their kit version.

$(() => {
  initPrestashopComponents();
  initDatePickers();
  initInvalidFields();
  initEmailFields('input[type="email"]');
  initNumberCommaTransformer('.js-comma-transformer');
  watchSymfonyDebugBar();
});
