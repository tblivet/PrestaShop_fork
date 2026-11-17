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
 * Bootstrap 5 alert of the /ui kit, mirrors ui/src/stories/components/Alert.stories.js:
 * <twig:ui:Alert type="danger" icon="cancel" dismissible>…</twig:ui:Alert>
 */
#[AsTwigComponent('ui:Alert', template: '@PrestaShop/Admin/Component/Ui/alert.html.twig')]
final class Alert
{
    public const TYPES = ['danger', 'dark', 'info', 'light', 'primary', 'secondary', 'success', 'warning'];

    public string $type = 'info';

    public bool $dismissible = false;

    /** No border around the alert, only its tinted background */
    public bool $borderless = false;

    /** <twig:ui:Icon> name, e.g. "info", shown filled */
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
        ;

        return $resolver->resolve($data) + $data;
    }
}
