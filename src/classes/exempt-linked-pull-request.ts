import {Option} from '../enums/option.js';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options.js';
import {LoggerService} from '../services/logger.service.js';
import {Issue} from './issue.js';
import {IssueLogger} from './loggers/issue-logger.js';

export class ExemptLinkedPullRequest {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  async shouldExemptLinkedPullRequest(
    hasOpenLinkedPullRequestCallback: () => Promise<boolean>
  ): Promise<boolean> {
    // Pull requests are not linked to other pull requests, so there is nothing to check
    if (this._issue.isPullRequest) {
      return false;
    }

    if (!this._options.exemptIssuesWithOpenLinkedPr) {
      return false;
    }

    this._issueLogger.info(
      `The option ${this._issueLogger.createOptionLink(
        Option.ExemptIssuesWithOpenLinkedPr
      )} is enabled`
    );

    if (await hasOpenLinkedPullRequestCallback()) {
      this._issueLogger.info(
        LoggerService.white('└──'),
        `Skip the $$type checks because an open pull request will close it when merged`
      );

      return true;
    }

    this._issueLogger.info(
      LoggerService.white('└──'),
      `Continuing the process for this $$type because no open pull request will close it`
    );

    return false;
  }
}
