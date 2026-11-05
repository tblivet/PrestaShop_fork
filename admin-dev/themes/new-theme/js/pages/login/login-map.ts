/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

/**
 * Defines all selectors that are used in login/reset password form.
 */
export default {
  loginForm: '[data-ps-ref="login-form"]',
  forgotPasswordForm: '[data-ps-ref="forgot-password-form"]',
  forgotPasswordLink: '[data-ps-action="show-forgot-password"]',
  forgotPasswordEmail: '[data-ps-ref="forgot-password-email"]',
  panelTitle: '[data-ps-ref="panel-title"]',
  cancelResetPasswordButton: '[data-ps-action="cancel-forgot-password"]',
  passwordStrengthFeedbackContainer: '[data-ps-ref="password-feedback"]',
  resetNewPassword: '[data-ps-ref="new-password"]',
  resetNewPasswordConfirmation: '[data-ps-ref="new-password-confirmation"]',
  resetPasswordMismatch: '[data-ps-target="password-mismatch"]',
  resetPasswordPolicyError: '[data-ps-target="password-policy-error"]',
  resetSubmitButton: '[data-ps-ref="reset-password-submit"]',
  alertMessages: '[data-ps-ref="flash-alert"]',
};
