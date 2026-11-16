<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\HeaderAction;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class HeaderActionTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['label' => 'View my store', 'icon' => 'storefront', 'image' => null, 'href' => '/', 'external' => false, 'items' => null, 'description' => null, 'align' => 'end', 'iconOnly' => false, 'warning' => false],
            (new HeaderAction())->preMount(['label' => 'View my store', 'icon' => 'storefront', 'href' => '/'])
        );
    }

    public function testAcceptsAMenuWithAnImage(): void
    {
        $props = (new HeaderAction())->preMount(['label' => 'Marc Beier', 'image' => '/avatar.jpg', 'items' => [], 'id' => 'account']);

        $this->assertSame([], $props['items']);
        $this->assertSame('account', $props['id']);
    }

    public function testRequiresALabel(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new HeaderAction())->preMount(['icon' => 'storefront', 'href' => '/']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new HeaderAction())->preMount($data);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'blank label' => [['label' => ' ', 'icon' => 'storefront', 'href' => '/']];
        yield 'neither icon nor image' => [['label' => 'Store', 'href' => '/']];
        yield 'icon and image' => [['label' => 'Store', 'icon' => 'storefront', 'image' => '/a.jpg', 'href' => '/']];
        yield 'neither href nor items' => [['label' => 'Store', 'icon' => 'storefront']];
        yield 'href and items' => [['label' => 'Store', 'icon' => 'storefront', 'href' => '/', 'items' => []]];
        yield 'external menu' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'external' => true]];
        yield 'menu with a description' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'description' => 'More']];
        yield 'icon-only menu' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'iconOnly' => true]];
        yield 'icon-only with an image' => [['label' => 'Account', 'image' => '/a.jpg', 'href' => '/', 'iconOnly' => true]];
        yield 'non boolean warning' => [['label' => 'Debug', 'icon' => 'bug_report', 'href' => '/', 'warning' => 'yes']];
        yield 'unknown alignment' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'align' => 'left']];
    }
}
