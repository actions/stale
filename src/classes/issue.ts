import {isLabeled} from '../functions/is-labeled';
import {isPullRequest} from '../functions/is-pull-request';
import {IIssue} from '../interfaces/issue';
import {IMilestone} from '../interfaces/milestone';
import {IssueProcessorOptions, Label} from '../IssueProcessor';

export class Issue implements IIssue {
  private readonly _options: IssueProcessorOptions;
  readonly title: string;
  readonly number: number;
  updated_at: string;
  readonly labels: Label[];
  readonly pull_request: any;
  readonly state: string;
  readonly locked: boolean;
  readonly milestone: IMilestone;
  readonly isPullRequest: boolean;
  isStale: boolean;
  readonly staleLabel: string;

  constructor(
    options: Readonly<IssueProcessorOptions>,
    issue: Readonly<IIssue>
  ) {
    this._options = options;
    this.title = issue.title;
    this.number = issue.number;
    this.updated_at = issue.updated_at;
    this.labels = issue.labels;
    this.pull_request = issue.pull_request;
    this.state = issue.state;
    this.locked = issue.locked;
    this.milestone = issue.milestone;

    this.isPullRequest = isPullRequest(this);
    this.staleLabel = this._getStaleLabel();
    this.isStale = isLabeled(this, this.staleLabel);
  }

  private _getStaleLabel(): string {
    return this.isPullRequest
      ? this._options.stalePrLabel
      : this._options.staleIssueLabel;
  }
}
