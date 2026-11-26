/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Grid> renders (grid.html.twig and Grid/cell/*.html.twig) from a fixture of ui/src/stories/fixtures,
// and its Twig call. The test builds the same presented grid from the same fixture (GridFixture.php), its filter form a
// real one, and compares (StoryMarkupTest): the filter fields here are what the kit form theme renders for them.
import arrowDownward from '../../icons/material-symbols/arrow-downward.svg?raw';
import arrowUpward from '../../icons/material-symbols/arrow-upward.svg?raw';
import cancel from '../../icons/material-symbols/cancel.svg?raw';
import closeIcon from '../../icons/material-symbols/close.svg?raw';
import cloudDownload from '../../icons/material-symbols/cloud-download.svg?raw';
import code from '../../icons/material-symbols/code.svg?raw';
import deleteIcon from '../../icons/material-symbols/delete.svg?raw';
import dragIndicator from '../../icons/material-symbols/drag-indicator.svg?raw';
import edit from '../../icons/material-symbols/edit.svg?raw';
import filterAlt from '../../icons/material-symbols/filter-alt.svg?raw';
import filterAltOff from '../../icons/material-symbols/filter-alt-off.svg?raw';
import keyboardArrowDown from '../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import openInNew from '../../icons/material-symbols/open-in-new.svg?raw';
import checkCircle from '../../icons/material-symbols/check-circle.svg?raw';
import checkIcon from '../../icons/material-symbols/check.svg?raw';
import inbox from '../../icons/material-symbols/inbox.svg?raw';
import keyboardArrowUp from '../../icons/material-symbols/keyboard-arrow-up.svg?raw';
import moreVert from '../../icons/material-symbols/more-vert.svg?raw';
import print from '../../icons/material-symbols/print.svg?raw';
import refresh from '../../icons/material-symbols/refresh.svg?raw';
import search from '../../icons/material-symbols/search.svg?raw';
import searchOff from '../../icons/material-symbols/search-off.svg?raw';
import settings from '../../icons/material-symbols/settings.svg?raw';
import storage from '../../icons/material-symbols/storage.svg?raw';
import swapVert from '../../icons/material-symbols/swap-vert.svg?raw';
import unfoldMore from '../../icons/material-symbols/unfold-more.svg?raw';
import badge from './badge';
import check from './check';
import dropdownMenu from './dropdown-menu';
import emptyState from './empty-state';
import modal from './modal';
import pagination from './pagination';
import uiIcon from './ui-icon';
import { clusterClasses } from './layouts/layout-classes';

// Grid.php defaults; grid is required
export const GRID_DEFAULTS = { embedded: false, headingLevel: 2 };

// Grid::LIMITS
const LIMITS = [10, 20, 50, 100, 300, 1000];

const ALIGNMENTS = { right: 'end', center: 'center' };

// The icons of the fixtures' actions, by their kit name (Grid::icon(): zoom_in is search)
const ICONS = {
  arrow_downward: arrowDownward, arrow_upward: arrowUpward, cloud_download: cloudDownload, code, delete: deleteIcon, edit, filter_alt_off: filterAltOff, open_in_new: openInNew, print, refresh, search, settings, storage,
};
const ICON_ALIASES = { zoom_in: 'search' };
const kitIcon = (name) => (name ? ICON_ALIASES[name] ?? name : null);

// Grid::inkOn(): the text that reads best on a record's colour, dark ($gray-800) or light, by their WCAG contrast
const luminance = (hex) => {
  const [r, g, b] = [0, 2, 4].map((at) => {
    const value = parseInt(hex.slice(at, at + 2), 16) / 255;

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const inkOn = (color) => {
  const short = color.trim().replace(/^#/, '');
  const hex = short.length === 3 ? [...short].map((digit) => digit + digit).join('') : short;

  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return 'dark';
  }
  const own = luminance(hex);

  return (own + 0.05) / (luminance('1d1d1b') + 0.05) >= 1.05 / (own + 0.05) ? 'dark' : 'light';
};

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The few PHP date() letters the fixtures use
const date = (value, format) => {
  const [day, time = '00:00:00'] = value.split(' ');
  const [Y, m, d] = day.split('-');
  const [H, i, s] = time.split(':');
  const parts = { Y, m, d, H, i, s };

  return format.replace(/\\(.)|([YmdHis])/g, (match, escaped, letter) => escaped ?? parts[letter]);
};

// Grid.php url(): the current query (none in a story) with the grid's prefixed parameters, on the results summary
const url = (grid, parameters) => {
  const key = (name) => encodeURIComponent(grid.form_prefix ? `${grid.form_prefix}[${name}]` : name);
  const query = Object.entries(parameters).map(([name, value]) => `${key(name)}=${encodeURIComponent(value)}`).join('&');

  return `?${query}#${grid.id}_grid_results`;
};

// The fields of a filter as the kit form theme (ui_kit_layout.html.twig) renders them
const filterField = (grid, filter, column) => {
  const id = `${grid.id}_${filter.name}`;
  const name = `${grid.id}[${filter.name}]`;
  const value = grid.filter_data[filter.name];
  const range = (fields) => `<fieldset class="ps-filter-range" id="${id}"><legend class="visually-hidden">${escape(column.name)}</legend>${fields.map((field) => `<div class="ps-filter-range__field"><label class="visually-hidden form-label" for="${field.id}">${field.label}</label>${field.input}</div>`).join('')}</fieldset>`;

  if (filter.type === 'date_range') {
    const end = filter.options?.default_end_value ?? '';

    return range([
      { id: `${id}_from`, label: 'Start date', input: `<input type="date" id="${id}_from" name="${name}[from]" placeholder="YYYY-MM-DD" class="from date-range-start-date form-control-sm form-control">` },
      { id: `${id}_to`, label: 'End date', input: `<input type="date" id="${id}_to" name="${name}[to]" placeholder="YYYY-MM-DD" class="to date-range-end-date form-control-sm form-control" data-default-value="${end}">` },
    ]);
  }

  if (filter.type === 'number_min_max') {
    return range(['min', 'max'].map((bound) => ({
      id: `${id}_${bound}_field`,
      label: bound === 'min' ? 'Min' : 'Max',
      input: `<input type="text" id="${id}_${bound}_field" name="${name}[${bound}_field]" placeholder="${bound === 'min' ? 'Min' : 'Max'}" class="js-comma-transformer form-control-sm form-control" inputmode="decimal">`,
    })));
  }

  return `<label class="visually-hidden form-label" for="${id}">${escape(column.name)}</label><input type="text" id="${id}" name="${name}"${value ? ` value="${escape(value)}"` : ''} size="1" class="form-control-sm form-control">`;
};

// A <twig:ui:IconButton>: a link with href, else a button
const iconButton = ({
  icon, label, variant = 'link', size = null, tooltip = false, class: own = '', attributes = {},
}) => {
  const {
    href, type = 'button', disabled, ...rest
  } = attributes;
  const classes = `btn btn-${variant}${size ? ` btn-${size}` : ''} ps-button ps-icon-button${own ? ` ${own}` : ''}`;
  const tip = tooltip ? ` data-bs-toggle="tooltip" data-bs-title="${escape(label)}"` : '';
  const extra = Object.entries(rest).map(([name, value]) => ` ${name}="${value}"`).join('');
  const svg = uiIcon({ more_vert: moreVert, keyboard_arrow_down: keyboardArrowDown }[icon] ?? ICONS[icon], { size: 'lg' });

  return href
    ? `<a class="${classes}" href="${href}" aria-label="${escape(label)}"${tip}${extra}>${svg}</a>`
    : `<button class="${classes}" type="${type}" data-ps-data-busy-label="Loading..."${disabled !== undefined ? ' disabled' : ''} aria-label="${escape(label)}"${tip}${extra}>${svg}</button>`;
};

// Grid::confirmAttributes(): what the page's ConfirmDialog asks with
const confirmAttributes = (message, modalOptions = {}) => (message ? Object.fromEntries(Object.entries({
  'data-ps-confirm': message,
  'data-ps-data-confirm-title': modalOptions.title ?? '',
  'data-ps-data-confirm-label': modalOptions.confirm_button_label ?? '',
  'data-ps-data-confirm-variant': (modalOptions.confirm_button_class ?? '').includes('danger') ? 'danger' : '',
}).filter(([, value]) => value !== '')) : {});

// Grid::rowActions(): every action in one menu, the dangerous ones last after a divider (the fixture's url is what the
// router gives the route, {field} the record's)
const rowActions = (grid, record, column) => {
  const items = [];
  const dangers = [];

  column.options.actions.forEach((action) => {
    const { options } = action;
    const href = action.url.replace(/\{(\w+)\}/g, (match, field) => record[field]);
    const confirm = confirmAttributes(options.confirm_message, options.modal_options);
    const danger = action.id.includes('delete') || confirm['data-ps-data-confirm-variant'] === 'danger';
    let item;
    let attributes;

    if (action.type === 'link') {
      attributes = { ...confirm, ...(options.target ? { target: options.target } : {}) };
      item = { type: 'link', href };
    } else {
      const method = (options.method ?? 'POST').toUpperCase();
      attributes = {
        form: `${grid.id}_grid_action_form`, formaction: href, formmethod: method === 'GET' ? 'get' : 'post', ...(['GET', 'POST'].includes(method) ? {} : { name: '_method', value: method }), ...confirm,
      };
      item = { type: 'submit' };
    }
    item = {
      ...item, label: action.name, icon: kitIcon(action.icon), attr: attributes,
    };
    (danger ? dangers : items).push(item);
  });

  return items.length && dangers.length ? [...items, { type: 'divider' }, ...dangers] : [...items, ...dangers];
};

// Grid::rowLink(): the first link action with clickable_row, unless it asks first
const rowLink = (fixture, record) => {
  const action = fixture.columns.filter((column) => column.type === 'action').flatMap((column) => column.options.actions)
    .find((candidate) => candidate.type === 'link' && candidate.options.clickable_row);

  return action && !action.options.confirm_message ? action.url.replace(/\{(\w+)\}/g, (match, field) => record[field]) : null;
};

// Grid::getGridItems(): the list's actions, as menu items
const gridItems = (fixture) => (fixture.grid_actions ?? []).map((action) => {
  const item = { label: action.name, icon: kitIcon(action.icon) };

  if (action.type === 'link') {
    return { ...item, type: 'link', href: action.url };
  }

  return {
    ...item,
    ...({
      common_refresh_list: { type: 'link', href: url(fixture, {}) },
      common_show_query: { type: 'button', attr: { 'data-bs-toggle': 'modal', 'data-bs-target': `#${fixture.id}_grid_common_show_query_modal` } },
      common_export_sql_manager: { type: 'submit', attr: { form: `${fixture.id}_common_show_query_modal_form` } },
    }[action.id] ?? { type: 'button', attr: { class: `js-${action.id}-grid-action`, 'data-ps-action': 'grid-action', 'data-ps-data-action-id': action.id } }),
  };
});

// Grid/cell/{type}.html.twig
const cell = (grid, column, record, rowHeaderId) => {
  const { options } = column;

  switch (column.type) {
    case 'identifier': {
      const value = escape(record[options.identifier_field]);
      if (!options.preview) {
        return value;
      }
      const url = options.preview.url.replace(/\{(\w+)\}/g, (match, field) => record[field]);

      return `<span id="${rowHeaderId}">${value}</span>${iconButton({
        icon: 'keyboard_arrow_down',
        label: 'Preview',
        size: 'sm',
        class: 'ps-grid__preview-toggle',
        attributes: {
          'aria-expanded': 'false',
          'aria-controls': rowHeaderId.replace('_grid_rowhead_', '_grid_preview_'),
          'aria-describedby': rowHeaderId,
          'data-ps-action': 'grid-preview',
          'data-ps-data-url': url,
          'data-ps-data-loading': 'Loading...',
          'data-ps-data-error': 'The preview could not be loaded.',
          'data-ps-data-retry': 'Try again',
        },
      })}`;
    }
    case 'toggle': {
      const key = record[options.primary_field];

      return check({
        type: 'switch',
        label: column.name,
        hideLabel: true,
        checked: Number(record[options.field] ?? 0) === 1,
        id: `${grid.id}_grid_${column.id}_${key}`,
        class: 'ps-grid__toggle',
        'aria-labelledby': `${grid.id}_col_${column.id} ${rowHeaderId}`,
        'data-ps-action': 'grid-toggle',
        'data-ps-data-url': options.url.replace(/\{(\w+)\}/g, (match, field) => record[field]),
        'data-ps-data-error': 'The change could not be saved. Try again.',
      }).html;
    }
    case 'position':
      return escape(Number(record[options.position_field]) + (options.display_offset ?? 1));
    case 'position_handle': {
      const index = grid.records.indexOf(record) + 1;
      const move = (direction) => iconButton({
        icon: direction === 'up' ? 'arrow_upward' : 'arrow_downward',
        label: direction === 'up' ? 'Move up' : 'Move down',
        size: 'sm',
        attributes: {
          ...((direction === 'up' ? index === 1 : index === grid.records.length) ? { disabled: '' } : {}),
          'aria-describedby': rowHeaderId,
          'data-ps-action': 'grid-move',
          'data-ps-data-direction': direction,
        },
      });

      return `<div class="ps-grid__position" data-ps-ref="grid-position" data-ps-data-id="${record[options.id_field]}" data-ps-data-position="${record[options.position_field]}" data-ps-data-url="${options.url}" data-ps-data-method="${options.update_method.toUpperCase()}">`
        + `<span class="ps-grid__drag" data-ps-action="grid-drag" aria-hidden="true">${uiIcon(dragIndicator)}</span>${move('up')}${move('down')}</div>`;
    }
    case 'choice': {
      const current = record[options.field];
      const entries = Object.entries(options.choices ?? {});
      if (!entries.length) {
        return '';
      }
      const formaction = options.url.replace(/\{(\w+)\}/g, (match, field) => record[field]);
      const label = entries.find(([, value]) => String(value) === String(current))?.[0] ?? '';
      const color = options.color_field ? record[options.color_field] : null;
      const items = entries.map(([name, value]) => ({
        type: 'submit', label: name, active: String(value) === String(current), attr: { form: `${grid.id}_grid_action_form`, formaction, name: 'value', value: String(value) },
      }));

      return `<div class="dropdown"><button class="btn btn-outline-secondary btn-sm ps-button ps-grid__choice${color ? ` ps-grid__choice--ink-${inkOn(color)}` : ''}" type="button" data-ps-data-busy-label="Loading..."${color ? ` style="--psk-grid-choice-color: ${color}"` : ''} data-bs-toggle="dropdown" aria-expanded="false" data-bs-popper-config="{&quot;strategy&quot;:&quot;fixed&quot;}" aria-describedby="${rowHeaderId}">`
        + `<span class="ps-button__label"><span class="visually-hidden">${escape(column.name)}: </span>${escape(label)}</span>${uiIcon(keyboardArrowDown, { size: 'lg' })}</button>${dropdownMenu({ items })}</div>`;
    }
    case 'bulk_action': {
      const value = record[options.bulk_field];

      return check({
        label: 'Select',
        hideLabel: true,
        name: `${grid.id}_${column.id}[]`,
        value: String(value),
        id: `${grid.id}_grid_select_${value}`,
        class: 'ps-grid__check',
        'data-ps-action': 'grid-select-row',
        'aria-labelledby': `${grid.id}_grid_select_label ${rowHeaderId}`,
      }).html;
    }
    case 'data': {
      const text = String(record[options.field] ?? '');
      const max = options.max_displayed_characters ?? 0;

      return max > 0 && text.length > max
        ? `<span aria-hidden="true">${escape(text.slice(0, max))}…</span><span class="visually-hidden">${escape(text)}</span>`
        : escape(text);
    }
    case 'boolean': {
      const on = Boolean(record[options.field]);

      return `<span class="ps-grid__state ps-grid__state--${on ? 'on' : 'off'}">${uiIcon(on ? checkCircle : cancel, { class: 'ps-grid__state-icon' })}${escape(on ? options.true_name : options.false_name)}</span>`;
    }
    case 'order_price':
      return record[options.is_paid_field] ? badge({ label: escape(record[options.field]), variant: 'success' }).html : escape(record[options.field]);
    case 'badge': {
      const color = record[options.color_field];

      return badge({
        label: escape(record[options.field]), variant: 'light', class: `ps-grid__badge ps-grid__badge--ink-${inkOn(color)}`, style: `--psk-grid-badge-color: ${color}`,
      }).html;
    }
    case 'date_time': {
      const value = record[column.id];

      return value ? `<time datetime="${date(value, 'Y-m-d\\TH:i:s')}">${date(value, options.format)}</time>` : escape(options.empty_data ?? '');
    }
    case 'action': {
      const items = rowActions(grid, record, column);
      if (!items.length) {
        return '';
      }

      return `<div class="dropdown ps-grid__actions">${iconButton({
        icon: 'more_vert', label: 'Actions', variant: 'outline-secondary', size: 'sm', attributes: { 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false', 'aria-describedby': rowHeaderId },
      })}${dropdownMenu({ items, align: 'end' }, ICONS)}</div>`;
    }
    default:
      return escape(record[options.field] ?? '');
  }
};

// Grid::getBulkItems(): the bulk actions as menu items (the fixture's url is what the router gives the route)
const bulkItems = (fixture) => (fixture.bulk_actions ?? []).map((action) => {
  const { options } = action;
  const item = { label: action.name, icon: action.icon };

  if (action.type === 'submit') {
    const confirm = confirmAttributes(options.confirm_message, options.modal_options);

    return {
      ...item,
      type: 'submit',
      attr: {
        form: `${fixture.id}_filter_form`, formaction: action.url, formmethod: (options.submit_method ?? 'POST').toLowerCase(), ...confirm,
      },
    };
  }
  if (action.type === 'button') {
    return {
      ...item, type: 'button', attr: { ...options.attributes, class: options.class ?? '', 'data-ps-action': 'grid-bulk-button', 'data-ps-data-action-id': action.id },
    };
  }

  return {
    ...item, type: 'button', attr: { 'data-ps-action': 'grid-bulk-modal', 'data-bs-toggle': 'modal', 'data-bs-target': `#${options.modal_id}` },
  };
});

// A <twig:ui:Button> of the grid: Search, Clear filters
const button = ({
  label, variant, size = null, type = 'button', icon = null, attributes = {},
}) => {
  const extra = Object.entries(attributes).map(([name, value]) => ` ${name}="${escape(value)}"`).join('');
  const content = icon ? `${uiIcon(icon, { size: 'lg' })}<span class="ps-button__label">${label}</span>` : label;

  return `<button class="btn btn-${variant}${size ? ` btn-${size}` : ''} ps-button" type="${type}" data-ps-data-busy-label="Loading..."${extra}>${content}</button>`;
};

/**
 * @param {object} fixture a fixture of ui/src/stories/fixtures, with the story's override applied
 * @param {object} props embedded, headingLevel
 * @param {object} blocks the nodes ({html, twig}) of the blocks before, toolbar, empty, footer
 */
export default function grid(fixture, { embedded = false, headingLevel = 2 } = {}, blocks = {}) {
  const block = (name) => blocks[name]?.html ?? '';
  const { id } = fixture;
  const empty = fixture.is_empty_state;
  const total = fixture.records_total;
  const state = empty ? 'empty' : (total === 0 ? 'no-match' : 'list');
  const { offset, limit } = fixture.pagination;
  const filterNames = fixture.filters.map((filter) => filter.name);
  const hasFilters = fixture.filters.length > 0;
  // GridFixture puts search_and_reset on the actions column: Filter goes in its filter cell
  const filterColumnId = hasFilters && fixture.columns.some((column) => column.id === 'actions') ? 'actions' : null;
  const filterButton = (size) => button({
    label: 'Filter', variant: 'outline-primary', size, type: 'submit', icon: filterAlt, attributes: { form: `${fixture.id}_filter_form`, 'data-ps-action': 'grid-apply-filters' },
  });
  const showReset = hasFilters && Object.keys(fixture.filter_data).some((name) => filterNames.includes(name));
  const reset = {
    'data-ps-action': 'grid-reset-filters',
    'data-ps-data-url': fixture.reset_url,
    'data-ps-data-redirect': fixture.redirect_url,
    'data-ps-data-fragment': `${id}_grid_results`,
    'data-ps-data-error': 'The filters could not be cleared. Try again.',
  };
  const rowHeader = (fixture.columns.find((column) => column.type === 'identifier') ?? fixture.columns.find((column) => ['data', 'link', 'disableable_link'].includes(column.type)))?.id;
  const subLevel = Math.min(headingLevel + 1, 6);

  const resultsWord = total === 1 ? 'result' : 'results';
  // The title is where sorting, pages and filters land (#{id}_grid_results)
  const titleAttributes = `id="${id}_grid_results" tabindex="-1" data-ps-ref="grid-results"`;
  const listItems = gridItems(fixture);
  const hideName = fixture.view_options.display_name === false;
  const listActions = listItems.length
    ? `<div class="dropdown ps-grid__list-actions">${iconButton({
      icon: 'settings', label: 'List actions', attributes: { id: `${id}-grid-actions-button`, 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false' },
    })}${dropdownMenu({ items: listItems, align: 'end' }, ICONS)}</div>`
    : '';
  const header = embedded || (hideName && !listItems.length)
    ? `<h${headingLevel} ${titleAttributes} class="visually-hidden">${escape(fixture.name)}</h${headingLevel}>`
    : `<header class="ps-grid__header card-header"><h${headingLevel} id="${id}_grid_results" class="ps-grid__title${hideName ? ' visually-hidden' : ''}" tabindex="-1" data-ps-ref="grid-results">${escape(fixture.name)} ${badge({ label: `${total}<span class="visually-hidden"> ${resultsWord}</span>`, variant: 'oceanblue', pill: true }).html}</h${headingLevel}>${listActions}</header>`;

  let body;

  if (state === 'empty') {
    body = block('empty') || emptyState({ title: 'No records found', icon: 'inbox', headingLevel: subLevel }, { inbox }).html;
  } else {
    const searchCluster = hasFilters && !filterColumnId
      ? `<div class="${clusterClasses({})} ps-grid__search">${filterButton()}${showReset ? button({
        label: 'Clear filters', variant: 'link', icon: closeIcon, attributes: reset,
      }) : ''}</div>`
      : '';
    const items = state === 'list' ? bulkItems(fixture) : [];
    // The bulk bar, over the headings and filters while rows are checked (grid-selection.js)
    const bulk = items.length
      ? `<div class="ps-grid__bulk" role="group" aria-label="Bulk actions" data-ps-ref="grid-bulk" hidden>${check({
        label: `Select all ${fixture.records.length} rows on this page`, hideLabel: true, id: `${id}_grid_bulk_select_all`, class: 'ps-grid__check', 'data-ps-action': 'grid-select-all',
      }).html}<p class="ps-grid__selection" data-ps-ref="grid-selection-count" data-ps-data-none="No rows selected" data-ps-data-some="%count% selected">No rows selected</p>`
        + '<div class="dropdown" data-ps-ref="grid-bulk-actions"><button class="btn btn-secondary btn-sm ps-button" type="button" data-ps-data-busy-label="Loading..." data-bs-toggle="dropdown" aria-expanded="false">'
        + `<span class="ps-button__label">Bulk actions</span>${uiIcon(keyboardArrowDown, { size: 'lg' })}</button>${dropdownMenu({ items }, ICONS)}</div>`
        + `<button class="btn btn-link btn-sm ps-button ps-grid__clear-selection" type="button" data-ps-data-busy-label="Loading..." data-ps-action="grid-clear-selection">${uiIcon(closeIcon, { size: 'lg' })}<span class="ps-button__label">Clear selection</span></button></div>`
      : '';
    // Grid::getReorder()
    const positionColumn = fixture.columns.find((column) => column.type === 'position');
    const ordering = positionColumn && fixture.sorting.order_by === positionColumn.id;
    const other = fixture.columns.find((column) => column.type !== 'position' && column.type !== 'position_handle' && column.options.sortable);
    const reorder = state === 'list' && positionColumn && fixture.filters.some((filter) => filter.type === 'reorder')
      ? `<a class="btn btn-outline-secondary ps-button" href="${escape(url(fixture, { orderBy: ordering && other ? other.id : positionColumn.id, sortOrder: 'asc' }))}">${uiIcon(ordering ? checkIcon : swapVert, { size: 'lg' })}<span class="ps-button__label">${ordering ? 'Done' : 'Rearrange'}</span></a>`
      : '';
    // Grid::getQuickFilters(): its hidden field first, so the clicked choice wins
    const quick = fixture.filters.filter((filter) => filter.type === 'filter_link').map((filter) => {
      const name = `${id}[${filter.name}]`;
      const current = String(fixture.filter_data[filter.name] ?? filter.options.default_value ?? '');
      const label = filter.name.replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase());

      return `<div class="ps-grid__quick-filters btn-group" role="group" aria-label="${label}"><input type="hidden" form="${id}_filter_form" name="${name}" value="${current}">`
        + Object.entries(filter.options.filter_options).map(([value, text]) => {
          const pressed = value === current;

          return `<button type="submit" form="${id}_filter_form" class="btn btn-outline-secondary${pressed ? ' active' : ''}" name="${name}" value="${value}" aria-pressed="${pressed}">${pressed ? uiIcon(checkIcon) : ''}${escape(text)}</button>`;
        }).join('')
        + '</div>';
    }).join('');
    const toolbar = reorder || block('toolbar') ? `<div class="ps-grid__toolbar">${block('toolbar')}${reorder}</div>` : '';
    const summary = quick || searchCluster ? `<div class="ps-grid__results">${searchCluster}${quick}</div>` : '';
    // Clear filters in the filter row: in its label cell, or next to Filter when the first column has a filter
    const clearButton = showReset ? iconButton({
      icon: 'filter_alt_off', label: 'Clear filters', variant: 'outline-primary', size: 'sm', tooltip: true, attributes: reset,
    }) : '';
    const filterLabel = !fixture.filters.some((filter) => filter.column === fixture.columns[0]?.id && filter.type !== 'reorder');

    const headings = fixture.columns.map((column) => {
      const sort = state === 'list' && fixture.sorting.order_by === column.id ? (fixture.sorting.order_way.toLowerCase() === 'desc' ? 'descending' : 'ascending') : null;
      const align = ALIGNMENTS[column.options.alignment ?? ''];
      const sortable = column.options.sortable && state === 'list';
      const icon = { ascending: arrowUpward, descending: arrowDownward }[sort] ?? unfoldMore;
      if (column.type === 'position_handle') {
        return `<th scope="col" id="${id}_col_${column.id}" class="ps-grid__heading ps-grid__heading--select"><span class="visually-hidden">Move</span></th>`;
      }
      if (column.type === 'bulk_action') {
        const all = state === 'list' ? check({
          label: `Select all ${fixture.records.length} rows on this page`, hideLabel: true, id: `${id}_grid_bulk_action_select_all`, class: 'ps-grid__check', 'data-ps-action': 'grid-select-all',
        }).html : '';

        return `<th scope="col" id="${id}_col_${column.id}" class="ps-grid__heading ps-grid__heading--select">${all}</th>`;
      }
      const content = sortable
        ? `<a class="ps-grid__sort" href="${escape(url(fixture, { orderBy: column.id, sortOrder: sort === 'ascending' ? 'desc' : 'asc' }))}">${escape(column.name)}${uiIcon(icon, { class: 'ps-grid__sort-icon' })}</a>`
        : escape(column.name);

      return `<th scope="col" id="${id}_col_${column.id}" class="ps-grid__heading${column.options.width ? ` ps-grid__heading--width-${column.options.width}` : ''}${align ? ` ps-grid__heading--${align}` : ''}"${sort ? ` aria-sort="${sort}"` : ''}>${content}</th>`;
    }).join('');
    const filters = hasFilters
      ? `<tr class="ps-grid__filters" data-ps-ref="grid-filter-row">${fixture.columns.map((column, index) => {
        const fields = fixture.filters.filter((filter) => filter.column === column.id && filter.type !== 'reorder');

        return index === 0 && filterLabel
          ? `<th scope="row" class="ps-grid__filter-label">${clearButton || uiIcon(filterAlt)}<span class="visually-hidden">Filters</span></th>`
          : `<td class="ps-grid__filter${column.options.width ? ` ps-grid__filter--width-${column.options.width}` : ''}">${column.id === filterColumnId ? `<div class="ps-grid__filter-actions">${filterButton('sm')}${filterLabel ? '' : clearButton}</div>` : ''}${fields.map((filter) => filterField(fixture, filter, column)).join('')}</td>`;
      }).join('')}</tr>`
      : '';

    let noMatch = '';
    let rows = '';

    if (state === 'no-match') {
      const actions = showReset ? [{ html: button({
        label: 'Clear filters', variant: 'outline-secondary', icon: closeIcon, attributes: reset,
      }), twig: '' }] : [];

      noMatch = emptyState({
        title: 'No results match these filters', icon: 'search_off', size: 'sm', headingLevel: subLevel, actions, class: 'ps-grid__no-match',
      }, { search_off: searchOff }).html;
    } else {
      const previewColumn = fixture.columns.find((column) => column.options.preview)?.id;
      rows = fixture.records.map((record, index) => {
        const link = rowLink(fixture, record);
        const cells = fixture.columns.map((column) => {
          const head = column.id === rowHeader;
          const tag = head ? 'th' : 'td';
          const align = ALIGNMENTS[column.options.alignment ?? ''];
          const clickable = link && column.options.clickable ? ' ps-grid__cell--clickable' : '';

          return `<${tag}${head ? ` scope="row"${column.id !== previewColumn ? ` id="${id}_grid_rowhead_${index + 1}"` : ''}` : ''} class="ps-grid__cell ps-grid__cell--${column.type.replaceAll('_', '-')}${align ? ` ps-grid__cell--${align}` : ''}${clickable}"${clickable ? ' data-ps-ref="grid-clickable-cell"' : ''}>${cell(fixture, column, record, `${id}_grid_rowhead_${index + 1}`)}</${tag}>`;
        }).join('');
        const preview = previewColumn
          ? `<tr id="${id}_grid_preview_${index + 1}" class="ps-grid__preview" hidden data-ps-ref="grid-preview"><td colspan="${fixture.columns.length}"><div class="ps-grid__preview-content" data-ps-target="grid-preview-content"></div></td></tr>`
          : '';

        return `<tr class="ps-grid__row"${link ? ` data-ps-action="grid-row-link" data-ps-data-href="${link}"` : ''}>${cells}</tr>${preview}`;
      }).join('');
    }

    body = `${toolbar}${summary}<form name="${id}" method="post" action="${fixture.action}#${id}_grid_results" id="${id}_filter_form" class="ps-grid__form" novalidate="novalidate" data-ps-action="validate">`
      + `<div class="ps-grid__table-area">${bulk}<div class="ps-grid__scroll table-responsive ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="${escape(fixture.name)} table">`
      + `<table id="${id}_grid_table" class="ps-grid__table table table-hover"><caption id="${id}_grid_caption" class="visually-hidden">${escape(fixture.name)}</caption>`
      + `<thead><tr class="ps-grid__headings">${headings}</tr>${filters}</thead><tbody>${rows}</tbody></table></div></div><span id="${id}_grid_select_label" hidden>Select</span>${noMatch}</form>`
      + `<form id="${id}_grid_action_form" method="post" hidden data-ps-ref="grid-action-form"></form>`;
  }

  // Under the table, in the card: the rows shown, the pages (Previous, a field to go to a page, Next), the rows per page
  const paginated = state === 'list' && (total > 10 || offset > 0);
  let pager = '';

  if (paginated) {
    const current = Math.floor(offset / limit) + 1;
    const last = Math.max(1, Math.ceil(total / limit), current);
    const links = Object.fromEntries([...new Set([1, current - 1, current, current + 1, last])]
      .filter((page) => page >= 1 && page <= last).sort((a, b) => a - b)
      .map((page) => [page, url(fixture, { offset: (page - 1) * limit, limit })]));
    const limits = LIMITS.includes(limit) ? LIMITS : [...LIMITS, limit].sort((a, b) => a - b);
    const menu = dropdownMenu({ items: limits.map((choice) => ({ label: String(choice), href: url(fixture, { offset: 0, limit: choice }), active: choice === limit })), align: 'end' });
    const range = last > 1 ? `${Math.min(offset + 1, total)}–${Math.min(offset + limit, total)} of ${total} results` : `${total} ${resultsWord}`;

    pager = `<div class="ps-grid__pager"><div class="ps-grid__pager-bar"><p id="${id}_grid_range" class="ps-grid__range">${range}</p>${pagination({
      class: 'ps-grid__pagination',
      current, links, label: `Pages of ${fixture.name}`, jumpUrl: url(fixture, { offset: '{offset}', limit }).replace(encodeURIComponent('{offset}'), '{offset}'), perPage: limit, 'aria-describedby': `${id}_grid_range`,
    }).html}`
      + `<div class="dropup ps-grid__per-page"><button class="btn btn-outline-secondary btn-sm ps-button" type="button" data-ps-data-busy-label="Loading..." data-bs-toggle="dropdown" aria-expanded="false"><span class="ps-button__label">${limit} per page</span>${uiIcon(keyboardArrowUp, { size: 'lg' })}</button>${menu}</div></div></div>`;
  }

  const footer = block('footer') ? `<footer class="ps-grid__footer${embedded ? '' : ' card-footer'}">${block('footer')}</footer>` : '';

  const blockTwig = ['before', 'toolbar', 'empty', 'footer'].filter((name) => blocks[name])
    .map((name) => `  <twig:block name="${name}">\n${blocks[name].twig.split('\n').map((line) => `    ${line}`).join('\n')}\n  </twig:block>`);
  const props = `${embedded ? ' embedded' : ''}${headingLevel !== 2 ? ` :headingLevel="${headingLevel}"` : ''}`;

  const queryFormId = `${id}_common_show_query_modal_form`;
  const queryModal = listItems.some((item) => item.attr?.form === queryFormId || item.attr?.['data-bs-target'] === `#${id}_grid_common_show_query_modal`)
    ? modal({
      id: `${id}_grid_common_show_query_modal`,
      title: 'SQL query',
      size: 'lg',
      body: {
        html: `<form id="${queryFormId}" class="ps-grid__query" method="post" action="/configure/advanced/sql-requests/new"><label class="form-label" for="${id}_grid_query">SQL query</label>`
          + `<textarea class="form-control ps-grid__query-text" id="${id}_grid_query" name="sql" rows="10" readonly>${escape(fixture.query ?? '')}</textarea><input type="hidden" name="name" value="${escape(fixture.name)}"></form>`,
        twig: '',
      },
      footer: [
        { html: '<button class="btn btn-link ps-button" type="button" data-ps-data-busy-label="Loading..." data-bs-dismiss="modal">Cancel</button>', twig: '' },
        { html: `<button class="btn btn-primary ps-button" type="submit" data-ps-data-busy-label="Loading..." form="${queryFormId}">Export to SQL Manager</button>`, twig: '' },
      ],
    }).html
    : '';

  return {
    html: `<section id="${id}_grid_panel" class="ps-grid ${embedded ? 'ps-grid--embedded' : 'card'}" data-ps-ref="grid" data-ps-data-grid-id="${id}" aria-labelledby="${id}_grid_results">${header}<div id="${id}_grid" class="ps-grid__body${embedded ? '' : ' card-body'}">${block('before')}${body}${pager}</div>${footer}${queryModal}</section>`,
    twig: blockTwig.length
      ? `<twig:ui:Grid :grid="${fixture.variable}"${props}>\n${blockTwig.join('\n')}\n</twig:ui:Grid>`
      : `<twig:ui:Grid :grid="${fixture.variable}"${props}/>`,
  };
}
