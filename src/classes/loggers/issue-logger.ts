import * as core from '@actions/core';
import {Issue} from '../issue';
import {Logger} from './logger';

/**
 * @description
 * Each log will prefix the message with the issue number
 *
 * @example
 * warning('No stale') => "[#123] No stale"
 *
 * Each log method can have special tokens:
 * - $$type => will replace this by either "pull request" or "issue" depending of the type of issue
 *
 * @example
 * warning('The $$type will stale') => "The pull request will stale"
 */
export class IssueLogger implements Logger {
  private readonly _issue: Issue;

  constructor(issue: Issue) {
    this._issue = issue;
  }

  warning(message: Readonly<string>): void {
    core.warning(this._format(message));
  }

  info(message: Readonly<string>): void {
    core.info(this._format(message));
  }

  error(message: Readonly<string>): void {
    core.error(this._format(message));
  }

  private _replaceTokens(message: Readonly<string>): string {
    return this._replaceTypeToken(message);
  }

  private _replaceTypeToken(message: Readonly<string>): string {
    return message
      .replace(
        /^\$\$type/,
        this._issue.isPullRequest ? 'Pull request' : 'Issue'
      )
      .replace(
        /\$\$type/g,
        this._issue.isPullRequest ? 'pull request' : 'issue'
      );
  }

  private _prefixWithIssueNumber(message: Readonly<string>): string {
    return `[#${this._getIssueNumber()}] ${message}`;
  }

  private _getIssueNumber(): number {
    return this._issue.number;
  }

  private _format(message: Readonly<string>): string {
    return this._prefixWithIssueNumber(this._replaceTokens(message));
  }
}
