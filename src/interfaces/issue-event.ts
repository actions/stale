import {ILabel} from './label.js';
import {IUser} from './user.js';

export interface IIssueEvent {
  created_at: string;
  event: string;
  label: ILabel;
  actor?: IUser | null;
}
