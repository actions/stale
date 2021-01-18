import {IssueType} from '../enums/issue-type';

export function getIssueType(isPullRequest: Readonly<boolean>): IssueType {
  return isPullRequest ? IssueType.PullRequest : IssueType.Issue;
}
