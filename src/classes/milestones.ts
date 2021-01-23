import deburr from 'lodash.deburr';
import {wordsToList} from '../functions/words-to-list';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';

type CleanMilestone = string;

export class Milestones {
  private static _cleanMilestone(label: Readonly<string>): CleanMilestone {
    return deburr(label.toLowerCase());
  }

  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
  }

  shouldExemptMilestones(): boolean {
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
}
