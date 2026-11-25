<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Form\Ui;

use PrestaShopBundle\Form\Admin\Type\DateRangeType;
use PrestaShopBundle\Form\Admin\Type\IntegerMinMaxFilterType;
use PrestaShopBundle\Form\Admin\Type\NumberMinMaxFilterType;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Twig\Environment;

/**
 * A grid's range filters in the kit form theme (ui_kit_layout.html.twig): named for screen readers, no Bootstrap 4
 * markup, and the same field names as the theme of the pages not on the kit.
 */
class UiKitFilterRangeThemeTest extends KernelTestCase
{
    private const UI_KIT = '@PrestaShop/Admin/TwigTemplateForm/ui_kit_layout.html.twig';
    private const BOOTSTRAP_4 = '@PrestaShop/Admin/TwigTemplateForm/prestashop_ui_kit.html.twig';

    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
        // Form extensions of the back office read the session
        $request = new Request();
        $request->setSession(new Session(new MockArraySessionStorage()));
        static::getContainer()->get('request_stack')->push($request);
    }

    public function testADateRangeIsAFieldsetOfTwoDateFields(): void
    {
        $html = $this->render(self::UI_KIT, 'date_add');

        $this->assertStringContainsString('<fieldset class="ps-filter-range" id="order_date_add"><legend class="visually-hidden">Date</legend>', $html);
        $this->assertMatchesRegularExpression('#<label class="visually-hidden[^"]*" for="order_date_add_from">Start date</label><input type="date" id="order_date_add_from" name="order\[date_add\]\[from\]"#', $html);
        $this->assertMatchesRegularExpression('#<label class="visually-hidden[^"]*" for="order_date_add_to">End date</label><input type="date" id="order_date_add_to" name="order\[date_add\]\[to\]"#', $html);
    }

    public function testAMinMaxFilterLabelsItsFieldsByTheirPlaceholder(): void
    {
        foreach (['total', 'weight'] as $filter) {
            $html = $this->render(self::UI_KIT, $filter);

            $this->assertMatchesRegularExpression('#<label class="visually-hidden[^"]*" for="order_' . $filter . '_min_field">Min</label><input type="(?:number|text)" id="order_' . $filter . '_min_field" name="order\[' . $filter . '\]\[min_field\]"#', $html);
            $this->assertMatchesRegularExpression('#<label class="visually-hidden[^"]*" for="order_' . $filter . '_max_field">Max</label><input type="(?:number|text)" id="order_' . $filter . '_max_field" name="order\[' . $filter . '\]\[max_field\]"#', $html);
        }
    }

    public function testNoBootstrap4MarkupAndTheSameFieldNames(): void
    {
        foreach (['date_add', 'total', 'weight'] as $filter) {
            $kit = $this->render(self::UI_KIT, $filter);

            $this->assertDoesNotMatchRegularExpression('/input-group-append|col-md-|material-icons/', $kit);
            $this->assertSame($this->names($this->render(self::BOOTSTRAP_4, $filter)), $this->names($kit), $filter);
        }
    }

    private function render(string $theme, string $filter): string
    {
        /** @var FormFactoryInterface $factory */
        $factory = static::getContainer()->get('form.factory');
        $form = $factory->createNamedBuilder('order', FormType::class, null, ['csrf_protection' => false])
            ->add('date_add', DateRangeType::class, ['required' => false, 'label' => 'Date'])
            ->add('total', NumberMinMaxFilterType::class, ['required' => false])
            ->add('weight', IntegerMinMaxFilterType::class, ['required' => false])
            ->getForm()
            ->createView();

        $template = $this->twig->createTemplate('{% form_theme form theme %}{{ form_widget(form[filter]) }}');

        return preg_replace('/>\s+</', '><', trim($template->render(['form' => $form, 'theme' => $theme, 'filter' => $filter])));
    }

    /**
     * @return string[]
     */
    private function names(string $html): array
    {
        preg_match_all('/name="([^"]+)"/', $html, $matches);

        return $matches[1];
    }
}
