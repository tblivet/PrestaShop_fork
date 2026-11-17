<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * Small label for a state, a count or a flag, mirrors ui/src/stories/components/Badge.stories.js:
 * <twig:ui:Badge variant="success" icon="check">Paid</twig:ui:Badge>, <twig:ui:Badge counter>3</twig:ui:Badge>.
 * The text is the content block. Its size follows the text around it.
 */
#[AsTwigComponent('ui:Badge', template: '@PrestaShop/Admin/Component/Ui/badge.html.twig')]
final class Badge
{
    /** The Bootstrap theme colors, then the kit palette colors (oceanblue: the light brand blue of the current menu entry) */
    public const VARIANTS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'oceanblue', 'purple', 'amber'];

    public string $variant = 'primary';

    /** <twig:ui:Icon> name, decorative: the text says the state, the icon only repeats it */
    public ?string $icon = null;

    public bool $pill = false;

    /** A number: round while short, a pill as it grows */
    public bool $counter = false;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults(['variant' => 'primary', 'icon' => null, 'pill' => false, 'counter' => false])
            ->setAllowedValues('variant', self::VARIANTS)
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedTypes('pill', 'bool')
            ->setAllowedTypes('counter', 'bool')
        ;

        return $resolver->resolve($data) + $data;
    }
}
