<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\Core\Grid\Column;

use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Grid\Column\Type\Common\ActionColumn;
use PrestaShop\PrestaShop\Core\Grid\Column\Type\DataColumn;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class ColumnWidthTest extends TestCase
{
    public function testAnyColumnTakesAWidthHint(): void
    {
        $this->assertSame('sm', (new DataColumn('id_country'))->setOptions(['field' => 'id_country', 'width' => 'sm'])->getOptions()['width']);
        // A type that does not call the parent's options takes it too
        $this->assertSame('lg', (new ActionColumn('actions'))->setOptions(['width' => 'lg'])->getOptions()['width']);
    }

    public function testNoWidthUnlessGiven(): void
    {
        $this->assertArrayNotHasKey('width', (new DataColumn('name'))->setOptions(['field' => 'name'])->getOptions());
    }

    public function testOnlyKnownWidths(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new DataColumn('name'))->setOptions(['field' => 'name', 'width' => 'xl']);
    }
}
