<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Twig\Environment;

/**
 * The rendered markup must match ui/src/stories/components/Kpi.stories.js.
 */
class KpiComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersACardWithItsColourIconValueAndPeriod(): void
    {
        $html = $this->render('<twig:ui:Kpi title="Conversion Rate" value="1.8%" subtitle="30 days" icon="percent" color="purple" id="box-conversion-rate"/>');

        $this->assertStringContainsString('<div class="card ps-kpi ps-kpi--purple" data-ps-ref="kpi" id="box-conversion-rate">', $html);
        $this->assertMatchesRegularExpression('#<span class="ps-kpi__icon"><svg [^>]*class="ps-icon ps-icon--lg"#', $html);
        $this->assertStringContainsString('<p class="ps-kpi__title">Conversion Rate</p><p class="ps-kpi__value" data-ps-ref="kpi-value">1.8%</p><p class="ps-kpi__subtitle">30 days</p>', $html);
    }

    public function testALinkedKpiIsALinkWithItsTooltip(): void
    {
        $html = $this->render('<twig:ui:Kpi title="Abandoned Carts" href="/carts" tooltip="Carts with no order"/>');

        $this->assertStringContainsString('<a class="card ps-kpi ps-kpi--oceanblue" data-ps-ref="kpi" href="/carts" data-bs-toggle="tooltip" data-bs-title="Carts with no order">', $html);
        $this->assertStringNotContainsString('ps-kpi__info', $html);
    }

    public function testATooltipWithoutLinkIsAnInfoButton(): void
    {
        $html = $this->render('<twig:ui:Kpi title="Disabled Products" value="12%" tooltip="12% of your products are disabled"/>');

        $this->assertMatchesRegularExpression('#<p class="ps-kpi__title">Disabled Products<button class="btn btn-link btn-sm ps-button ps-icon-button ps-kpi__info" type="button" [^>]*aria-label="12% of your products are disabled" data-bs-toggle="tooltip" data-bs-title="12% of your products are disabled" data-ps-ref="kpi-info">#', $html);
    }

    public function testShowsAPlaceholderInsteadOfAValueToRefresh(): void
    {
        $html = $this->render('<twig:ui:Kpi title="Average Order Value" value=" tax excl." refreshUrl="/stats?kpi=age"/>');

        $this->assertStringContainsString('data-ps-data-refresh-url="/stats?kpi=age"', $html);
        $this->assertStringContainsString('<p class="ps-kpi__value placeholder-glow" data-ps-ref="kpi-value" aria-busy="true"><span class="placeholder ps-kpi__placeholder" aria-hidden="true"></span></p>', $html);
        $this->assertStringNotContainsString('tax excl.', $html);
        $this->assertStringContainsString('<p class="ps-kpi__value" data-ps-ref="kpi-value">—</p>', $this->render('<twig:ui:Kpi title="Average Age"/>'));
        $this->assertStringNotContainsString('ps-kpi__icon', $html);
        $this->assertStringNotContainsString('ps-kpi__subtitle', $html);
    }

    public function testTheRowScrollsSidewaysOnAPhone(): void
    {
        $html = $this->twig->render('@PrestaShop/Admin/Common/Kpi/Ui/kpi_row.html.twig', ['kpis' => [
            ['props' => ['title' => 'Customers', 'value' => '58%', 'color' => 'oceanblue']],
            ['props' => ['title' => 'Average Age', 'value' => '34', 'color' => 'purple']],
            ['html' => '<div class="module-kpi">Module</div>'],
        ]]);

        $this->assertStringContainsString('<div class="ps-kpi-row ps-kpi-row--3 ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="Key figures" tabindex="0">', $html);
        $this->assertSame(2, substr_count($html, 'data-ps-ref="kpi"'));
        $this->assertStringContainsString('<div><div class="module-kpi">Module</div></div>', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
