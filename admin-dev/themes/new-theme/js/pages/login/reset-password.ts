/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

import LoginFormMap from '@pages/login/login-map';
import onReady from '@components/on-ready';
import ChangePasswordHandler from '@components/change-password-handler';

onReady(() => {
  const passwordInput = document.querySelector<HTMLInputElement>(LoginFormMap.resetNewPassword);
  const confirmationInput = document.querySelector<HTMLInputElement>(LoginFormMap.resetNewPasswordConfirmation);
  const mismatch = document.querySelector<HTMLElement>(LoginFormMap.resetPasswordMismatch);
  const policyError = document.querySelector<HTMLElement>(LoginFormMap.resetPasswordPolicyError);

  if (!passwordInput || !confirmationInput) {
    return;
  }

  const passwordHandler = new ChangePasswordHandler(LoginFormMap.passwordStrengthFeedbackContainer);
  passwordHandler.watchPasswordStrength([passwordInput]);

  const passwordsMatch = (): boolean => passwordInput.value === confirmationInput.value;

  // Says why a submit did nothing when the password does not meet the policy; the checklist below tells what is missing
  const showPolicyError = (show: boolean): void => {
    if (policyError) {
      policyError.textContent = show ? policyError.dataset.psDataInvalid ?? '' : '';
    }
  };

  passwordInput.addEventListener('input', () => {
    if (passwordHandler.isPasswordValid() || passwordInput.value === '') {
      showPolicyError(false);
    }
  });

  // The message is written when shown, so the live region announces it
  const showMismatch = (show: boolean): void => {
    if (show) {
      confirmationInput.setAttribute('aria-invalid', 'true');
    } else {
      confirmationInput.removeAttribute('aria-invalid');
    }

    if (mismatch) {
      mismatch.textContent = show ? confirmationInput.dataset.psDataMismatch ?? '' : '';
    }
  };

  // Shown once the user leaves the field, not while they are still typing; cleared as soon as it is fixed
  confirmationInput.addEventListener('blur', () => {
    showMismatch(confirmationInput.value !== '' && !passwordsMatch());
  });
  [passwordInput, confirmationInput].forEach((input) => {
    input.addEventListener('input', () => {
      if (passwordsMatch() || confirmationInput.value === '') {
        showMismatch(false);
      }
    });
  });

  // The button stays enabled: a blocked submit explains itself on the fields and moves focus to the first one to fix
  passwordInput.form?.addEventListener('submit', (event) => {
    const passwordValid = passwordHandler.isPasswordValid();
    const match = passwordsMatch();

    showMismatch(!match);
    showPolicyError(!passwordValid);

    if (passwordValid && match) {
      return;
    }

    if (!passwordValid) {
      passwordHandler.markInvalid(passwordInput);
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    (passwordValid ? confirmationInput : passwordInput).focus();
  });
});
