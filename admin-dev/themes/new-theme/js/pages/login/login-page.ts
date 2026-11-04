/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import * as EmailValidator from 'email-validator';
import LoginFormMap from '@pages/login/login-map';
import onReady from '@components/on-ready';

/**
 * Client-side email check of the kit login pages: each email field has an empty message slot linked by
 * aria-describedby (email_widget block of ui_kit_layout.html.twig); the field state is aria-invalid.
 */
const watchEmailFields = (): void => {
  document.querySelectorAll<HTMLElement>(LoginFormMap.emailError).forEach((error) => {
    const input = document.querySelector<HTMLInputElement>(`[aria-describedby~="${error.id}"]`);

    if (!input) {
      return;
    }

    const check = (): boolean => {
      const valid = EmailValidator.validate(input.value);

      if (valid) {
        input.removeAttribute('aria-invalid');
      } else {
        input.setAttribute('aria-invalid', 'true');
      }
      // Written when shown, so the live region announces it; emptied otherwise, so the slot takes no room
      if (valid) {
        error.replaceChildren();
      } else {
        error.replaceChildren(error.dataset.psDataInvalid ?? '');
      }

      return valid;
    };

    // Checked on submit, not when the field is left: a message appearing then would move the button being clicked.
    // Once shown, it follows the typing, so it goes away as soon as the address is fixed.
    let shown = false;

    input.addEventListener('input', () => {
      if (shown) {
        shown = !check();
      }
    });
    input.form?.addEventListener('submit', (event) => {
      if (!check()) {
        shown = true;
        event.preventDefault();
        event.stopImmediatePropagation();
        input.focus();
      }
    });
  });
};

onReady(() => {
  const loginForm = document.querySelector<HTMLFormElement>(LoginFormMap.loginForm);
  const forgotPasswordForm = document.querySelector<HTMLFormElement>(LoginFormMap.forgotPasswordForm);
  const forgotPasswordLink = document.querySelector<HTMLElement>(LoginFormMap.forgotPasswordLink);

  // Focus follows the panel switch, so keyboard and screen reader users stay in the visible panel
  forgotPasswordLink?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    loginForm?.classList.add('d-none');
    forgotPasswordForm?.classList.remove('d-none');
    document.querySelectorAll<HTMLElement>(LoginFormMap.alertMessages).forEach((alert) => {
      alert.remove();
    });
    forgotPasswordForm?.querySelector<HTMLElement>(LoginFormMap.forgotPasswordEmail)?.focus();
  });

  document.querySelector(LoginFormMap.cancelResetPasswordButton)?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    loginForm?.classList.remove('d-none');
    forgotPasswordForm?.classList.add('d-none');
    forgotPasswordLink?.focus();
  });

  watchEmailFields();
});
