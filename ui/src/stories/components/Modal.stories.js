/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/modal/
export default {
  title: 'Components/Modal',
};

const modal = ({ id, title, body, dialogClass = '' }) => `
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${id}">
    Open modal
  </button>
  <div class="modal fade" id="${id}" tabindex="-1">
    <div class="modal-dialog ${dialogClass}">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
`;

export const Default = {
  render: () =>
    modal({
      id: 'modal-default',
      title: 'Modal title',
      body: '<p>Modal body text goes here.</p>',
    }),
};

export const Sizes = {
  render: () => `
    <div class="d-flex gap-2 flex-wrap">
      ${[
        ['modal-sm', 'Small', 'modal-size-sm'],
        ['modal-lg', 'Large', 'modal-size-lg'],
        ['modal-xl', 'Extra large', 'modal-size-xl'],
      ]
        .map(
          ([cls, label, id]) => `
        <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#${id}">${label}</button>
        <div class="modal fade" id="${id}" tabindex="-1">
          <div class="modal-dialog ${cls}">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${label} modal</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body"><p>Body content for the ${label.toLowerCase()} modal.</p></div>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};

export const VerticallyCentered = {
  render: () =>
    modal({
      id: 'modal-centered',
      title: 'Vertically centered',
      body: '<p>This modal is vertically centered on the page.</p>',
      dialogClass: 'modal-dialog-centered',
    }),
};

export const Scrollable = {
  render: () =>
    modal({
      id: 'modal-scrollable',
      title: 'Scrollable modal',
      body: Array(12)
        .fill(
          '<p>This is some placeholder content to show the scrolling behavior inside modals. Instead of repeating the text, we use an inline style to set a minimum height, thereby extending the length of the overall modal and demonstrating the overflow scrolling.</p>'
        )
        .join(''),
      dialogClass: 'modal-dialog-scrollable',
    }),
};

export const Fullscreen = {
  render: () =>
    modal({
      id: 'modal-fullscreen',
      title: 'Full screen modal',
      body: '<p>This modal takes up the full viewport.</p>',
      dialogClass: 'modal-fullscreen',
    }),
};
