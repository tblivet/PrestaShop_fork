/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import LoginFormMap from '@pages/login/login-map';
import onReady from '@components/on-ready';

/**
 * The document title names the visible panel, then the shop (DECISIONS.md #32): "Sign in to your back office • Shop".
 */
const showPanelTitle = (from: HTMLFormElement | null, to: HTMLFormElement | null): void => {
  const fromTitle = from?.querySelector(LoginFormMap.panelTitle)?.textContent?.trim();
  const toTitle = to?.querySelector(LoginFormMap.panelTitle)?.textContent?.trim();

  if (fromTitle && toTitle && document.title.startsWith(fromTitle)) {
    document.title = toTitle + document.title.slice(fromTitle.length);
  }
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
    showPanelTitle(loginForm, forgotPasswordForm);
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
    showPanelTitle(forgotPasswordForm, loginForm);
    forgotPasswordLink?.focus();
  });
});
