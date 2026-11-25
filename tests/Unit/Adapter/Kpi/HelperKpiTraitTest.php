<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\Adapter\Kpi;

use HelperKpi;
use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Adapter\Kpi\HelperKpiTrait;

class HelperKpiTraitTest extends TestCase
{
    public function testTheDataHasTheTextOfTheHelpersHtml(): void
    {
        $kpi = new class() {
            use HelperKpiTrait;

            private function createHelper(): HelperKpi
            {
                $helper = new HelperKpi();
                $helper->id = 'box-conversion';
                $helper->title = 'Sales &amp; Orders';
                $helper->value = '&infin;%';
                $helper->subtitle = '';

                return $helper;
            }
        };

        $data = $kpi->getKpiData();

        $this->assertSame('Sales & Orders', $data->title);
        $this->assertSame('∞%', $data->value);
        $this->assertNull($data->subtitle);
    }
}
