<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Header;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

class HeaderTest extends TestCase
{
    public function testReadsTheSearchFromTheRequest(): void
    {
        $requests = new RequestStack();
        $requests->push(new Request(['bo_query' => 'shoes', 'bo_search_type' => '3']));
        $header = new Header($requests);

        $this->assertSame('shoes', $header->getSearchQuery());
        $this->assertSame(3, $header->getSearchType());
    }
}
