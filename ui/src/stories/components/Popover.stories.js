/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/popovers/
import * as bootstrap from 'bootstrap';

export default {
  title: 'Components/Popover',
};

const initPopovers = (canvasElement) =>
  canvasElement
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach((el) => bootstrap.Popover.getOrCreateInstance(el));

export const Default = {
  render: () => `
    <div class="d-flex justify-content-center p-5 my-5">
      <button
        id="popover-default"
        type="button"
        class="btn btn-lg btn-secondary"
        data-bs-toggle="popover"
        title="Popover title"
        data-bs-content="And here's some amazing content. It's very engaging. Right?"
      >
        Click to toggle popover
      </button>
    </div>
  `,
  play: ({ canvasElement }) => initPopovers(canvasElement),
};

export const AllPositions = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 p-5 my-5 justify-content-center">
      <button
        id="popover-top"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="popover"
        data-bs-placement="top"
        title="Popover on top"
        data-bs-content="This popover appears on the top."
      >
        Popover on top
      </button>
      <button
        id="popover-right"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="popover"
        data-bs-placement="right"
        title="Popover on right"
        data-bs-content="This popover appears on the right."
      >
        Popover on right
      </button>
      <button
        id="popover-bottom"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="popover"
        data-bs-placement="bottom"
        title="Popover on bottom"
        data-bs-content="This popover appears on the bottom."
      >
        Popover on bottom
      </button>
      <button
        id="popover-left"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="popover"
        data-bs-placement="left"
        title="Popover on left"
        data-bs-content="This popover appears on the left."
      >
        Popover on left
      </button>
    </div>
  `,
  play: ({ canvasElement }) => initPopovers(canvasElement),
};

export const DismissOnNextClick = {
  render: () => `
    <div class="d-flex justify-content-center p-5 my-5">
      <a
        id="popover-dismiss"
        tabindex="0"
        class="btn btn-lg btn-danger"
        role="button"
        data-bs-toggle="popover"
        data-bs-trigger="focus"
        title="Dismissible popover"
        data-bs-content="And here's some amazing content. It's very engaging. Right? Click anywhere outside to dismiss."
      >
        Dismissible popover
      </a>
    </div>
  `,
  play: ({ canvasElement }) => initPopovers(canvasElement),
};
