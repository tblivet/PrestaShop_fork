/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// TEMPORARY: remove once back-office code calls Bootstrap's API (bootstrap.Modal…)
// instead of the jQuery plugins ($(…).modal()…).
//
// Bootstrap waits for DOMContentLoaded to register its jQuery plugins, which is
// too late for back-office scripts calling $(…).modal() in their ready handlers.
export default function registerJqueryPlugins(bootstrap) {
  const { jQuery } = window;

  if (!jQuery) {
    return;
  }

  Object.values(bootstrap)
    .filter((Component) => typeof Component.jQueryInterface === 'function')
    .forEach((Component) => {
      const { NAME } = Component;
      const previous = jQuery.fn[NAME];

      jQuery.fn[NAME] = Component.jQueryInterface;
      jQuery.fn[NAME].Constructor = Component;
      jQuery.fn[NAME].noConflict = () => {
        jQuery.fn[NAME] = previous;

        return Component.jQueryInterface;
      };
    });
}
