import {Issue} from '../../src/classes/issue';
import {IUserAssignee} from '../../src/interfaces/assignee';
import {IIssuesProcessorOptions} from '../../src/interfaces/issues-processor-options';
import {IsoDateString} from '../../src/types/iso-date-string';

export function generateIssue(
  options: IIssuesProcessorOptions,
  id: number,
  title: string,
  updatedAt: IsoDateString,
  createdAt: IsoDateString = updatedAt,
  draft = false,
  isPullRequest = false,
  labels: string[] = [],
  isClosed = false,
  isLocked = false,
  milestone: string | undefined = undefined,
  assignees: string[] = [],
  issue_type?: string
): Issue {
  return new Issue(options, {
    number: id,
    labels: labels.map(l => {
      return {name: l};
    }),
    title,
    created_at: createdAt,
    updated_at: updatedAt,
    draft: draft,
    pull_request: isPullRequest ? {} : null,
    state: isClosed ? 'closed' : 'open',
    locked: isLocked,
    milestone: milestone
      ? {
          title: milestone
        }
      : undefined,
    assignees: assignees.map((assignee: Readonly<string>): IUserAssignee => {
      return {
        login: assignee,
        type: 'User'
      };
    }),
    ...(issue_type ? {type: {name: issue_type}} : {})
  });
}
