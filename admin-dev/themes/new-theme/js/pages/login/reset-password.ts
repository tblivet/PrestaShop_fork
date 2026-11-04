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

  if (!passwordInput || !confirmationInput) {
    return;
  }

  const passwordHandler = new ChangePasswordHandler(LoginFormMap.passwordStrengthFeedbackContainer);
  passwordHandler.watchPasswordStrength([passwordInput]);

  const passwordsMatch = (): boolean => passwordInput.value === confirmationInput.value;

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

    if (passwordValid && match) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    (passwordValid ? confirmationInput : passwordInput).focus();
  });
});
