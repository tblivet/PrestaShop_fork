/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/helpers/stacks/
export default {
  title: 'Helpers/Stacks',
};

export const VStack = {
  render: () => `
    <div class="vstack gap-3" style="max-width:300px;">
      <div class="p-2 border rounded">First item</div>
      <div class="p-2 border rounded">Second item</div>
      <div class="p-2 border rounded">Third item</div>
    </div>
  `,
};

export const HStack = {
  render: () => `
    <div class="hstack gap-3">
      <div class="p-2 border rounded">First item</div>
      <div class="p-2 border rounded">Second item</div>
      <div class="p-2 border rounded">Third item</div>
    </div>
  `,
};

export const HStackWithDivider = {
  render: () => `
    <div class="hstack gap-3">
      <div>First item</div>
      <div class="vr"></div>
      <div>Second item</div>
      <div class="vr"></div>
      <div>Third item</div>
    </div>
  `,
};

export const HStackFormPattern = {
  render: () => `
    <div class="hstack gap-2" style="max-width:400px;">
      <input class="form-control" type="text" placeholder="Add your item here...">
      <button type="button" class="btn btn-secondary flex-shrink-0">Submit</button>
      <div class="vr"></div>
      <button type="button" class="btn btn-outline-danger flex-shrink-0">Reset</button>
    </div>
  `,
};
