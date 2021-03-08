import {Logger} from '../../src/classes/loggers/logger';
import {LoggerFactory} from '../../src/classes/loggers/logger-factory';

/**
 * @description Creates Logger instances that won't generate any logs.
 * Useful for getting rid of verbose output while testing.
 */
export class NoopLoggerFactory extends LoggerFactory {
  createLogger(): Logger {
    return new NoopLogger();
  }

  createIssueLogger(): Logger {
    return new NoopLogger();
  }
}

class NoopLogger extends Logger {
  warning(): void {}

  info(): void {}

  error(): void {}

  createLink(): string {
    return 'noop_link';
  }

  createOptionLink(): string {
    return 'noop_link';
  }
}
