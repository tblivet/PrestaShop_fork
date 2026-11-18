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
 * Blocks one under the other with one gap, mirrors ui/src/stories/layouts/Stack.stories.js:
 * <twig:ui:Layout:Stack gap="lg">...</twig:ui:Layout:Stack>
 */
#[AsTwigComponent('ui:Layout:Stack', template: '@PrestaShop/Admin/Component/Ui/Layout/stack.html.twig')]
final class Stack
{
    public const ALIGNS = ['stretch', 'start', 'center', 'end'];
    public const ELEMENTS = ['div', 'section', 'ul', 'ol'];

    public string $gap = 'md';

    public string $align = 'stretch';

    public string $as = 'div';

    /**
     * The block and a modifier for each prop away from its default (layout/_stack.scss).
     */
    public function getClasses(): string
    {
        $classes = ['ps-stack'];

        if ('md' !== $this->gap) {
            $classes[] = 'ps-stack--gap-' . $this->gap;
        }
        if ('stretch' !== $this->align) {
            $classes[] = 'ps-stack--align-' . $this->align;
        }
        if (in_array($this->as, ['ul', 'ol'], true)) {
            $classes[] = 'ps-stack--list';
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
            ->setDefaults(['gap' => 'md', 'align' => 'stretch', 'as' => 'div'])
            ->setAllowedValues('gap', array_keys(Gap::SCALE))
            ->setAllowedValues('align', self::ALIGNS)
            ->setAllowedValues('as', self::ELEMENTS)
        ;

        return $resolver->resolve($data) + $data;
    }
}
