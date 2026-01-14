import {Issue} from '../../src/classes/issue';
import {IssuesProcessor} from '../../src/classes/issues-processor';
import {IComment} from '../../src/interfaces/comment';
import {IIssuesProcessorOptions} from '../../src/interfaces/issues-processor-options';
import {IPullRequest} from '../../src/interfaces/pull-request';
import {IState} from '../../src/interfaces/state/state';
import {IIssueEvent} from '../../src/interfaces/issue-event';

export class IssuesProcessorMock extends IssuesProcessor {
  constructor(
    options: IIssuesProcessorOptions,
    state: IState,
    getIssues?: (page: number) => Promise<Issue[]>,
    listIssueComments?: (
      issue: Issue,
      sinceDate: string
    ) => Promise<IComment[]>,
    getLabelCreationDate?: (
      issue: Issue,
      label: string
    ) =>
      | Promise<string | undefined>
      | Promise<{creationDate?: string; events: IIssueEvent[]}>,
    hasOnlyStaleLabelingEventsSince?: (
      issue: Issue,
      sinceDate: string,
      staleLabel: string,
      events: IIssueEvent[]
    ) => Promise<boolean>,
    getPullRequest?: (issue: Issue) => Promise<IPullRequest | undefined | void>
  ) {
    super(options, state);

    if (getIssues) {
      this.getIssues = getIssues;
    }

    if (listIssueComments) {
      this.listIssueComments = listIssueComments;
    }

    if (getLabelCreationDate) {
      this.getLabelCreationDate = async (
        issue: Issue,
        label: string
      ): Promise<{creationDate?: string; events: IIssueEvent[]}> => {
        const result = await getLabelCreationDate(issue, label);
        if (typeof result === 'string' || typeof result === 'undefined') {
          return {creationDate: result, events: []};
        }

        return result;
      };
    }

    if (hasOnlyStaleLabelingEventsSince) {
      this.hasOnlyStaleLabelingEventsSince = hasOnlyStaleLabelingEventsSince;
    }

    if (getPullRequest) {
      this.getPullRequest = getPullRequest;
    }
  }
}
