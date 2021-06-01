import {Option} from '../enums/option';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

export class IgnoreAllActivitiesBeforeStale {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  shouldIgnoreAllActivitiesBeforeStale(): boolean {
    return this._shouldIgnoreAllActivitiesBeforeStale();
  }

  private _shouldIgnoreAllActivitiesBeforeStale(): boolean {
    return this._issue.isPullRequest
      ? this._shouldIgnoreAllPullRequestActivitiesBeforeStale()
      : this._shouldIgnoreAllIssueActivitiesBeforeStale();
  }

  private _shouldIgnoreAllPullRequestActivitiesBeforeStale(): boolean {
    if (this._options.ignoreAllPrActivitiesBeforeStale === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreAllPrActivitiesBeforeStale
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );

      return true;
    } else if (this._options.ignoreAllPrActivitiesBeforeStale === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreAllPrActivitiesBeforeStale
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );

      return false;
    }

    this._logIgnoreAllActivitiesBeforeStaleOption();

    return this._options.ignoreAllActivitiesBeforeStale;
  }

  private _shouldIgnoreAllIssueActivitiesBeforeStale(): boolean {
    if (this._options.ignoreAllIssueActivitiesBeforeStale === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreAllIssueActivitiesBeforeStale
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );

      return true;
    } else if (this._options.ignoreAllIssueActivitiesBeforeStale === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreAllIssueActivitiesBeforeStale
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );

      return false;
    }

    this._logIgnoreAllActivitiesBeforeStaleOption();

    return this._options.ignoreAllActivitiesBeforeStale;
  }

  private _logIgnoreAllActivitiesBeforeStaleOption(): void {
    if (this._options.ignoreAllActivitiesBeforeStale) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreAllActivitiesBeforeStale
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of activity`
      );
    } else {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreAllActivitiesBeforeStale
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some activity`
      );
    }
  }
}
