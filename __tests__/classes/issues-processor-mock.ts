import {Issue} from '../../src/classes/issue';
import {IssuesProcessor} from '../../src/classes/issues-processor';
import {IComment} from '../../src/interfaces/comment';
import {IIssuesProcessorOptions} from '../../src/interfaces/issues-processor-options';
import {IPullRequest} from '../../src/interfaces/pull-request';

export class IssuesProcessorMock extends IssuesProcessor {
  constructor(
    options: IIssuesProcessorOptions,
    getIssues?: (page: number) => Promise<Issue[]>,
    listIssueComments?: (
      issue: Issue,
      sinceDate: string
    ) => Promise<IComment[]>,
    getLabelCreationDate?: (
      issue: Issue,
      label: string
    ) => Promise<string | undefined>,
    getPullRequest?: (issue: Issue) => Promise<IPullRequest | undefined | void>
  ) {
    super(options);

    if (getIssues) {
      this.getIssues = getIssues;
    }

    if (listIssueComments) {
      this.listIssueComments = listIssueComments;
    }

    if (getLabelCreationDate) {
      this.getLabelCreationDate = getLabelCreationDate;
    }

    if (getPullRequest) {
      this.getPullRequest = getPullRequest;
    }
  }
}
