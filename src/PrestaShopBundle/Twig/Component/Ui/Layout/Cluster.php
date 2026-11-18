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

    /**
     * The block and a modifier for each prop away from its default (layout/_cluster.scss: with stackBelow, the row's
     * justify, align and wrap apply from that breakpoint).
     */
    public function getClasses(): string
    {
        $classes = ['ps-cluster'];

        if ('sm' !== $this->gap) {
            $classes[] = 'ps-cluster--gap-' . $this->gap;
        }
        if ('start' !== $this->justify) {
            $classes[] = 'ps-cluster--justify-' . $this->justify;
        }
        if ('center' !== $this->align) {
            $classes[] = 'ps-cluster--align-' . $this->align;
        }
        if (!$this->wrap) {
            $classes[] = 'ps-cluster--nowrap';
        }
        if ('none' !== $this->stackBelow) {
            $classes[] = 'ps-cluster--stack-below-' . $this->stackBelow;
        }
        if (in_array($this->as, ['ul', 'ol'], true)) {
            $classes[] = 'ps-cluster--list';
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
