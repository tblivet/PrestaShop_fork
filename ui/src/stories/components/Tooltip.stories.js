/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/tooltips/
import * as bootstrap from 'bootstrap';

export default {
  title: 'Components/Tooltip',
};

const initTooltips = (canvasElement) =>
  canvasElement
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => bootstrap.Tooltip.getOrCreateInstance(el));

export const AllPositions = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 p-5 my-5 justify-content-center">
      <button
        id="tooltip-top"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Tooltip on top"
      >
        Tooltip on top
      </button>
      <button
        id="tooltip-right"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="Tooltip on right"
      >
        Tooltip on right
      </button>
      <button
        id="tooltip-bottom"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Tooltip on bottom"
      >
        Tooltip on bottom
      </button>
      <button
        id="tooltip-left"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="left"
        title="Tooltip on left"
      >
        Tooltip on left
      </button>
    </div>
  `,
  play: ({ canvasElement }) => initTooltips(canvasElement),
};

export const HTMLContent = {
  render: () => `
    <div class="d-flex justify-content-center p-5 my-5">
      <button
        id="tooltip-html"
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-html="true"
        title="<strong>Bold text</strong> and <em>italic text</em> inside a tooltip"
      >
        Tooltip with HTML content
      </button>
    </div>
  `,
  play: ({ canvasElement }) => initTooltips(canvasElement),
};

export const CustomColor = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 p-5 my-5 justify-content-center">
      <button
        id="tooltip-green"
        type="button"
        class="btn btn-success"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="This tooltip uses a custom green background"
        style="--psk-tooltip-bg: #198754; --psk-tooltip-color: #fff;"
      >
        Custom green tooltip
      </button>
      <button
        id="tooltip-red"
        type="button"
        class="btn btn-danger"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="This tooltip uses a custom red background"
        style="--psk-tooltip-bg: #dc3545; --psk-tooltip-color: #fff;"
      >
        Custom red tooltip
      </button>
      <button
        id="tooltip-warning"
        type="button"
        class="btn btn-warning"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="This tooltip uses a custom dark text"
        style="--psk-tooltip-bg: #ffc107; --psk-tooltip-color: #000;"
      >
        Custom warning tooltip
      </button>
    </div>
  `,
  play: ({ canvasElement }) => initTooltips(canvasElement),
};
