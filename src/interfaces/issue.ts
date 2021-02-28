import {IsoDateString} from '../types/iso-date-string';
import {IAssignee} from './assignee';
import {ILabel} from './label';
import {IMilestone} from './milestone';

export interface IIssue {
  title: string;
  number: number;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  labels: ILabel[];
  pull_request: Object | null | undefined;
  state: string;
  locked: boolean;
  milestone: IMilestone | undefined;
  assignees: IAssignee[];
}
