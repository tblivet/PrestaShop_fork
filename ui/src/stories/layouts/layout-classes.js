/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The classes the <twig:ui:Layout:*> templates output for given props, shared by the layout stories.
// Keep in sync with src/PrestaShopBundle/Twig/Component/Ui/Layout/*.php and their templates.

// One gap scale for every layout: Bootstrap spacers 0 to 5
export const GAPS = { none: 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };

export const stackClasses = ({ gap = 'md', align = 'stretch' }) => [
  'ps-stack', 'd-flex', 'flex-column', `gap-${GAPS[gap]}`, `align-items-${align}`,
].join(' ');

const JUSTIFY = { start: 'start', end: 'end', between: 'between', center: 'center' };

export const clusterClasses = ({ gap = 'sm', justify = 'start', align = 'center', wrap = true, stackBelow = 'none' }) => {
  const classes = ['ps-cluster', 'd-flex', `gap-${GAPS[gap]}`];

  if (stackBelow === 'none') {
    classes.push(wrap ? 'flex-wrap' : 'flex-nowrap', `justify-content-${JUSTIFY[justify]}`, `align-items-${align}`);
  } else {
    // Below the breakpoint: one full-width item per line, in reading order; from it: the row
    classes.push('flex-column', `flex-${stackBelow}-row`, wrap ? `flex-${stackBelow}-wrap` : `flex-${stackBelow}-nowrap`,
      `justify-content-${stackBelow}-${JUSTIFY[justify]}`, `align-items-${stackBelow}-${align}`);
  }

  return classes.join(' ');
};

// Items per line at full width; the steps below it are built in (see scss/layout/_tiles.scss)
export const TILES_COLUMNS = ['2', '3', '4', '6'];

export const tilesClasses = ({ columns = '3', gap = 'md' }) => `ps-tiles ps-tiles--${columns} d-grid gap-${GAPS[gap]}`;
