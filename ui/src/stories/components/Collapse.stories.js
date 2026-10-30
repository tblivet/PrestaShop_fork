/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/collapse/

export default {
  title: 'Components/Collapse',
};

export const Default = {
  render: () => `
    <div>
      <button class="btn btn-primary" type="button"
        data-bs-toggle="collapse" data-bs-target="#collapseExample"
        aria-expanded="false" aria-controls="collapseExample">
        Toggle collapse
      </button>
      <div class="collapse mt-3" id="collapseExample">
        <div class="card card-body">
          Some placeholder content for the collapse component. This panel is hidden by default but
          revealed when the user activates the relevant trigger.
        </div>
      </div>
    </div>
  `,
};

export const MultipleTargets = {
  render: () => `
    <div>
      <div class="d-flex gap-2 mb-3">
        <button class="btn btn-primary" type="button"
          data-bs-toggle="collapse" data-bs-target="#multiCollapseOne"
          aria-expanded="false" aria-controls="multiCollapseOne">
          Toggle first element
        </button>
        <button class="btn btn-primary" type="button"
          data-bs-toggle="collapse" data-bs-target="#multiCollapseTwo"
          aria-expanded="false" aria-controls="multiCollapseTwo">
          Toggle second element
        </button>
        <button class="btn btn-primary" type="button"
          data-bs-toggle="collapse" data-bs-target=".multi-collapse"
          aria-expanded="false" aria-controls="multiCollapseOne multiCollapseTwo">
          Toggle both elements
        </button>
      </div>
      <div class="row">
        <div class="col">
          <div class="collapse multi-collapse" id="multiCollapseOne">
            <div class="card card-body">
              Some placeholder content for the first collapse component of this multi-collapse example.
              This panel is hidden by default but revealed when the user activates the relevant trigger.
            </div>
          </div>
        </div>
        <div class="col">
          <div class="collapse multi-collapse" id="multiCollapseTwo">
            <div class="card card-body">
              Some placeholder content for the second collapse component of this multi-collapse example.
              This panel is hidden by default but revealed when the user activates the relevant trigger.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const Horizontal = {
  render: () => `
    <div>
      <button class="btn btn-primary mb-3" type="button"
        data-bs-toggle="collapse" data-bs-target="#collapseHorizontal"
        aria-expanded="false" aria-controls="collapseHorizontal">
        Toggle horizontal collapse
      </button>
      <div style="min-height: 120px;">
        <div class="collapse collapse-horizontal" id="collapseHorizontal">
          <div class="card card-body" style="width: 300px;">
            This is some placeholder content for a horizontal collapse. It's hidden by default and shown
            when triggered.
          </div>
        </div>
      </div>
    </div>
  `,
};
