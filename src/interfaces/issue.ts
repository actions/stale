import {IsoDateString} from '../types/iso-date-string';
import {Assignee} from './assignee';
import {ILabel} from './label';
import {IMilestone} from './milestone';
import {components} from '@octokit/openapi-types';
export interface IIssue {
  title: string;
  number: number;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  labels: ILabel[];
  pull_request?: Object | null;
  state: string;
  locked: boolean;
  milestone?: IMilestone | null;
  assignees?: Assignee[] | null;
}

export type OctokitIssue = components['schemas']['issue'];
