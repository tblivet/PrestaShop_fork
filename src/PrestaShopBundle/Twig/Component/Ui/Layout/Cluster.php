<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui\Layout;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * Items side by side, wrapping onto the next line, mirrors ui/src/stories/layouts/Cluster.stories.js:
 * <twig:ui:Layout:Cluster justify="end">...</twig:ui:Layout:Cluster>
 * Groups in a row are nested clusters (justify="between" on the outer one).
 */
#[AsTwigComponent('ui:Layout:Cluster', template: '@PrestaShop/Admin/Component/Ui/Layout/cluster.html.twig')]
final class Cluster
{
    public const JUSTIFIES = ['start', 'end', 'between', 'center'];
    public const ALIGNS = ['center', 'start', 'baseline', 'end'];
    public const STACK_BELOW = ['none', 'sm', 'md'];
    public const ELEMENTS = ['div', 'ul', 'ol'];

    public string $gap = 'sm';

    public string $justify = 'start';

    public string $align = 'center';

    public bool $wrap = true;

    public string $stackBelow = 'none';

    public string $as = 'div';

    public function getClasses(): string
    {
        $classes = ['ps-cluster', 'd-flex', Gap::utility($this->gap)];

        if ($this->stackBelow === 'none') {
            $classes = [...$classes, $this->wrap ? 'flex-wrap' : 'flex-nowrap', 'justify-content-' . $this->justify, 'align-items-' . $this->align];
        } else {
            // Below the breakpoint: one full-width item per line, in reading order; from it: the row
            $breakpoint = $this->stackBelow;
            $classes = [
                ...$classes,
                'flex-column',
                'flex-' . $breakpoint . '-row',
                'flex-' . $breakpoint . ($this->wrap ? '-wrap' : '-nowrap'),
                'justify-content-' . $breakpoint . '-' . $this->justify,
                'align-items-' . $breakpoint . '-' . $this->align,
            ];
        }

        if (in_array($this->as, ['ul', 'ol'], true)) {
            $classes = [...$classes, 'list-unstyled', 'mb-0'];
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
            ->setDefaults(['gap' => 'sm', 'justify' => 'start', 'align' => 'center', 'wrap' => true, 'stackBelow' => 'none', 'as' => 'div'])
            ->setAllowedValues('gap', array_keys(Gap::SCALE))
            ->setAllowedValues('justify', self::JUSTIFIES)
            ->setAllowedValues('align', self::ALIGNS)
            ->setAllowedTypes('wrap', 'bool')
            ->setAllowedValues('stackBelow', self::STACK_BELOW)
            ->setAllowedValues('as', self::ELEMENTS)
        ;

        return $resolver->resolve($data) + $data;
    }
}
