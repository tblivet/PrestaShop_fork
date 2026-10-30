/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/toasts/

export default {
  title: 'Components/Toast',
};

export const Default = {
  render: () => `
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect width="100%" height="100%" fill="#007aff"/>
        </svg>
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        Hello, world! This is a toast message.
      </div>
    </div>
  `,
};

export const Stacked = {
  render: () => `
    <div class="toast-container position-static d-flex flex-column gap-2">
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect width="100%" height="100%" fill="#007aff"/>
          </svg>
          <strong class="me-auto">Bootstrap</strong>
          <small>just now</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          See? Just like this.
        </div>
      </div>
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect width="100%" height="100%" fill="#007aff"/>
          </svg>
          <strong class="me-auto">Bootstrap</strong>
          <small>2 seconds ago</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Heads up, toasts will stack automatically.
        </div>
      </div>
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect width="100%" height="100%" fill="#007aff"/>
          </svg>
          <strong class="me-auto">Bootstrap</strong>
          <small>5 minutes ago</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          And this is the third toast in the stack.
        </div>
      </div>
    </div>
  `,
};

export const ColorVariants = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div class="toast show text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">A simple primary toast.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
      <div class="toast show text-bg-secondary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">A simple secondary toast.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
      <div class="toast show text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">A simple success toast.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
      <div class="toast show text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">A simple danger toast.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
      <div class="toast show text-bg-warning border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">A simple warning toast.</div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
      <div class="toast show text-bg-info border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">A simple info toast.</div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `,
};

export const Placement = {
  render: () => `
    <div class="d-flex flex-column gap-4">
      <div>
        <p class="text-muted small fw-semibold mb-2">Top positions</p>
        <div class="d-flex flex-wrap gap-3">
          <div>
            <p class="text-muted small mb-1">top-start</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Top start</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast top-start</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-muted small mb-1">top-center</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Top center</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast top-center</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-muted small mb-1">top-end</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Top end</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast top-end</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="text-muted small fw-semibold mb-2">Middle positions</p>
        <div class="d-flex flex-wrap gap-3">
          <div>
            <p class="text-muted small mb-1">middle-start</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Middle start</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast middle-start</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-muted small mb-1">middle-center</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Middle center</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast middle-center</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-muted small mb-1">middle-end</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Middle end</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast middle-end</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="text-muted small fw-semibold mb-2">Bottom positions</p>
        <div class="d-flex flex-wrap gap-3">
          <div>
            <p class="text-muted small mb-1">bottom-start</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Bottom start</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast bottom-start</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-muted small mb-1">bottom-center</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Bottom center</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast bottom-center</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-muted small mb-1">bottom-end</p>
            <div class="toast-container position-static">
              <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Bottom end</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">Toast bottom-end</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
