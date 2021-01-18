import {Label} from '../IssueProcessor';
import {IsoDateString} from '../types/iso-date-string';
import {IMilestone} from './milestone';

export interface IIssue {
  title: string;
  number: number;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  labels: Label[];
  pull_request: Object | null | undefined;
  state: string;
  locked: boolean;
  milestone: IMilestone | undefined;
}
