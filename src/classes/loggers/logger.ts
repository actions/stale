import * as core from '@actions/core';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import {Option} from '../../enums/option';

export class Logger {
  warning(...message: string[]): void {
    core.warning(chalk.whiteBright(...message));
  }

  info(...message: string[]): void {
    core.info(chalk.whiteBright(...message));
  }

  error(...message: string[]): void {
    core.error(chalk.whiteBright(...message));
  }

  createLink(name: Readonly<string>, link: Readonly<string>): string {
    return terminalLink(name, link);
  }

  createOptionLink(option: Readonly<Option>): string {
    return chalk.magenta(
      this.createLink(option, `https://github.com/actions/stale#${option}`)
    );
  }
}
