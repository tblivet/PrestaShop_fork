<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Controller\Admin;

use PrestaShop\PrestaShop\Core\Context\ShopContext;
use PrestaShop\PrestaShop\Core\Domain\Employee\Exception\EmployeeNotFoundException;
use PrestaShop\PrestaShop\Core\Form\FormHandlerInterface;
use PrestaShop\PrestaShop\Core\Security\OpenSsl\OpenSSL;
use PrestaShop\PrestaShop\Core\Security\PasswordGenerator;
use PrestaShopBundle\Entity\Employee\Employee;
use PrestaShopBundle\Security\Admin\EmployeeHomepageProvider;
use PrestaShopBundle\Security\Admin\Exception\InvalidResetPasswordTokenException;
use PrestaShopBundle\Security\Admin\Exception\PasswordResetTemporarilyBlockedException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Throwable;

class LoginController extends PrestaShopAdminController
{
    public function __construct(
        private readonly ShopContext $shopContext,
        private readonly string $projectDir,
        private readonly string $adminFolderName,
    ) {
    }

    /**
     * This route and controller are defined in the firewall as login_path and check_path
     * so the controller doesn't need to handle the form submission logic, it is handled
     * internally by the FormLoginAuthenticator
     *
     * See https://symfony.com/doc/current/security.html#form-login
     *
     * @param Security $security
     *
     * @return Response
     */
    public function loginAction(
        Request $request,
        Security $security,
        AuthenticationUtils $authenticationUtils,
        #[Autowire(service: 'prestashop.admin.login.form_handler')]
        FormHandlerInterface $loginFormHandler,
        #[Autowire(service: 'prestashop.admin.request_password_reset.form_handler')]
        FormHandlerInterface $requestResetPasswordFormHandler,
    ): Response {
        $securityResponse = $this->checkRequiredActions($request);
        if ($securityResponse) {
            return $securityResponse;
        }

        if ($security->getUser()) {
            return $this->redirectToRoute('admin_homepage');
        }

        $loginForm = $loginFormHandler->getForm();
        $requestPasswordResetForm = $requestResetPasswordFormHandler->getForm();

        if ($authenticationUtils->getLastAuthenticationError() instanceof AuthenticationException) {
            $this->addFlash('error', $this->trans('The email address or password is incorrect.', [], 'Admin.Login.Notification'));
        }

        return $this->renderLoginPage($loginForm, $requestPasswordResetForm, false);
    }

    /**
     * This controller is not even called since the logout_path is defined in the firewall
     * so the logout path is watched and Symfony handles the logout part and the redirection
     * but we still need to define a route to benefit from the _legacy_link feature so it
     * doesn't hurt to have a consistent controller here anyway.
     *
     * See https://symfony.com/doc/current/security.html#logging-out
     *
     * @param Security $security
     *
     * @return RedirectResponse
     */
    public function logoutAction(Security $security): RedirectResponse
    {
        if ($security->getUser()) {
            $security->logout();
        }

        return $this->redirectToRoute('admin_login');
    }

    /**
     * Automatically redirects to the Employee configured homepage, or AdminDashboard
     * as a fallback, or to the login in case the employee is not logged in.
     */
    public function homepageAction(Security $security, EmployeeHomepageProvider $employeeHomepageProvider): RedirectResponse
    {
        $loggedUser = $security->getUser();
        if ($loggedUser instanceof Employee) {
            return $this->redirect($employeeHomepageProvider->getHomepageUrl());
        }

        return $this->redirectToRoute('admin_login');
    }

