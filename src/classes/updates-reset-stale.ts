import {Option} from '../enums/option';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

export class UpdatesResetStale {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  shouldUpdatesResetStale(): boolean {
    return this._shouldUpdatesResetStale();
  }

  private _shouldUpdatesResetStale(): boolean {
    return this._issue.isPullRequest
      ? this._shouldIgnoreAllPullRequestActivitiesBeforeStale()
      : this._shouldIssueUpdatesResetStale();
  }

  private _shouldIgnoreAllPullRequestActivitiesBeforeStale(): boolean {
    if (this._options.prUpdatesResetStale === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.PrUpdatesResetStale
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );

      return true;
    } else if (this._options.prUpdatesResetStale === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.PrUpdatesResetStale
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );

      return false;
    }

    this._logUpdatesResetStaleOption();

    return this._options.updatesResetStale;
  }

  private _shouldIssueUpdatesResetStale(): boolean {
    if (this._options.issueUpdatesResetStale === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IssueUpdatesResetStale
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );

      return true;
    } else if (this._options.issueUpdatesResetStale === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IssueUpdatesResetStale
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );

      return false;
    }

    this._logUpdatesResetStaleOption();

    return this._options.updatesResetStale;
  }

  private _logUpdatesResetStaleOption(): void {
    if (this._options.updatesResetStale) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.UpdatesResetStale
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );
    } else {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.UpdatesResetStale
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );
    }
  }
}
