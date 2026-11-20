<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\IconButton;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class IconButtonTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            [
                'icon' => 'delete',
                'label' => 'Delete',
                'tooltip' => false,
                'tooltipPlacement' => 'top',
                'variant' => 'primary',
                'size' => 'md',
                'href' => null,
                'type' => 'button',
                'loading' => false,
                'busyLabel' => null,
                'disabled' => false,
            ],
            (new IconButton())->preMount(['icon' => 'delete', 'label' => 'Delete'])
        );
    }

    public function testKeepsExtraAttributes(): void
    {
        $data = (new IconButton())->preMount(['icon' => 'edit', 'label' => 'Edit', 'variant' => 'link', 'href' => '/edit', 'aria-controls' => 'menu']);

        $this->assertSame(['link', '/edit', 'menu'], [$data['variant'], $data['href'], $data['aria-controls']]);
    }

    #[DataProvider('provideMissingProps')]
    public function testRequiresIconAndLabel(array $data): void
    {
        $this->expectException(MissingOptionsException::class);

        (new IconButton())->preMount($data);
    }

    public static function provideMissingProps(): iterable
    {
        yield 'no label' => [['icon' => 'delete']];
        yield 'no icon' => [['label' => 'Delete']];
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new IconButton())->preMount($data + ['icon' => 'delete', 'label' => 'Delete']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'blank label' => [['label' => ' ']];
        yield 'non boolean tooltip' => [['tooltip' => 'yes']];
        yield 'unknown tooltip placement' => [['tooltip' => true, 'tooltipPlacement' => 'left']];
        yield 'tooltip placement without tooltip' => [['tooltipPlacement' => 'bottom']];
        yield 'unknown variant (Button rule)' => [['variant' => 'ghost']];
        yield 'link with a type (Button rule)' => [['href' => '/x', 'type' => 'button']];
    }
}
