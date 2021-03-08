import chalk from 'chalk';
import {Option} from '../../enums/option';
import {Logger} from './logger';

/**
 * @description Pretiffy log messages using chalk api
 */
export class ChalkLoggerDecorator extends Logger {
  constructor(private readonly _logger: Logger) {
    super();
  }

  warning(...message: string[]): void {
    this._logger.warning(chalk.whiteBright(...message));
  }

  info(...message: string[]): void {
    this._logger.info(chalk.whiteBright(...message));
  }

  error(...message: string[]): void {
    this._logger.error(chalk.whiteBright(...message));
  }

  createOptionLink(option: Readonly<Option>): string {
    return chalk.magenta(this._logger.createOptionLink(option));
  }
}
