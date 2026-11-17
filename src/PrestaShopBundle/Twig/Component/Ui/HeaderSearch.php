<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * The search of <twig:ui:Header>, in its search block; mirrors ui/src/stories/components/HeaderSearch.stories.js:
 * <twig:ui:HeaderSearch action="…" :type="0" :types="[{value: 0, label: '…', placeholder: '…', icon: '…'}]"/>
 * In the bar from md up; below, a button that opens it as a panel sliding from the top.
 */
#[AsTwigComponent('ui:HeaderSearch', template: '@PrestaShop/Admin/Component/Ui/header_search.html.twig')]
final class HeaderSearch
{
    /** Where the form posts bo_query and bo_search_type */
    public string $action;

    public string $query = '';

    /** The chosen type's value; the first type when it is not in the list */
    public int $type = 0;

    /**
     * Where to search, picked in a menu after the field; at least one.
     *
     * @var list<array{value: int, label: string, placeholder: string, icon: string|null}>
     */
    public array $types;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['action', 'types'])
            ->setDefaults(['query' => '', 'type' => 0])
            ->setAllowedTypes('action', 'string')
            ->setAllowedTypes('query', 'string')
            ->setAllowedTypes('type', 'int')
            ->setAllowedTypes('types', 'array')
            ->setAllowedValues('types', fn (array $types): bool => [] !== $types)
        ;
        $resolved = $resolver->resolve($data);

        $type = new OptionsResolver();
        $type
            ->setRequired(['value', 'label', 'placeholder'])
            ->setDefault('icon', null)
            ->setAllowedTypes('value', 'int')
            ->setAllowedTypes('label', 'string')
            ->setAllowedTypes('placeholder', 'string')
            ->setAllowedTypes('icon', ['null', 'string'])
        ;
        $resolved['types'] = array_map(fn (mixed $item): array => is_array($item) ? $type->resolve($item) : throw new InvalidOptionsException('A search type is an array.'), array_values($resolved['types']));

        // An old or unknown bo_search_type
        $values = array_column($resolved['types'], 'value');
        if (!in_array($resolved['type'], $values, true)) {
            $resolved['type'] = $values[0];
        }

        return $resolved + $data;
    }
}
