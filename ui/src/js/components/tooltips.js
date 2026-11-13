/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// Bootstrap does not start tooltips by itself: each [data-bs-toggle="tooltip"] gets one the first time it is hovered or
// focused, so elements added later (a grid refresh, a modal) work too.
// A tooltip that repeats the element's name (an icon button's label) is not linked with aria-describedby: screen readers
// would read it twice.
export default function initTooltips(Tooltip) {
  const start = (event) => {
    const element = event.target instanceof Element ? event.target.closest(selectors.tooltip) : null;

    if (!element || Tooltip.getInstance(element)) {
      return;
    }

    Tooltip.getOrCreateInstance(element).show();
  };

  document.addEventListener('mouseover', start);
  document.addEventListener('focusin', start);
  document.addEventListener('shown.bs.tooltip', (event) => {
    const element = event.target;

    if (element.getAttribute('aria-label') === element.getAttribute('data-bs-title')) {
      element.removeAttribute('aria-describedby');
    }
  });
}
