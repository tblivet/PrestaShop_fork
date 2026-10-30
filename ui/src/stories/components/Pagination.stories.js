/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/pagination/
export default {
  title: 'Components/Pagination',
};

const prev = (disabled = false) => `
  <li class="page-item${disabled ? ' disabled' : ''}">
    <a class="page-link" href="#" aria-label="Previous"${disabled ? ' aria-disabled="true" tabindex="-1"' : ''}>
      <span class="icon" aria-hidden="true">chevron_left</span>
      <span class="visually-hidden">Previous</span>
    </a>
  </li>`;

const next = (disabled = false) => `
  <li class="page-item${disabled ? ' disabled' : ''}">
    <a class="page-link" href="#" aria-label="Next"${disabled ? ' aria-disabled="true" tabindex="-1"' : ''}>
      <span class="icon" aria-hidden="true">chevron_right</span>
      <span class="visually-hidden">Next</span>
    </a>
  </li>`;

const pages = (active, count = 5) =>
  Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return `<li class="page-item${n === active ? ' active' : ''}"><a class="page-link" href="#">${n}</a></li>`;
  }).join('');

export const Default = {
  render: () => `
    <nav>
      <ul class="pagination">
        ${prev()}
        ${pages(3)}
        ${next()}
      </ul>
    </nav>
  `,
};

export const FirstPage = {
  render: () => `
    <nav>
      <ul class="pagination">
        ${prev(true)}
        ${pages(1)}
        ${next()}
      </ul>
    </nav>
  `,
};

export const LastPage = {
  render: () => `
    <nav>
      <ul class="pagination">
        ${prev()}
        ${pages(5)}
        ${next(true)}
      </ul>
    </nav>
  `,
};

export const WithEllipsis = {
  render: () => `
    <nav>
      <ul class="pagination">
        ${prev()}
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item disabled"><span class="page-link">&hellip;</span></li>
        <li class="page-item"><a class="page-link" href="#">6</a></li>
        <li class="page-item active"><a class="page-link" href="#">7</a></li>
        <li class="page-item"><a class="page-link" href="#">8</a></li>
        <li class="page-item disabled"><span class="page-link">&hellip;</span></li>
        <li class="page-item"><a class="page-link" href="#">16</a></li>
        ${next()}
      </ul>
    </nav>
  `,
};

export const Disabled = {
  render: () => `
    <nav>
      <ul class="pagination">
        ${prev(true)}
        <li class="page-item disabled"><span class="page-link">1</span></li>
        <li class="page-item disabled"><span class="page-link">2</span></li>
        <li class="page-item active"><a class="page-link" href="#">3</a></li>
        <li class="page-item disabled"><span class="page-link">4</span></li>
        <li class="page-item disabled"><span class="page-link">5</span></li>
        ${next(true)}
      </ul>
    </nav>
  `,
};

export const Large = {
  render: () => `
    <nav>
      <ul class="pagination pagination-lg">
        ${prev()}
        ${pages(2)}
        ${next()}
      </ul>
    </nav>
  `,
};

export const Small = {
  render: () => `
    <nav>
      <ul class="pagination pagination-sm">
        ${prev()}
        ${pages(2)}
        ${next()}
      </ul>
    </nav>
  `,
};
