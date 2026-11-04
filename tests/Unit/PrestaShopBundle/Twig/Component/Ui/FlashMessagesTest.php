<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\FlashMessages;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class FlashMessagesTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertSame(
            ['types' => ['error', 'failure', 'success', 'warning', 'info'], 'dismissible' => true],
            (new FlashMessages())->preMount([])
        );
    }

    public function testAlertsFollowTheDisplayOrderWhateverTheGivenOrder(): void
    {
        $component = new FlashMessages();
        $component->types = ['info', 'error'];

        $this->assertSame(['error', 'info'], array_keys($component->getAlerts()));
        $this->assertSame('danger', $component->getAlerts()['error']['type']);
    }

    public function testRejectsUnknownType(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new FlashMessages())->preMount(['types' => ['notice']]);
    }

    public function testRejectsNonBooleanDismissible(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new FlashMessages())->preMount(['dismissible' => 'no']);
    }
}
