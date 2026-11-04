<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Twig\Environment;

/**
 * The rendered markup must match ui/src/stories/components/FlashMessages.stories.js.
 */
class FlashMessagesComponentTest extends KernelTestCase
{
    private Environment $twig;

    private Session $session;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
        $this->session = new Session(new MockArraySessionStorage());
        $request = new Request();
        $request->setSession($this->session);
        static::getContainer()->get('request_stack')->push($request);
    }

    public function testRendersNothingWithoutMessages(): void
    {
        $this->assertSame('', trim($this->render('<twig:ui:FlashMessages/>')));
    }

    public function testRendersOneAlertPerTypeInDisplayOrder(): void
    {
        $this->session->getFlashBag()->add('info', 'Check your inbox.');
        $this->session->getFlashBag()->add('error', 'First error');
        $this->session->getFlashBag()->add('error', 'Second error');

        $html = $this->render('<twig:ui:FlashMessages/>');

        $this->assertStringContainsString('class="ps-flash-messages" data-ps-ref="flash-messages"', $html);
        $this->assertSame(2, substr_count($html, 'data-ps-ref="flash-alert"'));
        $this->assertLessThan(strpos($html, 'alert-info'), strpos($html, 'alert-danger'));
        $this->assertStringContainsString('<p class="mb-0">First error</p>', $html);
        $this->assertStringContainsString('<p class="mb-0">Second error</p>', $html);
        $this->assertStringContainsString('data-bs-dismiss="alert"', $html);
    }

    public function testEachMessageShowsOnce(): void
    {
        $this->session->getFlashBag()->add('success', 'Saved');

        $this->render('<twig:ui:FlashMessages/>');

        $this->assertSame('', trim($this->render('<twig:ui:FlashMessages/>')));
    }

    public function testOnlyPrintsTheGivenTypesAndLeavesTheOthers(): void
    {
        $this->session->getFlashBag()->add('success', 'Saved');
        $this->session->getFlashBag()->add('warning', 'Careful');

        $html = $this->render('<twig:ui:FlashMessages :types="[\'warning\']" :dismissible="false"/>');

        $this->assertStringContainsString('Careful', $html);
        $this->assertStringNotContainsString('Saved', $html);
        $this->assertStringNotContainsString('btn-close', $html);
        $this->assertSame(['Saved'], $this->session->getFlashBag()->peek('success'));
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render([]);
    }
}
