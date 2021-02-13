import {isLabeled} from '../functions/is-labeled';
import {isPullRequest} from '../functions/is-pull-request';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {ILabel} from '../interfaces/label';
import {IMilestone} from '../interfaces/milestone';
import {IsoDateString} from '../types/iso-date-string';

export class Issue implements IIssue {
  private readonly _options: IIssuesProcessorOptions;
  readonly title: string;
  readonly number: number;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  readonly labels: ILabel[];
  readonly pull_request: Object | null | undefined;
  readonly state: string;
  readonly locked: boolean;
  readonly milestone: IMilestone | undefined;
  readonly isPullRequest: boolean;
  readonly staleLabel: string;
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
