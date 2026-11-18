<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui\Layout;

use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * Equal tiles for repeated items, more per line as the screen widens, mirrors ui/src/stories/layouts/Tiles.stories.js:
 * <twig:ui:Layout:Tiles columns="4">...</twig:ui:Layout:Tiles>
 * The steps per breakpoint live in ui/src/scss/layout/_tiles.scss.
 */
#[AsTwigComponent('ui:Layout:Tiles', template: '@PrestaShop/Admin/Component/Ui/Layout/tiles.html.twig')]
final class Tiles
{
    public const COLUMNS = [2, 3, 4, 6];
    public const ELEMENTS = ['div', 'section', 'ul', 'ol'];

    public int $columns = 3;

    public string $gap = 'md';

    public string $as = 'div';

    /**
     * The block, its columns, and a modifier for each other prop away from its default (layout/_tiles.scss).
     */
    public function getClasses(): string
    {
        $classes = ['ps-tiles', 'ps-tiles--' . $this->columns];

        if ('md' !== $this->gap) {
            $classes[] = 'ps-tiles--gap-' . $this->gap;
        }
        if (in_array($this->as, ['ul', 'ol'], true)) {
            $classes[] = 'ps-tiles--list';
        }

        return implode(' ', $classes);
    }

    /**
     * Rejects values outside the scales; other attributes (class, id...) go through to the rendered element.
     */
    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults(['columns' => 3, 'gap' => 'md', 'as' => 'div'])
            // columns="4" arrives as a string, :columns="4" as an int
            ->setNormalizer('columns', static fn (Options $options, $value) => is_numeric($value) ? (int) $value : $value)
            ->setAllowedValues('columns', array_merge(self::COLUMNS, array_map('strval', self::COLUMNS)))
            ->setAllowedValues('gap', array_keys(Gap::SCALE))
            ->setAllowedValues('as', self::ELEMENTS)
        ;

        return $resolver->resolve($data) + $data;
    }
}
