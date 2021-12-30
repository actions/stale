import {Issue} from '../classes/issue';

export function isPullRequest(issue: Readonly<Issue>): boolean {
  return !!issue.pull_request;
}
