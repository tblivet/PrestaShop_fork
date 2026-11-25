<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Kpi\KpiData;
use PrestaShopBundle\Twig\Component\Ui\Kpi;
use Symfony\Component\OptionsResolver\Exception\ExceptionInterface;

class KpiTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['title' => 'Conversion Rate', 'value' => null, 'subtitle' => null, 'icon' => null, 'color' => 'oceanblue', 'href' => null, 'refreshUrl' => null],
            (new Kpi())->preMount(['title' => 'Conversion Rate'])
        );
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(ExceptionInterface::class);

        (new Kpi())->preMount($data + ['title' => 'Conversion Rate']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'empty title' => [['title' => ' ']];
        yield 'unknown colour' => [['color' => 'color1']];
        yield 'icon not a symbol name' => [['icon' => 'icon-envelope']];
        yield 'non string title' => [['title' => 3]];
        yield 'number as value' => [['value' => 12]];
        yield 'non string subtitle' => [['subtitle' => 1]];
        yield 'non string href' => [['href' => 42]];
        yield 'non string refresh url' => [['refreshUrl' => true]];
    }

    public function testTakesTheColourOfItsPlaceInTheRowAndAKitIcon(): void
    {
        $props = Kpi::propsFromKpiData(new KpiData(
            id: 'box-conversion-rate',
            title: 'Conversion Rate',
            value: '1.8%',
            subtitle: '30 days',
            icon: 'assessment',
            color: 'color3',
            href: '/stats',
            source: '/stats?ajax=1',
            refresh: true,
        ), 6);

        $this->assertSame([
            'id' => 'box-conversion-rate',
            'title' => 'Conversion Rate',
            'value' => '1.8%',
            'subtitle' => '30 days',
            'icon' => 'monitoring',
            'color' => 'amber',
            'href' => '/stats',
            'refreshUrl' => '/stats?ajax=1',
        ], $props);
    }

    public function testRefreshesOnlyAnOutOfDateValue(): void
    {
        $props = Kpi::propsFromKpiData(new KpiData(id: 'box-newsletter', title: 'Newsletter Registrations', icon: 'mail_outline', source: '/stats?ajax=1'));

        $this->assertNull($props['refreshUrl']);
        $this->assertSame('mail', $props['icon']);
        $this->assertSame('oceanblue', $props['color']);
    }

    public function testAKpiWithoutIconOrPlaceKeepsTheFirstColour(): void
    {
        $props = Kpi::propsFromKpiData(new KpiData(id: 'box-module', title: 'Module KPI'), -1);

        $this->assertNull($props['icon']);
        $this->assertSame('oceanblue', $props['color']);
    }
}
