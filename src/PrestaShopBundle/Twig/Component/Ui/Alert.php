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
 * Bootstrap 5 alert of the /ui kit, mirrors ui/src/stories/components/Alert.stories.js:
 * <twig:ui:Alert type="danger" icon="cancel" dismissible>…</twig:ui:Alert>
 */
#[AsTwigComponent('ui:Alert', template: '@PrestaShop/Admin/Component/Ui/alert.html.twig')]
final class Alert
{
    /** The types $ps-alert-colors draws (_variables.scss) */
    public const TYPES = ['danger', 'info', 'primary', 'secondary', 'success', 'warning'];

    /** The icon a status type shows when none is given, so the type never rests on its color alone */
    public const STATUS_ICONS = ['danger' => 'cancel', 'info' => 'info', 'success' => 'check_circle', 'warning' => 'warning'];

    public string $type = 'info';

    public bool $dismissible = false;

    /** No border around the alert, only its tinted background */
    public bool $borderless = false;

    /** <twig:ui:Icon> name, shown filled; default: the status icon of danger, info, success and warning, none for the others */
    public ?string $icon = null;

    /**
     * Rejects unknown types; other attributes (class, id…) go through to the rendered element.
     */
    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults([
                'type' => 'info',
                'dismissible' => false,
                'borderless' => false,
                'icon' => null,
            ])
            ->setAllowedValues('type', self::TYPES)
            ->setAllowedTypes('dismissible', 'bool')
            ->setAllowedTypes('borderless', 'bool')
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setNormalizer('icon', fn (Options $options, ?string $icon): ?string => $icon ?? self::STATUS_ICONS[$options['type']] ?? null)
        ;

        return $resolver->resolve($data) + $data;
    }
}
