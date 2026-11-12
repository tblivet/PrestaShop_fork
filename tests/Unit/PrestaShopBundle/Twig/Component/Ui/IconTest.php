<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Icon;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class IconTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['name' => 'arrow_back', 'label' => null, 'size' => 'md', 'filled' => false, 'flipRtl' => false],
            (new Icon())->preMount(['name' => 'arrow_back'])
        );
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertEquals(
            ['name' => 'warning', 'label' => 'Warning', 'size' => 'lg', 'filled' => true, 'flipRtl' => false, 'class' => 'text-warning'],
            (new Icon())->preMount(['name' => 'warning', 'label' => 'Warning', 'size' => 'lg', 'filled' => true, 'class' => 'text-warning'])
        );
    }

    /**
     * @dataProvider provideIconNames
     */
    public function testMapsTheNameToItsFile(string $name, bool $filled, string $iconName): void
    {
        $icon = new Icon();
        $icon->name = $name;
        $icon->filled = $filled;

        $this->assertSame($iconName, $icon->getIconName());
    }

    public static function provideIconNames(): iterable
    {
        yield 'material symbol' => ['arrow_back', false, 'material-symbols:arrow-back'];
        yield 'filled style' => ['check_circle', true, 'material-symbols:check-circle-fill'];
        yield 'brand logo' => ['brand:github', false, 'brand:github'];
    }

    public function testRequiresAName(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Icon())->preMount([]);
    }

    /**
     * @dataProvider provideInvalidOptions
     */
    public function testRejectsInvalidOptions(array $options): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Icon())->preMount($options);
    }

    public static function provideInvalidOptions(): iterable
    {
        yield 'ux:icon name' => [['name' => 'bi:github']];
        yield 'kebab-case name' => [['name' => 'arrow-back']];
        yield 'uppercase name' => [['name' => 'Arrow_back']];
        yield 'unknown size' => [['name' => 'add', 'size' => 'huge']];
        yield 'filled brand logo' => [['name' => 'brand:github', 'filled' => true]];
        yield 'non-boolean flipRtl' => [['name' => 'arrow_back', 'flipRtl' => 'yes']];
    }
}
