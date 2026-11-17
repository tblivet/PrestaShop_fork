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

    public function testRendersPlainAlert(): void
    {
        $html = $this->render('<twig:ui:Alert type="warning">Plain</twig:ui:Alert>');

        $this->assertStringContainsString('<div class="ps-alert alert alert-warning" role="status">', $html);
        $this->assertStringContainsString('Plain', $html);
        $this->assertStringNotContainsString('btn-close', $html);
    }

    public function testRendersDismissibleAlertWithIcon(): void
    {
        $html = $this->render('<twig:ui:Alert type="info" icon="info" dismissible class="mb-0">{{ message }}</twig:ui:Alert>', ['message' => 'Hello']);

        $this->assertStringContainsString('class="ps-alert alert alert-info alert-dismissible fade show ps-alert--icon mb-0"', $html);
        $this->assertStringContainsString('role="status"', $html);
        $this->assertStringContainsString('<svg width="1em" height="1em" fill="currentColor" viewBox="0 -960 960 960" class="ps-icon ps-icon--lg ps-alert__icon" aria-hidden="true">', $html);
        $this->assertStringContainsString('<div class="ps-alert__content">Hello</div>', $html);
        $this->assertStringContainsString('data-bs-dismiss="alert"', $html);
    }

    public function testRendersBorderlessAlert(): void
    {
        $html = $this->render('<twig:ui:Alert type="success" borderless dismissible>Saved</twig:ui:Alert>');

        $this->assertStringContainsString('class="ps-alert alert alert-success ps-alert--borderless alert-dismissible fade show"', $html);
    }

    public function testHiddenAlertWithIconHasNoDisplayUtility(): void
    {
        $html = $this->render('<twig:ui:Alert type="danger" icon="cancel" hidden><span></span></twig:ui:Alert>');

        $this->assertStringContainsString('class="ps-alert alert alert-danger ps-alert--icon" role="alert" hidden', $html);
        $this->assertStringNotContainsString('d-flex', $html);
    }

    public function testDangerAlertInterruptsScreenReaders(): void
    {
        $html = $this->render('<twig:ui:Alert type="danger">Failed</twig:ui:Alert>');

        $this->assertStringContainsString('<div class="ps-alert alert alert-danger" role="alert">', $html);
    }

    private function render(string $template, array $context = []): string
    {
        return $this->twig->createTemplate($template)->render($context);
    }
}
