<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\ConfirmDialog;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class ConfirmDialogTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(['id' => 'ps-confirm-dialog'], (new ConfirmDialog())->preMount([]));
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('page-confirm', (new ConfirmDialog())->preMount(['class' => 'page-confirm'])['class']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new ConfirmDialog())->preMount($data);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'blank id' => [['id' => ' ']];
        yield 'non string id' => [['id' => 3]];
    }
}
