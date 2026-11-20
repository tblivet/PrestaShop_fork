<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Alert;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class AlertTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertSame(['type' => 'info', 'dismissible' => false, 'borderless' => false, 'icon' => 'info'], (new Alert())->preMount([]));
    }

    public function testGivesAStatusTypeItsIcon(): void
    {
        $this->assertSame('cancel', (new Alert())->preMount(['type' => 'danger'])['icon']);
        $this->assertSame('lock', (new Alert())->preMount(['type' => 'danger', 'icon' => 'lock'])['icon']);
        $this->assertNull((new Alert())->preMount(['type' => 'secondary'])['icon']);
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame(
            ['type' => 'danger', 'dismissible' => true, 'borderless' => false, 'icon' => 'cancel', 'data-ps-ref' => 'flash-alert'],
            (new Alert())->preMount(['type' => 'danger', 'dismissible' => true, 'borderless' => false, 'icon' => 'cancel', 'data-ps-ref' => 'flash-alert'])
        );
    }

    public function testRejectsNonBoolBorderless(): void
    {
        $this->expectException(InvalidOptionsException::class);
        (new Alert())->preMount(['borderless' => 'yes']);
    }

    public function testRejectsUnknownType(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Alert())->preMount(['type' => 'error']);
    }

    public function testRejectsTheTypesOutsideTheKitColors(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Alert())->preMount(['type' => 'light']);
    }

    public function testRejectsNonStringIcon(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Alert())->preMount(['icon' => 42]);
    }

    public function testRejectsNonBooleanDismissible(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Alert())->preMount(['dismissible' => 'yes']);
    }
}
