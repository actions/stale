import {IssueType} from '../enums/issue-type.enum';

export function getIssueType(isPullRequest: Readonly<boolean>): IssueType {
  return isPullRequest ? IssueType.PULL_REQUEST : IssueType.ISSUE;
}
