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
        'error' => ['type' => 'danger', 'icon' => 'bi:x-circle-fill'],
        'failure' => ['type' => 'danger', 'icon' => 'bi:x-circle-fill'],
        'success' => ['type' => 'success', 'icon' => 'bi:check-circle-fill'],
        'warning' => ['type' => 'warning', 'icon' => 'bi:exclamation-triangle-fill'],
        'info' => ['type' => 'info', 'icon' => 'bi:info-circle-fill'],
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
