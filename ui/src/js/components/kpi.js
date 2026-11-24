/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// <twig:ui:Kpi> (kpi.html.twig): a figure that is out of date has a refresh URL (data-ps-data-refresh-url) and shows a
// placeholder; its fresh value is fetched when the page loads (AdminStats getKpi: JSON {value, tooltip} or
// {has_errors}). Without one, a long dash, as a KPI with no value.
const NO_VALUE = '—';

const show = (kpi, text) => {
  const value = kpi.querySelector(selectors.kpiValue);

  value.textContent = text;
  value.classList.remove('placeholder-glow');
  value.removeAttribute('aria-busy');
};

export default function initKpis(Tooltip) {
  document.querySelectorAll(selectors.kpiToRefresh).forEach(async (kpi) => {
    try {
      const response = await fetch(kpi.dataset.psDataRefreshUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const data = await response.json();

      if (data.has_errors || data.value === undefined || data.value === null) {
        show(kpi, NO_VALUE);

        return;
      }

      show(kpi, String(data.value));

      const info = kpi.querySelector(selectors.kpiInfo) ?? (kpi.dataset.bsToggle === 'tooltip' ? kpi : null);

      if (info && data.tooltip) {
        info.setAttribute('data-bs-title', data.tooltip);
        Tooltip.getInstance(info)?.setContent({ '.tooltip-inner': data.tooltip });
      }
    } catch {
      show(kpi, NO_VALUE);
    }
  });
}
