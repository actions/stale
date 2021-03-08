import * as core from '@actions/core';
import terminalLink from 'terminal-link';
import {Option} from '../../enums/option';

export class Logger {
  warning(...message: string[]): void {
    core.warning(message.join(' '));
  }

  info(...message: string[]): void {
    core.info(message.join(' '));
  }

  error(...message: string[]): void {
    core.error(message.join(' '));
  }

  createLink(name: Readonly<string>, link: Readonly<string>): string {
    return terminalLink(name, link);
  }

  createOptionLink(option: Readonly<Option>): string {
    return this.createLink(
      option,
      `https://github.com/actions/stale#${option}`
    );
  }
}
