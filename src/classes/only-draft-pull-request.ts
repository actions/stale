import {Option} from '../enums/option';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {LoggerService} from '../services/logger.service';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

export class OnlyDraftPullRequest {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  shouldSkipNonDraftPullRequest(): boolean {
    if (this._issue.isPullRequest) {
      if (this._options.onlyDraftPr) {
        this._issueLogger.info(
          `The option ${this._issueLogger.createOptionLink(
            Option.OnlyDraftPr
          )} is enabled`
        );

        if (this._issue?.draft !== true) {
          this._issueLogger.info(
            LoggerService.white('└──'),
            `Skip this $$type because it is not a draft and only draft PRs should be processed`
          );

          return true;
        } else {
          this._issueLogger.info(
            LoggerService.white('└──'),
            `Continuing the process for this $$type because it is a draft`
          );
        }
      }
    }

    return false;
  }
}
