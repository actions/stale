import {isLabeled} from '../functions/is-labeled';
import {isPullRequest} from '../functions/is-pull-request';
import {Assignee} from '../interfaces/assignee';
import {IIssue, OctokitIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {ILabel} from '../interfaces/label';
import {IOwnerRepo} from '../interfaces/owner-repo';
import {IMilestone} from '../interfaces/milestone';
import {IsoDateString} from '../types/iso-date-string';
import {Operations} from './operations';
import {OwnerRepo} from './owner-repo';

export class Issue implements IIssue {
  readonly title: string;
  readonly number: number;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  readonly draft: boolean;
  readonly labels: ILabel[];
  readonly pull_request: object | null | undefined;
  readonly state: string | 'closed' | 'open';
  readonly locked: boolean;
  readonly milestone?: IMilestone | null;
  readonly assignees: Assignee[];
  readonly repository_url?: string;
  isStale: boolean;
  markedStaleThisRun: boolean;
  readonly owner_repo: IOwnerRepo;
  operations = new Operations();
  private readonly _options: IIssuesProcessorOptions;

  constructor(
    options: Readonly<IIssuesProcessorOptions>,
    issue: Readonly<OctokitIssue> | Readonly<IIssue>
  ) {
    this._options = options;
    this.title = issue.title;
    this.number = issue.number;
    this.created_at = issue.created_at;
    this.updated_at = issue.updated_at;
    this.draft = Boolean(issue.draft);
    this.labels = mapLabels(issue.labels);
    this.pull_request = issue.pull_request;
    this.state = issue.state;
    this.locked = issue.locked;
    this.milestone = issue.milestone;
    this.assignees = issue.assignees || [];
    this.repository_url = issue.repository_url;
    this.isStale = isLabeled(this, this.staleLabel);
    this.markedStaleThisRun = false;
    this.owner_repo = new OwnerRepo(issue.repository_url || '');
  }

  get isPullRequest(): boolean {
    return isPullRequest(this);
  }

  get staleLabel(): string {
    return this._getStaleLabel();
  }

  get hasAssignees(): boolean {
    return this.assignees.length > 0;
  }

  private _getStaleLabel(): string {
    return this.isPullRequest
      ? this._options.stalePrLabel
      : this._options.staleIssueLabel;
  }
}

function mapLabels(labels: (string | ILabel)[] | ILabel[]): ILabel[] {
  return labels.map(label => {
    if (typeof label == 'string') {
      return {
        name: label
      };
    }
    return label;
  });
}
