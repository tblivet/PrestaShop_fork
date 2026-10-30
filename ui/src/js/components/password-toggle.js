/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// <button data-ps-action="toggle-password" aria-controls="{input id}"> shows or hides that input's value.
export default function initPasswordToggle() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest(selectors.passwordToggle);
    const input = button && document.getElementById(button.getAttribute('aria-controls'));

    if (!input) {
      return;
    }

    const show = input.type === 'password';
    const icon = button.querySelector('[aria-hidden="true"]');

    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(show));

    if (icon) {
      icon.textContent = show ? 'visibility_off' : 'visibility';
    }
  });
}
