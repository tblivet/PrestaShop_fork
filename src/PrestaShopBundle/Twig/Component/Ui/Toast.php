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
 * A short notice of what an action that did not reload the page did ("The status has been successfully updated."),
 * shown in the page's <twig:ui:ToastStack> by toast.ts. After a reload, the result is a flash message instead.
 */
#[AsTwigComponent('ui:Toast', template: '@PrestaShop/Admin/Component/Ui/toast.html.twig')]
final class Toast
{
    public const TYPES = ['success', 'info', 'warning', 'danger'];

    public string $type = 'success';

    /** Hidden after the delay, unless the pointer or the focus is on it; never for danger: an error waits to be read */
    public bool $autohide = true;

    /** Milliseconds */
    public int $delay = 5000;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults([
                'type' => 'success',
                'autohide' => true,
                'delay' => 5000,
            ])
            ->setAllowedValues('type', self::TYPES)
            ->setAllowedTypes('autohide', 'bool')
            ->setAllowedTypes('delay', 'int')
            ->setAllowedValues('delay', fn (int $delay): bool => $delay > 0)
            ->setNormalizer('autohide', fn (Options $options, bool $autohide): bool => $autohide && 'danger' !== $options['type'])
        ;

        return $resolver->resolve($data) + $data;
    }

    public function getIcon(): string
    {
        return Alert::STATUS_ICONS[$this->type];
    }
}
