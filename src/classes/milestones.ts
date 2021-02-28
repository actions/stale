import deburr from 'lodash.deburr';
import {wordsToList} from '../functions/words-to-list';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';

type CleanMilestone = string;

export class Milestones {
  private static _cleanMilestone(milestone: Readonly<string>): CleanMilestone {
    return deburr(milestone.toLowerCase());
  }

  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
  }

  shouldExemptMilestones(): boolean {
    if (this._shouldExemptAllMilestones()) {
      return true;
    }

    const exemptMilestones: string[] = this._getExemptMilestones();

    return exemptMilestones.some((exemptMilestone: Readonly<string>): boolean =>
      this._hasMilestone(exemptMilestone)
    );
  }

  private _getExemptMilestones(): string[] {
    return wordsToList(
      this._issue.isPullRequest
        ? this._getExemptPullRequestMilestones()
        : this._getExemptIssueMilestones()
    );
  }

  private _getExemptIssueMilestones(): string {
    return this._options.exemptIssueMilestones !== ''
      ? this._options.exemptIssueMilestones
      : this._options.exemptMilestones;
  }

  private _getExemptPullRequestMilestones(): string {
    return this._options.exemptPrMilestones !== ''
      ? this._options.exemptPrMilestones
      : this._options.exemptMilestones;
  }

  private _hasMilestone(milestone: Readonly<string>): boolean {
    if (!this._issue.milestone) {
      return false;
    }

    return (
      Milestones._cleanMilestone(milestone) ===
      Milestones._cleanMilestone(this._issue.milestone.title)
    );
  }

  private _shouldExemptAllMilestones(): boolean {
    if (this._issue.milestone) {
      return this._issue.isPullRequest
        ? this._shouldExemptAllPullRequestMilestones()
        : this._shouldExemptAllIssueMilestones();
    }

    return false;
  }

  private _shouldExemptAllIssueMilestones(): boolean {
    if (this._options.exemptAllIssueMilestones === true) {
      return true;
    } else if (this._options.exemptAllIssueMilestones === false) {
      return false;
    }

    return this._options.exemptAllMilestones;
  }

  private _shouldExemptAllPullRequestMilestones(): boolean {
    if (this._options.exemptAllPrMilestones === true) {
      return true;
    } else if (this._options.exemptAllPrMilestones === false) {
      return false;
    }

    return this._options.exemptAllMilestones;
  }
}
