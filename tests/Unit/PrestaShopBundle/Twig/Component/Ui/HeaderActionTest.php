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
            ['label' => 'View my store', 'icon' => 'storefront', 'href' => '/', 'external' => false, 'items' => null, 'description' => null, 'align' => 'end', 'iconOnly' => false, 'warning' => false],
            (new HeaderAction())->preMount(['label' => 'View my store', 'icon' => 'storefront', 'href' => '/'])
        );
    }

    public function testAcceptsAMenu(): void
    {
        $props = (new HeaderAction())->preMount(['label' => 'Quick access', 'icon' => 'bookmarks', 'items' => [], 'id' => 'account']);

        $this->assertSame([], $props['items']);
        $this->assertSame('account', $props['id']);
    }

    public function testRequiresALabel(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new HeaderAction())->preMount(['icon' => 'storefront', 'href' => '/']);
    }

    public function testRequiresAnIcon(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new HeaderAction())->preMount(['label' => 'Store', 'href' => '/']);
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
        yield 'neither href nor items' => [['label' => 'Store', 'icon' => 'storefront']];
        yield 'href and items' => [['label' => 'Store', 'icon' => 'storefront', 'href' => '/', 'items' => []]];
        yield 'external menu' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'external' => true]];
        yield 'menu with a description' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'description' => 'More']];
        yield 'icon-only menu' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'iconOnly' => true]];
        yield 'non boolean warning' => [['label' => 'Debug', 'icon' => 'bug_report', 'href' => '/', 'warning' => 'yes']];
        yield 'unknown alignment' => [['label' => 'Account', 'icon' => 'person', 'items' => [], 'align' => 'left']];
    }
}
