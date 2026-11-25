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

    public function testALinkedKpiIsALink(): void
    {
        $html = $this->render('<twig:ui:Kpi title="Abandoned Carts" href="/carts"/>');

        $this->assertStringContainsString('<a class="card ps-kpi ps-kpi--oceanblue" data-ps-ref="kpi" href="/carts">', $html);
        $this->assertStringEndsWith('</a>', trim($html));
    }

    public function testABlankValueIsALongDashNamedForScreenReaders(): void
    {
        $this->assertStringContainsString('<p class="ps-kpi__value" data-ps-ref="kpi-value"><span aria-hidden="true">—</span><span class="visually-hidden">No value</span></p>', $this->render('<twig:ui:Kpi title="Average Age" value=" "/>'));
    }

    public function testShowsAPlaceholderInsteadOfAValueToRefresh(): void
    {
        $html = $this->render('<twig:ui:Kpi title="Average Order Value" value=" tax excl." refreshUrl="/stats?kpi=age"/>');

        $this->assertStringContainsString('data-ps-data-refresh-url="/stats?kpi=age"', $html);
        $this->assertStringContainsString('<p class="ps-kpi__value" data-ps-ref="kpi-value" data-ps-data-no-value="No value" aria-busy="true"><span class="placeholder-wave" aria-hidden="true"><span class="placeholder ps-kpi__placeholder"></span></span><span class="visually-hidden">Loading...</span></p>', $html);
        $this->assertStringNotContainsString('tax excl.', $html);
        $this->assertStringContainsString('<p class="ps-kpi__value" data-ps-ref="kpi-value"><span aria-hidden="true">—</span><span class="visually-hidden">No value</span></p>', $this->render('<twig:ui:Kpi title="Average Age"/>'));
        $this->assertStringNotContainsString('ps-kpi__icon', $html);
        $this->assertStringNotContainsString('ps-kpi__subtitle', $html);
    }

    public function testTheRowScrollsSidewaysOnAPhone(): void
    {
        $html = $this->renderRow([
            ['props' => ['title' => 'Customers', 'value' => '58%', 'color' => 'oceanblue']],
            ['props' => ['title' => 'Average Age', 'value' => '34', 'color' => 'purple']],
            ['html' => '<div class="module-kpi">Module</div>'],
        ]);

        $this->assertStringContainsString('<div class="ps-kpi-row ps-kpi-row--3 ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" role="region" aria-label="Key figures">', $html);
        $this->assertSame(2, substr_count($html, 'data-ps-ref="kpi"'));
        $this->assertStringContainsString('<div><div class="module-kpi">Module</div></div>', $html);
    }

    public function testTheRowHasAtMostFourColumns(): void
    {
        $kpi = ['props' => ['title' => 'Customers', 'value' => '58%']];

        $this->assertStringContainsString('ps-kpi-row--4', $this->renderRow(array_fill(0, 5, $kpi)));
        $this->assertStringContainsString('ps-kpi-row--2 ', $this->renderRow(array_fill(0, 2, $kpi)));
    }

    public function testALoneKpiTakesTheRow(): void
    {
        $this->assertStringContainsString('ps-kpi-row--1 ', $this->renderRow([['props' => ['title' => 'Total Cart', 'value' => '€128.40']]]));
    }

    private function renderRow(array $kpis): string
    {
        return $this->twig->render('@PrestaShop/Admin/Common/Kpi/Ui/kpi_row.html.twig', ['kpis' => $kpis]);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
