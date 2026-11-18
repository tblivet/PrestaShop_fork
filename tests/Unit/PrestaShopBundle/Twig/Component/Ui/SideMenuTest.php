<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\SideMenu;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\Icon;
use Symfony\UX\Icons\IconRegistryInterface;

class SideMenuTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            [
                'label' => null,
                'shopUrl' => null,
                'version' => null,
                'sections' => [[
                    'title' => null,
                    'items' => [['label' => 'Dashboard', 'href' => '/dashboard', 'icon' => 'home', 'current' => false, 'badge' => null, 'children' => []]],
                ]],
            ],
            $this->menu()->preMount(['sections' => [['items' => [['label' => 'Dashboard', 'href' => '/dashboard', 'icon' => 'home']]]]])
        );
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('main-menu', $this->menu()->preMount(['sections' => [], 'id' => 'main-menu'])['id']);
    }

    public function testRequiresSections(): void
    {
        $this->expectException(MissingOptionsException::class);

        $this->menu()->preMount([]);
    }

    #[DataProvider('provideInvalidSections')]
    public function testRejectsInvalidSections(array $sections): void
    {
        $this->expectException(InvalidOptionsException::class);

        $this->menu()->preMount(['sections' => $sections]);
    }

    public static function provideInvalidSections(): iterable
    {
        yield 'item without href or children' => [[['items' => [['label' => 'Orders']]]]];
        yield 'non string title' => [[['title' => 3, 'items' => []]]];
        yield 'non boolean current' => [[['items' => [['label' => 'Orders', 'href' => '/orders', 'current' => 'yes']]]]];
        yield 'blank badge label' => [[['items' => [['label' => 'Orders', 'href' => '/orders', 'badge' => ['label' => ' ']]]]]];
        yield 'badge on a parent' => [[['items' => [['label' => 'Orders', 'badge' => ['label' => 'New'], 'children' => [['label' => 'Invoices', 'href' => '/invoices']]]]]]];
        yield 'non boolean badge logo' => [[['items' => [['label' => 'Orders', 'href' => '/orders', 'badge' => ['label' => 'New', 'logo' => 'yes']]]]]];
    }

    public function testRequiresChildHref(): void
    {
        $this->expectException(MissingOptionsException::class);

        $this->menu()->preMount(['sections' => [['items' => [['label' => 'Orders', 'children' => [['label' => 'Invoices']]]]]]]);
    }

    public function testItemWithChildrenHasNoHref(): void
    {
        $item = $this->menu()->preMount(['sections' => [['items' => [[
            'label' => 'Orders',
            'href' => '/orders',
            'icon' => 'shopping_basket',
            'children' => [['label' => 'Invoices', 'href' => '/invoices', 'current' => true]],
        ]]]]])['sections'][0]['items'][0];

        $this->assertNull($item['href']);
        $this->assertEquals([['label' => 'Invoices', 'href' => '/invoices', 'current' => true, 'badge' => null]], $item['children']);
    }

    #[DataProvider('provideFallbackIcons')]
    public function testFallsBackToTheExtensionIcon(?string $icon): void
    {
        $item = ['label' => 'Module', 'href' => '/module'] + (null === $icon ? [] : ['icon' => $icon]);

        $this->assertSame(SideMenu::FALLBACK_ICON, $this->menu()->preMount(['sections' => [['items' => [$item]]]])['sections'][0]['items'][0]['icon']);
    }

    public static function provideFallbackIcons(): iterable
    {
        yield 'no icon' => [null];
        yield 'not a Material Symbols name' => ['icon-AdminParentModules'];
        yield 'no SVG file' => ['icon_from_an_old_module'];
    }

    public function testResolvesBadges(): void
    {
        $item = $this->menu()->preMount(['sections' => [['items' => [[
            'label' => 'Orders',
            'icon' => 'shopping_basket',
            'children' => [['label' => 'Invoices', 'href' => '/invoices', 'badge' => ['label' => 'New', 'logo' => true]]],
        ], ['label' => 'Marketing', 'href' => '/marketing', 'badge' => ['label' => 'New']]]]]])['sections'][0]['items'];

        $this->assertEquals(['label' => 'New', 'logo' => true], $item[0]['children'][0]['badge']);
        $this->assertEquals(['label' => 'New', 'logo' => false], $item[1]['badge']);
    }

    public function testMapsRenamedMaterialIcons(): void
    {
        $item = ['label' => 'Payment', 'href' => '/payment', 'icon' => 'payment'];

        $this->assertSame('credit_card', $this->menu()->preMount(['sections' => [['items' => [$item]]]])['sections'][0]['items'][0]['icon']);
    }

    private function menu(): SideMenu
    {
        $icons = $this->createMock(IconRegistryInterface::class);
        $icons->method('get')->willReturnCallback(function (string $name): Icon {
            if ('material-symbols:icon-from-an-old-module' === $name) {
                throw new IconNotFoundException($name);
            }

            return new Icon('<path/>');
        });

        return new SideMenu($icons);
    }
}
