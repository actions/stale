import {IssueTypeEnum} from '../enums/issue-type.enum';

export function getIssueType(isPullRequest: Readonly<boolean>): IssueTypeEnum {
  return isPullRequest ? IssueTypeEnum.PULL_REQUEST : IssueTypeEnum.ISSUE;
}