    public function requestPasswordResetAction(
        Request $request,
        #[Autowire(service: 'prestashop.admin.login.form_handler')]
        FormHandlerInterface $loginFormHandler,
        #[Autowire(service: 'prestashop.admin.request_password_reset.form_handler')]
        FormHandlerInterface $requestResetPasswordFormHandler,
    ): Response {
        $loginForm = $loginFormHandler->getForm();
        $requestPasswordResetForm = $requestResetPasswordFormHandler->getForm();
        $requestPasswordResetForm->handleRequest($request);

        if ($requestPasswordResetForm->isSubmitted()) {
            if ($requestPasswordResetForm->isValid()) {
                $infoMessage = $errorMessage = null;
                try {
                    $requestResetPasswordFormHandler->save($requestPasswordResetForm->getData());
                    $infoMessage = $this->getPasswordResetRequestedMessage();
                } catch (EmployeeNotFoundException|UserNotFoundException|PasswordResetTemporarilyBlockedException) {
                    // An unknown email, or a known one asking again too soon, gets the same message as a sent link,
                    // so nobody can find out which emails belong to an employee by trying them.
                    // UserNotFoundException is no longer thrown by EmployeePasswordResetter but is still caught for safety.
                    $infoMessage = $this->getPasswordResetRequestedMessage();
                } catch (Throwable) {
                    $errorMessage = $this->trans('We couldn\'t reset your password. Try again later.', [], 'Admin.Login.Notification');
                }

                if (!empty($infoMessage)) {
                    $this->addFlash('info', $infoMessage);
                } elseif (!empty($errorMessage)) {
                    $this->addFlash('error', $errorMessage);
                }

                return $this->redirectToRoute('admin_login');
            }

            return $this->renderLoginPage($loginForm, $requestPasswordResetForm, true);
        }

        return $this->redirectToRoute('admin_login');
    }

    public function resetPasswordAction(
        #[Autowire(service: 'prestashop.admin.reset_password.form_handler')]
        FormHandlerInterface $resetPasswordFormHandler,
        Request $request,
        string $resetToken
    ): Response {
        $resetPasswordForm = $resetPasswordFormHandler->getForm();
        $resetPasswordForm->handleRequest($request);

        if ($resetPasswordForm->isSubmitted() && $resetPasswordForm->isValid()) {
            try {
                $resetPasswordFormHandler->save(array_merge([
                    'resetToken' => $resetToken,
                ], $resetPasswordForm->getData()));
                $this->addFlash('success', $this->trans('Your password has been changed. You can now sign in.', [], 'Admin.Login.Notification'));
            } catch (InvalidResetPasswordTokenException) {
                // Display generic error message with no details why it failed
                $this->addFlash('error', $this->trans('Your reset link has expired. Request a new one.', [], 'Admin.Login.Notification'));

                return $this->redirectToRoute('admin_login');
            } catch (Throwable) {
                $this->addFlash('error', $this->trans('We couldn\'t reset your password. Try again later.', [], 'Admin.Login.Notification'));
            }

            return $this->redirectToRoute('admin_login');
        }

        return $this->render('@PrestaShop/Admin/Login/reset_password.html.twig', [
            'resetPasswordForm' => $resetPasswordForm->createView(),
            'imgDir' => $this->shopContext->getBaseURI() . 'img/',
            'shopName' => $this->getConfiguration()->get('PS_SHOP_NAME'),
        ]);
    }

    private function getPasswordResetRequestedMessage(): string
    {
        return $this->trans('Check your inbox.', [], 'Admin.Login.Notification') . '<br/>'
            . $this->trans('If an account exists for this email address, you\'ll receive a link to reset your password.', [], 'Admin.Login.Notification') . ' '
            . $this->getPasswordResetIntervalMessage((int) ($this->getConfiguration()->get('PS_PASSWD_TIME_BACK') ?: 360));
    }

    /**
     * One sentence per case, since the translator has no plural forms: PS_PASSWD_TIME_BACK is in minutes, 360 by default.
     */
    private function getPasswordResetIntervalMessage(int $minutes): string
    {
        if ($minutes === 60) {
            return $this->trans('You can request a new link every hour.', [], 'Admin.Login.Notification');
        }

        if ($minutes > 60 && $minutes % 60 === 0) {
            return $this->trans('You can request a new link every %count% hours.', ['%count%' => intdiv($minutes, 60)], 'Admin.Login.Notification');
        }

        if ($minutes === 1) {
            return $this->trans('You can request a new link every minute.', [], 'Admin.Login.Notification');
        }

        return $this->trans('You can request a new link every %count% minutes.', ['%count%' => $minutes], 'Admin.Login.Notification');
    }

