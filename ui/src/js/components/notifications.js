/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// The header's notifications (Component/Layout/Ui/notifications_center.html.twig): loads what is new (every two minutes
// and when the panel closes), shows the counts, and lists it: every kind under "All", grouped, or one kind once its
// filter is selected (the filters are tabs of the list). The kinds shown while the panel was open are marked seen when it closes.
// Nothing here knows a kind but how to word its line (LINES): the filters, icons and empty sentences come from the page.

const REFRESH_DELAY = 120000;

const node = (tag, className, text) => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
};

// The thread status as the Customer service page names it (pending1 → "Pending 1"); an unknown one as it comes
const statusLabel = (root, status) => {
  try {
    return JSON.parse(root.dataset.psDataStatuses ?? '{}')[status] ?? status;
  } catch {
    return status;
  }
};

const named = (notification) => (notification.company
  ? `${notification.customer_name} (${notification.company})`
  : notification.customer_name);

// Each kind's line: where it goes, its title (who) and its details (what). Values are set as text, never HTML.
const LINES = {
  order: (notification) => ({
    url: notification.order_view_url,
    title: `#${notification.id_order} ${notification.customer_name}`,
    details: [notification.iso_code, notification.carrier, notification.total_paid],
  }),
  customer: (notification, root) => ({
    url: notification.customer_view_url,
    title: named(notification),
    details: [(root.dataset.psDataRegistered ?? '').replace('%date%', notification.date_add)],
  }),
  customer_message: (notification, root) => ({
    url: notification.customer_thread_view_url,
    title: named(notification),
    details: [statusLabel(root, notification.status), notification.date_add],
  }),
};

const kindIcon = (root, type) => root.querySelector(selectors.notificationsIcons)
  ?.content.querySelector(`[data-ps-data-type="${type}"]`)?.cloneNode(true);

const line = (root, type, notification) => {
  const { url, title, details } = LINES[type](notification, root);
  const item = node('li');
  const link = node('a', 'ps-notifications__item');
  const text = node('span', 'ps-notifications__text');
  const icon = kindIcon(root, type);

  link.href = url;
  text.append(node('span', 'ps-notifications__title', title), node('span', 'ps-notifications__details', details.filter(Boolean).join(' · ')));
  link.append(...(icon ? [icon] : []), text);
  item.append(link);

  return item;
};

const selectedFilter = (root) => root.querySelector(`${selectors.filterNotifications}[aria-selected="true"]`);
const selectedType = (root) => selectedFilter(root)?.dataset.psDataType ?? '';

const setCount = (badge, count) => {
  if (badge) {
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.hidden = count === 0;
  }
};

// The list for the selected filter; "All" shows each kind with new items under its name
const show = (root, data) => {
  const type = selectedType(root);
  const list = root.querySelector(selectors.notificationsList);
  const kinds = Object.keys(data).filter((kind) => LINES[kind] && (type === '' || kind === type));
  const groups = [];

  // A list per kind; under All, each is named by its heading
  kinds.forEach((kind) => {
    const { results } = data[kind];

    if (results.length === 0) {
      return;
    }

    const items = node('ul', 'ps-notifications__items');

    items.append(...results.map((notification) => line(root, kind, notification)));

    if (type === '') {
      const filter = root.querySelector(`${selectors.filterNotifications}[data-ps-data-type="${kind}"]`);
      const heading = node('p', 'ps-notifications__heading', filter?.dataset.psDataLabel ?? '');

      heading.id = `ps-notifications-heading-${kind}`;
      items.setAttribute('aria-labelledby', heading.id);
      groups.push(heading);
    }
    groups.push(items);
  });

  list.replaceChildren(...groups);
  list.hidden = groups.length === 0;

  // The generic empty state: the selected filter's sentence, and the kind's tip when there is one
  const empty = root.querySelector(selectors.notificationsEmpty);
  empty.hidden = groups.length > 0;
  empty.querySelector(selectors.notificationsEmptyTitle).textContent = selectedFilter(root)?.dataset.psDataEmpty ?? '';

  // The panel takes the focus itself only when it holds no link to Tab to
  const panel = root.querySelector(selectors.notificationsPanel);
  panel.setAttribute('aria-labelledby', selectedFilter(root)?.id ?? '');
  if (groups.length === 0) {
    panel.setAttribute('tabindex', '0');
  } else {
    panel.removeAttribute('tabindex');
  }
  empty.querySelectorAll(selectors.notificationsEmptyTip).forEach((tip) => {
    tip.hidden = tip.dataset.psDataType !== type;
  });
};

