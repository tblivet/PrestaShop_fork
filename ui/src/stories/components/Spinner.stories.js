/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/spinners/

export default {
  title: 'Components/Spinner',
};

export const BorderSpinners = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 align-items-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
};

export const GrowSpinners = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 align-items-center">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
};

export const Sizes = {
  render: () => `
    <div class="d-flex flex-column gap-4">
      <div>
        <p class="text-muted mb-2 small fw-semibold">Border — Small (.spinner-border-sm)</p>
        <div class="d-flex gap-3 align-items-center">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0 text-muted small">spinner-border-sm</p>
        </div>
      </div>
      <div>
        <p class="text-muted mb-2 small fw-semibold">Border — Default</p>
        <div class="d-flex gap-3 align-items-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0 text-muted small">Default</p>
        </div>
      </div>
      <div>
        <p class="text-muted mb-2 small fw-semibold">Border — Custom large (via style)</p>
        <div class="d-flex gap-3 align-items-center">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0 text-muted small">style="width: 3rem; height: 3rem;"</p>
        </div>
      </div>
      <div>
        <p class="text-muted mb-2 small fw-semibold">Grow — Small (.spinner-grow-sm)</p>
        <div class="d-flex gap-3 align-items-center">
          <div class="spinner-grow spinner-grow-sm text-success" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0 text-muted small">spinner-grow-sm</p>
        </div>
      </div>
      <div>
        <p class="text-muted mb-2 small fw-semibold">Grow — Default</p>
        <div class="d-flex gap-3 align-items-center">
          <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0 text-muted small">Default</p>
        </div>
      </div>
      <div>
        <p class="text-muted mb-2 small fw-semibold">Grow — Custom large (via style)</p>
        <div class="d-flex gap-3 align-items-center">
          <div class="spinner-grow text-success" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0 text-muted small">style="width: 3rem; height: 3rem;"</p>
        </div>
      </div>
    </div>
  `,
};

export const ButtonWithSpinner = {
  render: () => `
    <div class="d-flex flex-wrap gap-3">
      <button class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Loading...</span>
      </button>
      <button class="btn btn-secondary" type="button" disabled>
        <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
        <span role="status">Loading...</span>
      </button>
      <button class="btn btn-outline-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span class="visually-hidden" role="status">Loading...</span>
      </button>
    </div>
  `,
};
