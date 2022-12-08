import {components} from '@octokit/openapi-types';

export interface IUser {
  type: string | 'User';
  login: string;
}

export type OctokitUser = components['schemas']['nullable-simple-user'];