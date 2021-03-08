import {IIssue} from '../interfaces/issue';

export function isPullRequest(issue: Readonly<IIssue>): boolean {
  return !!issue.pull_request;
}
