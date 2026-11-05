/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

import {zxcvbn, zxcvbnOptions, ZxcvbnResult} from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import debounce from 'lodash/debounce';

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

// Hooks of Admin/Helpers/password_feedback.html.twig
const PasswordFeedbackMap = {
  field: '[data-ps-ref="password-field"]',
  template: '[data-ps-ref="password-feedback-template"]',
  strengthBar: '[data-ps-ref="password-strength-bar"]',
  strengthText: '[data-ps-ref="password-strength-text"]',
  requirements: '[data-ps-ref="password-requirements"]',
  requirementLength: '[data-ps-ref="password-requirement-length"]',
  requirementScore: '[data-ps-ref="password-requirement-score"]',
  requirementIcon: '[data-ps-ref="password-requirement-icon"]',
  requirementText: '[data-ps-ref="password-requirement-text"]',
  tip: '[data-ps-ref="password-tip"]',
  announcement: '[data-ps-target="password-feedback-announcement"]',
};

type RequirementState = 'met' | 'unmet' | 'failed';

// The icon changes shape with the state, so color is not the only cue
const REQUIREMENT_ICONS: Record<RequirementState, string> = {
  met: 'check_circle',
  unmet: 'radio_button_unchecked',
  failed: 'cancel',
};

// Wait for a pause in typing, so screen readers are not interrupted on every key
const ANNOUNCEMENT_DELAY = 800;

export interface ChangePasswordHandlerOptions {
  minLength?: number;
}

/**
 * Generates a password and informs about it's strength.
 * You can pass a password input to watch the password strength and display feedback messages.
 * You can also generate a random password into an input.
 */
type FeedbackTranslations = {warnings?: Record<string, string>, suggestions?: Record<string, string>};

/**
 * Puts the PrestaShop translations over the library's English ones, by @zxcvbn-ts warning and suggestion id,
 * so result.feedback comes back translated. Every id must stay present, hence the merge.
 */
const useFeedbackTranslations = (feedback: FeedbackTranslations): void => {
  const {translations} = zxcvbnEnPackage;

  zxcvbnOptions.setOptions({
    translations: {
      ...translations,
      warnings: {...translations.warnings, ...feedback.warnings},
      suggestions: {...translations.suggestions, ...feedback.suggestions},
    },
  });
};

export default class ChangePasswordHandler {
  minLength: number;

  feedbackSelector: string;

  isValid: boolean;

  // Fields the user has left with a value: only they show the invalid state, not a password still being typed
  private touched = new WeakSet<HTMLInputElement>();

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
      const announce = debounce((feedbackContainer: HTMLElement, message: string) => {
        const announcement = feedbackContainer.querySelector<HTMLElement>(PasswordFeedbackMap.announcement);

        if (announcement) {
          announcement.textContent = message;
        }
      }, ANNOUNCEMENT_DELAY);

      input.addEventListener('blur', () => {
        if (input.value !== '') {
          this.touched.add(input);
        }
        this.updateInvalidState(input);
      });

