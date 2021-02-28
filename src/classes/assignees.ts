import deburr from 'lodash.deburr';
import {wordsToList} from '../functions/words-to-list';
import {IAssignee} from '../interfaces/assignee';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

type CleanAssignee = string;

export class Assignees {
  private static _cleanAssignee(assignee: Readonly<string>): CleanAssignee {
    return deburr(assignee.toLowerCase());
  }

  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  shouldExemptAssignees(): boolean {
    if (!this._issue.hasAssignees) {
      this._issueLogger.info('This $$type has no assignee');
      this._logSkip();

      return false;
    }

    if (this._shouldExemptAllAssignees()) {
      this._issueLogger.info(
        'Skipping $$type because it has an exempt assignee'
      );

      return true;
    }

    const exemptAssignees: string[] = this._getExemptAssignees();

    if (exemptAssignees.length === 0) {
      this._issueLogger.info(
        `No option was specified to skip the stale process for this $$type`
      );
      this._logSkip();

      return false;
    }

    this._issueLogger.info(
      `Found ${exemptAssignees.length} assignee${
        exemptAssignees.length > 1 ? 's' : ''
      } on this $$type`
    );

    const hasExemptAssignee: boolean = exemptAssignees.some(
      (exemptAssignee: Readonly<string>): boolean =>
        this._hasAssignee(exemptAssignee)
    );

    if (!hasExemptAssignee) {
      this._issueLogger.info(
        'No assignee on this $$type can exempt the stale process'
      );
      this._logSkip();
    } else {
      this._issueLogger.info(
        'Skipping this $$type because it has an exempt assignee'
      );
    }

    return hasExemptAssignee;
  }

  private _getExemptAssignees(): string[] {
    return this._issue.isPullRequest
      ? this._getExemptPullRequestAssignees()
      : this._getExemptIssueAssignees();
  }

  private _getExemptIssueAssignees(): string[] {
    if (this._options.exemptIssueAssignees === '') {
      this._issueLogger.info(
        'The option "exemptIssueAssignees" is disabled. No specific assignee can skip the stale process for this $$type'
      );

      if (this._options.exemptAssignees === '') {
        this._issueLogger.info(
          'The option "exemptAssignees" is disabled. No specific assignee can skip the stale process for this $$type'
        );

        return [];
      }

      const exemptAssignees: string[] = wordsToList(
        this._options.exemptAssignees
      );

      this._issueLogger.info(
        `The option "exemptAssignees" is set. ${
          exemptAssignees.length
        } assignee${
          exemptAssignees.length === 1 ? '' : 's'
        } can skip the stale process for this $$type`
      );

      return exemptAssignees;
    }

    const exemptAssignees: string[] = wordsToList(
      this._options.exemptIssueAssignees
    );

    this._issueLogger.info(
      `The option "exemptIssueAssignees" is set. ${
        exemptAssignees.length
      } assignee${
        exemptAssignees.length === 1 ? '' : 's'
      } can skip the stale process for this $$type`
    );

    return exemptAssignees;
  }

  private _getExemptPullRequestAssignees(): string[] {
    if (this._options.exemptPrAssignees === '') {
      this._issueLogger.info(
        'The option "exemptPrAssignees" is disabled. No specific assignee can skip the stale process for this $$type'
      );

      if (this._options.exemptAssignees === '') {
        this._issueLogger.info(
          'The option "exemptAssignees" is disabled. No specific assignee can skip the stale process for this $$type'
        );

        return [];
      }

      const exemptAssignees: string[] = wordsToList(
        this._options.exemptAssignees
      );

      this._issueLogger.info(
        `The option "exemptAssignees" is set. ${
          exemptAssignees.length
        } assignee${
          exemptAssignees.length === 1 ? '' : 's'
        } can skip the stale process for this $$type`
      );

      return exemptAssignees;
    }

    const exemptAssignees: string[] = wordsToList(
      this._options.exemptPrAssignees
    );

    this._issueLogger.info(
      `The option "exemptPrAssignees" is set. ${
        exemptAssignees.length
      } assignee${
        exemptAssignees.length === 1 ? '' : 's'
      } can skip the stale process for this $$type`
    );

    return exemptAssignees;
  }

  private _hasAssignee(assignee: Readonly<string>): boolean {
    const cleanAssignee: CleanAssignee = Assignees._cleanAssignee(assignee);

    return this._issue.assignees.some(
      (issueAssignee: Readonly<IAssignee>): boolean => {
        const isSameAssignee: boolean =
          cleanAssignee === Assignees._cleanAssignee(issueAssignee.login);

        if (isSameAssignee) {
          this._issueLogger.info(
            `@${issueAssignee.login} is assigned on this $$type and is an exempt assignee`
          );
        }

        return isSameAssignee;
      }
    );
  }

  private _shouldExemptAllAssignees(): boolean {
    return this._issue.isPullRequest
      ? this._shouldExemptAllPullRequestAssignees()
      : this._shouldExemptAllIssueAssignees();
  }

  private _shouldExemptAllIssueAssignees(): boolean {
    if (this._options.exemptAllIssueAssignees === true) {
      this._issueLogger.info(
        'The option "exemptAllIssueAssignees" is enabled. Any assignee on this $$type will skip the stale process'
      );

      return true;
    } else if (this._options.exemptAllIssueAssignees === false) {
      this._issueLogger.info(
        'The option "exemptAllIssueAssignees" is disabled. Only some specific assignees on this $$type will skip the stale process'
      );

      return false;
    }

    this._logExemptAllAssigneesOption();

    return this._options.exemptAllAssignees;
  }

  private _shouldExemptAllPullRequestAssignees(): boolean {
    if (this._options.exemptAllPrAssignees === true) {
      this._issueLogger.info(
        'The option "exemptAllPrAssignees" is enabled. Any assignee on this $$type will skip the stale process'
      );

      return true;
    } else if (this._options.exemptAllPrAssignees === false) {
      this._issueLogger.info(
        'The option "exemptAllPrAssignees" is disabled. Only some specific assignees on this $$type will skip the stale process'
      );

      return false;
    }

    this._logExemptAllAssigneesOption();

    return this._options.exemptAllAssignees;
  }

  private _logExemptAllAssigneesOption(): void {
    if (this._options.exemptAllAssignees) {
      this._issueLogger.info(
        'The option "exemptAllAssignees" is enabled. Any assignee on this $$type will skip the stale process'
      );
    } else {
      this._issueLogger.info(
        'The option "exemptAllAssignees" is disabled. Only some specific assignees on this $$type will skip the stale process'
      );
    }
  }

  private _logSkip(): void {
    this._issueLogger.info('Skip the assignees checks');
  }
}
