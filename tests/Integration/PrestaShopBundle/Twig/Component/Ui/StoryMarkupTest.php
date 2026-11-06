<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Every Storybook story of a <twig:ui:*> component shows the markup the component really renders: each story's Twig code
 * is rendered here and compared with the story's HTML. The stories are read from story-markup.json, written by
 * ui/.ai/bin/story-markup.mjs (CI checks it is up to date). Compared as DOM trees: attribute order, class order and
 * whitespace between tags don't count.
 */
class StoryMarkupTest extends KernelTestCase
{
    /**
     * @dataProvider provideStories
     *
     * @param array{flashes?: array<string, string[]>} $session
     */
    public function testTheStoryShowsWhatTheComponentRenders(string $twig, string $html, array $session): void
    {
        self::bootKernel();
        $container = static::getContainer();

        $request = new Request();
        $request->setSession(new Session(new MockArraySessionStorage()));
        foreach ($session['flashes'] ?? [] as $type => $messages) {
            foreach ($messages as $message) {
                $request->getSession()->getFlashBag()->add($type, $message);
            }
        }
        $container->get('request_stack')->push($request);

        $rendered = $container->get('twig')->createTemplate($twig)->render();

        $this->assertSame(self::canonical($html), self::canonical($rendered));
    }

    public static function provideStories(): iterable
    {
        $stories = json_decode(file_get_contents(__DIR__ . '/story-markup.json'), true, 512, JSON_THROW_ON_ERROR);

        foreach ($stories as $id => $story) {
            yield $id => [$story['twig'], $story['html'], $story['session']];
        }
    }

    /**
     * One element per line, attributes and class names sorted, text with collapsed whitespace, no comments.
     */
    public static function canonical(string $html): string
    {
        $document = new DOMDocument();
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8"><body>' . $html . '</body>', LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $lines = [];
        foreach ($document->getElementsByTagName('body')->item(0)->childNodes as $node) {
            self::describe($node, 0, $lines);
        }

        return implode("\n", $lines);
    }

    /**
     * @param string[] $lines
     */
    private static function describe(DOMNode $node, int $depth, array &$lines): void
    {
        $indent = str_repeat('  ', $depth);

        if ($node instanceof DOMText) {
            $text = trim(preg_replace('/\s+/u', ' ', $node->textContent));
            if ($text !== '') {
                $lines[] = $indent . $text;
            }

            return;
        }

        if (!$node instanceof DOMElement) {
            return;
        }

        $attributes = [];
        foreach ($node->attributes as $attribute) {
            $value = $attribute->value;
            if ($attribute->name === 'class') {
                $classes = preg_split('/\s+/', trim($value), -1, PREG_SPLIT_NO_EMPTY);
                sort($classes);
                $value = implode(' ', $classes);
            }
            $attributes[$attribute->name] = sprintf('%s="%s"', $attribute->name, $value);
        }
        ksort($attributes);

        $lines[] = $indent . '<' . implode(' ', array_merge([$node->tagName], $attributes)) . '>';
        foreach ($node->childNodes as $child) {
            self::describe($child, $depth + 1, $lines);
        }
    }
}
