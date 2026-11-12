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
 * The session's flash messages as <twig:ui:Alert>s, mirrors ui/src/stories/components/FlashMessages.stories.js:
 * <twig:ui:FlashMessages/> or <twig:ui:FlashMessages :types="['error', 'success']" :dismissible="false"/>
 * Reading a type empties it, so each message shows once. Renders nothing when there is none.
 */
#[AsTwigComponent('ui:FlashMessages', template: '@PrestaShop/Admin/Component/Ui/flash_messages.html.twig')]
final class FlashMessages
{
    /** Flash bag type => alert type and icon, in display order */
    public const TYPES = [
        'error' => ['type' => 'danger', 'icon' => 'cancel'],
        'failure' => ['type' => 'danger', 'icon' => 'cancel'],
        'success' => ['type' => 'success', 'icon' => 'check_circle'],
        'warning' => ['type' => 'warning', 'icon' => 'warning'],
        'info' => ['type' => 'info', 'icon' => 'info'],
    ];

    /** @var string[] */
    public array $types = [];

    public bool $dismissible = true;

    /**
     * @return array<string, array{type: string, icon: string}>
     */
    public function getAlerts(): array
    {
        return array_intersect_key(self::TYPES, array_flip($this->types));
    }

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults([
                'types' => array_keys(self::TYPES),
                'dismissible' => true,
            ])
            ->setAllowedTypes('types', 'string[]')
            ->setAllowedTypes('dismissible', 'bool')
            ->setAllowedValues('types', fn (array $types): bool => [] === array_diff($types, array_keys(self::TYPES)))
        ;

        return $resolver->resolve($data) + $data;
    }
}
