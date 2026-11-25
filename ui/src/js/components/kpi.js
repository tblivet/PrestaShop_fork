/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// <twig:ui:Kpi> (kpi.html.twig): a figure that is out of date has a refresh URL (data-ps-data-refresh-url) and shows a
// placeholder; its fresh value is fetched when the page loads (AdminStats getKpi: JSON {value} or {has_errors}).
// Without one, a long dash named for screen readers, as a KPI with no value. Storybook runs it on each story it renders
// (root).

// The value comes as HTML text ("&infin;%"): its text, never its markup
const decode = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent.trim();

const show = (kpi, text) => {
  const value = kpi.querySelector(selectors.kpiValue);

  if (text) {
    value.textContent = text;
  } else {
    const dash = document.createElement('span');
    const name = document.createElement('span');

    dash.setAttribute('aria-hidden', 'true');
    dash.textContent = '—';
    name.className = 'visually-hidden';
    name.textContent = value.dataset.psDataNoValue;
    value.replaceChildren(dash, name);
  }
  value.removeAttribute('aria-busy');
};

export default function initKpis(root = document) {
  root.querySelectorAll(selectors.kpiToRefresh).forEach(async (kpi) => {
    try {
      const response = await fetch(kpi.dataset.psDataRefreshUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const data = await response.json();

      show(kpi, data.has_errors || data.value === undefined || data.value === null ? '' : decode(String(data.value)));
    } catch {
      show(kpi, '');
    }
  });
}
