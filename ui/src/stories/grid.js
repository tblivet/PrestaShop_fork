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
import checkCircle from '../../icons/material-symbols/check-circle.svg?raw';
import inbox from '../../icons/material-symbols/inbox.svg?raw';
import keyboardArrowUp from '../../icons/material-symbols/keyboard-arrow-up.svg?raw';
import search from '../../icons/material-symbols/search.svg?raw';
import searchOff from '../../icons/material-symbols/search-off.svg?raw';
import unfoldMore from '../../icons/material-symbols/unfold-more.svg?raw';
import badge from './badge';
import dropdownMenu from './dropdown-menu';
import emptyState from './empty-state';
import pagination from './pagination';
import uiIcon from './ui-icon';
import { clusterClasses } from './layouts/layout-classes';

// Grid.php defaults; grid is required
export const GRID_DEFAULTS = { embedded: false, headingLevel: 2 };

// Grid::LIMITS
const LIMITS = [10, 20, 50, 100, 300, 1000];

const ALIGNMENTS = { right: 'end', center: 'center' };

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

  return `<label class="visually-hidden form-label" for="${id}">${escape(column.name)}</label><input type="text" id="${id}" name="${name}"${value ? ` value="${escape(value)}"` : ''} class="form-control-sm form-control">`;
};

// Grid/cell/{type}.html.twig
const cell = (column, record) => {
  const { options } = column;

  switch (column.type) {
    case 'identifier':
      return escape(record[options.identifier_field]);
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
    default:
      return escape(record[options.field] ?? '');
  }
};

