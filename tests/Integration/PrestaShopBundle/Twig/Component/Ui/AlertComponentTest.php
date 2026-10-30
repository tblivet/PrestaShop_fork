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

        $this->assertStringContainsString('<div class="alert alert-warning" role="alert">', $html);
        $this->assertStringContainsString('Plain', $html);
        $this->assertStringNotContainsString('btn-close', $html);
    }

    public function testRendersDismissibleAlertWithIcon(): void
    {
        $html = $this->render('<twig:ui:Alert type="info" icon="bi:info-circle-fill" dismissible class="mb-0">{{ message }}</twig:ui:Alert>', ['message' => 'Hello']);

        $this->assertStringContainsString('class="alert alert-info alert-dismissible fade show d-flex align-items-center gap-2 mb-0"', $html);
        $this->assertStringContainsString('<svg', $html);
        $this->assertStringContainsString('<div>Hello</div>', $html);
        $this->assertStringContainsString('data-bs-dismiss="alert"', $html);
    }

    private function render(string $template, array $context = []): string
    {
        return $this->twig->createTemplate($template)->render($context);
    }
}
