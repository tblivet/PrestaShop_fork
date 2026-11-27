<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use PrestaShop\PrestaShop\Core\Kpi\KpiData;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * A key figure in a card, mirrors ui/src/stories/components/Kpi.stories.js:
 * <twig:ui:Kpi title="Conversion rate" value="1.8%" subtitle="30 days" icon="percent" color="oceanblue"/>
 * Its colour tells it from the others of its row (a line on top, the icon's tint). With an href the card is a link;
 * with a refreshUrl, kpi.ts fetches a fresh value when the page loads.
 */
#[AsTwigComponent('ui:Kpi', template: '@PrestaShop/Admin/Component/Ui/kpi.html.twig')]
final class Kpi
{
    /** In the order of a row's places: a KPI takes the colour of its place */
    public const COLORS = ['oceanblue', 'purple', 'amber', 'green'];

    /** Core KPI icons the kit has under another name */
    private const ICONS = ['assessment' => 'monitoring'];

    public string $title;

    /** None or blank: a long dash. Not shown with a refreshUrl: a placeholder stands until the fresh one comes */
    public ?string $value = null;

    /** The period or the scope of the value: "30 days", "All time" */
    public ?string $subtitle = null;

    /** <twig:ui:Icon> name, decorative */
    public ?string $icon = null;

    public string $color = 'oceanblue';

    /** The page the figure comes from: the card is a link to it */
    public ?string $href = null;

    /** The URL kpi.ts fetches a fresh value from (JSON: value) */
    public ?string $refreshUrl = null;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('title')
            ->setDefaults(['value' => null, 'subtitle' => null, 'icon' => null, 'color' => 'oceanblue', 'href' => null, 'refreshUrl' => null])
            ->setAllowedTypes('title', 'string')
            ->setAllowedValues('title', fn (string $title): bool => '' !== trim($title))
            ->setAllowedTypes('value', ['null', 'string'])
            ->setAllowedTypes('subtitle', ['null', 'string'])
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedValues('icon', fn (?string $icon): bool => null === $icon || 1 === preg_match(Icon::MATERIAL_SYMBOL, $icon))
            ->setAllowedValues('color', self::COLORS)
            ->setAllowedTypes('href', ['null', 'string'])
            ->setAllowedTypes('refreshUrl', ['null', 'string'])
        ;

        return $resolver->resolve($data) + $data;
    }

    /**
     * The props of a core KPI (KpiDataInterface) at a place of its row (from 0): the colour of that place, its icon as a
     * kit icon
     *
     * @return array<string, string|null>
     */
    public static function propsFromKpiData(KpiData $kpi, int $place = 0): array
    {
        $icon = null === $kpi->icon ? null : (string) preg_replace('/_outline$/', '', $kpi->icon);

        return [
            'id' => $kpi->id,
            'title' => $kpi->title,
            'value' => $kpi->value,
            'subtitle' => $kpi->subtitle,
            'icon' => null === $icon ? null : self::ICONS[$icon] ?? $icon,
            'color' => self::COLORS[max(0, $place) % count(self::COLORS)],
            'href' => $kpi->href,
            'refreshUrl' => $kpi->refresh ? $kpi->source : null,
        ];
    }
}
