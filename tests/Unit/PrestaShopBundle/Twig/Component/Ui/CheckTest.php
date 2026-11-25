<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Check;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class CheckTest extends TestCase
{
    public function testDefaults(): void
    {
        $props = (new Check())->preMount(['label' => 'Newsletter', 'id' => 'newsletter']);

        $this->assertEquals(
            ['label' => 'Newsletter', 'type' => 'checkbox', 'hideLabel' => false, 'checked' => false, 'disabled' => false, 'name' => null, 'value' => null, 'id' => 'newsletter'],
            $props
        );
    }

    public function testGeneratesADifferentIdForEachCheckWithoutOne(): void
    {
        $first = (new Check())->preMount(['label' => 'Select order #1'])['id'];
        $second = (new Check())->preMount(['label' => 'Select order #1'])['id'];

        $this->assertMatchesRegularExpression('/^ps-check-\d+$/', $first);
        $this->assertNotSame($first, $second);
    }

    public function testTakesANumberAsValue(): void
    {
        $this->assertSame('12', (new Check())->preMount(['label' => 'Select order #12', 'value' => 12])['value']);
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('order_grid', (new Check())->preMount(['label' => 'Select', 'form' => 'order_grid'])['form']);
    }

    public function testRequiresALabel(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Check())->preMount([]);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Check())->preMount($data + ['label' => 'Newsletter']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'blank label' => [['label' => ' ']];
        yield 'unknown type' => [['type' => 'radio']];
        yield 'non boolean hideLabel' => [['hideLabel' => 'yes']];
        yield 'non boolean checked' => [['checked' => 1]];
        yield 'non boolean disabled' => [['disabled' => 'disabled']];
        yield 'non string name' => [['name' => 3]];
        yield 'non scalar value' => [['value' => ['1']]];
        yield 'non string id' => [['id' => 3]];
    }
}
