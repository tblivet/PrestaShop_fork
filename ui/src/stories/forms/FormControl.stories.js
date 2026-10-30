/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/form-control/

export default {
  title: 'Forms/FormControl',
};

export const Default = {
  render: () => `
    <div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
      </div>
      <div class="mb-3">
        <label for="exampleFormControlPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="exampleFormControlPassword1" placeholder="Password">
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput2" class="form-label">URL</label>
        <input type="url" class="form-control" id="exampleFormControlInput2" placeholder="https://example.com">
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput3" class="form-label">Phone</label>
        <input type="tel" class="form-control" id="exampleFormControlInput3" placeholder="+1 555 000 0000">
      </div>
      <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
      </div>
    </div>
  `,
};

export const Sizing = {
  render: () => `
    <div>
      <input class="form-control form-control-lg mb-3" type="text" placeholder=".form-control-lg" aria-label=".form-control-lg example">
      <input class="form-control mb-3" type="text" placeholder="Default input" aria-label="default input example">
      <input class="form-control form-control-sm" type="text" placeholder=".form-control-sm" aria-label=".form-control-sm example">
    </div>
  `,
};

export const Disabled = {
  render: () => `
    <div>
      <input class="form-control mb-3" type="text" placeholder="Disabled input" aria-label="Disabled input example" disabled>
      <input class="form-control" type="text" value="Disabled readonly input" aria-label="Disabled input example" disabled readonly>
    </div>
  `,
};

export const Readonly = {
  render: () => `
    <input class="form-control" type="text" value="Readonly input here..." aria-label="readonly input example" readonly>
  `,
};

export const ReadonlyPlaintext = {
  render: () => `
    <div>
      <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com">
        </div>
      </div>
      <div class="mb-3 row">
        <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm-10">
          <input type="password" class="form-control" id="inputPassword" placeholder="Password">
        </div>
      </div>
    </div>
  `,
};

export const FileInput = {
  render: () => `
    <div>
      <div class="mb-3">
        <label for="formFile" class="form-label">Default file input example</label>
        <input class="form-control" type="file" id="formFile">
      </div>
      <div class="mb-3">
        <label for="formFileMultiple" class="form-label">Multiple files input example</label>
        <input class="form-control" type="file" id="formFileMultiple" multiple>
      </div>
      <div class="mb-3">
        <label for="formFileDisabled" class="form-label">Disabled file input example</label>
        <input class="form-control" type="file" id="formFileDisabled" disabled>
      </div>
      <div class="mb-3">
        <label for="formFileSm" class="form-label">Small file input example</label>
        <input class="form-control form-control-sm" id="formFileSm" type="file">
      </div>
      <div>
        <label for="formFileLg" class="form-label">Large file input example</label>
        <input class="form-control form-control-lg" id="formFileLg" type="file">
      </div>
    </div>
  `,
};

export const ColorInput = {
  render: () => `
    <div>
      <label for="exampleColorInput" class="form-label">Color picker</label>
      <input type="color" class="form-control form-control-color" id="exampleColorInput" value="#563d7c" title="Choose your color">
    </div>
  `,
};

export const Datalist = {
  render: () => `
    <div>
      <label for="exampleDataList" class="form-label">Datalist example</label>
      <input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search...">
      <datalist id="datalistOptions">
        <option value="San Francisco">
        <option value="New York">
        <option value="Seattle">
        <option value="Los Angeles">
        <option value="Chicago">
      </datalist>
    </div>
  `,
};
