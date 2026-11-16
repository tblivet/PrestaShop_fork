<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Header;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class HeaderTest extends TestCase
{
    private const TYPES = [
        ['value' => 0, 'label' => 'Everywhere', 'placeholder' => 'What are you looking for?'],
        ['value' => 3, 'label' => 'Orders', 'placeholder' => 'Order ID'],
    ];

    public function testDefaults(): void
    {
        $this->assertEquals(
            ['homeUrl' => '/home', 'logo' => '/logo.svg', 'version' => null, 'menuId' => 'ps-side-menu', 'search' => null],
            (new Header())->preMount(['homeUrl' => '/home', 'logo' => '/logo.svg'])
        );
    }

    public function testResolvesTheSearch(): void
    {
        $this->assertEquals(
            ['action' => '/search', 'query' => '', 'type' => 0, 'types' => []],
            (new Header())->preMount(['homeUrl' => '/home', 'logo' => '/logo.svg', 'search' => ['action' => '/search']])['search']
        );
    }

    public function testFallsBackToTheFirstSearchType(): void
    {
        $search = (new Header())->preMount(['homeUrl' => '/home', 'logo' => '/logo.svg', 'search' => ['action' => '/search', 'type' => 42, 'types' => self::TYPES]])['search'];

        $this->assertSame(0, $search['type']);
    }

    public function testKeepsAKnownSearchType(): void
    {
        $search = (new Header())->preMount(['homeUrl' => '/home', 'logo' => '/logo.svg', 'search' => ['action' => '/search', 'type' => 3, 'types' => self::TYPES]])['search'];

        $this->assertSame(3, $search['type']);
    }

    public function testRequiresTheLogo(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Header())->preMount(['homeUrl' => '/home']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data, string $exception): void
    {
        $this->expectException($exception);

        (new Header())->preMount($data + ['homeUrl' => '/home', 'logo' => '/logo.svg']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'search without action' => [['search' => ['query' => 'shoes']], MissingOptionsException::class];
        yield 'search type as a string' => [['search' => ['action' => '/search', 'type' => '3']], InvalidOptionsException::class];
        yield 'search type without placeholder' => [['search' => ['action' => '/search', 'types' => [['value' => 0, 'label' => 'Everywhere']]]], MissingOptionsException::class];
        yield 'search type that is not an array' => [['search' => ['action' => '/search', 'types' => ['Everywhere']]], InvalidOptionsException::class];
        yield 'non string version' => [['version' => 9], InvalidOptionsException::class];
    }
}
