<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\HeaderSearch;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class HeaderSearchTest extends TestCase
{
    private const TYPES = [
        ['value' => 0, 'label' => 'Everywhere', 'placeholder' => 'What are you looking for?'],
        ['value' => 3, 'label' => 'Orders', 'placeholder' => 'Order ID'],
    ];

    public function testDefaults(): void
    {
        $this->assertEquals(
            ['action' => '/search', 'query' => '', 'type' => 0, 'types' => [
                ['value' => 0, 'label' => 'Everywhere', 'placeholder' => 'What are you looking for?', 'icon' => null],
                ['value' => 3, 'label' => 'Orders', 'placeholder' => 'Order ID', 'icon' => null],
            ]],
            (new HeaderSearch())->preMount(['action' => '/search', 'types' => self::TYPES])
        );
    }

    public function testFallsBackToTheFirstType(): void
    {
        $this->assertSame(0, (new HeaderSearch())->preMount(['action' => '/search', 'type' => 42, 'types' => self::TYPES])['type']);
    }

    public function testKeepsAKnownType(): void
    {
        $this->assertSame(3, (new HeaderSearch())->preMount(['action' => '/search', 'type' => 3, 'types' => self::TYPES])['type']);
    }

    public function testTypeIconIsOptional(): void
    {
        $types = (new HeaderSearch())->preMount(['action' => '/search', 'types' => [
            ['value' => 0, 'label' => 'Everywhere', 'placeholder' => 'What?', 'icon' => 'search'],
            ['value' => 3, 'label' => 'Orders', 'placeholder' => 'Order ID'],
        ]])['types'];

        $this->assertSame(['search', null], array_column($types, 'icon'));
    }

    public function testPassesOtherAttributesThrough(): void
    {
        $this->assertSame('search', (new HeaderSearch())->preMount(['action' => '/search', 'types' => self::TYPES, 'data-ps-ref' => 'search'])['data-ps-ref']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data, string $exception): void
    {
        $this->expectException($exception);

        (new HeaderSearch())->preMount($data);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'no action' => [['types' => self::TYPES], MissingOptionsException::class];
        yield 'no types' => [['action' => '/search'], MissingOptionsException::class];
        yield 'empty types' => [['action' => '/search', 'types' => []], InvalidOptionsException::class];
        yield 'type as a string' => [['action' => '/search', 'type' => '3', 'types' => self::TYPES], InvalidOptionsException::class];
        yield 'type without placeholder' => [['action' => '/search', 'types' => [['value' => 0, 'label' => 'Everywhere']]], MissingOptionsException::class];
        yield 'type that is not an array' => [['action' => '/search', 'types' => ['Everywhere']], InvalidOptionsException::class];
        yield 'type icon that is not a string' => [['action' => '/search', 'types' => [['value' => 0, 'label' => 'Everywhere', 'placeholder' => 'What?', 'icon' => true]]], InvalidOptionsException::class];
    }
}
