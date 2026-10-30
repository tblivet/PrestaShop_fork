/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/navbar/
export default {
  title: 'Components/Navbar',
};

export const Default = {
  render: () => `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Brand</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav1">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav1">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
            <li class="nav-item"><a class="nav-link disabled">Disabled</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
};

export const Dark = {
  render: () => `
    <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Brand</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav2">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav2">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
};

export const WithSearch = {
  render: () => `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Brand</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav3">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav3">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Link</a></li>
          </ul>
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  `,
};

export const WithDropdown = {
  render: () => `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Brand</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Dropdown</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
};
