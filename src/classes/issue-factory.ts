import {isPullRequest} from '../functions/is-pull-request';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {PullRequest} from './pull-request';

export class IssueFactory {
  constructor(private readonly options: IIssuesProcessorOptions) {}
  createIssue(issue: Readonly<IIssue>): Issue {
    return isPullRequest(issue)
      ? new PullRequest(this.options, issue)
      : new Issue(this.options, issue);
  }
}
