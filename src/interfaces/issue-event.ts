import {ILabel} from './label';

export interface IIssueEvent {
  created_at: string;
  event: string;
  label: ILabel;
}
