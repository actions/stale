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
  exemptMilestones: string;
  exemptIssueMilestones: string;
  exemptPrMilestones: string;
  exemptAllMilestones: boolean;
  exemptAllIssueMilestones: boolean | undefined;
  exemptAllPrMilestones: boolean | undefined;
  exemptAssignees: string;
  exemptIssueAssignees: string;
  exemptPrAssignees: string;
  exemptAllAssignees: boolean;
  exemptAllIssueAssignees: boolean | undefined;
  exemptAllPrAssignees: boolean | undefined;
  enableStatistics: boolean;
  labelsToRemoveWhenUnstale: string;
  labelsToAddWhenUnstale: string;
  updatesResetStale: boolean;
  issueUpdatesResetStale: boolean | undefined;
  prUpdatesResetStale: boolean | undefined;
}
