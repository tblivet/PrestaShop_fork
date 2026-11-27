/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import type { Tooltip as BootstrapTooltip } from 'bootstrap';
import selectors from '../selectors';

// Bootstrap does not start tooltips by itself: each [data-bs-toggle="tooltip"] gets one the first time it is hovered or
// focused, so elements added later (a grid refresh, a modal) work too.
// A tooltip that repeats the element's name (an icon button's label, visible or not) is not linked with aria-describedby:
// screen readers would read it twice.
// A dropdown's tooltip (data-ps-action="tooltip" on its box, an icon-only header menu: Bootstrap allows one component per
// element, so it cannot be on the toggle) repeats the toggle's name, and never shows while the menu is open.
export default function initTooltips(Tooltip: typeof BootstrapTooltip): void {
  const start = (event: Event): void => {
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

    if (!(element instanceof Element)) {
      return;
    }
    const title = element.getAttribute('data-bs-title');

    if (element.getAttribute('aria-label') === title || element.matches(selectors.dropdownTooltip)) {
      element.removeAttribute('aria-describedby');
    }
  });
  document.addEventListener('show.bs.dropdown', (event) => {
    const box = event.target instanceof Element ? event.target.closest(selectors.dropdownTooltip) : null;

    if (box) {
      Tooltip.getInstance(box)?.hide();
    }
  });
  document.addEventListener('show.bs.tooltip', (event) => {
    if (event.target instanceof Element && event.target.querySelector(selectors.openDropdownToggle)) {
      event.preventDefault();
    }
  });
}
