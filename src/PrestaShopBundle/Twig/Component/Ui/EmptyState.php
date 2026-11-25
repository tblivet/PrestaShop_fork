<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * What a list or a block shows when it has nothing to show; mirrors ui/src/stories/components/EmptyState.stories.js:
 * <twig:ui:EmptyState icon="shopping_basket" title="{{ 'You have no orders yet'|trans(…) }}">…message…
 *   <twig:block name="actions"><twig:ui:Button href="…">Add new order</twig:ui:Button></twig:block>
 * </twig:ui:EmptyState>
 * The content block is the message, the actions block its buttons, centred in a row that wraps.
 */
#[AsTwigComponent('ui:EmptyState', template: '@PrestaShop/Admin/Component/Ui/empty_state.html.twig')]
final class EmptyState
{
    /** md: a list with nothing yet; sm: inside a card or a table row (no match) */
    public const SIZES = ['md', 'sm'];

    public const HEADING_LEVELS = [2, 3, 4, 5, 6];

    public string $title;

    /** <twig:ui:Icon> name, decorative and neutral (not a warning): the title says it */
    public ?string $icon = null;

    public string $size = 'md';

    /** The title's heading level, after the heading of the block it is in */
    public int $headingLevel = 2;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('title')
            ->setDefaults(['icon' => null, 'size' => 'md', 'headingLevel' => 2])
            ->setAllowedTypes('title', 'string')
            ->setAllowedValues('title', fn (string $title): bool => '' !== trim($title))
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedValues('size', self::SIZES)
            // headingLevel="3" in Twig is a string
            ->setAllowedValues('headingLevel', fn (mixed $level): bool => is_numeric($level) && in_array((int) $level, self::HEADING_LEVELS, true))
            ->setNormalizer('headingLevel', fn (Options $options, int|string $level): int => (int) $level)
        ;

        return $resolver->resolve($data) + $data;
    }
}
