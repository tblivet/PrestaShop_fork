/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// The header's quick access (Component/Layout/Ui/quick_access.html.twig and quick_access_modals.html.twig): adds this
// page with a name, or removes it after a confirmation, then rebuilds the shortcuts in place, so nothing typed on the
// page is lost. The server answers with the employee's shortcuts, or {has_errors: true, 0: message}.

const NAME_MAX_LENGTH = 32;

// A link item of <twig:ui:DropdownMenu> (dropdown_menu.html.twig), built with the DOM so names are never read as HTML
const linkItem = (shortcut, newTabLabel) => {
  const item = document.createElement('li');
  const link = document.createElement('a');
  const label = document.createElement('span');

  link.className = 'dropdown-item ps-dropdown-menu__item';
  link.href = shortcut.link;
  link.dataset.psRef = 'quick-access-link';
  if (shortcut.active) {
    link.setAttribute('aria-current', 'true');
  }
  label.className = 'ps-dropdown-menu__label';
  label.textContent = shortcut.name;
  if (Number(shortcut.new_window) === 1) {
    const hidden = document.createElement('span');

    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    hidden.className = 'visually-hidden';
    hidden.textContent = ` ${newTabLabel}`;
    label.append(hidden);
  }
  link.append(label);
  item.append(link);

  return item;
};

const dividerItem = () => {
  const item = document.createElement('li');
  const divider = document.createElement('hr');

  divider.className = 'dropdown-divider';
  item.append(divider);

  return item;
};

// The shortcuts first, then a divider when there are some, then the actions
const renderShortcuts = (root, shortcuts) => {
  const menu = root.querySelector('ul');
  const divider = menu.querySelector(':scope > li > hr')?.parentElement;

  menu.querySelectorAll(selectors.quickAccessLink).forEach((link) => link.parentElement.remove());
  divider?.remove();

  if (shortcuts.length > 0) {
    menu.prepend(...shortcuts.map((shortcut) => linkItem(shortcut, root.dataset.psDataNewTab)), dividerItem());
  }

  const current = shortcuts.find((shortcut) => shortcut.active);
  root.dataset.psDataId = current ? String(current.id_quick_access) : '';
  root.querySelector(selectors.addQuickAccess).hidden = Boolean(current);
  root.querySelector(selectors.removeQuickAccess).hidden = !current;
};

const send = async (url, fields) => {
  const response = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams(fields),
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(Object.values(data).filter((value) => typeof value === 'string').join(' '));
  }

  return data;
};

const announce = (key) => {
  const status = document.querySelector(selectors.quickAccessStatus);

  if (status) {
    status.textContent = status.dataset[key] ?? '';
  }
};

export default function initQuickAccess(Modal) {
  const root = () => document.querySelector(selectors.quickAccess);

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;

    if (target?.closest(selectors.addQuickAccess)) {
      const dialog = document.querySelector(selectors.quickAccessAdd);
      const error = dialog.querySelector(selectors.quickAccessError);

      dialog.querySelector(selectors.quickAccessName).value = (root().dataset.psDataPageName ?? '').slice(0, NAME_MAX_LENGTH);
      dialog.querySelector(selectors.quickAccessNewTab).checked = false;
      error.hidden = true;
      error.textContent = '';
      Modal.getOrCreateInstance(dialog).show();

      return;
    }

    if (target?.closest(selectors.removeQuickAccess)) {
      const dialog = document.querySelector(selectors.quickAccessRemove);
      const message = dialog.querySelector(selectors.quickAccessRemoveMessage);
      const current = root().querySelector(`${selectors.quickAccessLink}[aria-current="true"]`);
      const name = current?.textContent.trim() ?? root().dataset.psDataPageName ?? '';

      message.textContent = (message.dataset.psDataMessage ?? '').replace('%name%', name);
      Modal.getOrCreateInstance(dialog).show();

      return;
    }

    const confirm = target?.closest(selectors.confirmRemoveQuickAccess);

    if (confirm) {
      const dialog = document.querySelector(selectors.quickAccessRemove);

      confirm.disabled = true;
      send(root().dataset.psDataRemoveUrl, { method: 'remove', id_quick_access: root().dataset.psDataId })
        .then((shortcuts) => {
          renderShortcuts(root(), shortcuts);
          Modal.getOrCreateInstance(dialog).hide();
          announce('psDataRemoved');
        })
        .catch((reason) => {
          dialog.querySelector(selectors.quickAccessRemoveMessage).textContent = reason.message;
        })
        .finally(() => {
          confirm.disabled = false;
        });
    }
  });

  // Runs after form-validation.js, which stops an empty name before it gets here
  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.matches(selectors.quickAccessAddForm)) {
      return;
    }

    event.preventDefault();
    const dialog = form.closest(selectors.quickAccessAdd);
    const error = form.querySelector(selectors.quickAccessError);
    const submit = document.querySelector(`[form="${form.id}"][type="submit"]`);

    if (submit) {
      submit.disabled = true;
    }
    send(root().dataset.psDataAddUrl, {
      method: 'add',
      url: root().dataset.psDataPageUrl,
      name: form.querySelector(selectors.quickAccessName).value.trim(),
      icon: root().dataset.psDataPageIcon,
      new_window: form.querySelector(selectors.quickAccessNewTab).checked ? 1 : 0,
    })
      .then((shortcuts) => {
        renderShortcuts(root(), shortcuts);
        Modal.getOrCreateInstance(dialog).hide();
        announce('psDataAdded');
      })
      .catch((reason) => {
        error.textContent = reason.message;
        error.hidden = false;
      })
      .finally(() => {
        if (submit) {
          submit.disabled = false;
        }
      });
  });

  document.addEventListener('shown.bs.modal', (event) => {
    if (event.target.matches?.(selectors.quickAccessAdd)) {
      event.target.querySelector(selectors.quickAccessName).select();
    }
  });

  // Opened from the menu, not by a data-bs-toggle button: Bootstrap does not bring focus back, so it goes to the quick
  // access button the menu came from
  document.addEventListener('hidden.bs.modal', (event) => {
    if (event.target.matches?.(`${selectors.quickAccessAdd}, ${selectors.quickAccessRemove}`)) {
      root()?.querySelector(selectors.dropdownToggle)?.focus();
    }
  });
}
