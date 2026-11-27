<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Toast;
use PrestaShopBundle\Twig\Component\Ui\ToastStack;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class ToastTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertSame(['type' => 'success', 'autohide' => true, 'delay' => 5000], (new Toast())->preMount([]));
    }

    public function testADangerToastNeverHidesByItself(): void
    {
        $this->assertFalse((new Toast())->preMount(['type' => 'danger'])['autohide']);
        $this->assertFalse((new Toast())->preMount(['type' => 'danger', 'autohide' => true])['autohide']);
        $this->assertTrue((new Toast())->preMount(['type' => 'warning'])['autohide']);
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('show', (new Toast())->preMount(['class' => 'show'])['class']);
    }

    public function testShowsTheStatusIconOfItsType(): void
    {
        $toast = new Toast();
        $toast->type = 'danger';

        $this->assertSame('cancel', $toast->getIcon());
    }

    public function testRejectsUnknownType(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Toast())->preMount(['type' => 'primary']);
    }

    public function testRejectsANonPositiveDelay(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Toast())->preMount(['delay' => 0]);
    }

    public function testTheStackHasATemplateOfEachType(): void
    {
        $this->assertSame(Toast::TYPES, (new ToastStack())->getTypes());
    }
}
