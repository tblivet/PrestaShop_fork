<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui\Layout;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Layout\Tiles;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class TilesTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertSame(['columns' => 3, 'gap' => 'md', 'as' => 'div'], (new Tiles())->preMount([]));
        $this->assertSame('ps-tiles ps-tiles--3 d-grid gap-3', (new Tiles())->getClasses());
    }

    public function testColumnsFromAStringAttribute(): void
    {
        $this->assertSame(4, (new Tiles())->preMount(['columns' => '4'])['columns']);
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('ps-dashboard__kpis', (new Tiles())->preMount(['class' => 'ps-dashboard__kpis'])['class']);
    }

    public function testList(): void
    {
        $tiles = new Tiles();
        $tiles->columns = 6;
        $tiles->gap = 'sm';
        $tiles->as = 'ul';

        $this->assertSame('ps-tiles ps-tiles--6 d-grid gap-2 list-unstyled mb-0', $tiles->getClasses());
    }

    /**
     * @dataProvider invalidOptions
     */
    public function testRejectsValuesOutsideTheScales(array $options): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Tiles())->preMount($options);
    }

    public static function invalidOptions(): iterable
    {
        yield 'columns' => [['columns' => 5]];
        yield 'columns as text' => [['columns' => 'four']];
        yield 'gap' => [['gap' => 'huge']];
        yield 'element' => [['as' => 'table']];
    }
}
