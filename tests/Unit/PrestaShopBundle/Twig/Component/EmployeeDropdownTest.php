<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component;

use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Action\ActionsBarButton;
use PrestaShop\PrestaShop\Core\Context\EmployeeContext;
use PrestaShop\PrestaShop\Core\Hook\HookDispatcherInterface;
use PrestaShopBundle\Twig\Component\EmployeeDropdown;
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\Icon;
use Symfony\UX\Icons\IconRegistryInterface;

class EmployeeDropdownTest extends TestCase
{
    public function testMapsTheModuleLinks(): void
    {
        $this->assertSame(
            [
                ['label' => 'My account', 'href' => 'https://addons.example', 'icon' => 'person', 'external' => true],
                ['label' => 'Help', 'href' => '/help', 'icon' => null, 'external' => false],
                ['label' => 'Legacy', 'href' => '/legacy', 'icon' => null, 'external' => false],
            ],
            $this->dropdown([
                new ActionsBarButton('', ['link' => 'https://addons.example', 'icon' => 'person', 'isExternalLink' => true], 'My account'),
                new ActionsBarButton('', ['link' => '/help'], 'Help'),
                // An icon with no SVG file, and one that is not a Material Symbols name, are left out
                new ActionsBarButton('', ['link' => '/legacy', 'icon' => 'icon_from_an_old_module'], 'Legacy'),
                new ActionsBarButton('', ['link' => '/empty'], ' '),
                new ActionsBarButton('', [], 'No link'),
            ])->getModuleItems()
        );
    }

    public function testCallsTheHookOnce(): void
    {
        $hooks = $this->createMock(HookDispatcherInterface::class);
        $hooks->expects($this->once())->method('dispatchWithParameters');
        $dropdown = new EmployeeDropdown($hooks, $this->createMock(EmployeeContext::class), $this->createMock(IconRegistryInterface::class));

        $dropdown->getModuleItems();
        $dropdown->getDisplayBackOfficeEmployeeMenu();
    }

    private function dropdown(array $links): EmployeeDropdown
    {
        $hooks = $this->createMock(HookDispatcherInterface::class);
        $hooks->method('dispatchWithParameters')->willReturnCallback(function (string $hook, array $parameters) use ($links): void {
            foreach ($links as $link) {
                $parameters['links']->add($link);
            }
        });
        $icons = $this->createMock(IconRegistryInterface::class);
        $icons->method('get')->willReturnCallback(fn (string $name): Icon => 'material-symbols:person' === $name ? new Icon('<path/>') : throw new IconNotFoundException($name));

        return new EmployeeDropdown($hooks, $this->createMock(EmployeeContext::class), $icons);
    }
}
