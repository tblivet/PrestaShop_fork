<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * The menu of a Bootstrap dropdown, mirrors ui/src/stories/components/DropdownMenu.stories.js:
 * <twig:ui:DropdownMenu :items="[{label: 'Edit', href: '…', icon: 'edit'}, {type: 'divider'}, {label: 'Delete', …}]"/>
 * or, without items, any markup: <twig:ui:DropdownMenu><form>…</form></twig:ui:DropdownMenu>
 * Placed after a trigger with data-bs-toggle="dropdown"; <twig:ui:Dropdown> renders both.
 */
#[AsTwigComponent('ui:DropdownMenu', template: '@PrestaShop/Admin/Component/Ui/dropdown_menu.html.twig')]
final class DropdownMenu
{
    public const ALIGNMENTS = ['start', 'end'];

    public const ITEM_TYPES = ['button', 'divider', 'heading', 'link', 'text'];

    /**
     * @var list<array{type: string, label: ?string, href: ?string, icon: ?string, active: bool, disabled: bool, external: bool, attr: array<string, string>}>
     *
     * Not set: the menu shows its content instead (a form, text)
     */
    public ?array $items = null;

    /** The side the menu lines up with: end for a trigger at the end of a row */
    public string $align = 'start';

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults(['items' => null, 'align' => 'start'])
            ->setAllowedValues('align', self::ALIGNMENTS)
            ->setAllowedTypes('items', ['null', 'array'])
            ->setNormalizer('items', fn (Options $options, ?array $items): ?array => null === $items ? null : array_map($this->resolveItem(...), array_values($items)))
        ;

        return $resolver->resolve($data) + $data;
    }

    private function resolveItem(mixed $item): array
    {
        if (!is_array($item)) {
            throw new InvalidOptionsException('A dropdown item is an array.');
        }

        $resolver = new OptionsResolver();
        $resolver
            ->setDefaults([
                'type' => null,
                'label' => null,
                'href' => null,
                'icon' => null,
                'active' => false,
                'disabled' => false,
                'external' => false,
                'attr' => [],
            ])
            ->setAllowedValues('type', array_merge([null], self::ITEM_TYPES))
            ->setAllowedTypes('label', ['null', 'string'])
            ->setAllowedTypes('href', ['null', 'string'])
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedTypes('active', 'bool')
            ->setAllowedTypes('disabled', 'bool')
            ->setAllowedTypes('external', 'bool')
            ->setAllowedTypes('attr', 'array')
            // A link goes somewhere, a button acts on the page (data-ps-action in attr)
            ->setNormalizer('type', fn (Options $options, ?string $type): string => $type ?? (null === $options['href'] ? 'button' : 'link'))
        ;
        $item = $resolver->resolve($item);

        if (in_array($item['type'], ['divider', 'heading', 'text'], true) && (null !== $item['href'] || null !== $item['icon'] || $item['active'] || $item['disabled'] || $item['external'])) {
            throw new InvalidOptionsException(sprintf('A %s item only takes a label.', $item['type']));
        }
        if ('divider' !== $item['type'] && (null === $item['label'] || '' === trim($item['label']))) {
            throw new InvalidOptionsException(sprintf('A %s item needs a label.', $item['type']));
        }
        if ('link' === $item['type'] && null === $item['href']) {
            throw new InvalidOptionsException('A link item needs an href.');
        }
        foreach ($item['attr'] as $name => $value) {
            if (!is_string($name) || !preg_match('/^[a-z][a-z0-9-]*$/', $name) || !is_scalar($value)) {
                throw new InvalidOptionsException('Item attributes are name => value pairs such as "data-ps-action" => "…".');
            }
        }
        if ('button' === $item['type'] && (null !== $item['href'] || $item['external'])) {
            throw new InvalidOptionsException('A button item takes no href and does not open a tab: make it a link.');
        }

        return $item;
    }
}