      // input, not keyup: a paste, a password manager, a suggested password or dictation fill the field without a key
      input.addEventListener('input', () => {
        // A page can wrap the input (e.g. in an input group) and mark the element the feedback goes into
        const container = input.closest<HTMLElement>(PasswordFeedbackMap.field) ?? input.parentElement;

        if (!container) {
          return;
        }

        let feedbackContainer = container.querySelector<HTMLElement>(this.feedbackSelector);

        if (!feedbackContainer) {
          container.insertAdjacentHTML(
            'beforeend',
            document.querySelector(PasswordFeedbackMap.template)?.innerHTML ?? '',
          );
          feedbackContainer = container.querySelector<HTMLElement>(this.feedbackSelector);

          if (feedbackContainer) {
            this.describeInput(input, feedbackContainer);
            useFeedbackTranslations(JSON.parse(feedbackContainer.dataset.psDataFeedback ?? '{}'));
          }
        }

        if (!feedbackContainer) {
          return;
        }

        const translations = JSON.parse(feedbackContainer.dataset.psDataTranslations ?? '{}');
        const passwordRequirementsLength = feedbackContainer.querySelector<HTMLElement>(
          PasswordFeedbackMap.requirementLength,
        );
        const lengthText = passwordRequirementsLength?.querySelector(PasswordFeedbackMap.requirementText);

        if (passwordRequirementsLength && lengthText) {
          lengthText.textContent = sprintf(
            passwordRequirementsLength.dataset.psDataTranslation,
            input.dataset.minlength,
            input.dataset.maxlength,
          );
        }

        const passwordRequirementsScore = feedbackContainer.querySelector<HTMLElement>(
          PasswordFeedbackMap.requirementScore,
        );
        const scoreText = passwordRequirementsScore?.querySelector(PasswordFeedbackMap.requirementText);

        if (passwordRequirementsScore && scoreText) {
          scoreText.textContent = sprintf(
            passwordRequirementsScore.dataset.psDataTranslation,
            translations[input.dataset.minscore ?? ''],
          );
        }

        if (input.value === '') {
          feedbackContainer.classList.add('d-none');
          announce.cancel();
          this.touched.delete(input);
          this.updateInvalidState(input);
        } else {
          const result = zxcvbn(input.value);
          this.displayFeedback(input, feedbackContainer, translations, result);
          feedbackContainer.classList.remove('d-none');
          const strength = this.getStrengthText(input, translations, result);
          announce(feedbackContainer, this.getAnnouncement(feedbackContainer, strength, result));
        }
      });
    });
  }

  isPasswordValid(): boolean {
    return this.isValid;
  }

  /**
   * Shows the invalid state now, e.g. when a submit is blocked, without waiting for the user to leave the field.
   */
  markInvalid(input: HTMLInputElement): void {
    this.touched.add(input);
    this.updateInvalidState(input);
  }

  /**
   * aria-invalid (and its red style) once the field was left or a submit blocked, never on an empty field;
   * removed as soon as the password meets the policy.
   *
   * @private
   */
  private updateInvalidState(input: HTMLInputElement): void {
    if (input.value !== '' && !this.isValid && this.touched.has(input)) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  /**
   * Link the requirements to the input, so screen readers read them with the field.
   *
   * @private
   */
  private describeInput(input: HTMLInputElement, feedbackContainer: HTMLElement): void {
    const requirements = feedbackContainer.querySelector<HTMLElement>(PasswordFeedbackMap.requirements);

    if (!requirements || !input.id) {
      return;
    }

    requirements.id = `${input.id}_password_requirements`;

    const describedBy = (input.getAttribute('aria-describedby') ?? '').split(' ').filter((id) => id !== '');

    if (!describedBy.includes(requirements.id)) {
      input.setAttribute('aria-describedby', [...describedBy, requirements.id].join(' '));
    }
  }

  /**
   * Strength, then the requirements left to meet, or that they are all met.
   *
   * @private
   */
  private getAnnouncement(feedbackContainer: HTMLElement, strength: string, result: ZxcvbnResult): string {
    const announcement = feedbackContainer.querySelector<HTMLElement>(PasswordFeedbackMap.announcement);

    if (!announcement) {
      return '';
    }

    const prefix = strength ? `${strength}. ` : '';

    if (this.isValid) {
      return `${prefix}${announcement.dataset.psDataValid ?? ''}`;
    }

    const unmetRequirements = Array.from(
      feedbackContainer.querySelectorAll<HTMLElement>(
        `${PasswordFeedbackMap.requirementLength}, ${PasswordFeedbackMap.requirementScore}`,
      ),
    )
      .filter((requirement) => requirement.dataset.psState !== 'met')
      .map((requirement) => requirement.querySelector(PasswordFeedbackMap.requirementText)?.textContent ?? '')
      .join(', ');

    const warning = result.feedback.warning ? `. ${result.feedback.warning}` : '';

    return `${prefix}${sprintf(announcement.dataset.psDataInvalid ?? '%s', unmetRequirements)}${warning}`;
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
    const strengthText = outputContainer.querySelector<HTMLElement>(PasswordFeedbackMap.strengthText);

    if (strengthText) {
      const strength = this.getStrengthText(passwordInput, translations, result);
      const minScore = Number(passwordInput.dataset.minscore);
      strengthText.textContent = strength && result.score < minScore
        ? sprintf(strengthText.dataset.psDataBelowRequired ?? '%s', strength, translations[minScore])
        : strength;
    }

    const lengthState = this.getLengthState(passwordInput);
    this.markRequirement(outputContainer.querySelector(PasswordFeedbackMap.requirementLength), lengthState);

    const passwordScoreValid = Number(passwordInput.dataset.minscore) <= result.score;
    this.markRequirement(
      outputContainer.querySelector(PasswordFeedbackMap.requirementScore),
      passwordScoreValid ? 'met' : 'unmet',
    );

    this.isValid = passwordScoreValid && lengthState === 'met';
    this.updateInvalidState(passwordInput);

    this.showTip(outputContainer, passwordScoreValid ? [] : [result.feedback.warning, result.feedback.suggestions[0]]);

    const progressBar = outputContainer.querySelector<HTMLElement>(PasswordFeedbackMap.strengthBar);

    if (progressBar) {
      // Width only; the color comes from the state, styled in _password.scss
      progressBar.style.width = `${(result.score * 20) + 20}%`;
      progressBar.dataset.psState = lengthState === 'met' ? this.getStrengthState(result.score) : 'weak';
    }
  }

  /**
   * A password outside the length bounds is not acceptable, whatever its score, so its strength is not shown.
   *
   * @private
   */
  private getStrengthText(input: HTMLInputElement, translations: Record<string, string>, result: ZxcvbnResult): string {
    return this.getLengthState(input) === 'met' ? translations[result.score] : '';
  }

  /**
   * Too long cannot be fixed by typing more, so it fails rather than staying unmet.
   *
   * @private
   */
  private getLengthState(input: HTMLInputElement): RequirementState {
    const {length} = input.value;

    if (length > Number(input.dataset.maxlength)) {
      return 'failed';
    }

    return length >= Number(input.dataset.minlength) ? 'met' : 'unmet';
  }

  /**
   * The state goes on the requirement for the styles, and the icon changes shape so color is not the only cue.
   *
   * @private
   */
  private markRequirement(requirement: HTMLElement | null, state: RequirementState): void {
    if (!requirement) {
      return;
    }

    requirement.setAttribute('data-ps-state', state);

    const icon = requirement.querySelector(PasswordFeedbackMap.requirementIcon);

    if (icon) {
      icon.textContent = REQUIREMENT_ICONS[state];
    }
  }

  /**
   * Why the strength is not enough (warning) and how to improve it (first suggestion), under the strength requirement.
   * The library's sentences may lack a final period, so one is added to join them.
   *
   * @private
   */
  private showTip(outputContainer: HTMLElement, sentences: Array<string | null | undefined>): void {
    const tip = outputContainer.querySelector<HTMLElement>(PasswordFeedbackMap.tip);

    if (!tip) {
      return;
    }

    tip.textContent = sentences
      .filter((sentence): sentence is string => Boolean(sentence))
      .map((sentence) => (/[.!?]$/.test(sentence) ? sentence : `${sentence}.`))
      .join(' ');
    tip.hidden = tip.textContent === '';
  }

  /**
   * @private
   */
  private getStrengthState(score: number): string {
    if (score <= 1) {
      return 'weak';
    }

    return score === 2 ? 'average' : 'strong';
  }
}
