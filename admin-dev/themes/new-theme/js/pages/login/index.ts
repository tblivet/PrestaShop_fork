/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import 'prestakit/dist/js/prestashop-ui-kit';
import 'jquery-ui-dist/jquery-ui';

import '@pages/login/login-page';
import onReady from '@components/on-ready';
import EmailInput from '@components/email-input';

// Old theme only (PS_UI_KIT=0): its template has no client error slot, so it keeps EmailInput.
// The kit page checks emails in login-page.ts.
onReady(() => {
  new EmailInput();
});