// A <twig:ui:Button> of the grid: Search, Clear filters
const button = ({
  label, variant, type = 'button', icon = null, attributes = {},
}) => {
  const extra = Object.entries(attributes).map(([name, value]) => ` ${name}="${escape(value)}"`).join('');
  const content = icon ? `${uiIcon(icon, { size: 'lg' })}<span class="ps-button__label">${label}</span>` : label;

  return `<button class="btn btn-${variant} ps-button" type="${type}" data-ps-data-busy-label="Loading..."${extra}>${content}</button>`;
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
  const header = embedded || fixture.view_options.display_name === false
    ? `<h${headingLevel} id="${id}_grid_title" class="visually-hidden">${escape(fixture.name)}</h${headingLevel}>`
    : `<header class="ps-grid__header card-header"><h${headingLevel} id="${id}_grid_title" class="ps-grid__title">${escape(fixture.name)} ${badge({ label: `${total}<span class="visually-hidden"> ${resultsWord}</span>`, variant: 'secondary', pill: true }).html}</h${headingLevel}></header>`;

  let body;

  if (state === 'empty') {
    body = block('empty') || emptyState({ title: 'No records found', icon: 'inbox', headingLevel: subLevel }, { inbox }).html;
  } else {
    const searchCluster = hasFilters
      ? `<div class="${clusterClasses({})} ps-grid__search">${button({
        label: 'Search', variant: 'outline-primary', type: 'submit', icon: search, attributes: { form: `${id}_filter_form` },
      })}${showReset ? button({ label: 'Clear filters', variant: 'link', attributes: reset }) : ''}</div>`
      : '';
    const toolbar = searchCluster || block('toolbar') ? `<div class="ps-grid__toolbar">${block('toolbar')}${searchCluster}</div>` : '';
    const [from, to] = [Math.min(offset + 1, total), Math.min(offset + limit, total)];
    const summary = `<p id="${id}_grid_results" class="ps-grid__summary" tabindex="-1" data-ps-ref="grid-results">${state === 'no-match' ? `${total} ${resultsWord}` : `${from}–${to} of ${total}`}</p>`;

    const headings = fixture.columns.map((column) => {
      const sort = state === 'list' && fixture.sorting.order_by === column.id ? (fixture.sorting.order_way.toLowerCase() === 'desc' ? 'descending' : 'ascending') : null;
      const align = ALIGNMENTS[column.options.alignment ?? ''];
      const sortable = column.options.sortable && state === 'list';
      const icon = { ascending: arrowUpward, descending: arrowDownward }[sort] ?? unfoldMore;
      const content = sortable
        ? `<a class="ps-grid__sort" href="${escape(url(fixture, { orderBy: column.id, sortOrder: sort === 'ascending' ? 'desc' : 'asc' }))}">${escape(column.name)}${uiIcon(icon, { class: 'ps-grid__sort-icon' })}</a>`
        : escape(column.name);

      return `<th scope="col" id="${id}_col_${column.id}" class="ps-grid__heading${align ? ` ps-grid__heading--${align}` : ''}"${sort ? ` aria-sort="${sort}"` : ''}>${content}</th>`;
    }).join('');
    const filters = hasFilters
      ? `<tr class="ps-grid__filters">${fixture.columns.map((column) => `<td class="ps-grid__filter">${fixture.filters.filter((filter) => filter.column === column.id).map((filter) => filterField(fixture, filter, column)).join('')}</td>`).join('')}</tr>`
      : '';

    let noMatch = '';
    let rows = '';

    if (state === 'no-match') {
      const actions = showReset ? [{ html: button({ label: 'Clear filters', variant: 'outline-secondary', attributes: reset }), twig: '' }] : [];

      noMatch = emptyState({
        title: 'No results match these filters', icon: 'search_off', size: 'sm', headingLevel: subLevel, actions, class: 'ps-grid__no-match',
      }, { search_off: searchOff }).html;
    } else {
      rows = fixture.records.map((record, index) => `<tr class="ps-grid__row">${fixture.columns.map((column) => {
        const head = column.id === rowHeader;
        const tag = head ? 'th' : 'td';
        const align = ALIGNMENTS[column.options.alignment ?? ''];

        return `<${tag}${head ? ` scope="row" id="${id}_grid_rowhead_${index + 1}"` : ''} class="ps-grid__cell ps-grid__cell--${column.type.replaceAll('_', '-')}${align ? ` ps-grid__cell--${align}` : ''}">${cell(column, record)}</${tag}>`;
      }).join('')}</tr>`).join('');
    }

    body = `${toolbar}${summary}<form name="${id}" method="post" action="${fixture.action}#${id}_grid_results" id="${id}_filter_form" class="ps-grid__form" novalidate="novalidate" data-ps-action="validate">`
      + `<div class="ps-grid__scroll table-responsive ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="${escape(fixture.name)} table">`
      + `<table id="${id}_grid_table" class="ps-grid__table table" aria-describedby="${id}_grid_results"><caption id="${id}_grid_caption" class="visually-hidden">${escape(fixture.name)}</caption>`
      + `<thead><tr class="ps-grid__headings">${headings}</tr>${filters}</thead><tbody>${rows}</tbody></table></div>${noMatch}</form>`;
  }

  const paginated = state !== 'empty' && (total > 10 || offset > 0);
  let footer = '';
  let pages = '';

  if (paginated) {
    const current = Math.floor(offset / limit) + 1;
    const last = Math.max(1, Math.ceil(total / limit), current);
    const links = Object.fromEntries([...new Set([1, current - 1, current, current + 1, last])]
      .filter((page) => page >= 1 && page <= last).sort((a, b) => a - b)
      .map((page) => [page, url(fixture, { offset: (page - 1) * limit, limit })]));
    const jump = last > 5;
    const limits = LIMITS.includes(limit) ? LIMITS : [...LIMITS, limit].sort((a, b) => a - b);
    const menu = dropdownMenu({ items: limits.map((choice) => ({ label: String(choice), href: url(fixture, { offset: 0, limit: choice }), active: choice === limit })), align: 'end' });

    pages = `<div class="${clusterClasses({ justify: 'between' })}">${pagination({
      class: 'ps-grid__pagination',
      current, links, label: `Pages of ${fixture.name}`, jumpUrl: jump ? url(fixture, { offset: '{offset}', limit }).replace(encodeURIComponent('{offset}'), '{offset}') : null, perPage: jump ? limit : null,
    }).html}<div class="dropup"><button class="btn btn-outline-secondary btn-sm ps-button" type="button" data-ps-data-busy-label="Loading..." data-bs-toggle="dropdown" aria-expanded="false"><span class="ps-button__label">${limit} per page</span>${uiIcon(keyboardArrowUp, { size: 'lg' })}</button>${menu}</div></div>`;
  }

  if (pages || block('footer')) {
    footer = `<footer class="ps-grid__footer${embedded ? '' : ' card-footer'}">${pages}${block('footer')}</footer>`;
  }

  const blockTwig = ['before', 'toolbar', 'empty', 'footer'].filter((name) => blocks[name])
    .map((name) => `  <twig:block name="${name}">\n${blocks[name].twig.split('\n').map((line) => `    ${line}`).join('\n')}\n  </twig:block>`);
  const props = `${embedded ? ' embedded' : ''}${headingLevel !== 2 ? ` :headingLevel="${headingLevel}"` : ''}`;

  return {
    html: `<section id="${id}_grid_panel" class="ps-grid ${embedded ? 'ps-grid--embedded' : 'card'}" data-ps-ref="grid" data-ps-data-grid-id="${id}" aria-labelledby="${id}_grid_title">${header}<div id="${id}_grid" class="ps-grid__body${embedded ? '' : ' card-body'}">${block('before')}${body}</div>${footer}</section>`,
    twig: blockTwig.length
      ? `<twig:ui:Grid :grid="${fixture.variable}"${props}>\n${blockTwig.join('\n')}\n</twig:ui:Grid>`
      : `<twig:ui:Grid :grid="${fixture.variable}"${props}/>`,
  };
}
