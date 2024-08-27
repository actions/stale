import {IsoDateString} from '../types/iso-date-string';
import {Assignee} from './assignee';
import {ILabel} from './label';
import {IMilestone} from './milestone';
import {components} from '@octokit/openapi-types';
import { IUser } from './user';
export interface IIssue {
  title: string;
  number: number;
  user: IUser;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  draft: boolean;
  labels: ILabel[];
  pull_request?: object | null;
  state: string;
  locked: boolean;
  milestone?: IMilestone | null;
  assignees?: Assignee[] | null;
}

export type OctokitIssue = components['schemas']['issue'];