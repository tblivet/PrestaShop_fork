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
 * Top bar of the back office, mirrors ui/src/stories/components/Header.stories.js:
 * <twig:ui:Header homeUrl="…" logo="…" version="9.3.0" :search="{action: '…', types: […]}">
 *   <twig:ui:HeaderAction …/>
 * </twig:ui:Header>
 * The content holds the header actions. Below md, a button opens the side menu (menuId) and the search slides from the top.
 */
#[AsTwigComponent('ui:Header', template: '@PrestaShop/Admin/Component/Ui/header.html.twig')]
final class Header
{
    public string $homeUrl;

    /** URL of the logo image, a dark logo the header shows light */
    public string $logo;

    public ?string $version = null;

    /** Id of the <twig:ui:SideMenu> the menu button opens below md */
    public string $menuId = 'ps-side-menu';

    /**
     * The search form, none without it.
     *
     * @var array{action: string, query: string, type: int, types: list<array{value: int, label: string, placeholder: string}>}|null
     */
    public ?array $search = null;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['homeUrl', 'logo'])
            ->setDefaults(['version' => null, 'menuId' => 'ps-side-menu', 'search' => null])
            ->setAllowedTypes('homeUrl', 'string')
            ->setAllowedTypes('logo', 'string')
            ->setAllowedTypes('version', ['null', 'string'])
            ->setAllowedTypes('menuId', 'string')
            ->setAllowedTypes('search', ['null', 'array'])
            ->setNormalizer('search', fn (Options $options, ?array $search): ?array => null === $search ? null : $this->resolveSearch($search))
        ;

        return $resolver->resolve($data) + $data;
    }

    private function resolveSearch(array $search): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setRequired('action')
            ->setDefaults(['query' => '', 'type' => 0, 'types' => []])
            ->setAllowedTypes('action', 'string')
            ->setAllowedTypes('query', 'string')
            ->setAllowedTypes('type', 'int')
            ->setAllowedTypes('types', 'array')
        ;
        $search = $resolver->resolve($search);

        $type = new OptionsResolver();
        $type
            ->setRequired(['value', 'label', 'placeholder'])
            ->setAllowedTypes('value', 'int')
            ->setAllowedTypes('label', 'string')
            ->setAllowedTypes('placeholder', 'string')
        ;
        $search['types'] = array_map(fn (mixed $item): array => is_array($item) ? $type->resolve($item) : throw new InvalidOptionsException('A search type is an array.'), array_values($search['types']));

        // The chosen type must be one of the list, the first one otherwise (an old or unknown bo_search_type)
        $values = array_column($search['types'], 'value');
        if ([] !== $values && !in_array($search['type'], $values, true)) {
            $search['type'] = $values[0];
        }

        return $search;
    }
}
