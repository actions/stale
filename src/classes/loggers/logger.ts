import * as core from '@actions/core';
import terminalLink from 'terminal-link';
import {Option} from '../../enums/option';
import {LoggerService} from '../../services/logger.service';

export class Logger {
  warning(...message: string[]): void {
    core.warning(LoggerService.whiteBright(message.join(' ')));
  }

  info(...message: string[]): void {
    core.info(LoggerService.whiteBright(message.join(' ')));
  }

  error(...message: string[]): void {
    core.error(LoggerService.whiteBright(message.join(' ')));
  }

  async grouping(message: string, fn: () => Promise<void>): Promise<void> {
    return core.group(LoggerService.whiteBright(message), fn);
  }

  createLink(name: Readonly<string>, link: Readonly<string>): string {
    return terminalLink(name, link);
  }

  createOptionLink(option: Readonly<Option>): string {
    return LoggerService.magenta(
      this.createLink(option, `https://github.com/actions/stale#${option}`)
    );
  }
}
