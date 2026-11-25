<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Kpi;

/**
 * What a KPI shows, for a view that renders it itself (the /ui kit's <twig:ui:Kpi>) instead of its HTML
 */
final class KpiData
{
    /**
     * @param string|null $color the KPI's place in its row: color1 to color4
     * @param string|null $source the URL that gives a fresh value (JSON: value)
     * @param bool $refresh whether the value is out of date and must be fetched from the source
     */
    public function __construct(
        public readonly string $id,
        public readonly string $title,
        public readonly ?string $value = null,
        public readonly ?string $subtitle = null,
        public readonly ?string $icon = null,
        public readonly ?string $color = null,
        public readonly ?string $href = null,
        public readonly ?string $source = null,
        public readonly bool $refresh = false,
    ) {
    }
}
