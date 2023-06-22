import {Option} from '../enums/option';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {IPullRequest} from '../interfaces/pull-request';
import {LoggerService} from '../services/logger.service';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

export class ExemptDraftPullRequest {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  async shouldExemptDraftPullRequest(
    // keep this for backward compatibility
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pullRequestCallback: () => Promise<IPullRequest | undefined | void>
  ): Promise<boolean> {
    if (this._issue.isPullRequest) {
      if (this._options.exemptDraftPr) {
        this._issueLogger.info(
          `The option ${this._issueLogger.createOptionLink(
            Option.ExemptDraftPr
          )} is enabled`
        );

        /* This code was used until Jun 15 2022 - it is unclear why they had to call API for getting pull request
        const pullRequest: IPullRequest | undefined | void =
          await pullRequestCallback();

        if (pullRequest?.draft === true) {
         */
        if (this._issue?.draft === true) {
          this._issueLogger.info(
            LoggerService.white('└──'),
            `Skip the $$type draft checks`
          );

          return true;
        } else {
          this._issueLogger.info(
            LoggerService.white('└──'),
            `Continuing the process for this $$type because it is not a draft`
          );
        }
      }
    }

    return false;
  }
}
