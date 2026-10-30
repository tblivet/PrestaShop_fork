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
        $this->assertSame(['type' => 'info', 'dismissible' => false, 'icon' => null], (new Alert())->preMount([]));
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame(
            ['type' => 'danger', 'dismissible' => true, 'icon' => 'bi:x-circle-fill', 'class' => 'mb-0'],
            (new Alert())->preMount(['type' => 'danger', 'dismissible' => true, 'icon' => 'bi:x-circle-fill', 'class' => 'mb-0'])
        );
    }

    public function testRejectsUnknownType(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Alert())->preMount(['type' => 'error']);
    }

    public function testRejectsNonBooleanDismissible(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Alert())->preMount(['dismissible' => 'yes']);
    }
}
