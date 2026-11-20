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
 * The rendered markup must match ui/src/stories/components/Button.stories.js.
 */
class ButtonComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersAButtonThatSendsNoForm(): void
    {
        $this->assertSame(
            '<button class="btn btn-primary ps-button" type="button" data-ps-data-busy-label="Loading...">Save</button>',
            trim($this->render('<twig:ui:Button>Save</twig:ui:Button>'))
        );
    }

    public function testRendersSubmitButtonWithIconAndAttributes(): void
    {
        $html = $this->render('<twig:ui:Button variant="primary" size="sm" type="submit" icon="add" id="add" class="ms-auto">{{ label }}</twig:ui:Button>', ['label' => 'Add']);

        $this->assertStringStartsWith('<button class="btn btn-primary btn-sm ps-button ms-auto" type="submit" data-ps-data-busy-label="Loading..." id="add">', trim($html));
        $this->assertMatchesRegularExpression('#<svg [^>]*class="ps-icon ps-icon--lg" aria-hidden="true">.*</svg><span class="ps-button__label">Add</span></button>#s', $html);
    }

    public function testRendersIconAfterTheLabel(): void
    {
        $html = $this->render('<twig:ui:Button icon="arrow_forward" iconPosition="end">Next</twig:ui:Button>');

        $this->assertMatchesRegularExpression('#<span class="ps-button__label">Next</span><svg [^>]*class="ps-icon ps-icon--lg"#', $html);
    }

    public function testRendersLoadingState(): void
    {
        $html = $this->render('<twig:ui:Button variant="primary" type="submit" loading>Send</twig:ui:Button>');

        $this->assertStringContainsString('<button class="btn btn-primary ps-button" type="submit" data-ps-data-busy-label="Loading..." data-ps-state="loading" aria-disabled="true"><span class="spinner-border spinner-border-sm" aria-hidden="true" data-ps-ref="submit-spinner"></span>Send<span class="visually-hidden" data-ps-ref="busy-text">Loading...</span></button>', $html);
    }

    public function testSaysItsBusyLabel(): void
    {
        $html = $this->render('<twig:ui:Button loading busyLabel="Installing...">Install</twig:ui:Button>');

        $this->assertStringContainsString('data-ps-data-busy-label="Installing..."', $html);
        $this->assertStringContainsString('<span class="visually-hidden" data-ps-ref="busy-text">Installing...</span>', $html);
    }

    public function testRendersDisabledButton(): void
    {
        $this->assertStringContainsString('<button class="btn btn-destructive ps-button" type="button" data-ps-data-busy-label="Loading..." disabled>Delete</button>', $this->render('<twig:ui:Button variant="destructive" disabled>Delete</twig:ui:Button>'));
    }

    public function testRendersLink(): void
    {
        $this->assertStringContainsString('<a class="btn btn-primary ps-button" href="/new">New</a>', $this->render('<twig:ui:Button variant="primary" href="/new">New</twig:ui:Button>'));
    }

    public function testDisabledLinkLosesItsHref(): void
    {
        $this->assertStringContainsString('<a class="btn btn-primary ps-button disabled" role="link" aria-disabled="true">New</a>', $this->render('<twig:ui:Button href="/new" disabled>New</twig:ui:Button>'));
    }

    public function testRefusesAButtonWithoutLabel(): void
    {
        $this->expectExceptionMessage('<twig:ui:Button> needs a label');

        $this->render('<twig:ui:Button icon="add">  </twig:ui:Button>');
    }

    public function testRendersWithoutContentWhenNamedByAriaLabel(): void
    {
        $this->assertStringContainsString('aria-label="Refresh"></button>', $this->render('<twig:ui:Button aria-label="Refresh"/>'));
    }

    private function render(string $template, array $context = []): string
    {
        return $this->twig->createTemplate($template)->render($context);
    }
}
