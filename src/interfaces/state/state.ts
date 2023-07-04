import {IIssue} from '../issue';

export interface IState {
  isIssueProcessed(issue: IIssue): boolean;
  addIssueToProcessed(issue: IIssue): void;
  reset(): void;
  persist(): Promise<void>;
  restore(): Promise<void>;
}
