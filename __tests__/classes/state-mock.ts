import {IState} from '../../src/interfaces/state/state';
import {IIssue} from '../../src/interfaces/issue';

export class StateMock implements IState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addIssueToProcessed(issue: IIssue) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isIssueProcessed(issue: IIssue) {
    return false;
  }

  persist(): Promise<void> {
    return Promise.resolve(undefined);
  }

  restore(): Promise<void> {
    return Promise.resolve(undefined);
  }

  reset() {}
}

export const alwaysFalseStateMock = new StateMock();
