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
 * The rendered markup must match ui/src/stories/components/Alert.stories.js.
 */
class AlertComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersAToneWithoutIcon(): void
    {
        $html = $this->render('<twig:ui:Alert type="secondary">Plain</twig:ui:Alert>');

        $this->assertStringContainsString('<div class="ps-alert alert alert-secondary" role="status">', $html);
        $this->assertStringContainsString('<div class="ps-alert__content">Plain</div>', $html);
        $this->assertStringNotContainsString('<svg', $html);
        $this->assertStringNotContainsString('btn-close', $html);
    }

    public function testAStatusTypeShowsAndSaysItsIcon(): void
    {
        $html = $this->render('<twig:ui:Alert type="warning">Check it</twig:ui:Alert>');

        $this->assertStringContainsString('class="ps-alert alert alert-warning ps-alert--icon"', $html);
        $this->assertMatchesRegularExpression('#<svg [^>]*class="ps-icon ps-icon--lg ps-alert__icon" role="img" aria-label="Warning">#', $html);
    }

    public function testAToneWithAnIconKeepsItDecorative(): void
    {
        $html = $this->render('<twig:ui:Alert type="primary" icon="info">Tip</twig:ui:Alert>');

        $this->assertStringContainsString('class="ps-alert alert alert-primary ps-alert--icon"', $html);
        $this->assertMatchesRegularExpression('#<svg [^>]*class="ps-icon ps-icon--lg ps-alert__icon" aria-hidden="true">#', $html);
        $this->assertStringNotContainsString('role="img"', $html);
        $this->assertStringNotContainsString('aria-label', $html);
    }

    public function testRendersDismissibleAlertWithIcon(): void
    {
        $html = $this->render('<twig:ui:Alert type="info" icon="info" dismissible data-ps-ref="flash-alert">{{ message }}</twig:ui:Alert>', ['message' => 'Hello']);

        $this->assertStringContainsString('class="ps-alert alert alert-info alert-dismissible fade show ps-alert--icon" role="status" data-ps-ref="flash-alert"', $html);
        $this->assertMatchesRegularExpression('#<svg [^>]*class="ps-icon ps-icon--lg ps-alert__icon" role="img" aria-label="Information">#', $html);
        $this->assertStringContainsString('<div class="ps-alert__content">Hello</div>', $html);
        $this->assertStringContainsString('<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>', $html);
    }

    public function testRendersBorderlessAlert(): void
    {
        $html = $this->render('<twig:ui:Alert type="success" borderless dismissible>Saved</twig:ui:Alert>');

        $this->assertStringContainsString('class="ps-alert alert alert-success ps-alert--borderless alert-dismissible fade show ps-alert--icon"', $html);
    }

    public function testHiddenAlertWithIconHasNoDisplayUtility(): void
    {
        $html = $this->render('<twig:ui:Alert type="danger" hidden><span></span></twig:ui:Alert>');

        $this->assertStringContainsString('class="ps-alert alert alert-danger ps-alert--icon" role="alert" hidden', $html);
        $this->assertStringNotContainsString('d-flex', $html);
    }

    public function testDangerAlertInterruptsScreenReaders(): void
    {
        $html = $this->render('<twig:ui:Alert type="danger">Failed</twig:ui:Alert>');

        $this->assertStringContainsString('<div class="ps-alert alert alert-danger ps-alert--icon" role="alert">', $html);
        $this->assertStringContainsString('aria-label="Error"', $html);
    }

    private function render(string $template, array $context = []): string
    {
        return $this->twig->createTemplate($template)->render($context);
    }
}
