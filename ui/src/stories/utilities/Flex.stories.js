/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/utilities/flex/

export default {
  title: 'Utilities/Flex',
};

const item = (label, cls = '') => `<div class="bg-primary text-white p-2 small rounded ${cls}">${label}</div>`;

const items = (n = 3, cls = '') => Array.from({ length: n }, (_, i) => item(`Flex item ${i + 1}`, cls)).join('');

const container = (cls, children, label) => `
  <div class="mb-4">
    <p class="small text-body-secondary mb-1"><code>.${cls.replace(/ /g, '.')}</code>${label ? ' — ' + label : ''}</p>
    <div class="${cls} bg-body-secondary p-2 rounded gap-1">${children}</div>
  </div>
`;

export const Direction = {
  render: () => `
    <div>
      ${container('d-flex flex-row', items(), 'Default row (left to right)')}
      ${container('d-flex flex-row-reverse', items(), 'Row reversed (right to left)')}
      ${container('d-flex flex-column', items(), 'Column (top to bottom)')}
      ${container('d-flex flex-column-reverse', items(), 'Column reversed (bottom to top)')}
    </div>
  `,
};

export const JustifyContent = {
  render: () => `
    <div>
      ${container('d-flex justify-content-start', items(), 'start')}
      ${container('d-flex justify-content-end', items(), 'end')}
      ${container('d-flex justify-content-center', items(), 'center')}
      ${container('d-flex justify-content-between', items(), 'between')}
      ${container('d-flex justify-content-around', items(), 'around')}
      ${container('d-flex justify-content-evenly', items(), 'evenly')}
    </div>
  `,
};

export const AlignItems = {
  render: () => `
    <div>
      ${['start', 'end', 'center', 'baseline', 'stretch']
        .map((v) =>
          container(
            `d-flex align-items-${v}`,
            `<div class="bg-primary text-white p-2 small rounded">Short</div>
           <div class="bg-secondary text-white p-4 small rounded">Tall</div>
           <div class="bg-success text-white p-3 small rounded">Medium</div>`,
            v
          )
        )
        .join('')}
    </div>
  `,
};

export const Wrap = {
  render: () => `
    <div>
      <div class="mb-4">
        <p class="small text-body-secondary mb-1"><code>.d-flex.flex-nowrap</code> — items overflow if needed</p>
        <div class="d-flex flex-nowrap bg-body-secondary p-2 rounded gap-1" style="max-width: 400px">
          ${Array.from({ length: 8 }, (_, i) => `<div class="bg-primary text-white p-2 small rounded flex-shrink-0">Item ${i + 1}</div>`).join('')}
        </div>
      </div>
      <div class="mb-4">
        <p class="small text-body-secondary mb-1"><code>.d-flex.flex-wrap</code> — items wrap to next line</p>
        <div class="d-flex flex-wrap bg-body-secondary p-2 rounded gap-1" style="max-width: 400px">
          ${Array.from({ length: 8 }, (_, i) => `<div class="bg-secondary text-white p-2 small rounded">${'Item ' + (i + 1)}</div>`).join('')}
        </div>
      </div>
      <div class="mb-4">
        <p class="small text-body-secondary mb-1"><code>.d-flex.flex-wrap-reverse</code> — wrap in reverse</p>
        <div class="d-flex flex-wrap-reverse bg-body-secondary p-2 rounded gap-1" style="max-width: 400px">
          ${Array.from({ length: 8 }, (_, i) => `<div class="bg-success text-white p-2 small rounded">${'Item ' + (i + 1)}</div>`).join('')}
        </div>
      </div>
    </div>
  `,
};

export const GrowShrink = {
  render: () => `
    <div>
      <p class="small text-body-secondary mb-1"><code>.flex-grow-1</code> — first item grows to fill space</p>
      <div class="d-flex gap-1 bg-body-secondary p-2 rounded mb-4">
        <div class="bg-primary text-white p-2 small rounded flex-grow-1">Flex item (flex-grow-1)</div>
        <div class="bg-secondary text-white p-2 small rounded">Flex item</div>
        <div class="bg-success text-white p-2 small rounded">Third item</div>
      </div>

      <p class="small text-body-secondary mb-1"><code>.flex-shrink-1</code> — second item shrinks if needed</p>
      <div class="d-flex gap-1 bg-body-secondary p-2 rounded mb-4">
        <div class="bg-primary text-white p-2 small rounded w-100">Flex item (w-100)</div>
        <div class="bg-danger text-white p-2 small rounded flex-shrink-1" style="min-width:120px">Flex item (flex-shrink-1)</div>
      </div>

      <p class="small text-body-secondary mb-1"><code>.flex-fill</code> — all items fill equally</p>
      <div class="d-flex gap-1 bg-body-secondary p-2 rounded">
        <div class="bg-primary text-white p-2 small rounded flex-fill text-center">Flex fill</div>
        <div class="bg-secondary text-white p-2 small rounded flex-fill text-center">Flex fill</div>
        <div class="bg-success text-white p-2 small rounded flex-fill text-center">Flex fill</div>
      </div>
    </div>
  `,
};

export const AutoMargins = {
  render: () => `
    <div>
      <p class="small text-body-secondary mb-1"><code>.me-auto</code> — push siblings to the end</p>
      <div class="d-flex gap-1 bg-body-secondary p-2 rounded mb-4">
        <div class="bg-primary text-white p-2 small rounded me-auto">Flex item (me-auto)</div>
        <div class="bg-secondary text-white p-2 small rounded">Flex item</div>
        <div class="bg-success text-white p-2 small rounded">Flex item</div>
      </div>

      <p class="small text-body-secondary mb-1"><code>.ms-auto</code> — push siblings to the start</p>
      <div class="d-flex gap-1 bg-body-secondary p-2 rounded mb-4">
        <div class="bg-primary text-white p-2 small rounded">Flex item</div>
        <div class="bg-secondary text-white p-2 small rounded">Flex item</div>
        <div class="bg-success text-white p-2 small rounded ms-auto">Flex item (ms-auto)</div>
      </div>

      <p class="small text-body-secondary mb-1"><code>.align-self-*</code> on individual items</p>
      <div class="d-flex gap-1 bg-body-secondary p-2 rounded" style="height:100px">
        <div class="bg-primary text-white p-2 small rounded align-self-start">start</div>
        <div class="bg-secondary text-white p-2 small rounded align-self-center">center</div>
        <div class="bg-success text-white p-2 small rounded align-self-end">end</div>
        <div class="bg-danger text-white p-2 small rounded align-self-baseline">baseline</div>
        <div class="bg-warning text-dark p-2 small rounded align-self-stretch">stretch</div>
      </div>
    </div>
  `,
};
