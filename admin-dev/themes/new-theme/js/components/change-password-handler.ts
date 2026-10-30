/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

import {zxcvbn, zxcvbnOptions, ZxcvbnResult} from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {sprintf} = require('sprintf-js');

// Initialize zxcvbn-ts with language packages
const zxcvbnConfig = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(zxcvbnConfig);

export interface ChangePasswordHandlerOptions {
  minLength?: number;
}

/**
 * Generates a password and informs about it's strength.
 * You can pass a password input to watch the password strength and display feedback messages.
 * You can also generate a random password into an input.
 */
export default class ChangePasswordHandler {
  minLength: number;

  feedbackSelector: string;

  isValid: boolean;

  constructor(
    passwordStrengthFeedbackContainerSelector: string,
    options: ChangePasswordHandlerOptions = {},
  ) {
    // Minimum length of the generated password.
    this.minLength = <number>options.minLength || 8;

    // Feedback container holds messages representing password strength.
    this.feedbackSelector = passwordStrengthFeedbackContainerSelector;

    this.isValid = false;
  }

  /**
   * Watch password, which is entered in the input, strength and inform about it.
   */
  watchPasswordStrength(inputs: ArrayLike<HTMLInputElement>): void {
    Array.from(inputs).forEach((input) => {
      input.addEventListener('keyup', () => {
        const container = input.parentElement;

        if (!container) {
          return;
        }

        let feedbackContainer = container.querySelector<HTMLElement>(this.feedbackSelector);

        if (!feedbackContainer) {
          container.insertAdjacentHTML('beforeend', document.querySelector('#password-feedback')?.innerHTML ?? '');
          feedbackContainer = container.querySelector<HTMLElement>(this.feedbackSelector);
        }

        if (!feedbackContainer) {
          return;
        }

        const translations = JSON.parse(feedbackContainer.dataset.translations ?? '{}');
        const passwordRequirementsLength = feedbackContainer.querySelector<HTMLElement>('.password-requirements-length');
        const lengthText = passwordRequirementsLength?.querySelector('span');

        if (passwordRequirementsLength && lengthText) {
          lengthText.textContent = sprintf(
            passwordRequirementsLength.dataset.translation,
            input.dataset.minlength,
            input.dataset.maxlength,
          );
        }

        const passwordRequirementsScore = feedbackContainer.querySelector<HTMLElement>('.password-requirements-score');
        const scoreText = passwordRequirementsScore?.querySelector('span');

        if (passwordRequirementsScore && scoreText) {
          scoreText.textContent = sprintf(
            passwordRequirementsScore.dataset.translation,
            translations[input.dataset.minscore ?? ''],
          );
        }

        if (input.value === '') {
          feedbackContainer.classList.add('d-none');
        } else {
          this.displayFeedback(input, feedbackContainer, translations, zxcvbn(input.value));
          feedbackContainer.classList.remove('d-none');
        }
      });
    });
  }

  isPasswordValid(): boolean {
    return this.isValid;
  }

  /**
   * Display feedback about password's strength.
   *
   * @private
   */
  private displayFeedback(
    passwordInput: HTMLInputElement,
    outputContainer: HTMLElement,
    translations: Record<string, string>,
    result: ZxcvbnResult,
  ): void {
    const feedback = this.getPasswordStrengthFeedback(result.score);
    const popoverContent:string[] = [];

    const strengthText = outputContainer.querySelector('.password-strength-text');

    if (strengthText) {
      strengthText.textContent = translations[result.score];
    }

    if (result.feedback.warning && result.feedback.warning !== '') {
      if (result.feedback.warning in translations) {
        popoverContent.push(translations[result.feedback.warning]);
      }
    }

    result.feedback.suggestions.forEach((suggestion) => {
      if (suggestion in translations) {
        popoverContent.push(translations[suggestion]);
      }
    });

    this.showPopover(passwordInput, popoverContent.join('<br/>'));

    const passwordLength = passwordInput.value.length;

    const passwordLengthValid = passwordLength >= Number(passwordInput.dataset.minlength)
      && passwordLength <= Number(passwordInput.dataset.maxlength);
    outputContainer.querySelector('.password-requirements-length .material-icons')?.classList.toggle(
      'text-success',
      passwordLengthValid,
    );

    const passwordScoreValid = Number(passwordInput.dataset.minscore) <= result.score;
    outputContainer.querySelector('.password-requirements-score .material-icons')?.classList.toggle(
      'text-success',
      passwordScoreValid,
    );

    const borderClass = passwordScoreValid && passwordLengthValid ? 'border-success' : 'border-danger';
    passwordInput.setAttribute('class', `form-control border ${borderClass}`);
    this.isValid = passwordScoreValid && passwordLengthValid;

    const percentage = (result.score * 20) + 20;
    // increase and decrease progress bar
    const progressBar = outputContainer.querySelector<HTMLElement>('.progress-bar');

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      progressBar.style.visibility = 'visible';
      progressBar.style.backgroundColor = feedback.color;
    }
  }

  /**
   * Bootstrap 5 when the /ui kit is loaded, otherwise the Bootstrap 4 jQuery plugin.
   *
   * @private
   */
  private showPopover(input: HTMLInputElement, content: string): void {
    const {bootstrap} = window;

    if (bootstrap?.Popover) {
      bootstrap.Popover.getInstance(input)?.dispose();
      new bootstrap.Popover(input, {html: true, placement: 'top', content}).show();

      return;
    }

    window.$(input).popover('dispose');
    window.$(input).popover({html: true, placement: 'top', content}).popover('show');
  }

  /**
   * Get feedback that describes given password strength.
   * Response contains text message and element class.
   *
   * @param {zxcvbn.ZXCVBNScore} strength
   *
   * @private
   */
  private getPasswordStrengthFeedback(
    strength: number,
  ): Record<string, string> {
    switch (strength) {
      case 0:
        return {
          color: '#D5343C',
        };

      case 1:
        return {
          color: '#D5343C',
        };

      case 2:
        return {
          color: '#FFA000',
        };

      case 3:
        return {
          color: '#21834D',
        };

      case 4:
        return {
          color: '#21834D',
        };

      default:
        throw new Error('Invalid password strength indicator.');
    }
  }
}
