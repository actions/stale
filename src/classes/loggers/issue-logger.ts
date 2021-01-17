import * as core from '@actions/core';
import {Issue} from '../issue';
import {Logger} from './logger';

export class IssueLogger implements Logger {
  private readonly _issue: Issue;

  constructor(issue: Issue) {
    this._issue = issue;
  }

  warning(message: Readonly<string>): void {
    core.warning(this._prefixWithIssueNumber(message));
  }

  info(message: Readonly<string>): void {
    core.info(this._prefixWithIssueNumber(message));
  }

  error(message: Readonly<string>): void {
    core.error(this._prefixWithIssueNumber(message));
  }

  private _prefixWithIssueNumber(message: Readonly<string>): string {
    return `[#${this._getIssueNumber()}] ${message}`;
  }

  private _getIssueNumber(): number {
    return this._issue.number;
  }
}
