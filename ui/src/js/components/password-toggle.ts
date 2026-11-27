/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// <button data-ps-action="toggle-password" aria-controls="{input id}"> (the <twig:ui:PasswordField> button) shows or hides that input's value.
export default function initPasswordToggle(): void {
  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest(selectors.passwordToggle) : null;
    const input = button && document.getElementById(String(button.getAttribute('aria-controls')));

    if (!button || !(input instanceof HTMLInputElement)) {
      return;
    }

    const show = input.type === 'password';

    // The icon follows aria-pressed in CSS (_password-field.scss)
    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(show));
  });
}
