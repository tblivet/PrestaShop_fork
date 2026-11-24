<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Kpi;

/**
 * A KPI that gives what it shows as data, as well as its HTML (KpiInterface::render())
 */
interface KpiDataInterface
{
    public function getKpiData(): KpiData;
}