    protected function renderLoginPage(FormInterface $loginForm, FormInterface $requestPasswordResetForm, bool $showRequestPasswordResetForm): Response
    {
        return $this->render('@PrestaShop/Admin/Login/login.html.twig', [
            'loginForm' => $loginForm->createView(),
            'requestPasswordResetForm' => $requestPasswordResetForm->createView(),
            'showRequestPasswordResetForm' => $showRequestPasswordResetForm,
            'imgDir' => $this->shopContext->getBaseURI() . 'img/',
            'shopName' => $this->getConfiguration()->get('PS_SHOP_NAME'),
        ]);
    }

    protected function checkRequiredActions(Request $request): ?Response
    {
        $requiredActions = [];
        $warningActions = [];

        // If install folder is still present display a warning to remove it
        if (is_dir($this->projectDir . '/install')) {
            $requiredActions[] = $this->trans('Delete the /install folder.', [], 'Admin.Login.Notification');
        }

        // If admin folder is still named admin
        if ($this->adminFolderName === 'admin') {
            $randomName = sprintf(
                'admin%03d%s/',
                mt_rand(0, 999),
                mb_strtolower((new PasswordGenerator(new OpenSSL()))->generatePassword(16)),
            );
            $requiredActions[] = $this->trans('Rename the /admin folder, for example to %s', [$randomName], 'Admin.Login.Notification');
        }

        $sslEnabled = (bool) $this->getConfiguration()->get('PS_SSL_ENABLED');
        if ($sslEnabled && !$request->isSecure()) {
            $maintenanceIpConfiguration = $this->getConfiguration()->get('PS_MAINTENANCE_IP');
            if (empty($maintenanceIpConfiguration)) {
                $maintenanceIps = [];
            } else {
                $maintenanceIps = explode(',', $maintenanceIpConfiguration);
            }

            $maintenanceIps = array_merge(['127.0.0.1', '::1'], $maintenanceIps);
            $isMaintainer = false;
            foreach ($request->getClientIps() as $clientIp) {
                if (in_array($clientIp, $maintenanceIps)) {
                    $isMaintainer = true;
                    break;
                }
            }

            if (!$isMaintainer) {
                $securedUrl = str_replace('http://', 'https://', $this->shopContext->getBaseURL());

                $physicalUri = $this->shopContext->getPhysicalUri();
                if (str_ends_with($securedUrl, $physicalUri)) {
                    $securedUrl = substr($securedUrl, 0, -strlen($physicalUri));
                }

                $securedUrl .= $this->generateUrl('admin_login');

                $requiredActions[] = $this->trans(
                    'SSL is on: [1]sign in over a secure connection (https://)[/1].',
                    ['[1]' => '<a href="' . $securedUrl . '">', '[/1]' => '</a>'],
                    'Admin.Login.Notification'
                );
            } else {
                $warningActions[] = $this->trans('SSL is on, but your IP address is allowed to sign in without it, for maintenance or local access.', [], 'Admin.Login.Notification');
            }
        }

        if (!empty($requiredActions)) {
            return $this->render('@PrestaShop/Admin/Login/required_actions.html.twig', [
                'requiredActions' => $requiredActions,
                'imgDir' => $this->shopContext->getBaseURI() . 'img/',
                'shopName' => $this->getConfiguration()->get('PS_SHOP_NAME'),
            ]);
        }

        // Warning actions are not blocking but should still be indicated to the user
        foreach ($warningActions as $warningAction) {
            $this->addFlash('warning', $warningAction);
        }

        return null;
    }
}
