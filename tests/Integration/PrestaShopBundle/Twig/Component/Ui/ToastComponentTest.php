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
 * The rendered markup must match ui/src/stories/components/Toast.stories.js.
 */
class ToastComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersBootstrapsToastWithItsMessage(): void
    {
        $html = $this->render('<twig:ui:Toast>Saved.</twig:ui:Toast>');

        $this->assertStringContainsString('<div class="toast ps-toast ps-toast--success" data-bs-autohide="true" data-bs-delay="5000" data-ps-ref="toast">', $html);
        $this->assertStringContainsString('<div class="toast-body ps-toast__message" data-ps-ref="toast-message">Saved.</div>', $html);
        $this->assertStringContainsString('<button type="button" class="btn-close ps-toast__close" data-bs-dismiss="toast" aria-label="Close"></button>', $html);
        // Not a live region: the page's announcer says the message
        $this->assertStringNotContainsString('role="status"', $html);
        $this->assertStringNotContainsString('aria-live', $html);
    }

    public function testItsIconSaysItsType(): void
    {
        $html = $this->render('<twig:ui:Toast type="danger">Not saved.</twig:ui:Toast>');

        $this->assertMatchesRegularExpression('#<svg [^>]*class="ps-icon ps-icon--lg ps-toast__icon" role="img" aria-label="Error">#', $html);
        $this->assertStringContainsString('data-bs-autohide="false"', $html);
    }

    public function testTakesItsDelayAndOtherAttributes(): void
    {
        $html = $this->render('<twig:ui:Toast type="info" :delay="8000" class="show" id="export-started">Started.</twig:ui:Toast>');

        $this->assertMatchesRegularExpression('#<div class="toast ps-toast ps-toast--info show" data-bs-autohide="true" data-bs-delay="8000" data-ps-ref="toast" id="export-started">#', $html);
    }

    public function testTheStackHoldsATemplateOfEachType(): void
    {
        $html = $this->render('<twig:ui:ToastStack/>');

        $this->assertStringContainsString('<div class="toast-container ps-toast-stack" data-ps-target="toast-stack">', $html);
        foreach (['success', 'info', 'warning', 'danger'] as $type) {
            $this->assertMatchesRegularExpression('#<template data-ps-ref="toast-template" data-ps-data-type="' . $type . '">\s*<div class="toast ps-toast ps-toast--' . $type . '"#', $html);
        }
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
