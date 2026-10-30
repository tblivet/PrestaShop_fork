/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/close-button/

export default {
  title: 'Components/CloseButton',
};

export const Default = {
  render: () => `
    <button type="button" class="btn-close" aria-label="Close"></button>
  `,
};

export const White = {
  render: () => `
    <div class="bg-dark p-3 d-inline-block rounded">
      <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
    </div>
  `,
};

export const Disabled = {
  render: () => `
    <div class="d-flex gap-3 align-items-center">
      <div>
        <p class="text-muted small mb-1">Default disabled</p>
        <button type="button" class="btn-close" disabled aria-label="Close"></button>
      </div>
      <div class="bg-dark p-3 rounded">
        <p class="text-white small mb-1">White disabled</p>
        <button type="button" class="btn-close btn-close-white" disabled aria-label="Close"></button>
      </div>
    </div>
  `,
};
