<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Dropdown;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class DropdownTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['label' => 'Export', 'items' => [], 'icon' => null, 'variant' => 'secondary', 'size' => 'md', 'align' => 'start', 'direction' => 'down', 'disabled' => false],
            (new Dropdown())->preMount(['label' => 'Export', 'items' => []])
        );
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('export', (new Dropdown())->preMount(['label' => 'Export', 'items' => [], 'id' => 'export'])['id']);
    }

    public function testRequiresLabel(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Dropdown())->preMount(['items' => []]);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Dropdown())->preMount($data + ['label' => 'Export', 'items' => []]);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'blank label' => [['label' => ' ']];
        yield 'unknown variant' => [['variant' => 'danger']];
        yield 'unknown size' => [['size' => 'xl']];
        yield 'unknown alignment' => [['align' => 'right']];
        yield 'unknown direction' => [['direction' => 'left']];
        yield 'non boolean disabled' => [['disabled' => 'yes']];
    }
}
