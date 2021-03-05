import deburr from 'lodash.deburr';
import {wordsToList} from '../functions/words-to-list';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

type CleanMilestone = string;

export class Milestones {
  private static _cleanMilestone(milestone: Readonly<string>): CleanMilestone {
    return deburr(milestone.toLowerCase());
  }

  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  shouldExemptMilestones(): boolean {
    if (!this._issue.milestone) {
      this._issueLogger.info('This $$type has no milestone');
      this._logSkip();

      return false;
    }

    if (this._shouldExemptAllMilestones()) {
      this._issueLogger.info(
        'Skipping $$type because it has an exempt milestone'
      );

      return true;
    }

    const exemptMilestones: string[] = this._getExemptMilestones();

    if (exemptMilestones.length === 0) {
      this._issueLogger.info(
        `No milestone option was specified to skip the stale process for this $$type`
      );
      this._logSkip();

      return false;
    }

    this._issueLogger.info(
      `Found ${exemptMilestones.length} milestone${
        exemptMilestones.length > 1 ? 's' : ''
      } that can exempt stale on this $$type`
    );

    const hasExemptMilestone: boolean = exemptMilestones.some(
      (exemptMilestone: Readonly<string>): boolean =>
        this._hasMilestone(exemptMilestone)
    );

    if (!hasExemptMilestone) {
      this._issueLogger.info(
        'No milestone on this $$type can exempt the stale process'
      );
      this._logSkip();
    } else {
      this._issueLogger.info(
        'Skipping this $$type because it has an exempt milestone'
      );
    }

    return hasExemptMilestone;
  }

  private _getExemptMilestones(): string[] {
    return this._issue.isPullRequest
      ? this._getExemptPullRequestMilestones()
      : this._getExemptIssueMilestones();
  }

  private _getExemptIssueMilestones(): string[] {
    if (this._options.exemptIssueMilestones === '') {
      this._issueLogger.info(
        'The option "exemptIssueMilestones" is disabled. No specific milestone can skip the stale process for this $$type'
      );

      if (this._options.exemptMilestones === '') {
        this._issueLogger.info(
          'The option "exemptMilestones" is disabled. No specific milestone can skip the stale process for this $$type'
        );

        return [];
      }

      const exemptMilestones: string[] = wordsToList(
        this._options.exemptMilestones
      );

      this._issueLogger.info(
        `The option "exemptMilestones" is set. ${
          exemptMilestones.length
        } milestone${
          exemptMilestones.length === 1 ? '' : 's'
        } can skip the stale process for this $$type`
      );

      return exemptMilestones;
    }

    const exemptMilestones: string[] = wordsToList(
      this._options.exemptIssueMilestones
    );

    this._issueLogger.info(
      `The option "exemptIssueMilestones" is set. ${
        exemptMilestones.length
      } milestone${
        exemptMilestones.length === 1 ? '' : 's'
      } can skip the stale process for this $$type`
    );

    return exemptMilestones;
  }

  private _getExemptPullRequestMilestones(): string[] {
    if (this._options.exemptPrMilestones === '') {
      this._issueLogger.info(
        'The option "exemptPrMilestones" is disabled. No specific milestone can skip the stale process for this $$type'
      );

      if (this._options.exemptMilestones === '') {
        this._issueLogger.info(
          'The option "exemptMilestones" is disabled. No specific milestone can skip the stale process for this $$type'
        );

        return [];
      }

      const exemptMilestones: string[] = wordsToList(
        this._options.exemptMilestones
      );

      this._issueLogger.info(
        `The option "exemptMilestones" is set. ${
          exemptMilestones.length
        } milestone${
          exemptMilestones.length === 1 ? '' : 's'
        } can skip the stale process for this $$type`
      );

      return exemptMilestones;
    }

    const exemptMilestones: string[] = wordsToList(
      this._options.exemptPrMilestones
    );

    this._issueLogger.info(
      `The option "exemptPrMilestones" is set. ${
        exemptMilestones.length
      } milestone${
        exemptMilestones.length === 1 ? '' : 's'
      } can skip the stale process for this $$type`
    );

    return exemptMilestones;
  }

  private _hasMilestone(milestone: Readonly<string>): boolean {
    if (!this._issue.milestone) {
      return false;
    }

    const cleanMilestone: CleanMilestone = Milestones._cleanMilestone(
      milestone
    );

    const isSameMilestone: boolean =
      cleanMilestone ===
      Milestones._cleanMilestone(this._issue.milestone.title);

    if (isSameMilestone) {
      this._issueLogger.info(
        `The milestone "${milestone}" is set on this $$type and is an exempt milestone`
      );
    }

    return isSameMilestone;
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
      this._issueLogger.info(
        'The option "exemptAllIssueMilestones" is enabled. Any milestone on this $$type will skip the stale process'
      );

      return true;
    } else if (this._options.exemptAllIssueMilestones === false) {
      this._issueLogger.info(
        'The option "exemptAllIssueMilestones" is disabled. Only some specific milestones on this $$type will skip the stale process'
      );

      return false;
    }

    this._logExemptAllMilestonesOption();

    return this._options.exemptAllMilestones;
  }

  private _shouldExemptAllPullRequestMilestones(): boolean {
    if (this._options.exemptAllPrMilestones === true) {
      this._issueLogger.info(
        'The option "exemptAllPrMilestones" is enabled. Any milestone on this $$type will skip the stale process'
      );

      return true;
    } else if (this._options.exemptAllPrMilestones === false) {
      this._issueLogger.info(
        'The option "exemptAllPrMilestones" is disabled. Only some specific milestones on this $$type will skip the stale process'
      );

      return false;
    }

    this._logExemptAllMilestonesOption();

    return this._options.exemptAllMilestones;
  }

  private _logExemptAllMilestonesOption(): void {
    if (this._options.exemptAllMilestones) {
      this._issueLogger.info(
        'The option "exemptAllMilestones" is enabled. Any milestone on this $$type will skip the stale process'
      );
    } else {
      this._issueLogger.info(
        'The option "exemptAllMilestones" is disabled. Only some specific milestones on this $$type will skip the stale process'
      );
    }
  }

  private _logSkip(): void {
    this._issueLogger.info('Skip the milestones checks');
  }
}
