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
 * The rendered markup must match ui/src/stories/components/PasswordField.stories.js.
 */
class PasswordFieldComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testPasswordFieldWrapsTheInputWithAToggle(): void
    {
        $html = $this->render('<twig:ui:PasswordField inputId="pwd"><input type="password" id="pwd" class="form-control"></twig:ui:PasswordField>');

        $this->assertStringContainsString('<div class="ps-password-field input-group has-validation">', $html);
        $this->assertStringContainsString('<input type="password" id="pwd" class="form-control">', $html);
        $this->assertStringContainsString('aria-controls="pwd"', $html);
        $this->assertStringContainsString('aria-pressed="false"', $html);
        $this->assertStringContainsString('data-ps-action="toggle-password"', $html);
        $this->assertStringContainsString('aria-label="Show password"', $html);
        $this->assertStringContainsString('class="ps-icon ps-icon--xl ps-password-field__icon ps-password-field__icon--shown" aria-hidden="true"', $html);
        $this->assertLessThan(strpos($html, '<button'), strpos($html, '<input'));
    }

    public function testTheLabelNamesTheButton(): void
    {
        $html = $this->render('<twig:ui:PasswordField inputId="pwd" label="New password"><input type="password" id="pwd" class="form-control"></twig:ui:PasswordField>');

        $this->assertStringContainsString('aria-label="Show password: New password"', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render([]);
    }
}
