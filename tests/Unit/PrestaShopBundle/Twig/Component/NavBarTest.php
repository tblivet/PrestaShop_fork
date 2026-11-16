<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component;

use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Adapter\LegacyContext;
use PrestaShopBundle\Twig\Component\NavBar;
use PrestaShopBundle\Twig\Layout\MenuBuilder;
use Psr\Log\LoggerInterface;
use ReflectionProperty;

class NavBarTest extends TestCase
{
    public function testCoreTabsTakeTheKitIcons(): void
    {
        $sections = $this->navBar([
            $this->tab('AdminDashboard', 'Dashboard', 'trending_up'),
            $this->tab('SELL', 'Sell', '', [
                $this->tab('AdminParentOrders', 'Orders', 'shopping_basket'),
                $this->tab('AdminParentCustomer', 'Customers', 'account_circle', [$this->tab('AdminCustomers', 'Customers', '')]),
            ]),
            $this->tab('CONFIGURE', 'Configure', '', [
                $this->tab('AdminAdvancedParameters', 'Advanced parameters', 'settings_applications'),
            ]),
        ])->getSections();

        $this->assertSame('home', $sections[0]['items'][0]['icon']);
        $this->assertSame(['shopping_basket', 'group'], array_column($sections[1]['items'], 'icon'));
        $this->assertSame('tune', $sections[2]['items'][0]['icon']);
    }

    public function testModuleTabsKeepTheirIcon(): void
    {
        $sections = $this->navBar([
            $this->tab('IMPROVE', 'Improve', '', [$this->tab('AdminMyModule', 'My module', 'rocket_launch')]),
        ])->getSections();

        $this->assertSame('rocket_launch', $sections[0]['items'][0]['icon']);
    }

    private function navBar(array $tabs): NavBar
    {
        $navBar = new NavBar(
            $this->createMock(LegacyContext::class),
            $this->createMock(LoggerInterface::class),
            $this->createMock(MenuBuilder::class),
            '9.3.0'
        );
        (new ReflectionProperty(NavBar::class, 'tabs'))->setValue($navBar, $tabs);

        return $navBar;
    }

    private function tab(string $className, string $name, string $icon, array $subTabs = []): array
    {
        return [
            'class_name' => $className,
            'name' => $name,
            'icon' => $icon,
            'active' => true,
            'href' => '#' . $className,
            'current' => false,
            'sub_tabs' => $subTabs,
        ];
    }
}
