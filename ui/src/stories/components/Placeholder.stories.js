/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/placeholders/

export default {
  title: 'Components/Placeholder',
};

export const Default = {
  render: () => `
    <div class="card" style="width: 18rem;">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='286' height='180'%3E%3Crect width='100%25' height='100%25' fill='%23868e96'/%3E%3C/svg%3E" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title placeholder-glow">
          <span class="placeholder col-6"></span>
        </h5>
        <p class="card-text placeholder-glow">
          <span class="placeholder col-7"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-6"></span>
          <span class="placeholder col-8"></span>
        </p>
        <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
      </div>
    </div>
  `,
};

export const Widths = {
  render: () => `
    <div style="max-width: 400px;">
      <span class="placeholder col-1 d-block mb-2"></span>
      <span class="placeholder col-2 d-block mb-2"></span>
      <span class="placeholder col-3 d-block mb-2"></span>
      <span class="placeholder col-4 d-block mb-2"></span>
      <span class="placeholder col-5 d-block mb-2"></span>
      <span class="placeholder col-6 d-block mb-2"></span>
      <span class="placeholder col-7 d-block mb-2"></span>
      <span class="placeholder col-8 d-block mb-2"></span>
      <span class="placeholder col-9 d-block mb-2"></span>
      <span class="placeholder col-10 d-block mb-2"></span>
      <span class="placeholder col-11 d-block mb-2"></span>
      <span class="placeholder col-12 d-block mb-2"></span>
    </div>
  `,
};

export const Colors = {
  render: () => `
    <div style="max-width: 400px;">
      <span class="placeholder col-12 d-block mb-2"></span>
      <span class="placeholder col-12 bg-primary d-block mb-2"></span>
      <span class="placeholder col-12 bg-secondary d-block mb-2"></span>
      <span class="placeholder col-12 bg-success d-block mb-2"></span>
      <span class="placeholder col-12 bg-danger d-block mb-2"></span>
      <span class="placeholder col-12 bg-warning d-block mb-2"></span>
      <span class="placeholder col-12 bg-info d-block mb-2"></span>
      <span class="placeholder col-12 bg-light d-block mb-2"></span>
      <span class="placeholder col-12 bg-dark d-block mb-2"></span>
    </div>
  `,
};

export const Sizing = {
  render: () => `
    <div style="max-width: 400px;">
      <p class="mb-1 text-muted small">placeholder-xs</p>
      <span class="placeholder col-12 placeholder-xs d-block mb-3"></span>

      <p class="mb-1 text-muted small">placeholder-sm</p>
      <span class="placeholder col-12 placeholder-sm d-block mb-3"></span>

      <p class="mb-1 text-muted small">Default</p>
      <span class="placeholder col-12 d-block mb-3"></span>

      <p class="mb-1 text-muted small">placeholder-lg</p>
      <span class="placeholder col-12 placeholder-lg d-block mb-3"></span>
    </div>
  `,
};

export const GlowAnimation = {
  render: () => `
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title placeholder-glow">
          <span class="placeholder col-6"></span>
        </h5>
        <p class="card-text placeholder-glow">
          <span class="placeholder col-7"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-6"></span>
          <span class="placeholder col-8"></span>
        </p>
        <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
      </div>
    </div>
  `,
};

export const WaveAnimation = {
  render: () => `
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title placeholder-wave">
          <span class="placeholder col-6"></span>
        </h5>
        <p class="card-text placeholder-wave">
          <span class="placeholder col-7"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-6"></span>
          <span class="placeholder col-8"></span>
        </p>
        <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
      </div>
    </div>
  `,
};
