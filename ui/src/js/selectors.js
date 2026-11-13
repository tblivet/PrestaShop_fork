/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// JS hooks of the kit's components: data-ps-* attributes only, never CSS classes.
export default {
  passwordToggle: '[data-ps-action="toggle-password"]',
  // data-ps-action can hold several behaviours ("submit-once validate")
  submitOnce: '[data-ps-action~="submit-once"]',
  validate: '[data-ps-action~="validate"]',
  clientError: '[data-ps-target="client-error"]',
  flashAlert: '[data-ps-ref="flash-alert"]',
  submitSpinner: '[data-ps-ref="submit-spinner"]',
  // Bootstrap's own attribute: the tooltip plugin reads its options from data-bs-*
  tooltip: '[data-bs-toggle="tooltip"]',
};
