<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\Core\Grid\Column;

use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Grid\Column\Type\Common\ActionColumn;

class ActionColumnTest extends TestCase
{
    public function testConstructor(): void
    {
        $column = new ActionColumn('actions');
        $this->assertEquals('actions', $column->getId());
        $this->assertEquals('', $column->getName());
        // The resolver doesn't call the parent resolver method: only its own options are available by default
        $this->assertEquals([
            'actions' => null,
            'alignment' => 'end',
        ], $column->getOptions());
    }
}
