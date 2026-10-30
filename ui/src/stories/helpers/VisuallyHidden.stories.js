/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/visually-hidden/
export default {
  title: 'Helpers/Visually Hidden',
};

export const Default = {
  render: () => `
    <p class="text-body-secondary small mb-3">
      <code>.visually-hidden</code> hides content visually while keeping it accessible to screen readers.
      <code>.visually-hidden-focusable</code> reveals the element when focused (skip-nav pattern).
    </p>
    <div class="d-flex flex-column gap-3">
      <div>
        <p class="mb-1 small fw-semibold">visually-hidden (not visible, but in DOM)</p>
        <span class="visually-hidden">This text is visually hidden</span>
        <code class="p-2 border rounded d-block bg-body-secondary">&lt;span class="visually-hidden"&gt;...&lt;/span&gt;</code>
      </div>
      <div>
        <p class="mb-1 small fw-semibold">visually-hidden-focusable (Tab to reveal)</p>
        <a href="#main" class="visually-hidden-focusable">Skip to main content</a>
        <code class="p-2 border rounded d-block bg-body-secondary">&lt;a class="visually-hidden-focusable" href="#main"&gt;Skip to main content&lt;/a&gt;</code>
      </div>
    </div>
  `,
};
