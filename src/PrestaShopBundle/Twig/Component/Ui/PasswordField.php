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
 * A password input with its own show/hide button (not a generic icon button: it belongs to the field), mirrors ui/src/stories/components/PasswordField.stories.js.
 * The kit form theme renders every PasswordType through it; by hand:
 * <twig:ui:PasswordField inputId="employee_password"><input type="password" id="employee_password" …></twig:ui:PasswordField>
 * The button behaviour is ui/src/js/components/password-toggle.ts.
 */
#[AsTwigComponent('ui:PasswordField', template: '@PrestaShop/Admin/Component/Ui/password_field.html.twig')]
final class PasswordField
{
    /** id of the password input given as content, which the button shows or hides */
    public string $inputId;

    /** label of the field, in the button's name so two password fields on a page have distinct buttons */
    public ?string $label = null;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('inputId')
            ->setDefault('label', null)
            ->setAllowedTypes('inputId', 'string')
            ->setAllowedTypes('label', ['null', 'string'])
            ->setAllowedValues('inputId', fn (string $inputId): bool => '' !== $inputId)
        ;

        return $resolver->resolve($data) + $data;
    }
}
