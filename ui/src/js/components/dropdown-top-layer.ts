/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import type { Dropdown as BootstrapDropdown } from 'bootstrap';
import selectors from '../selectors';

// A <twig:ui:DropdownMenu> (popover="manual") opens in the browser's top layer: above everything, never cut by a box
// it sits in (a grid's scrolling table, its fade mask, a container), as Shopify's menus do. Bootstrap still opens,
// places (Popper, fixed to the viewport, as the top layer is), closes and drives it from the keyboard; this only puts
// it in the top layer while it is shown. Browsers without the Popover API ignore the attribute: the menu is as before.

// Bootstrap's own options of a dropdown, read before Popper is made
type DropdownWithConfig = BootstrapDropdown & { _config: BootstrapDropdown.Options };

const menuOf = (toggle: Element): HTMLElement | null | undefined =>
  toggle.parentElement?.querySelector<HTMLElement>(selectors.dropdownMenuOfToggle);

export default function initDropdownTopLayer(Dropdown: typeof BootstrapDropdown): void {
  document.addEventListener('show.bs.dropdown', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const menu = menuOf(event.target);

    if (!menu || typeof menu.showPopover !== 'function') {
      return;
    }
    // Before Popper is made, right after this event: the top layer is placed against the viewport
    const dropdown = Dropdown.getInstance(event.target) as DropdownWithConfig | null;
    const own = dropdown?._config.popperConfig;

    if (dropdown && typeof own !== 'function') {
      // eslint-disable-next-line no-underscore-dangle
      dropdown._config.popperConfig = { ...(own ?? {}), strategy: 'fixed' };
    }
    if (!menu.matches(':popover-open')) {
      menu.showPopover();
    }
  });

  document.addEventListener('hidden.bs.dropdown', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const menu = menuOf(event.target);

    if (menu?.matches(':popover-open')) {
      menu.hidePopover();
    }
  });
}
