<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Grid\Column;

use Symfony\Component\OptionsResolver\Exception\NoSuchOptionException;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Class AbstractColumn implements reusable column methods.
 */
abstract class AbstractColumn implements ColumnInterface
{
    /**
     * start and end follow the reading direction; left, right and justify are kept for existing definitions
     */
    public const ALIGNMENTS = ['start', 'center', 'end', 'left', 'right', 'justify'];

    /**
     * @var string
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var array
     */
    private $options;

    /**
     * @param string $id
     */
    public function __construct($id)
    {
        $this->id = $id;
        $this->name = '';
    }

    /**
     * {@inheritdoc}
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * {@inheritdoc}
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function setOptions(array $options)
    {
        $this->resolveOptions($options);

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function getOptions()
    {
        if (null === $this->options) {
            $this->resolveOptions();
        }

        return $this->options;
    }

    /**
     * {@inheritdoc}
     */
    public function getOption(string $name)
    {
        if (array_key_exists($name, $this->options)) {
            return $this->options[$name];
        }

        throw new NoSuchOptionException(sprintf('Option "%s" does not exist in "%s"', $name, static::class));
    }

    /**
     * Default column options configuration. You can override or extend it needed options.
     *
     * @param OptionsResolver $resolver
     */
    protected function configureOptions(OptionsResolver $resolver)
    {
        $resolver
            ->setDefaults([
                'sortable' => true,
                'clickable' => false,
                'alignment' => 'start',
                'attr' => [],
            ])
            ->setAllowedTypes('sortable', 'bool')
            ->setAllowedTypes('clickable', 'bool')
            ->setAllowedTypes('alignment', 'string')
            ->setAllowedValues('alignment', self::ALIGNMENTS)
            ->setAllowedTypes('attr', 'array')
        ;
    }

    /**
     * Resolve column options.
     *
     * @param array $options
     */
    private function resolveOptions(array $options = [])
    {
        $resolver = new OptionsResolver();
        $this->configureOptions($resolver);
        // Every column type, its own options or not: an optional width hint for the list's layout. narrow: as narrow as
        // its content; wide: at least a large width; default (or unset): as wide as its heading and values
        $resolver
            ->setDefined('width')
            ->setAllowedValues('width', ['narrow', 'default', 'wide']);

        $this->options = $resolver->resolve($options);
    }
}
