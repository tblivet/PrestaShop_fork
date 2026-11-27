/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import type * as Bootstrap from 'bootstrap';

declare global {
  // A jQuery plugin ($(…).modal()), with the Constructor and noConflict Bootstrap adds to it
  type JQueryPlugin = ((...args: never[]) => unknown) & { Constructor?: unknown; noConflict?: () => unknown };

  interface Window {
    // The kit's Bootstrap, shared with the back-office bundles (main.ts)
    bootstrap: typeof Bootstrap;
    // The back office's jQuery, when a page loads it (compat/jquery-plugins.ts)
    jQuery?: { fn: Record<string, JQueryPlugin | undefined> };
  }
}

export {};
