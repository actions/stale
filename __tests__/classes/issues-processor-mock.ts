import {Issue} from '../../src/classes/issue.js';
import {IssuesProcessor} from '../../src/classes/issues-processor.js';
import {IComment} from '../../src/interfaces/comment.js';
import {IIssuesProcessorOptions} from '../../src/interfaces/issues-processor-options.js';
import {IPullRequest} from '../../src/interfaces/pull-request.js';
import {IState} from '../../src/interfaces/state/state.js';
import {IIssueEvent} from '../../src/interfaces/issue-event.js';

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

    // tests should never incur real pagination backoff delays
    this.wait = async () => {};

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
