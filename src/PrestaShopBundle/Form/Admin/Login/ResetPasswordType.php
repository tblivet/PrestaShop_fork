<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

namespace PrestaShopBundle\Form\Admin\Login;

use PrestaShop\PrestaShop\Core\ConfigurationInterface;
use PrestaShop\PrestaShop\Core\Security\PasswordPolicyConfiguration;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Contracts\Translation\TranslatorInterface;

class ResetPasswordType extends AbstractType
{
    public function __construct(
        private readonly ConfigurationInterface $configuration,
        private readonly TranslatorInterface $translator,
    ) {
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $maxLength = $this->configuration->get(PasswordPolicyConfiguration::CONFIGURATION_MAXIMUM_LENGTH);
        $minLength = $this->configuration->get(PasswordPolicyConfiguration::CONFIGURATION_MINIMUM_LENGTH);
        $minScore = $this->configuration->get(PasswordPolicyConfiguration::CONFIGURATION_MINIMUM_SCORE);

        $builder
            ->add('new_password', RepeatedType::class, [
                'type' => PasswordType::class,
                'required' => true,
                // Same words as the client-side check, shown under the confirmation field
                'invalid_message' => $this->translator->trans('The passwords don\'t match.', [], 'Admin.Notifications.Error'),
                'error_mapping' => [
                    '.' => 'second',
                ],
                'first_options' => [
                    'label' => $this->translator->trans('New password', [], 'Admin.Advparameters.Feature'),
                    // The same requirement as the strength checklist, from the password policy
                    'help' => $this->translator->trans('Use between %d and %d characters', [$minLength, $maxLength], 'Admin.Advparameters.Feature'),
                    'constraints' => [
                        $this->getLengthConstraint($minLength, $maxLength),
                    ],
                    'attr' => [
                        'data-ps-ref' => 'new-password',
                        'data-minscore' => $minScore,
                        'data-minlength' => $minLength,
                        'data-maxlength' => $maxLength,
                    ],
                ],
                'second_options' => [
                    'label' => $this->translator->trans('Confirm new password', [], 'Admin.Advparameters.Feature'),
                    'help' => '',
                    'attr' => [
                        'data-ps-ref' => 'new-password-confirmation',
                        'data-ps-data-mismatch' => $this->translator->trans('The passwords don\'t match.', [], 'Admin.Notifications.Error'),
                        'data-minscore' => $minScore,
                        'data-minlength' => $minLength,
                        'data-maxlength' => $maxLength,
                    ],
                ],
            ])
            ->add('submit_login', SubmitType::class, [
                'label' => $this->translator->trans('Reset password', [], 'Admin.Login.Feature'),
                'attr' => [
                    'data-ps-ref' => 'reset-password-submit',
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        parent::configureOptions($resolver);
        $resolver->setDefaults([
            'label' => $this->translator->trans('Reset your password', [], 'Admin.Login.Feature'),
            'label_tag_name' => 'h4',
            'form_theme' => '@PrestaShop/Admin/Login/form_theme.html.twig',
            'attr' => [
                'id' => 'reset_password_form',
                'data-ps-ref' => 'reset-password-form',
            ],
            'csrf_message' => $this->translator->trans('This page has expired. Try again.', [], 'Admin.Login.Notification'),
        ]);
    }

    /**
     * Too short or too long, the message gives the rule in the checklist's words
     */
    private function getLengthConstraint(int $minLength, int $maxLength): Length
    {
        $message = $this->translator->trans(
            'Use between %min% and %max% characters.',
            ['%min%' => $minLength, '%max%' => $maxLength],
            'Admin.Login.Notification'
        );

        return new Length([
            'min' => $minLength,
            'max' => $maxLength,
            'minMessage' => $message,
            'maxMessage' => $message,
        ]);
    }
}
