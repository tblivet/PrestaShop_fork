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
 * A checkbox or a switch with its label, Bootstrap's form-check; mirrors ui/src/stories/forms/Check.stories.js:
 * <twig:ui:Check label="{{ 'Select order #%id%'|trans(…) }}" hideLabel name="order_bulk[]" value="12"/>,
 * <twig:ui:Check type="switch" label="{{ 'Enabled'|trans({}, 'Admin.Global') }}" checked/>.
 * The label is required: hidden, it still names the box for screen readers and is the 24px click target around it.
 * Other attributes (class, data-ps-*, form, aria-*) go on the <input>.
 */
#[AsTwigComponent('ui:Check', template: '@PrestaShop/Admin/Component/Ui/check.html.twig')]
final class Check
{
    /** A switch is a checkbox that turns something on or off at once (role="switch") */
    public const TYPES = ['checkbox', 'switch'];

    private static int $generatedIds = 0;

    public string $label;

    public string $type = 'checkbox';

    /** The label is for screen readers only, where the row or the column already says it (a grid's selection) */
    public bool $hideLabel = false;

    public bool $checked = false;

    public bool $disabled = false;

    public ?string $name = null;

    public ?string $value = null;

    /** Ties the label to the box; generated when none is given */
    public string $id;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('label')
            ->setDefaults(['type' => 'checkbox', 'hideLabel' => false, 'checked' => false, 'disabled' => false, 'name' => null, 'value' => null, 'id' => null])
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedValues('type', self::TYPES)
            ->setAllowedTypes('hideLabel', 'bool')
            ->setAllowedTypes('checked', 'bool')
            ->setAllowedTypes('disabled', 'bool')
            ->setAllowedTypes('name', ['null', 'string'])
            ->setAllowedTypes('value', ['null', 'string', 'int'])
            ->setAllowedTypes('id', ['null', 'string'])
            ->setNormalizer('value', fn ($options, string|int|null $value): ?string => null === $value ? null : (string) $value)
            ->setNormalizer('id', fn ($options, ?string $id): string => $id ?? 'ps-check-' . ++self::$generatedIds)
        ;

        return $resolver->resolve($data) + $data;
    }
}
