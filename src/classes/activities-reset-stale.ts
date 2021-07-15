import {Option} from '../enums/option';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

export class ActivitiesResetStale {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  shouldActivitiesResetStale(): boolean {
    return this._shouldActivitiesResetStale();
  }

  private _shouldActivitiesResetStale(): boolean {
    return this._issue.isPullRequest
      ? this._shouldPullRequestActivitiesResetStale()
      : this._shouldIssueActivitiesResetStale();
  }

  private _shouldPullRequestActivitiesResetStale(): boolean {
    if (this._options.prActivitiesResetStale === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.PrActivitiesResetStale
        )} is enabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );

      return true;
    } else if (this._options.prActivitiesResetStale === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.PrActivitiesResetStale
        )} is disabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );

      return false;
    }

    this._logActivitiesResetStaleOption();

    return this._options.activitiesResetStale;
  }

  private _shouldIssueActivitiesResetStale(): boolean {
    if (this._options.issueActivitiesResetStale === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IssueActivitiesResetStale
        )} is enabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );

      return true;
    } else if (this._options.issueActivitiesResetStale === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IssueActivitiesResetStale
        )} is disabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );

      return false;
    }

    this._logActivitiesResetStaleOption();

    return this._options.activitiesResetStale;
  }

  private _logActivitiesResetStaleOption(): void {
    if (this._options.activitiesResetStale) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.ActivitiesResetStale
        )} is enabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );
    } else {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.ActivitiesResetStale
        )} is disabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );
    }
  }
}
