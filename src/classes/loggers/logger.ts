import * as core from '@actions/core';
import styles from 'ansi-styles';
import terminalLink from 'terminal-link';
import {Option} from '../../enums/option';

export class Logger {
  warning(...message: string[]): void {
    core.warning(
      `${styles.whiteBright.open}${message.join(' ')}${
        styles.whiteBright.close
      }`
    );
  }

  info(...message: string[]): void {
    core.info(
      `${styles.whiteBright.open}${message.join(' ')}${
        styles.whiteBright.close
      }`
    );
  }

  error(...message: string[]): void {
    core.error(
      `${styles.whiteBright.open}${message.join(' ')}${
        styles.whiteBright.close
      }`
    );
  }

  createLink(name: Readonly<string>, link: Readonly<string>): string {
    return terminalLink(name, link);
  }

  createOptionLink(option: Readonly<Option>): string {
    return `${styles.magenta.open}${this.createLink(
      option,
      `https://github.com/actions/stale#${option}`
    )}${styles.magenta.close}`;
  }
}
