/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/content/tables/

export default {
  title: 'Content/Tables',
};

const tableRows = `
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
`;

export const Default = {
  render: () => `<table class="table">${tableRows}</table>`,
};

export const Variants = {
  render: () => `
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Class</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Default</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-primary">
          <th scope="row">Primary</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-secondary">
          <th scope="row">Secondary</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-success">
          <th scope="row">Success</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-danger">
          <th scope="row">Danger</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-warning">
          <th scope="row">Warning</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-info">
          <th scope="row">Info</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-light">
          <th scope="row">Light</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr class="table-dark">
          <th scope="row">Dark</th>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
      </tbody>
    </table>
  `,
};

export const StripedRows = {
  render: () => `<table class="table table-striped">${tableRows}</table>`,
};

export const StripedColumns = {
  render: () => `<table class="table table-striped-columns">${tableRows}</table>`,
};

export const Hoverable = {
  render: () => `<table class="table table-hover">${tableRows}</table>`,
};

export const Bordered = {
  render: () => `
    <div>
      <p><code>.table-bordered</code></p>
      <table class="table table-bordered">${tableRows}</table>
      <p class="mt-3"><code>.table-bordered .border-primary</code></p>
      <table class="table table-bordered border-primary">${tableRows}</table>
    </div>
  `,
};

export const Borderless = {
  render: () => `<table class="table table-borderless">${tableRows}</table>`,
};

export const Small = {
  render: () => `<table class="table table-sm">${tableRows}</table>`,
};

export const Responsive = {
  render: () => `
    <div>
      <p>Always responsive: <code>.table-responsive</code></p>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              ${Array.from({ length: 9 }, (_, i) => `<th scope="col">#${i + 1}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${Array.from({ length: 9 }, (_, i) => `<td>Cell ${i + 1}</td>`).join('')}
            </tr>
            <tr>
              ${Array.from({ length: 9 }, (_, i) => `<td>Cell ${i + 1}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3">Breakpoint-specific: <code>.table-responsive-md</code></p>
      <div class="table-responsive-md">
        <table class="table">
          <thead>
            <tr>
              ${Array.from({ length: 9 }, (_, i) => `<th scope="col">#${i + 1}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${Array.from({ length: 9 }, (_, i) => `<td>Cell ${i + 1}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
};

export const DarkTable = {
  render: () => `<table class="table table-dark">${tableRows}</table>`,
};
