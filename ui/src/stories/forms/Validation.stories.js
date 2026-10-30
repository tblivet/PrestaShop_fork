/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/validation/

export default {
  title: 'Forms/Validation',
};

export const ServerSide = {
  render: () => `
    <form>
      <div class="row g-3">
        <div class="col-md-4">
          <label for="validationServer01" class="form-label">First name</label>
          <input type="text" class="form-control is-valid" id="validationServer01" value="Mark" required>
          <div class="valid-feedback">Looks good!</div>
        </div>
        <div class="col-md-4">
          <label for="validationServer02" class="form-label">Last name</label>
          <input type="text" class="form-control is-valid" id="validationServer02" value="Otto" required>
          <div class="valid-feedback">Looks good!</div>
        </div>
        <div class="col-md-4">
          <label for="validationServerUsername" class="form-label">Username</label>
          <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend3">@</span>
            <input type="text" class="form-control is-invalid" id="validationServerUsername" aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback" required>
            <div class="invalid-feedback" id="validationServerUsernameFeedback">Please choose a username.</div>
          </div>
        </div>
        <div class="col-md-6">
          <label for="validationServer03" class="form-label">City</label>
          <input type="text" class="form-control is-invalid" id="validationServer03" aria-describedby="validationServer03Feedback" required>
          <div class="invalid-feedback" id="validationServer03Feedback">Please provide a valid city.</div>
        </div>
        <div class="col-md-3">
          <label for="validationServer04" class="form-label">State</label>
          <select class="form-select is-invalid" id="validationServer04" aria-describedby="validationServer04Feedback" required>
            <option selected disabled value="">Choose...</option>
            <option>...</option>
          </select>
          <div class="invalid-feedback" id="validationServer04Feedback">Please select a valid state.</div>
        </div>
        <div class="col-md-3">
          <label for="validationServer05" class="form-label">Zip</label>
          <input type="text" class="form-control is-invalid" id="validationServer05" aria-describedby="validationServer05Feedback" required>
          <div class="invalid-feedback" id="validationServer05Feedback">Please provide a valid zip.</div>
        </div>
        <div class="col-12">
          <div class="form-check">
            <input class="form-check-input is-invalid" type="checkbox" value="" id="invalidCheck3" aria-describedby="invalidCheck3Feedback" required>
            <label class="form-check-label" for="invalidCheck3">Agree to terms and conditions</label>
            <div class="invalid-feedback" id="invalidCheck3Feedback">You must agree before submitting.</div>
          </div>
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit">Submit form</button>
        </div>
      </div>
    </form>
  `,
};

export const BrowserDefault = {
  render: () => `
    <form class="row g-3">
      <div class="col-md-4">
        <label for="validationDefault01" class="form-label">First name</label>
        <input type="text" class="form-control" id="validationDefault01" value="Mark" required>
      </div>
      <div class="col-md-4">
        <label for="validationDefault02" class="form-label">Last name</label>
        <input type="text" class="form-control" id="validationDefault02" value="Otto" required>
      </div>
      <div class="col-md-4">
        <label for="validationDefaultUsername" class="form-label">Username</label>
        <div class="input-group">
          <span class="input-group-text" id="inputGroupPrepend2">@</span>
          <input type="text" class="form-control" id="validationDefaultUsername" aria-describedby="inputGroupPrepend2" required>
        </div>
      </div>
      <div class="col-md-6">
        <label for="validationDefault03" class="form-label">City</label>
        <input type="text" class="form-control" id="validationDefault03" required>
      </div>
      <div class="col-md-3">
        <label for="validationDefault04" class="form-label">State</label>
        <select class="form-select" id="validationDefault04" required>
          <option selected disabled value="">Choose...</option>
          <option>...</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="validationDefault05" class="form-label">Zip</label>
        <input type="text" class="form-control" id="validationDefault05" required>
      </div>
      <div class="col-12">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
          <label class="form-check-label" for="invalidCheck">Agree to terms and conditions</label>
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">Submit form</button>
      </div>
    </form>
  `,
};

export const Tooltips = {
  render: () => `
    <form class="row g-3 needs-validation" novalidate>
      <div class="col-md-4 position-relative">
        <label for="validationTooltip01" class="form-label">First name</label>
        <input type="text" class="form-control is-valid" id="validationTooltip01" value="Mark" required>
        <div class="valid-tooltip">Looks good!</div>
      </div>
      <div class="col-md-4 position-relative">
        <label for="validationTooltip02" class="form-label">Last name</label>
        <input type="text" class="form-control is-valid" id="validationTooltip02" value="Otto" required>
        <div class="valid-tooltip">Looks good!</div>
      </div>
      <div class="col-md-4 position-relative">
        <label for="validationTooltipUsername" class="form-label">Username</label>
        <div class="input-group has-validation">
          <span class="input-group-text" id="validationTooltipUsernamePrepend">@</span>
          <input type="text" class="form-control is-invalid" id="validationTooltipUsername" aria-describedby="validationTooltipUsernamePrepend" required>
          <div class="invalid-tooltip">Please choose a unique and valid username.</div>
        </div>
      </div>
      <div class="col-md-6 position-relative">
        <label for="validationTooltip03" class="form-label">City</label>
        <input type="text" class="form-control is-invalid" id="validationTooltip03" required>
        <div class="invalid-tooltip">Please provide a valid city.</div>
      </div>
      <div class="col-md-3 position-relative">
        <label for="validationTooltip04" class="form-label">State</label>
        <select class="form-select is-invalid" id="validationTooltip04" required>
          <option selected disabled value="">Choose...</option>
          <option>...</option>
        </select>
        <div class="invalid-tooltip">Please select a valid state.</div>
      </div>
      <div class="col-md-3 position-relative">
        <label for="validationTooltip05" class="form-label">Zip</label>
        <input type="text" class="form-control is-invalid" id="validationTooltip05" required>
        <div class="invalid-tooltip">Please provide a valid zip.</div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">Submit form</button>
      </div>
    </form>
  `,
};
