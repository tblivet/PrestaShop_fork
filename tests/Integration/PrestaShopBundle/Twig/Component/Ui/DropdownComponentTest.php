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
 * The rendered markup must match ui/src/stories/components/Dropdown.stories.js and DropdownMenu.stories.js.
 */
class DropdownComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersATextTriggerAndItsMenu(): void
    {
        $html = $this->render("<twig:ui:Dropdown label=\"Export\" :items=\"[{label: 'CSV', href: '/csv'}]\" align=\"end\"/>");

        $this->assertMatchesRegularExpression('#^<div class="dropdown"><button class="btn btn-primary ps-button" type="button" data-ps-data-busy-label="Loading..." data-bs-toggle="dropdown" aria-expanded="false"><span class="ps-button__label">Export</span><svg #', trim($html));
        $this->assertStringContainsString('<ul class="dropdown-menu ps-dropdown-menu dropdown-menu-end"><li><a class="dropdown-item ps-dropdown-menu__item" href="/csv"><span class="ps-dropdown-menu__label">CSV</span></a></li></ul>', $html);
    }

    public function testRendersAnIconOnlyTriggerThatOpensUp(): void
    {
        $html = $this->render('<twig:ui:Dropdown icon="more_vert" label="More actions" :items="[]" direction="up"/>');

        $this->assertMatchesRegularExpression('#^<div class="dropup"><button class="btn btn-primary ps-button ps-icon-button" type="button" data-ps-data-busy-label="Loading..." aria-label="More actions" data-bs-toggle="dropdown" aria-expanded="false"><svg #', trim($html));
    }

    public function testRendersEveryItemKind(): void
    {
        $html = $this->render("<twig:ui:DropdownMenu :items=\"[{type: 'text', label: 'Pick one.'}, {type: 'heading', label: 'Search in'}, {label: 'Catalog', active: true, attr: {'data-ps-value': '1'}}, {type: 'divider'}, {label: 'Off', href: '/off', disabled: true}, {label: 'Docs', href: 'https://docs', external: true}]\"/>");

        $this->assertStringContainsString('<li><span class="dropdown-item-text">Pick one.</span></li>', $html);
        $this->assertStringContainsString('<li><span class="dropdown-header">Search in</span></li>', $html);
        $this->assertStringContainsString('<button type="button" class="dropdown-item ps-dropdown-menu__item" aria-current="true" data-ps-value="1">', $html);
        $this->assertStringContainsString('<li><hr class="dropdown-divider"></li>', $html);
        $this->assertStringContainsString('<a class="dropdown-item ps-dropdown-menu__item disabled" role="link" aria-disabled="true">', $html);
        $this->assertStringContainsString('target="_blank" rel="noopener noreferrer"><span class="ps-dropdown-menu__label">Docs<span class="visually-hidden"> (opens in a new tab)</span></span></a>', $html);
    }

    public function testRendersItsContentWithoutItems(): void
    {
        $html = $this->render('<twig:ui:DropdownMenu align="end" id="filters"><form><input type="text" name="q"></form></twig:ui:DropdownMenu>');

        $this->assertSame('<div class="dropdown-menu ps-dropdown-menu dropdown-menu-end ps-dropdown-menu--content" id="filters"><form><input type="text" name="q"></form></div>', trim($html));
    }

    public function testEscapesItemAttributeValues(): void
    {
        $html = $this->render('{{ component("ui:DropdownMenu", {items: [{label: "Edit", attr: {"data-ps-name": "\\"><script>"}}]}) }}');

        $this->assertStringNotContainsString('<script>', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
