<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\DropdownMenu;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class DropdownMenuTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            [
                'align' => 'start',
                'items' => [['type' => 'link', 'label' => 'Edit', 'href' => '/edit', 'icon' => null, 'active' => false, 'disabled' => false, 'external' => false, 'attr' => []]],
            ],
            (new DropdownMenu())->preMount(['items' => [['label' => 'Edit', 'href' => '/edit']]])
        );
    }

    public function testInfersTheItemType(): void
    {
        $items = (new DropdownMenu())->preMount(['items' => [
            ['label' => 'Edit', 'href' => '/edit'],
            ['label' => 'Delete', 'attr' => ['data-ps-action' => 'delete']],
            ['type' => 'divider'],
            ['type' => 'heading', 'label' => 'Export'],
            ['type' => 'text', 'label' => 'Pick a format.'],
        ]])['items'];

        $this->assertSame(['link', 'button', 'divider', 'heading', 'text'], array_column($items, 'type'));
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('row-actions', (new DropdownMenu())->preMount(['items' => [], 'id' => 'row-actions'])['id']);
    }

    public function testItemsAreOptional(): void
    {
        $this->assertSame(['items' => null, 'align' => 'end'], (new DropdownMenu())->preMount(['align' => 'end']));
    }

    #[DataProvider('provideInvalidItems')]
    public function testRejectsInvalidItems(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new DropdownMenu())->preMount($data);
    }

    public static function provideInvalidItems(): iterable
    {
        yield 'unknown alignment' => [['items' => [], 'align' => 'left']];
        yield 'item that is not an array' => [['items' => ['Edit']]];
        yield 'unknown item type' => [['items' => [['type' => 'form', 'label' => 'Delete']]]];
        yield 'item without label' => [['items' => [['href' => '/edit']]]];
        yield 'blank label' => [['items' => [['label' => ' ', 'href' => '/edit']]]];
        yield 'link without href' => [['items' => [['type' => 'link', 'label' => 'Edit']]]];
        yield 'external button' => [['items' => [['type' => 'button', 'label' => 'Print', 'external' => true]]]];
        yield 'submit without form' => [['items' => [['type' => 'submit', 'label' => 'Shipped', 'attr' => ['formaction' => '/status']]]]];
        yield 'submit with a blank form' => [['items' => [['type' => 'submit', 'label' => 'Shipped', 'attr' => ['form' => ' ']]]]];
        yield 'submit with an href' => [['items' => [['type' => 'submit', 'label' => 'Shipped', 'href' => '/status', 'attr' => ['form' => 'order_grid_action_form']]]]];
        yield 'divider with an icon' => [['items' => [['type' => 'divider', 'icon' => 'edit']]]];
        yield 'heading with a link' => [['items' => [['type' => 'heading', 'label' => 'Export', 'href' => '/export']]]];
        yield 'text with an icon' => [['items' => [['type' => 'text', 'label' => 'Pick one.', 'icon' => 'info']]]];
        yield 'text without label' => [['items' => [['type' => 'text']]]];
        yield 'items that are not a list' => [['items' => 'Edit']];
        yield 'invalid attribute name' => [['items' => [['label' => 'Edit', 'href' => '/edit', 'attr' => ['onclick="x"' => '1']]]]];
        yield 'non scalar attribute' => [['items' => [['label' => 'Edit', 'href' => '/edit', 'attr' => ['data-ps-ids' => [1, 2]]]]]];
    }
}
