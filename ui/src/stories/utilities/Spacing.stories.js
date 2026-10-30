/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/utilities/spacing/

export default {
  title: 'Utilities/Spacing',
};

export const Margin = {
  render: () => `
    <div>
      <p class="text-body-secondary small mb-3">Each box shows its margin class. The outer border is the reference container.</p>
      <div class="d-flex flex-wrap gap-0 border border-dashed">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div class="m-${n}">
            <div class="bg-primary text-white p-2 small">.m-${n}</div>
          </div>
        `
          )
          .join('')}
        <div class="m-auto">
          <div class="bg-secondary text-white p-2 small">.m-auto</div>
        </div>
      </div>

      <p class="text-body-secondary small mt-4 mb-3">Horizontal margins</p>
      <div class="d-flex flex-wrap gap-1">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div class="mx-${n} bg-success text-white p-2 small">.mx-${n}</div>
        `
          )
          .join('')}
      </div>

      <p class="text-body-secondary small mt-4 mb-3">Vertical margins</p>
      <div class="d-inline-flex flex-column">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div class="my-${n} bg-danger text-white p-2 small">.my-${n}</div>
        `
          )
          .join('')}
      </div>
    </div>
  `,
};

export const Padding = {
  render: () => `
    <div>
      <p class="text-body-secondary small mb-3">Each box shows its padding class with a background to visualise the space.</p>
      <div class="d-flex flex-wrap gap-3">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div class="p-${n} bg-info bg-opacity-25 border border-info rounded">
            <div class="bg-info text-white small">.p-${n}</div>
          </div>
        `
          )
          .join('')}
      </div>

      <p class="text-body-secondary small mt-4 mb-3">Horizontal padding</p>
      <div class="d-flex flex-wrap gap-3">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div class="px-${n} bg-warning bg-opacity-25 border border-warning rounded">
            <div class="bg-warning text-dark small">.px-${n}</div>
          </div>
        `
          )
          .join('')}
      </div>

      <p class="text-body-secondary small mt-4 mb-3">Vertical padding</p>
      <div class="d-flex flex-wrap gap-3">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div class="py-${n} bg-success bg-opacity-25 border border-success rounded">
            <div class="bg-success text-white small">.py-${n}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `,
};

export const NegativeMargin = {
  render: () => `
    <div>
      <p class="text-body-secondary small mb-3">Negative margins pull elements closer. The container has padding so negative margins are visible.</p>
      <div class="bg-body-secondary p-3">
        ${[1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div class="mt-n${n} bg-primary text-white p-2 small border border-white">.mt-n${n}</div>
        `
          )
          .join('')}
      </div>
    </div>
  `,
};

export const Gap = {
  render: () => `
    <div>
      <p class="text-body-secondary small mb-2">Flex gap utilities</p>
      ${[0, 1, 2, 3, 4, 5]
        .map(
          (n) => `
        <div class="d-flex gap-${n} mb-3 bg-body-secondary p-2 rounded">
          <div class="bg-primary text-white p-2 small">Item</div>
          <div class="bg-secondary text-white p-2 small">Item</div>
          <div class="bg-success text-white p-2 small">Item</div>
          <small class="ms-auto align-self-center text-body-secondary">.gap-${n}</small>
        </div>
      `
        )
        .join('')}

      <p class="text-body-secondary small mb-2 mt-3">Grid gap utilities</p>
      ${[0, 1, 2, 3, 4, 5]
        .map(
          (n) => `
        <div class="row g-${n} mb-3">
          <div class="col"><div class="bg-primary text-white p-2 small text-center">Col</div></div>
          <div class="col"><div class="bg-secondary text-white p-2 small text-center">Col</div></div>
          <div class="col"><div class="bg-success text-white p-2 small text-center">Col</div></div>
          <div class="col-auto"><small class="text-body-secondary">.g-${n}</small></div>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};
