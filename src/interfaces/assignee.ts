// @todo improve to include the notion of team?
interface IAssignee {
  type: string;
}

export interface IUserAssignee extends IAssignee {
  login: string;
  type: 'User' | string;
}

export type Assignee = IUserAssignee;
