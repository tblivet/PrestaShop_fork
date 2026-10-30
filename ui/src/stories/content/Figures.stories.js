/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/content/figures/

export default {
  title: 'Content/Figures',
};

const placeholder = (w, h, bg = '6c757d', fg = 'ffffff', text = '') =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect width='${w}' height='${h}' fill='%23${bg}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23${fg}' font-family='sans-serif' font-size='14'%3E${text || `${w}x${h}`}%3C/text%3E%3C/svg%3E`;

export const Default = {
  render: () => `
    <figure class="figure">
      <img src="${placeholder(400, 300)}" class="figure-img img-fluid rounded" alt="Figure image" width="400" height="300">
      <figcaption class="figure-caption">A caption for the above image.</figcaption>
    </figure>
  `,
};

export const Alignment = {
  render: () => `
    <div>
      <figure class="figure">
        <img src="${placeholder(400, 200, '0d6efd')}" class="figure-img img-fluid rounded" alt="Start aligned" width="400" height="200">
        <figcaption class="figure-caption text-start">Caption aligned to the start.</figcaption>
      </figure>

      <figure class="figure d-block text-center">
        <img src="${placeholder(400, 200, '198754')}" class="figure-img img-fluid rounded" alt="Center aligned" width="400" height="200">
        <figcaption class="figure-caption text-center">Caption aligned to the center.</figcaption>
      </figure>

      <figure class="figure d-block text-end">
        <img src="${placeholder(400, 200, 'dc3545')}" class="figure-img img-fluid rounded" alt="End aligned" width="400" height="200">
        <figcaption class="figure-caption text-end">Caption aligned to the end.</figcaption>
      </figure>
    </div>
  `,
};
