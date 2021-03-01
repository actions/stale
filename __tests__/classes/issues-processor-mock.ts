import {Issue} from '../../src/classes/issue';
import {IssuesProcessor} from '../../src/classes/issues-processor';
import {IComment} from '../../src/interfaces/comment';
import {IIssuesProcessorOptions} from '../../src/interfaces/issues-processor-options';

export class IssuesProcessorMock extends IssuesProcessor {
  constructor(
    options: IIssuesProcessorOptions,
    getActor?: () => Promise<string>,
    getIssues?: (page: number) => Promise<Issue[]>,
    listIssueComments?: (
      issueNumber: number,
      sinceDate: string
    ) => Promise<IComment[]>,
    getLabelCreationDate?: (
      issue: Issue,
      label: string
    ) => Promise<string | undefined>
  ) {
    super(options);

    if (getActor) {
      this.getActor = getActor;
    }

    if (getIssues) {
      this.getIssues = getIssues;
    }

    if (listIssueComments) {
      this.listIssueComments = listIssueComments;
    }

    if (getLabelCreationDate) {
      this.getLabelCreationDate = getLabelCreationDate;
    }
  }
}
