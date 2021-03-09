import chalk from 'chalk';
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
export class IssueLogger extends Logger {
  private readonly _issue: Issue;

  constructor(issue: Issue) {
    super();
    this._issue = issue;
  }

  warning(...message: string[]): void {
    super.warning(this._format(...message));
  }

  info(...message: string[]): void {
    super.info(this._format(...message));
  }

  error(...message: string[]): void {
    super.error(this._format(...message));
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
    return `${this._getPrefix()} ${message}`;
  }

  private _getIssueNumber(): number {
    return this._issue.number;
  }

  private _format(...message: string[]): string {
    return this._prefixWithIssueNumber(this._replaceTokens(message.join(' ')));
  }

  private _getPrefix(): string {
    return this._issue.isPullRequest
      ? this._getPullRequestPrefix()
      : this._getIssuePrefix();
  }

  private _getIssuePrefix(): string {
    return chalk.red(`[#${this._getIssueNumber()}]`);
  }

  private _getPullRequestPrefix(): string {
    return chalk.blue(`[#${this._getIssueNumber()}]`);
  }
}
