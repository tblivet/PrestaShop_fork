/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// <twig:ui:Kpi> (kpi.html.twig): a figure that is out of date has a refresh URL (data-ps-data-refresh-url) and shows a
// placeholder; its fresh value is fetched when the page loads (AdminStats getKpi: JSON {value} or {has_errors}).
// Without one, a long dash, as a KPI with no value. Storybook runs it on each story it renders (root).
const NO_VALUE = '—';

const show = (kpi, text) => {
  const value = kpi.querySelector(selectors.kpiValue);

  value.textContent = text;
  value.classList.remove('placeholder-wave');
  value.removeAttribute('aria-busy');
};

export default function initKpis(root = document) {
  root.querySelectorAll(selectors.kpiToRefresh).forEach(async (kpi) => {
    try {
      const response = await fetch(kpi.dataset.psDataRefreshUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const data = await response.json();

      show(kpi, data.has_errors || data.value === undefined || data.value === null || String(data.value).trim() === '' ? NO_VALUE : String(data.value));
    } catch {
      show(kpi, NO_VALUE);
    }
  });
}
