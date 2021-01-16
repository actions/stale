import {Issue} from '../IssueProcessor';

export function isPullRequest(issue: Readonly<Issue>): boolean {
  return !!issue.pull_request;
}
