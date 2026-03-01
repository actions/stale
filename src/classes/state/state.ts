import {IState} from '../../interfaces/state/state';
import * as core from '@actions/core';
import {IIssuesProcessorOptions} from '../../interfaces/issues-processor-options';
import {IStateStorage} from '../../interfaces/state/state-storage';
import {IIssue} from '../../interfaces/issue';

export type IssueID = number;

export class NoStateError extends Error {}

export class State implements IState {
  /**
   * @private don't mutate in the debug mode
   */
  private readonly debug: boolean;
  private readonly processedIssuesIDs: Set<IssueID>;
  private readonly stateStorage: IStateStorage;

  constructor(stateStorage: IStateStorage, options: IIssuesProcessorOptions) {
    this.debug = options.debugOnly;
    this.processedIssuesIDs = new Set();
    this.stateStorage = stateStorage;
  }

  isIssueProcessed(issue: IIssue) {
    return this.processedIssuesIDs.has(issue.number);
  }

  addIssueToProcessed(issue: IIssue) {
    core.debug(`state: mark ${issue.number} as processed`);
    this.processedIssuesIDs.add(issue.number);
  }

  reset() {
    core.debug('state: reset');
    this.processedIssuesIDs.clear();
  }

  private deserialize(serialized: string) {
    const issueIDs = serialized
      .split('|')
      .map(id => parseInt(id))
      .filter(i => !isNaN(i));
    this.processedIssuesIDs.clear();
    issueIDs.forEach(issueID => this.processedIssuesIDs.add(issueID));
  }

  private get serialized(): string {
    return Array.from(this.processedIssuesIDs).join('|');
  }

  async persist(): Promise<void> {
    if (this.debug) {
      core.warning('The state is not persisted in the debug mode');
      return;
    }
    core.info(
      `state: persisting info about ${this.processedIssuesIDs.size} issue(s)`
    );
    return this.stateStorage.save(this.serialized);
  }

  async restore(): Promise<void> {
    this.reset();
    const serialized = await this.stateStorage.restore();
    this.deserialize(serialized);
    if (this.processedIssuesIDs.size > 0)
      core.info(
        `state: restored with info about ${this.processedIssuesIDs.size} issue(s)`
      );
  }
}
