import * as core from '@actions/core';

export class Logger {
  warning(message: Readonly<string>): void {
    core.warning(message);
  }

  info(message: Readonly<string>): void {
    core.info(message);
  }

  error(message: Readonly<string>): void {
    core.error(message);
  }
}
