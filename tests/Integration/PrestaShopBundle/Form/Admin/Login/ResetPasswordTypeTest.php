<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Form\Admin\Login;

use PrestaShopBundle\Form\Admin\Login\ResetPasswordType;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

class ResetPasswordTypeTest extends KernelTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        /* @see AlertsTrackingExtension::buildView() reads the flash bag for any root form. */
        $request = new Request();
        $request->setSession(new Session(new MockArraySessionStorage()));
        self::getContainer()->get('request_stack')->push($request);
    }

    public function testMismatchErrorIsOnTheConfirmationField(): void
    {
        $form = $this->submit('Correct-Horse-Battery-1', 'Correct-Horse-Battery-2');

        $this->assertCount(0, $form->get('new_password')->getErrors());
        $this->assertCount(0, $form->get('new_password')->get('first')->getErrors());
        $errors = $form->get('new_password')->get('second')->getErrors();
        $this->assertCount(1, $errors);
        $this->assertSame('The passwords don\'t match.', $errors[0]->getMessage());
    }

    public function testLengthErrorIsOnTheNewPasswordField(): void
    {
        $form = $this->submit('short', 'short');

        $this->assertCount(0, $form->get('new_password')->getErrors());
        $this->assertCount(1, $form->get('new_password')->get('first')->getErrors());
        $this->assertCount(0, $form->get('new_password')->get('second')->getErrors());
    }

    public function testValidPasswordHasNoError(): void
    {
        $form = $this->submit('Correct-Horse-Battery-1', 'Correct-Horse-Battery-1');

        $this->assertTrue($form->isValid());
    }

    private function submit(string $first, string $second): FormInterface
    {
        $form = self::getContainer()->get('form.factory')->create(ResetPasswordType::class, null, ['csrf_protection' => false]);
        $form->submit(['new_password' => ['first' => $first, 'second' => $second]]);

        return $form;
    }
}
