<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Adapter\Kpi;

use HelperKpi;
use PrestaShop\PrestaShop\Core\Kpi\KpiData;

/**
 * A KPI built with HelperKpi: its HTML (render) and its data (getKpiData) from the same helper
 */
trait HelperKpiTrait
{
    abstract private function createHelper(): HelperKpi;

    /**
     * {@inheritdoc}
     */
    public function render()
    {
        return $this->createHelper()->generate();
    }

    public function getKpiData(): KpiData
    {
        $helper = $this->createHelper();
        $text = fn (mixed $value): ?string => null === $value || false === $value || '' === $value ? null : (string) $value;

        return new KpiData(
            id: (string) $helper->id,
            title: (string) $helper->title,
            value: $text($helper->value),
            subtitle: $text($helper->subtitle),
            icon: $text($helper->icon),
            color: $text($helper->color),
            href: $text($helper->href),
            source: $text($helper->source),
            refresh: (bool) $helper->refresh && null !== $text($helper->source),
        );
    }
}
