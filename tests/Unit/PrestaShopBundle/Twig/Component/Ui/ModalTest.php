<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Modal;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class ModalTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['id' => 'qa', 'title' => 'Add', 'headingLevel' => 2, 'size' => 'md', 'centered' => true, 'scrollable' => false, 'static' => false, 'closable' => true],
            (new Modal())->preMount(['id' => 'qa', 'title' => 'Add'])
        );
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('quick-access', (new Modal())->preMount(['id' => 'qa', 'title' => 'Add', 'data-ps-ref' => 'quick-access'])['data-ps-ref']);
    }

    public function testTakesTheHeadingLevelAsWrittenInTwig(): void
    {
        $this->assertSame(3, (new Modal())->preMount(['id' => 'qa', 'title' => 'Add', 'headingLevel' => '3'])['headingLevel']);
    }

    #[DataProvider('provideMissingProps')]
    public function testRequiresIdAndTitle(array $data): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Modal())->preMount($data);
    }

    public static function provideMissingProps(): iterable
    {
        yield 'no id' => [['title' => 'Add']];
        yield 'no title' => [['id' => 'qa']];
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Modal())->preMount(['id' => 'qa', 'title' => 'Add'] + $data);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'unknown size' => [['size' => 'huge']];
        yield 'heading level 1' => [['headingLevel' => 1]];
        yield 'heading level as a word' => [['headingLevel' => 'three']];
        yield 'non boolean centered' => [['centered' => 'yes']];
        yield 'non boolean static' => [['static' => 1]];
        yield 'non boolean closable' => [['closable' => 'false']];
    }
}
