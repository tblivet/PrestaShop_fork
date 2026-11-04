<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

/*
 * Reversible data scenarios for reviewing /ui kit screens (empty-ish to full grids, long names, a limited
 * employee, another language, multistore). Dev shops only. Run it in the PrestaShop container:
 *
 *   php ui/.ai/bin/seed.php list
 *   php ui/.ai/bin/seed.php up <scenario> [--count=N] [--iso=fr]
 *   php ui/.ai/bin/seed.php down <scenario>
 *   php ui/.ai/bin/seed.php status
 *
 * Each "up" records what it created or changed in var/ui-seed/<scenario>.json; "down" undoes exactly that.
 * Generated passwords are written in that file only (var/ is not versioned), never printed.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit(1);
}

$root = dirname(__DIR__, 3);
require $root . '/config/config.inc.php';

if (!_PS_MODE_DEV_) {
    fwrite(STDERR, "Refusing to seed: the shop is not in dev mode.\n");
    exit(1);
}

const SEED_DOMAIN = 'example.test';
const SEED_TAG = 'ui-seed';

$stateDir = $root . '/var/ui-seed';
$context = Context::getContext();
$context->employee = new Employee((int) Db::getInstance()->getValue('SELECT MIN(id_employee) FROM ' . _DB_PREFIX_ . 'employee'));

$scenarios = [
    'customers' => 'N customers (default 1000) for full listings, pagination and filters',
    'products' => 'N simple products (default 200) for full catalog listings',
    'long-names' => 'a customer and a product with maximum-length names, and a long shop name',
    'limited-employee' => 'an employee whose profile can only read Dashboard, Orders and Customers',
    'employee-language' => 'the first employee\'s back office language switched to --iso (default fr, must be installed)',
    'multistore' => 'multistore on with a second shop (experimental: the shop has no copied data)',
];

[$action, $scenario, $options] = parseArguments($argv);

switch ($action) {
    case 'list':
        foreach ($scenarios as $name => $description) {
            echo str_pad($name, 20) . $description . PHP_EOL;
        }
        exit(0);
    case 'status':
        $active = glob($stateDir . '/*.json') ?: [];
        echo $active ? implode(PHP_EOL, array_map(fn ($file) => basename($file, '.json'), $active)) . PHP_EOL : "No scenario is up.\n";
        exit(0);
    case 'up':
    case 'down':
        if (!isset($scenarios[$scenario])) {
            fwrite(STDERR, "Unknown scenario \"$scenario\". Run: php ui/.ai/bin/seed.php list\n");
            exit(1);
        }
        break;
    default:
        fwrite(STDERR, "Usage: php ui/.ai/bin/seed.php list|status|up <scenario>|down <scenario>\n");
        exit(1);
}

$stateFile = $stateDir . '/' . $scenario . '.json';

if ($action === 'up') {
    if (is_file($stateFile)) {
        fwrite(STDERR, "\"$scenario\" is already up; run down first.\n");
        exit(1);
    }
    @mkdir($stateDir, 0775, true);
    $state = ['scenario' => $scenario, 'created' => [], 'configuration' => []];
    // Save as we go, so a failure half way can still be undone
    $save = function () use (&$state, $stateFile): void {
        file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT));
    };
    $up = 'up' . str_replace(' ', '', ucwords(str_replace('-', ' ', $scenario)));
    $up($state, $save, $options);
    $save();
    echo "$scenario is up. Undo with: php ui/.ai/bin/seed.php down $scenario\n";
    exit(0);
}

if (!is_file($stateFile)) {
    echo "$scenario is not up, nothing to undo.\n";
    exit(0);
}
$state = json_decode((string) file_get_contents($stateFile), true);
undo($state);
unlink($stateFile);
echo "$scenario is down.\n";

function parseArguments(array $argv): array
{
    $options = [];
    $positional = [];
    foreach (array_slice($argv, 1) as $argument) {
        if (preg_match('/^--([a-z]+)=(.*)$/', $argument, $match)) {
            $options[$match[1]] = $match[2];
        } else {
            $positional[] = $argument;
        }
    }

    return [$positional[0] ?? '', $positional[1] ?? '', $options];
}

// Global values only: a shop-level write would survive the undo once multistore is on
function setConfiguration(array &$state, string $key, $value): void
{
    $current = Configuration::getGlobalValue($key);
    $state['configuration'][$key] = $current === false ? null : $current;
    Configuration::updateGlobalValue($key, $value);
}

function created(array &$state, string $class, int $id, callable $save): void
{
    $state['created'][] = ['class' => $class, 'id' => $id];
    $save();
}

function letters(int $number): string
{
    $letters = '';
    for (; $number > 0; $number = intdiv($number - 1, 26)) {
        $letters = chr(65 + ($number - 1) % 26) . $letters;
    }

    return $letters;
}

function multilang(string $value): array
{
    return array_fill_keys(array_map('intval', Language::getIDs(false)), $value);
}

function upCustomers(array &$state, callable $save, array $options): void
{
    $count = (int) ($options['count'] ?? 1000);
    $hash = password_hash(bin2hex(random_bytes(12)), PASSWORD_BCRYPT);
    for ($i = 1; $i <= $count; ++$i) {
        $customer = new Customer();
        $customer->firstname = 'Seed';
        // Names refuse digits, so the number is spelled with letters: A, B, … Z, AA, AB…
        $customer->lastname = 'Customer ' . letters($i);
        $customer->email = sprintf('%s-customer-%04d@%s', SEED_TAG, $i, SEED_DOMAIN);
        $customer->passwd = $hash;
        $customer->active = $i % 7 !== 0;
        $customer->newsletter = $i % 3 === 0;
        $customer->add();
        created($state, Customer::class, (int) $customer->id, $save);
    }
}

function upProducts(array &$state, callable $save, array $options): void
{
    $count = (int) ($options['count'] ?? 200);
    for ($i = 1; $i <= $count; ++$i) {
        $product = new Product();
        $product->name = multilang(sprintf('Seed product %04d', $i));
        $product->link_rewrite = multilang(sprintf('seed-product-%04d', $i));
        $product->reference = sprintf('SEED-%04d', $i);
        $product->price = (float) (($i * 37) % 500) + 0.99;
        $product->id_category_default = (int) Configuration::get('PS_HOME_CATEGORY');
        $product->active = $i % 5 !== 0;
        $product->add();
        $product->addToCategories([(int) Configuration::get('PS_HOME_CATEGORY')]);
        StockAvailable::setQuantity((int) $product->id, 0, $i % 4 === 0 ? 0 : $i % 100);
        created($state, Product::class, (int) $product->id, $save);
    }
}

function upLongNames(array &$state, callable $save, array $options): void
{
    $customer = new Customer();
    $customer->firstname = str_repeat('Maximilienne-', 3) . 'Anne';
    $customer->lastname = 'de La Rochefoucauld-Montmorency-Laval-Bourbon-Penthièvre';
    $customer->email = sprintf('%s-long-names-with-a-very-long-local-part@%s', SEED_TAG, SEED_DOMAIN);
    $customer->passwd = password_hash(bin2hex(random_bytes(12)), PASSWORD_BCRYPT);
    $customer->add();
    created($state, Customer::class, (int) $customer->id, $save);

    $product = new Product();
    $name = 'Seed coffret dégustation artisanal grand format édition limitée avec accessoires et emballage cadeau premium inclus';
    $product->name = multilang(mb_substr($name, 0, 128));
    $product->link_rewrite = multilang('seed-long-name-product');
    $product->reference = 'SEED-LONG-REFERENCE-0001';
    $product->price = 1234567.89;
    $product->id_category_default = (int) Configuration::get('PS_HOME_CATEGORY');
    $product->add();
    $product->addToCategories([(int) Configuration::get('PS_HOME_CATEGORY')]);
    created($state, Product::class, (int) $product->id, $save);

    setConfiguration($state, 'PS_SHOP_NAME', 'Maison Dupont et Fils - Épicerie fine artisanale depuis 1887');
    $save();
}

function upLimitedEmployee(array &$state, callable $save, array $options): void
{
    $profile = new Profile();
    $profile->name = multilang('UI seed limited');
    $profile->add();
    created($state, Profile::class, (int) $profile->id, $save);

    foreach (['ADMINDASHBOARD', 'ADMINPARENTORDERS', 'ADMINORDERS', 'ADMINPARENTCUSTOMER', 'ADMINCUSTOMERS'] as $tab) {
        $roleId = (int) Db::getInstance()->getValue(sprintf(
            "SELECT id_authorization_role FROM %sauthorization_role WHERE slug = 'ROLE_MOD_TAB_%s_READ'",
            _DB_PREFIX_,
            $tab
        ));
        if ($roleId) {
            Db::getInstance()->insert('access', ['id_profile' => (int) $profile->id, 'id_authorization_role' => $roleId], false, true, Db::INSERT_IGNORE);
        }
    }

    $password = bin2hex(random_bytes(10)) . 'Aa1!';
    $employee = new Employee();
    $employee->firstname = 'Limited';
    $employee->lastname = 'Seed';
    $employee->email = sprintf('%s-limited@%s', SEED_TAG, SEED_DOMAIN);
    $employee->passwd = password_hash($password, PASSWORD_BCRYPT);
    $employee->id_profile = (int) $profile->id;
    $employee->id_lang = (int) Configuration::get('PS_LANG_DEFAULT');
    $employee->default_tab = (int) Tab::getIdFromClassName('AdminDashboard');
    $employee->active = true;
    $employee->add();
    created($state, Employee::class, (int) $employee->id, $save);
    $state['credentials'] = ['email' => $employee->email, 'password' => $password];
}

function upEmployeeLanguage(array &$state, callable $save, array $options): void
{
    $iso = $options['iso'] ?? 'fr';
    $languageId = (int) Language::getIdByIso($iso);
    if (!$languageId) {
        throw new RuntimeException("Language \"$iso\" is not installed.");
    }
    $employee = Context::getContext()->employee;
    $state['employee'] = ['id' => (int) $employee->id, 'id_lang' => (int) $employee->id_lang];
    $save();
    $employee->id_lang = $languageId;
    $employee->update();
}

function upMultistore(array &$state, callable $save, array $options): void
{
    setConfiguration($state, 'PS_MULTISHOP_FEATURE_ACTIVE', 1);
    $save();

    $mainShop = new Shop((int) Configuration::get('PS_SHOP_DEFAULT'));
    $shop = new Shop();
    $shop->name = 'UI seed shop';
    $shop->id_shop_group = (int) $mainShop->id_shop_group;
    $shop->id_category = (int) $mainShop->id_category;
    $shop->theme_name = $mainShop->theme_name;
    $shop->color = '#7a5af8';
    $shop->active = true;
    $shop->add();
    created($state, Shop::class, (int) $shop->id, $save);

    $mainUrl = $mainShop->getUrls()[0] ?? null;
    $url = new ShopUrl();
    $url->id_shop = (int) $shop->id;
    $url->domain = $mainUrl['domain'] ?? Tools::getHttpHost();
    $url->domain_ssl = $mainUrl['domain_ssl'] ?? Tools::getHttpHost();
    $url->physical_uri = $mainUrl['physical_uri'] ?? '/';
    $url->virtual_uri = 'ui-seed/';
    $url->main = true;
    $url->active = true;
    $url->add();
    created($state, ShopUrl::class, (int) $url->id, $save);
}

function undo(array $state): void
{
    // Last created first, so dependants go before what they depend on
    foreach (array_reverse($state['created'] ?? []) as ['class' => $class, 'id' => $id]) {
        if ($class === Profile::class) {
            Db::getInstance()->delete('access', 'id_profile = ' . (int) $id);
        }
        $object = new $class((int) $id);
        if (Validate::isLoadedObject($object)) {
            $object->delete();
        }
    }

    if (isset($state['employee'])) {
        $employee = new Employee((int) $state['employee']['id']);
        $employee->id_lang = (int) $state['employee']['id_lang'];
        $employee->update();
    }

    foreach ($state['configuration'] ?? [] as $key => $value) {
        if ($value === null) {
            Configuration::deleteByName($key);
        } else {
            Configuration::updateGlobalValue($key, $value);
        }
    }
}
