/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/utilities/shadows/

export default {
  title: 'Utilities/Shadows',
};

export const AllShadows = {
  render: () => `
    <div class="d-flex flex-wrap gap-4 align-items-start p-4">
      <div class="card shadow-none" style="width: 180px">
        <div class="card-body">
          <h6 class="card-title">.shadow-none</h6>
          <p class="card-text small">No shadow applied to this card.</p>
        </div>
      </div>

      <div class="card shadow-sm" style="width: 180px">
        <div class="card-body">
          <h6 class="card-title">.shadow-sm</h6>
          <p class="card-text small">Small shadow applied to this card.</p>
        </div>
      </div>

      <div class="card shadow" style="width: 180px">
        <div class="card-body">
          <h6 class="card-title">.shadow</h6>
          <p class="card-text small">Regular shadow applied to this card.</p>
        </div>
      </div>

      <div class="card shadow-lg" style="width: 180px">
        <div class="card-body">
          <h6 class="card-title">.shadow-lg</h6>
          <p class="card-text small">Large shadow applied to this card.</p>
        </div>
      </div>
    </div>
  `,
};
