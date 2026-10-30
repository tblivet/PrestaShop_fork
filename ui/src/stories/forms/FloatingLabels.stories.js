/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/floating-labels/

export default {
  title: 'Forms/FloatingLabels',
};

export const Default = {
  render: () => `
    <div>
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>
    </div>
  `,
};

export const Textarea = {
  render: () => `
    <div class="form-floating">
      <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
      <label for="floatingTextarea2">Comments</label>
    </div>
  `,
};

export const Select = {
  render: () => `
    <div class="form-floating">
      <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
        <option selected>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
      <label for="floatingSelect">Works with selects</label>
    </div>
  `,
};

export const WithValidation = {
  render: () => `
    <div>
      <div class="form-floating mb-3">
        <input type="text" class="form-control is-valid" id="floatingInputValid" placeholder="name@example.com" value="test@example.com">
        <label for="floatingInputValid">Valid input</label>
        <div class="valid-feedback">Looks good!</div>
      </div>
      <div class="form-floating mb-3">
        <input type="email" class="form-control is-invalid" id="floatingInputInvalid" placeholder="name@example.com" value="not-an-email">
        <label for="floatingInputInvalid">Invalid input</label>
        <div class="invalid-feedback">Please enter a valid email address.</div>
      </div>
      <div class="form-floating">
        <select class="form-select is-invalid" id="floatingSelectInvalid" aria-label="Floating label select example">
          <option value="">Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
        <label for="floatingSelectInvalid">Invalid select</label>
        <div class="invalid-feedback">Please select a valid option.</div>
      </div>
    </div>
  `,
};
