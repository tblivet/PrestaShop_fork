/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/position/
export default {
  title: 'Helpers/Position',
};

export const FixedAndSticky = {
  render: () => `
    <p class="text-body-secondary small mb-3">
      Position helper classes shown as static labeled examples
      (actual <code>fixed-top</code>/<code>sticky-top</code> would affect the page layout).
    </p>
    <div class="d-flex flex-column gap-2">
      ${['fixed-top', 'fixed-bottom', 'sticky-top', 'sticky-bottom']
        .map(
          (cls) => `
        <code class="p-2 border rounded bg-body-secondary">.${cls}</code>
      `
        )
        .join('')}
    </div>
  `,
};

export const TranslateMiddle = {
  render: () => `
    <p class="text-body-secondary small mb-3">
      <code>.translate-middle</code> — centers an element over its positioned parent.
      Used for notification badges overlapping buttons.
    </p>
    <div class="d-flex gap-4">
      <div class="position-relative d-inline-flex">
        <button type="button" class="btn btn-primary">Inbox</button>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
          9+
        </span>
      </div>
      <div class="position-relative d-inline-flex">
        <button type="button" class="btn btn-secondary">Notifications</button>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-primary">
          4
        </span>
      </div>
    </div>
  `,
};
