/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/content/images/

export default {
  title: 'Content/Images',
};

const placeholder = (w, h, bg = '6c757d', fg = 'ffffff', text = '') =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect width='${w}' height='${h}' fill='%23${bg}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23${fg}' font-family='sans-serif' font-size='14'%3E${text || `${w}x${h}`}%3C/text%3E%3C/svg%3E`;

export const Responsive = {
  render: () => `
    <div>
      <p>Use <code>.img-fluid</code> to make images responsive. This applies
      <code>max-width: 100%</code> and <code>height: auto</code>.</p>
      <img src="${placeholder(800, 300)}" class="img-fluid" alt="Responsive image">
    </div>
  `,
};

export const Rounded = {
  render: () => `
    <div class="d-flex flex-wrap gap-3 align-items-center">
      <div>
        <p class="text-center small mb-1">.rounded</p>
        <img src="${placeholder(150, 150, '0d6efd')}" class="rounded" alt="Rounded image" width="150" height="150">
      </div>
      <div>
        <p class="text-center small mb-1">.rounded-circle</p>
        <img src="${placeholder(150, 150, '198754')}" class="rounded-circle" alt="Circle image" width="150" height="150">
      </div>
      <div>
        <p class="text-center small mb-1">.rounded-pill</p>
        <img src="${placeholder(200, 100, 'dc3545')}" class="rounded-pill" alt="Pill image" width="200" height="100">
      </div>
    </div>
  `,
};

export const Thumbnail = {
  render: () => `
    <div>
      <p>Use <code>.img-thumbnail</code> to give an image a rounded 1px border appearance.</p>
      <img src="${placeholder(200, 200, 'adb5bd', '000000')}" class="img-thumbnail" alt="Thumbnail image" width="200" height="200">
    </div>
  `,
};

export const Float = {
  render: () => `
    <div class="clearfix">
      <img src="${placeholder(150, 150, '0d6efd')}" class="rounded float-start me-3" alt="Float start" width="150" height="150">
      <img src="${placeholder(150, 150, '198754')}" class="rounded float-end ms-3" alt="Float end" width="150" height="150">
      <p>
        Use <code>.float-start</code> or <code>.float-end</code> to float an image to the left or
        right of the text. Add a clearing utility or use a clearfix to ensure the container
        wraps around the floated image. This text fills out the rest of the space alongside
        the two floated images. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
      </p>
    </div>
  `,
};

export const Alignment = {
  render: () => `
    <div>
      <p>Center an image using the <code>.mx-auto</code> margin utility and <code>.d-block</code>.</p>
      <img src="${placeholder(200, 150, '6f42c1')}" class="mx-auto d-block rounded" alt="Centered image" width="200" height="150">
    </div>
  `,
};
