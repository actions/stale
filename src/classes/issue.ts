import {isLabeled} from '../functions/is-labeled';
import {isPullRequest} from '../functions/is-pull-request';
import {IAssignee} from '../interfaces/assignee';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {ILabel} from '../interfaces/label';
import {IMilestone} from '../interfaces/milestone';
import {IsoDateString} from '../types/iso-date-string';

export class Issue implements IIssue {
  protected readonly _options: IIssuesProcessorOptions;
  readonly title: string;
  readonly number: number;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  readonly labels: ILabel[];
  readonly pull_request: Object | null | undefined;
  readonly state: string | 'closed' | 'open';
  readonly locked: boolean;
  readonly milestone: IMilestone | undefined;
  readonly assignees: IAssignee[];
  isStale: boolean;

  constructor(
    options: Readonly<IIssuesProcessorOptions>,
    issue: Readonly<IIssue>
  ) {
    this._options = options;
    this.title = issue.title;
    this.number = issue.number;
    this.created_at = issue.created_at;
    this.updated_at = issue.updated_at;
    this.labels = issue.labels;
    this.pull_request = issue.pull_request;
    this.state = issue.state;
    this.locked = issue.locked;
    this.milestone = issue.milestone;
    this.assignees = issue.assignees;

    this.isStale = isLabeled(this, this.staleLabel);
  }

  get isPullRequest(): boolean {
    return isPullRequest(this);
  }

  get staleLabel(): string {
    return this._options.staleIssueLabel;
  }

  get staleMessage(): string {
    return this._options.staleIssueMessage;
  }

  get closeLabel(): string {
    return this._options.closeIssueLabel;
  }

  get closeMessage(): string {
    return this._options.closeIssueMessage;
  }

  get skipMessage(): boolean {
    return this._options.skipStaleIssueMessage;
  }

  get daysBeforeStale(): number {
    return isNaN(this._options.daysBeforeIssueStale)
      ? this._options.daysBeforeStale
      : this._options.daysBeforeIssueStale;
  }

  get daysBeforeClose(): number {
    return isNaN(this._options.daysBeforeIssueClose)
      ? this._options.daysBeforeClose
      : this._options.daysBeforeIssueClose;
  }

  get hasAssignees(): boolean {
    return this.assignees.length > 0;
  }

  get shouldBeStale(): boolean {
    return !this._updatedSince(this.updated_at, this.daysBeforeStale);
  }

  get hasUpdate(): boolean {
    return this._updatedSince(this.updated_at, this.daysBeforeClose);
  }

  hasAllLabels(labels: Readonly<string[]>): boolean {
    return labels.every(label => isLabeled(this, label));
  }

  hasAnyLabels(labels: string[]): boolean {
    return labels.some(label => isLabeled(this, label));
  }

  private _updatedSince(timestamp: string, num_days: number): boolean {
    const daysInMillis = 1000 * 60 * 60 * 24 * num_days;
    const millisSinceLastUpdated =
      new Date().getTime() - new Date(timestamp).getTime();

    return millisSinceLastUpdated <= daysInMillis;
  }
}