const count = (root, data) => {
  let total = 0;

  Object.entries(data).forEach(([kind, { total: kindTotal }]) => {
    if (LINES[kind]) {
      total += Number(kindTotal);
      setCount(root.querySelector(`${selectors.notificationsCount}[data-ps-data-type="${kind}"]`), Number(kindTotal));
    }
  });
  setCount(root.querySelector(`${selectors.notificationsCount}[data-ps-data-type=""]`), total);
  setCount(root.querySelector(selectors.notificationsTotal), total);
};

const post = (url, fields = {}) => fetch(url, {
  method: 'POST',
  body: new URLSearchParams(fields),
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

export default function initNotifications() {
  const root = document.querySelector(selectors.notifications);

  if (!root) {
    return;
  }

  let data = {};
  let timer = null;
  const seen = new Set();

  const refresh = () => {
    clearTimeout(timer);
    post(root.dataset.psDataUrl)
      .then((response) => (response.ok ? response.json() : {}))
      .then((json) => {
        data = json;
        count(root, data);
        show(root, data);
      })
      .catch(() => {})
      .finally(() => {
        timer = setTimeout(refresh, REFRESH_DELAY);
      });
  };

  const markShown = () => {
    const type = selectedType(root);

    Object.keys(data).filter((kind) => type === '' || kind === type).forEach((kind) => seen.add(kind));
  };

  // Tabs: the selected filter is the only one in the Tab order; showing it fills the panel
  const select = (filter, focus = false) => {
    root.querySelectorAll(selectors.filterNotifications).forEach((button) => {
      button.setAttribute('aria-selected', String(button === filter));
      button.tabIndex = button === filter ? 0 : -1;
    });
    if (focus) {
      filter.focus();
      filter.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    show(root, data);
    markShown();
  };

  root.addEventListener('click', (event) => {
    const filter = event.target instanceof Element ? event.target.closest(selectors.filterNotifications) : null;

    if (filter) {
      select(filter);
    }
  });

  // Arrows move to the previous or next filter and show it (reversed right to left), Home and End to the first and last
  root.addEventListener('keydown', (event) => {
    const current = event.target instanceof Element ? event.target.closest(selectors.filterNotifications) : null;

    if (!current) {
      return;
    }
    const filters = [...root.querySelectorAll(selectors.filterNotifications)];
    const index = filters.indexOf(current);
    const step = document.dir === 'rtl' || getComputedStyle(current).direction === 'rtl' ? -1 : 1;
    const targets = {
      ArrowRight: filters[(index + step + filters.length) % filters.length],
      ArrowLeft: filters[(index - step + filters.length) % filters.length],
      Home: filters[0],
      End: filters[filters.length - 1],
    };

    if (targets[event.key]) {
      event.preventDefault();
      // Bootstrap's dropdown also listens to arrows inside its menu
      event.stopPropagation();
      select(targets[event.key], true);
    }
  });

  root.addEventListener('shown.bs.dropdown', markShown);

  // Closed: what was shown is seen, the next opening starts on All, then the counts are loaded again
  root.addEventListener('hidden.bs.dropdown', () => {
    root.querySelectorAll(selectors.filterNotifications).forEach((button) => {
      button.setAttribute('aria-selected', String(button.dataset.psDataType === ''));
      button.tabIndex = button.dataset.psDataType === '' ? 0 : -1;
    });
    Promise.all([...seen].filter((kind) => Number(data[kind]?.total) > 0)
      .map((type) => post(root.dataset.psDataAckUrl, { type }).catch(() => {})))
      .finally(refresh);
    seen.clear();
  });

  refresh();
}
