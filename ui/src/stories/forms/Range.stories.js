/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/range/

export default {
  title: 'Forms/Range',
};

export const Default = {
  render: () => `
    <div>
      <label for="customRange1" class="form-label">Example range</label>
      <input type="range" class="form-range" id="customRange1">
    </div>
  `,
};

export const MinMaxStep = {
  render: () => `
    <div>
      <div class="mb-3">
        <label for="customRange2" class="form-label">Range with min and max (0–5)</label>
        <input type="range" class="form-range" min="0" max="5" id="customRange2">
      </div>
      <div>
        <label for="customRange3" class="form-label">Range with steps of 0.5 (0–5, step 0.5)</label>
        <input type="range" class="form-range" min="0" max="5" step="0.5" id="customRange3">
      </div>
    </div>
  `,
};

export const Disabled = {
  render: () => `
    <div>
      <label for="disabledRange" class="form-label">Disabled range</label>
      <input type="range" class="form-range" id="disabledRange" disabled>
    </div>
  `,
};
