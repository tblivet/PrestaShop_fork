<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\PasswordField;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class PasswordFieldTest extends TestCase
{
    public function testKeepsTheInputIdAndExtraAttributes(): void
    {
        $this->assertEquals(
            ['inputId' => 'login_passwd', 'label' => null, 'class' => 'mb-0'],
            (new PasswordField())->preMount(['inputId' => 'login_passwd', 'class' => 'mb-0'])
        );
    }

    public function testKeepsTheLabel(): void
    {
        $this->assertSame('New password', (new PasswordField())->preMount(['inputId' => 'pwd', 'label' => 'New password'])['label']);
    }

    public function testRejectsANonStringLabel(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new PasswordField())->preMount(['inputId' => 'pwd', 'label' => 12]);
    }

    public function testRequiresTheInputId(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new PasswordField())->preMount([]);
    }

    public function testRejectsAnEmptyInputId(): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new PasswordField())->preMount(['inputId' => '']);
    }
}
