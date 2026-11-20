<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use LogicException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Button;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class ButtonTest extends TestCase
{
    private const DEFAULTS = [
        'variant' => 'primary',
        'size' => 'md',
        'href' => null,
        'type' => 'button',
        'icon' => null,
        'iconPosition' => 'start',
        'loading' => false,
        'busyLabel' => null,
        'disabled' => false,
    ];

    public function testDefaults(): void
    {
        $this->assertEquals(self::DEFAULTS, (new Button())->preMount([]));
    }

    public function testKeepsExtraAttributes(): void
    {
        $data = ['variant' => 'primary', 'type' => 'submit', 'icon' => 'save', 'loading' => true, 'id' => 'save', 'data-ps-ref' => 'save'];

        $this->assertEquals($data + self::DEFAULTS, (new Button())->preMount($data));
    }

    public function testAcceptsABusyLabel(): void
    {
        $this->assertSame('Installing...', (new Button())->preMount(['loading' => true, 'busyLabel' => 'Installing...'])['busyLabel']);
    }

    public function testAcceptsALink(): void
    {
        $this->assertSame('/admin', (new Button())->preMount(['href' => '/admin', 'disabled' => true])['href']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Button())->preMount($data);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'unknown variant' => [['variant' => 'danger']];
        yield 'unknown size' => [['size' => 'xl']];
        yield 'unknown type' => [['type' => 'link']];
        yield 'unknown icon position' => [['icon' => 'add', 'iconPosition' => 'left']];
        yield 'non boolean loading' => [['loading' => 'yes']];
        yield 'non boolean disabled' => [['disabled' => 1]];
        yield 'link with a type' => [['href' => '/admin', 'type' => 'button']];
        yield 'link loading' => [['href' => '/admin', 'loading' => true]];
        yield 'link with a busy label' => [['href' => '/admin', 'busyLabel' => 'Opening...']];
        yield 'empty busy label' => [['busyLabel' => ' ']];
        yield 'non string busy label' => [['busyLabel' => 42]];
        yield 'non string href' => [['href' => 42]];
        yield 'non string icon' => [['icon' => ['add']]];
    }

    #[DataProvider('provideNamelessContent')]
    public function testRefusesAButtonWithoutName(string $content): void
    {
        $this->expectException(LogicException::class);

        (new Button())->checkLabel($content, false);
    }

    public static function provideNamelessContent(): iterable
    {
        yield 'empty' => [''];
        yield 'spaces' => ["  \n "];
        yield 'markup only' => ['<svg aria-hidden="true"></svg>'];
    }

    public function testAcceptsALabelOrAnAriaLabel(): void
    {
        $this->expectNotToPerformAssertions();

        (new Button())->checkLabel('Save', false);
        (new Button())->checkLabel('', true);
    }
}
