import {IsoOrRfcDateString} from '../types/iso-or-rfc-date-string';

export interface IIssuesProcessorOptions {
  repoToken: string;
  staleIssueMessage: string;
  stalePrMessage: string;
  closeIssueMessage: string;
  closePrMessage: string;
  daysBeforeIssueStale: number;
  daysBeforePrStale: number;
  daysBeforeIssueClose: number;
  daysBeforePrClose: number;
  staleIssueLabel: string;
  closeIssueLabel: string;
  exemptIssueLabels: string;
  stalePrLabel: string;
  closePrLabel: string;
  exemptPrLabels: string;
  onlyIssueLabels: string;
  onlyPrLabels: string;
  anyOfIssueLabels: string;
  anyOfPrLabels: string;
  operationsPerRun: number;
  removeIssueStaleWhenUpdated: boolean;
  removePrStaleWhenUpdated: boolean;
  debugOnly: boolean;
  ascending: boolean;
  deleteBranch: boolean;
  startDate: IsoOrRfcDateString | undefined; // Should be ISO 8601 or RFC 2822
  exemptIssueMilestones: string;
  exemptPrMilestones: string;
  exemptAllIssueMilestones: boolean;
  exemptAllPrMilestones: boolean;
  exemptIssueAssignees: string;
  exemptPrAssignees: string;
  exemptAllIssueAssignees: boolean;
  exemptAllPrAssignees: boolean;
  enableStatistics: boolean;
  labelsToRemoveWhenUnstale: string;
  labelsToAddWhenUnstale: string;
  ignoreIssueUpdates: boolean;
  ignorePrUpdates: boolean;
  exemptDraftPr: boolean;
}
