<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component;

use Error;
use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Action\ActionsBarButton;
use PrestaShop\PrestaShop\Core\Hook\HookDispatcherInterface;
use PrestaShopBundle\Twig\Component\Toolbar;
use PrestaShopBundle\Twig\Layout\MenuBuilder;
use PrestaShopBundle\Twig\Layout\MenuLink;
use ReflectionProperty;

class ToolbarTest extends TestCase
{
    public function testTheKitTitleOfASubPageIsItsGroup(): void
    {
        $toolbar = $this->toolbar('Features', [
            new MenuLink('Attributes', '/attributes', attributes: ['active' => true, 'current' => false]),
            new MenuLink('Features', '/features', attributes: ['active' => true, 'current' => true]),
        ]);

        $this->assertSame('Attributes & Features', $toolbar->getKitTitle());
        $this->assertSame('Features', $toolbar->getTitle());
        $this->assertSame('style', $toolbar->getKitIcon());
    }

    public function testAPageUnderASubPageKeepsItsTitle(): void
    {
        $toolbar = $this->toolbar('New attribute', [
            new MenuLink('Attributes', '/attributes', attributes: ['active' => true, 'current' => true]),
            new MenuLink('Features', '/features', attributes: ['active' => true]),
        ]);
        (new ReflectionProperty(Toolbar::class, 'tabPage'))->setValue($toolbar, false);

        $this->assertSame('New attribute', $toolbar->getKitTitle());
        $this->assertCount(2, $toolbar->getKitPages());
    }

    public function testThePageIconComesBeforeItsGroups(): void
    {
        $toolbar = $this->toolbar('Features', [
            new MenuLink('Attributes', '/attributes', attributes: ['active' => true]),
            new MenuLink('Features', '/features', attributes: ['active' => true, 'current' => true]),
        ]);
        $toolbar->layoutIcon = 'inventory_2';

        $this->assertSame('inventory_2', $toolbar->getKitIcon());
    }

    public function testAPageWithoutSubPagesKeepsItsTitle(): void
    {
        $toolbar = $this->toolbar('Features', [
            new MenuLink('Attributes', '/attributes', attributes: ['active' => false]),
            new MenuLink('Features', '/features', attributes: ['active' => true, 'current' => true]),
        ]);

        $this->assertSame('Features', $toolbar->getKitTitle());
        $this->assertSame('style', $toolbar->getKitIcon());
    }

    public function testAPageWithoutSubPagesTakesItsMenuEntrysIcon(): void
    {
        $toolbar = $this->toolbar('Products', []);
        (new ReflectionProperty(Toolbar::class, 'tabClassName'))->setValue($toolbar, 'AdminProducts');

        $this->assertSame('inventory_2', $toolbar->getKitIcon());
    }

    public function testTheOnlyPageLeftInAGroupTakesItsIcon(): void
    {
        $toolbar = $this->toolbar('Theme & Logo', [new MenuLink('Theme & Logo', '/themes', attributes: ['active' => true, 'current' => true])]);
        (new ReflectionProperty(Toolbar::class, 'tabClassName'))->setValue($toolbar, 'AdminThemes');
        (new ReflectionProperty(Toolbar::class, 'parentTabClassName'))->setValue($toolbar, 'AdminThemesParent');

        $this->assertSame('Theme & Logo', $toolbar->getKitTitle());
        $this->assertSame('brush', $toolbar->getKitIcon());
    }

    public function testModulesAddTheirButtonsAfterThePages(): void
    {
        $hookDispatcher = $this->createMock(HookDispatcherInterface::class);
        $hookDispatcher->method('dispatchWithParameters')->willReturnCallback(function (string $hook, array $parameters): void {
            if ('actionGetAdminToolbarButtons' === $hook) {
                $parameters['toolbar_extra_buttons_collection']->add(new ActionsBarButton('btn-secondary import', ['href' => '/import', 'icon' => 'upload'], 'Import'));
            }
        });
        $toolbar = new Toolbar($hookDispatcher, $this->createMock(MenuBuilder::class));
        (new ReflectionProperty(Toolbar::class, 'layoutHeaderToolbarBtn'))->setValue($toolbar, ['add' => ['href' => '/new', 'desc' => 'Add new', 'icon' => 'add_circle_outline']]);

        $actions = $toolbar->getKitActions();

        $this->assertSame(['Add new', 'Import'], array_column($actions, 'label'));
        $this->assertSame('upload', $actions[1]['icon']);
        $this->assertSame(['id' => 'page-header-desc-configuration-btn-secondary import', 'class' => 'import'], $actions[1]['attr']);
    }

    public function testAModuleThatFailsLeavesTheOtherButtons(): void
    {
        $hookDispatcher = $this->createMock(HookDispatcherInterface::class);
        $hookDispatcher->method('dispatchWithParameters')->willThrowException(new Error('Call to a member function on null'));
        $toolbar = new Toolbar($hookDispatcher, $this->createMock(MenuBuilder::class));
        (new ReflectionProperty(Toolbar::class, 'layoutHeaderToolbarBtn'))->setValue($toolbar, ['add' => ['href' => '/new', 'desc' => 'Add new']]);

        $this->assertSame(['Add new'], array_column($toolbar->getKitActions(), 'label'));
    }

    public function testHelpOpensTheDocumentationNotItsSidebar(): void
    {
        $toolbar = $this->toolbar('Products', []);
        // As generateSidebarLink() builds it: the route encodes the documentation URL, then its slashes once more
        $sidebar = '/admin-dev/common/sidebar/' . strtr(rawurlencode('https://help.prestashop-project.org/en/doc/AdminProducts?version=9.1'), ['%2F' => '%252F']) . '/Help';
        (new ReflectionProperty(Toolbar::class, 'helpLink'))->setValue($toolbar, $sidebar);

        $this->assertSame('https://help.prestashop-project.org/en/doc/AdminProducts?version=9.1', $toolbar->getKitHelp());

        (new ReflectionProperty(Toolbar::class, 'helpLink'))->setValue($toolbar, 'https://docs.example/page');
        $this->assertSame('https://docs.example/page', $toolbar->getKitHelp());
    }

    public function testSubPagesOfAGroupWithoutANameAreNamedAfterThePage(): void
    {
        $toolbar = $this->toolbar('Configuration', [
            new MenuLink('Configuration', '/configuration', attributes: ['active' => true, 'current' => true]),
            new MenuLink('Statistics', '/statistics', attributes: ['active' => true]),
        ]);
        (new ReflectionProperty(Toolbar::class, 'breadcrumbs'))->setValue($toolbar, ['container' => new MenuLink('')]);

        $this->assertSame('Configuration', $toolbar->getKitPagesLabel());
        $this->assertSame('Configuration', $toolbar->getKitTitle());
    }

    /**
     * @param MenuLink[] $navigationTabs
     */
    private function toolbar(string $title, array $navigationTabs): Toolbar
    {
        $toolbar = new Toolbar($this->createMock(HookDispatcherInterface::class), $this->createMock(MenuBuilder::class));
        (new ReflectionProperty(Toolbar::class, 'title'))->setValue($toolbar, $title);
        (new ReflectionProperty(Toolbar::class, 'navigationTabs'))->setValue($toolbar, $navigationTabs);
        (new ReflectionProperty(Toolbar::class, 'parentTabClassName'))->setValue($toolbar, 'AdminParentAttributesGroups');
        (new ReflectionProperty(Toolbar::class, 'breadcrumbs'))->setValue($toolbar, ['container' => new MenuLink('Attributes & Features')]);

        return $toolbar;
    }
}
