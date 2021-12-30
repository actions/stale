import {Option} from '../enums/option';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

export class IgnoreUpdates {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  shouldIgnoreUpdates(): boolean {
    return this._shouldIgnoreUpdates();
  }

  private _shouldIgnoreUpdates(): boolean {
    return this._issue.isPullRequest
      ? this._shouldIgnorePullRequestUpdates()
      : this._shouldIgnoreIssueUpdates();
  }

  private _shouldIgnorePullRequestUpdates(): boolean {
    if (this._options.ignorePrUpdates === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnorePrUpdates
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of update`
      );

      return true;
    } else if (this._options.ignorePrUpdates === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnorePrUpdates
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some update`
      );

      return false;
    }

    this._logIgnoreUpdates();

    return this._options.ignoreUpdates;
  }

  private _shouldIgnoreIssueUpdates(): boolean {
    if (this._options.ignoreIssueUpdates === true) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreIssueUpdates
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of update`
      );

      return true;
    } else if (this._options.ignoreIssueUpdates === false) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreIssueUpdates
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some update`
      );

      return false;
    }

    this._logIgnoreUpdates();

    return this._options.ignoreUpdates;
  }

  private _logIgnoreUpdates(): void {
    if (this._options.ignoreUpdates) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreUpdates
        )} is enabled. The stale counter will ignore any updates or comments on this $$type and will use the creation date as a reference ignoring any kind of update`
      );
    } else {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreUpdates
        )} is disabled. The stale counter will take into account updates and comments on this $$type to avoid to stale when there is some update`
      );
    }
  }
}
