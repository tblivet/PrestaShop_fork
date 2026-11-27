<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\Core\Grid\Column;

use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Grid\Column\Type\Common\ActionColumn;
use PrestaShop\PrestaShop\Core\Grid\Column\Type\Common\ToggleColumn;
use PrestaShop\PrestaShop\Core\Grid\Column\Type\DataColumn;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class ColumnLayoutOptionsTest extends TestCase
{
    public function testAnyColumnTakesAWidthHint(): void
    {
        $this->assertSame('narrow', (new DataColumn('id_country'))->setOptions(['field' => 'id_country', 'width' => 'narrow'])->getOptions()['width']);
        // A type that does not call the parent's options takes it too
        $this->assertSame('wide', (new ActionColumn('actions'))->setOptions(['width' => 'wide'])->getOptions()['width']);
    }

    public function testNoWidthUnlessGiven(): void
    {
        $this->assertArrayNotHasKey('width', (new DataColumn('name'))->setOptions(['field' => 'name'])->getOptions());
    }

    public function testOnlyKnownWidths(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new DataColumn('name'))->setOptions(['field' => 'name', 'width' => 'sm']);
    }

    public function testAlignedToTheStartUnlessGiven(): void
    {
        $this->assertSame('start', (new DataColumn('name'))->setOptions(['field' => 'name'])->getOptions()['alignment']);
        $this->assertSame('end', (new DataColumn('price'))->setOptions(['field' => 'price', 'alignment' => 'end'])->getOptions()['alignment']);
    }

    public function testRowActionsAlignedToTheEnd(): void
    {
        $this->assertSame('end', (new ActionColumn('actions'))->setOptions([])->getOptions()['alignment']);
        $this->assertSame('start', (new ActionColumn('actions'))->setOptions(['alignment' => 'start'])->getOptions()['alignment']);
    }

    public function testSwitchesCentred(): void
    {
        $options = ['field' => 'active', 'primary_field' => 'id_country', 'route' => 'admin_countries_toggle_status', 'route_param_name' => 'countryId'];

        $this->assertSame('center', (new ToggleColumn('active'))->setOptions($options)->getOptions()['alignment']);
        $this->assertSame('end', (new ToggleColumn('active'))->setOptions($options + ['alignment' => 'end'])->getOptions()['alignment']);
    }

    public function testFormerAlignmentNamesStillAccepted(): void
    {
        $this->assertSame('right', (new DataColumn('price'))->setOptions(['field' => 'price', 'alignment' => 'right'])->getOptions()['alignment']);
    }
}
