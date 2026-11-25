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
 * The rendered markup must match ui/src/stories/components/ShowcaseModal.stories.js.
 */
class ShowcaseModalComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersAStaticModalTheKitOpensAndRecordsClosed(): void
    {
        $html = $this->render('<twig:ui:ShowcaseModal name="attributes_card" title="Create attributes" image="/img/attributes.svg" learnMore="https://docs.example/attributes"><p>Attributes change from one product to another.</p></twig:ui:ShowcaseModal>');

        $this->assertMatchesRegularExpression('#<div id="ps-showcase-attributes-card" class="modal fade ps-modal" tabindex="-1" aria-labelledby="ps-showcase-attributes-card-title" aria-hidden="true" data-bs-backdrop="static" data-ps-ref="showcase-modal" data-ps-data-name="attributes_card" data-ps-data-close-url="[^"]+">#', $html);
        $this->assertStringContainsString('<h2 class="modal-title ps-modal__title" id="ps-showcase-attributes-card-title" data-ps-ref="modal-title">Create attributes</h2>', $html);
        $this->assertStringContainsString('<img class="ps-showcase__image" src="/img/attributes.svg" alt="">', $html);
        $this->assertStringContainsString('<p>Attributes change from one product to another.</p>', $html);
        $this->assertMatchesRegularExpression('#<a href="https://docs.example/attributes" class="icon-link icon-link-hover" target="_blank" rel="noopener noreferrer">Learn more<span class="visually-hidden"> \(opens in a new tab\)</span><svg #', $html);
        $this->assertStringContainsString('data-bs-dismiss="modal">Got it</button>', $html);
    }

    public function testHasNoLinkWithoutLearnMore(): void
    {
        $this->assertStringNotContainsString('icon-link', $this->render('<twig:ui:ShowcaseModal name="features_card" title="Set features" image="/img/f.svg"><p>Text</p></twig:ui:ShowcaseModal>'));
    }

    public function testPostsItsClosingToTheShowcaseCardRoute(): void
    {
        $this->assertStringContainsString('data-ps-data-close-url="/configure/showcase-card/close"', $this->render('<twig:ui:ShowcaseModal name="features_card" title="Set features" image="/img/f.svg"><p>Text</p></twig:ui:ShowcaseModal>'));
    }

    public function testPutsItsActionsBeforeGotIt(): void
    {
        $template = '<twig:ui:ShowcaseModal name="seo-urls_card" title="Improve your SEO" image="/img/s.svg"><p>Text</p><twig:block name="actions">{% if indexPageId %}<twig:ui:Button variant="secondary" href="/index">Configure index page</twig:ui:Button>{% endif %}</twig:block></twig:ui:ShowcaseModal>';

        $html = $this->twig->createTemplate($template)->render(['indexPageId' => 4]);
        $this->assertMatchesRegularExpression('#<div class="modal-footer"><a class="btn btn-secondary ps-button" href="/index">.*Configure index page.*</a>\s*<button [^>]*data-bs-dismiss="modal">Got it</button>#s', $html);
        $this->assertStringNotContainsString('Configure index page', $this->twig->createTemplate($template)->render(['indexPageId' => null]));
    }

    public function testPutsOtherAttributesOnTheModal(): void
    {
        $html = $this->render('<twig:ui:ShowcaseModal name="features_card" title="Set features" image="/img/f.svg" class="ps-showcase--wide" data-test="showcase"><p>Text</p></twig:ui:ShowcaseModal>');

        $this->assertMatchesRegularExpression('#<div id="ps-showcase-features-card" class="modal fade ps-modal ps-showcase--wide" [^>]*data-test="showcase"#', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
