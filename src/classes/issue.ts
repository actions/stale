import {isLabeled} from '../functions/is-labeled';
import {isPullRequest} from '../functions/is-pull-request';
import {Assignee} from '../interfaces/assignee';
import {IIssue, OctokitIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {ILabel} from '../interfaces/label';
import {IMilestone} from '../interfaces/milestone';
import {IsoDateString} from '../types/iso-date-string';
import {Operations} from './operations';

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
  isStale: boolean;
  markedStaleThisRun: boolean;
  operations = new Operations();
  private readonly _options: IIssuesProcessorOptions;
  readonly issue_type?: string;

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
    this.isStale = isLabeled(this, this.staleLabel);
    this.markedStaleThisRun = false;

    if (
      typeof (issue as any).type === 'object' &&
      (issue as any).type !== null
    ) {
      this.issue_type = (issue as any).type.name;
    } else {
      this.issue_type = undefined;
    }
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
