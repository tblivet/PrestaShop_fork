/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/offcanvas/
export default {
  title: 'Components/Offcanvas',
};

const offcanvas = ({ id, placement, label }) => `
  <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#${id}">
    Open ${label}
  </button>
  <div class="offcanvas offcanvas-${placement}" tabindex="-1" id="${id}">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">${label} offcanvas</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
      <p>Some text as placeholder. In real life you can have the elements you have chosen.</p>
    </div>
  </div>
`;

export const Start = {
  render: () => offcanvas({ id: 'oc-start', placement: 'start', label: 'Start' }),
};

export const End = {
  render: () => offcanvas({ id: 'oc-end', placement: 'end', label: 'End' }),
};

export const Top = {
  render: () => offcanvas({ id: 'oc-top', placement: 'top', label: 'Top' }),
};

export const Bottom = {
  render: () => offcanvas({ id: 'oc-bottom', placement: 'bottom', label: 'Bottom' }),
};

export const WithBackdropDisabled = {
  render: () => `
    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#oc-no-backdrop">
      Open (no backdrop)
    </button>
    <div class="offcanvas offcanvas-start" data-bs-backdrop="false" tabindex="-1" id="oc-no-backdrop">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">No backdrop</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <p>The page remains interactive behind the offcanvas when the backdrop is disabled.</p>
      </div>
    </div>
  `,
};
