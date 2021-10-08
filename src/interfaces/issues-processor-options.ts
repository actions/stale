import {IsoOrRfcDateString} from '../types/iso-or-rfc-date-string';

export interface IIssuesProcessorOptions {
  repoToken: string;
  staleIssueMessage: string;
  stalePrMessage: string;
  closeIssueMessage: string;
  closePrMessage: string;
  daysBeforeStale: number;
  daysBeforeIssueStale: number; // Could be NaN
  daysBeforePrStale: number; // Could be NaN
  daysBeforeClose: number;
  daysBeforeIssueClose: number; // Could be NaN
  daysBeforePrClose: number; // Could be NaN
  staleIssueLabel: string;
  closeIssueLabel: string;
  exemptIssueLabels: string;
  stalePrLabel: string;
  closePrLabel: string;
  exemptPrLabels: string;
  onlyLabels: string;
  onlyIssueLabels: string;
  onlyPrLabels: string;
  anyOfLabels: string;
  anyOfIssueLabels: string;
  anyOfPrLabels: string;
  operationsPerRun: number;
  removeStaleWhenUpdated: boolean;
  removeIssueStaleWhenUpdated: boolean | undefined;
  removePrStaleWhenUpdated: boolean | undefined;
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
