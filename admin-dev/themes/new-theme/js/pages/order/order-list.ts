/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import Router from '@components/router';
import OrderListMap from '@pages/order/order-list-map';

// Orders on the kit: the grid's own scripts (ui/src/js/components/grid-*.js) do the rest.

type BulkActionDetail = {gridId: string, actionId: string, ids: string[]};

// "Open in new tabs": each checked order's page in a tab, this one keeping the focus; says so when the browser blocks some
document.addEventListener('ps:grid-bulk-action', (event) => {
  const {detail} = event as CustomEvent<BulkActionDetail>;
  const button = event.target instanceof Element ? event.target.querySelector<HTMLElement>(OrderListMap.openTabsButton) : null;

  if (detail.actionId !== 'open_tabs' || !button?.dataset.route) {
    return;
  }
  const router = new Router();
  const blocked = detail.ids.filter((id) => {
    const tab = window.open(router.generate(button.dataset.route as string, {[button.dataset.routeParamName ?? 'id']: id}));

    tab?.blur();
    window.focus();

    return tab === null;
  });

  if (blocked.length > 0 && button.dataset.tabsBlockedMessage) {
    // eslint-disable-next-line no-alert
    window.alert(button.dataset.tabsBlockedMessage);
  }
});

// A preview's "(N more)": the other products, focus on the first of them
document.addEventListener('click', (event) => {
  const more = event.target instanceof Element ? event.target.closest<HTMLElement>(OrderListMap.previewMore) : null;
  const preview = more?.closest('[data-role="preview-row"]');

  if (!more || !preview) {
    return;
  }
  const rows = Array.from(preview.querySelectorAll<HTMLElement>(OrderListMap.previewMoreRow));

  rows.forEach((row) => row.removeAttribute('hidden'));
  const first = rows.length > 0 ? rows[0].querySelector<HTMLElement>(OrderListMap.previewMoreFocus) : null;

  if (first && !first.matches('a')) {
    first.tabIndex = -1;
  }
  more.remove();
  first?.focus();
});
