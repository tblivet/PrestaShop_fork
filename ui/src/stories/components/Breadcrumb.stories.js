/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/breadcrumb/

export default {
  title: 'Components/Breadcrumb',
  args: {
    item1: 'Home',
    item2: 'Library',
    item3: 'Data',
    rtl: false,
  },
  argTypes: {
    item1: { control: 'text' },
    item2: { control: 'text' },
    item3: { control: 'text' },
    rtl: { control: 'boolean' },
  },
};

export const Default = {
  render: ({ item1, item2, item3, rtl }) => {
    const dir = rtl ? ' dir="rtl"' : '';
    return `
      <nav${dir} aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">${item1}</a></li>
          <li class="breadcrumb-item"><a href="#">${item2}</a></li>
          <li class="breadcrumb-item active" aria-current="page">${item3}</li>
        </ol>
      </nav>
    `;
  },
};

export const SingleItem = {
  render: ({ item1 }) => `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">${item1}</li>
      </ol>
    </nav>
  `,
};
