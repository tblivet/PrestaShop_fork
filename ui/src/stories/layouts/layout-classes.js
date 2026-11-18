/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The classes the <twig:ui:Layout:*> templates output for given props, shared by the layout stories.
// Keep in sync with src/PrestaShopBundle/Twig/Component/Ui/Layout/*.php and their templates.

// One gap scale for every layout (Gap.php, $ps-layout-gaps): a size to a Bootstrap spacer
export const GAPS = { none: 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };

const LISTS = ['ul', 'ol'];

// The block and a modifier for each prop away from its default
export const stackClasses = ({ gap = 'md', align = 'stretch', as = 'div' }) => [
  'ps-stack',
  gap !== 'md' && `ps-stack--gap-${gap}`,
  align !== 'stretch' && `ps-stack--align-${align}`,
  LISTS.includes(as) && 'ps-stack--list',
].filter(Boolean).join(' ');

// With stackBelow, the row's justify, align and wrap apply from that breakpoint (scss/layout/_cluster.scss)
export const clusterClasses = ({ gap = 'sm', justify = 'start', align = 'center', wrap = true, stackBelow = 'none', as = 'div' }) => [
  'ps-cluster',
  gap !== 'sm' && `ps-cluster--gap-${gap}`,
  justify !== 'start' && `ps-cluster--justify-${justify}`,
  align !== 'center' && `ps-cluster--align-${align}`,
  !wrap && 'ps-cluster--nowrap',
  stackBelow !== 'none' && `ps-cluster--stack-below-${stackBelow}`,
  LISTS.includes(as) && 'ps-cluster--list',
].filter(Boolean).join(' ');

// Items per line at full width; the steps below it are built in (see scss/layout/_tiles.scss)
export const TILES_COLUMNS = ['2', '3', '4', '6'];

export const tilesClasses = ({ columns = '3', gap = 'md', as = 'div' }) => [
  'ps-tiles',
  `ps-tiles--${columns}`,
  gap !== 'md' && `ps-tiles--gap-${gap}`,
  LISTS.includes(as) && 'ps-tiles--list',
].filter(Boolean).join(' ');
