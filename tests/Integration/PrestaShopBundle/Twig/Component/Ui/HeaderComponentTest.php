<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Twig\Environment;

/**
 * The rendered markup must match ui/src/stories/components/Header.stories.js, HeaderAction.stories.js and HeaderSearch.stories.js.
 */
class HeaderComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersTheBarWithItsActions(): void
    {
        $html = $this->render('<twig:ui:Header homeUrl="/home" logo="/logo.svg" version="9.3.0" menuId="main-menu"><twig:block name="actions"><twig:ui:HeaderAction icon="storefront" label="View my store" href="/" external/></twig:block></twig:ui:Header>');

        $this->assertStringStartsWith('<header class="ps-header d-print-none">', trim($html));
        $this->assertStringContainsString('data-bs-target="#main-menu" aria-controls="main-menu" aria-label="Open the menu"', $html);
        $this->assertStringContainsString('<span class="badge ps-badge ps-badge--oceanblue ps-header__version">9.3.0</span>', $html);
        $this->assertStringNotContainsString('ps-header-search', $html);
        $this->assertStringContainsString('<div class="ps-header__start"></div>', $html);
        $this->assertMatchesRegularExpression('#<a class="ps-header__brand" href="/home"><svg [^>]*class="ps-icon ps-icon--xl ps-header__monogram" role="img" aria-label="PrestaShop">.*</svg>\s*<img class="ps-header__logo" src="/logo.svg" alt="PrestaShop"#s', $html);
        $this->assertMatchesRegularExpression('#<div id="header_infos" class="ps-header__actions"><a class="ps-header-action" href="/" target="_blank" rel="noopener noreferrer"><svg [^>]*class="ps-icon ps-icon--xl ps-header-action__icon"#', $html);
    }

    public function testRendersAnIconOnlyLinkWithItsLabelInTheTooltip(): void
    {
        $html = $this->render('<twig:ui:HeaderAction icon="storefront" label="View my shop" href="/" external iconOnly/>');

        $this->assertStringStartsWith('<a class="ps-header-action ps-header-action--icon-only" href="/" target="_blank" rel="noopener noreferrer" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="ps-header-action-tooltip" data-bs-title="View my shop">', trim($html));
    }

    public function testRendersAWarningChip(): void
    {
        $html = $this->render('<twig:ui:HeaderAction icon="build" label="Maintenance mode" href="/maintenance" warning description="Your shop is closed."/>');

        $this->assertStringStartsWith('<a class="ps-header-action ps-header-action--warning" href="/maintenance" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="ps-header-action-tooltip" data-bs-title="Your shop is closed.">', trim($html));
    }

    public function testAnIconOnlyWarningShowsItsLabelAboveItsDescription(): void
    {
        $html = $this->render('<twig:ui:HeaderAction icon="build" label="Maintenance mode" href="/maintenance" warning iconOnly description="Your shop is closed."/>');

        $this->assertStringContainsString('class="ps-header-action ps-header-action--warning ps-header-action--icon-only"', $html);
        $this->assertStringContainsString('data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="ps-header-action-tooltip" data-bs-title="&lt;strong class=&quot;ps-header-action-tooltip__title&quot;&gt;Maintenance mode&lt;/strong&gt;Your shop is closed.">', $html);
    }

    public function testEscapesTheTitledTooltip(): void
    {
        $html = $this->render('<twig:ui:HeaderAction icon="build" label="<b>Mode</b>" href="/m" iconOnly description="<script>x</script>"/>');

        $this->assertStringContainsString('&amp;lt;b&amp;gt;Mode&amp;lt;/b&amp;gt;&lt;/strong&gt;&amp;lt;script&amp;gt;', $html);
    }

    public function testRendersTheStartBlockAfterTheLogo(): void
    {
        $html = $this->render("<twig:ui:Header homeUrl=\"/home\" logo=\"/logo.svg\" version=\"9.3.0\"><twig:block name=\"start\"><twig:ui:HeaderAction icon=\"bookmarks\" label=\"Quick access\" align=\"start\" :items=\"[{label: 'Orders', href: '/orders'}]\"/></twig:block></twig:ui:Header>");

        $this->assertMatchesRegularExpression('#ps-header__version">9.3.0</span>\s*<div class="ps-header__start"><div class="dropdown">\s*<button type="button" class="ps-header-action"#', $html);
        $this->assertStringContainsString('<ul class="dropdown-menu ps-dropdown-menu">', $html);
    }

    public function testRendersTheSearchBlockBeforeTheActions(): void
    {
        $html = $this->render('<twig:ui:Header homeUrl="/home" logo="/logo.svg" version="9.3.0"><twig:block name="search"><twig:ui:HeaderSearch action="/search" :types="[{value: 0, label: \'Everywhere\', placeholder: \'What?\'}]"/></twig:block><twig:block name="actions"><twig:ui:HeaderAction icon="storefront" label="View my store" href="/"/></twig:block></twig:ui:Header>');

        $this->assertMatchesRegularExpression('#<div class="ps-header__start"></div>\s*<div id="ps-header-search" class="ps-header-search offcanvas-md offcanvas-top" tabindex="-1">.*</div>\s*<button type="button" class="ps-header-search__toggle"[^>]*>.*</button>\s*<div id="header_infos" class="ps-header__actions"><a class="ps-header-action"#s', $html);
    }

    public function testShowsNoContentOutsideTheBlocks(): void
    {
        $this->assertStringNotContainsString('Loose', $this->render('<twig:ui:Header homeUrl="/home" logo="/logo.svg" version="9.3.0"><p>Loose</p></twig:ui:Header>'));
    }

    public function testRendersTheSearchWithTheChosenType(): void
    {
        $html = $this->render("<twig:ui:HeaderSearch action=\"/search\" query=\"shoes\" :type=\"3\" :types=\"[{value: 0, label: 'Everywhere', placeholder: 'What?'}, {value: 3, label: 'Orders', placeholder: 'Order ID', icon: 'shopping_basket'}]\"/>");

        $this->assertStringContainsString('<input type="hidden" name="bo_search_type" value="3" data-ps-ref="header-search-type">', $html);
        $this->assertStringContainsString('value="shoes" class="form-control ps-header-search__input" placeholder="Order ID"', $html);
        $this->assertMatchesRegularExpression('#<svg [^>]*class="ps-icon ps-icon--lg ps-header-search__scope-icon" aria-hidden="true" data-ps-ref="header-search-scope-icon">.*</svg>\s*<span class="ps-header-search__scope-label" data-ps-ref="header-search-scope">Orders</span>#s', $html);
        $this->assertStringContainsString('aria-current="true" data-ps-action="set-search-type" data-ps-value="3" data-ps-data-placeholder="Order ID"', $html);
        $this->assertMatchesRegularExpression('#data-ps-value="3"[^>]*><svg [^>]*class="ps-icon ps-icon--lg ps-dropdown-menu__icon"#', $html);
    }

    public function testPassesAttributesToThePanel(): void
    {
        $html = $this->render("<twig:ui:HeaderSearch action=\"/search\" :types=\"[{value: 0, label: 'Everywhere', placeholder: 'What?'}]\" class=\"my-search\"/>");

        $this->assertStringContainsString('<div id="ps-header-search" class="ps-header-search offcanvas-md offcanvas-top my-search" tabindex="-1">', $html);
        $this->assertStringContainsString('placeholder="What?"', $html);
        $this->assertStringContainsString('data-bs-target="#ps-header-search" aria-controls="ps-header-search"', $html);
    }

    public function testRendersAMenuActionAsAButton(): void
    {
        $html = $this->render("<twig:ui:HeaderAction icon=\"bookmarks\" label=\"Quick access\" :items=\"[{label: 'Orders', href: '/orders'}]\"/>");

        $this->assertMatchesRegularExpression('#<button type="button" class="ps-header-action" data-bs-toggle="dropdown" aria-expanded="false"><svg [^>]*class="ps-icon ps-icon--xl ps-header-action__icon"[^>]*>.*</svg>\s*<span class="ps-header-action__label">Quick access</span>#s', $html);
        $this->assertStringContainsString('<ul class="dropdown-menu ps-dropdown-menu dropdown-menu-end">', $html);
    }

    public function testRendersALinkWithItsDescription(): void
    {
        $html = $this->render('<twig:ui:HeaderAction icon="bug_report" label="Debug mode" href="/performance" description="Errors are displayed."/>');

        $this->assertStringContainsString('<a class="ps-header-action" href="/performance" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="ps-header-action-tooltip" data-bs-title="Errors are displayed.">', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
