import {Label} from '../IssueProcessor';
import {IMilestone} from './milestone';

export interface IIssue {
  title: string;
  number: number;
  updated_at: string;
  labels: Label[];
  pull_request: Object | undefined;
  state: string;
  locked: boolean;
  milestone: IMilestone;
}
