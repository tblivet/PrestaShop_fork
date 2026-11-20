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
 * The rendered markup must match ui/src/stories/components/IconButton.stories.js.
 */
class IconButtonComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersNamedSquareButton(): void
    {
        $html = $this->render('<twig:ui:IconButton icon="delete" label="Delete"/>');

        $this->assertMatchesRegularExpression('#^<button class="btn btn-primary ps-button ps-icon-button" type="button" data-ps-data-busy-label="Loading..." aria-label="Delete"><svg [^>]*class="ps-icon ps-icon--lg" aria-hidden="true">.*</svg></button>$#s', trim($html));
    }

    public function testRendersLinkWithTooltipAndAttributes(): void
    {
        $html = $this->render('<twig:ui:IconButton icon="edit" label="Edit" variant="link" size="sm" href="/edit" tooltip class="link-secondary" data-ps-ref="edit"/>');

        $this->assertStringStartsWith('<a class="btn btn-link btn-sm ps-button ps-icon-button link-secondary" href="/edit" aria-label="Edit" data-bs-toggle="tooltip" data-bs-title="Edit" data-ps-ref="edit">', trim($html));
    }

    public function testPlacesTooltipOnALogicalSide(): void
    {
        $html = $this->render('<twig:ui:IconButton icon="edit" label="Edit" tooltip tooltipPlacement="end"/>');

        $this->assertStringContainsString('data-bs-toggle="tooltip" data-bs-title="Edit" data-bs-placement="right"', $html);
        $this->assertStringNotContainsString('data-bs-placement', $this->render('<twig:ui:IconButton icon="edit" label="Edit" tooltip/>'));
    }

    public function testRendersLoadingState(): void
    {
        $html = $this->render('<twig:ui:IconButton icon="refresh" label="Refresh" loading/>');

        $this->assertStringContainsString('data-ps-state="loading" aria-disabled="true" aria-label="Refresh"><span class="spinner-border spinner-border-sm" aria-hidden="true" data-ps-ref="submit-spinner"></span><svg ', $html);
    }

    public function testPassesItsBusyLabelToTheButton(): void
    {
        $html = $this->render('<twig:ui:IconButton icon="refresh" label="Sync" loading busyLabel="Syncing..."/>');

        $this->assertStringContainsString('data-ps-data-busy-label="Syncing..."', $html);
        $this->assertStringContainsString('<span class="visually-hidden" data-ps-ref="busy-text">Syncing...</span>', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
