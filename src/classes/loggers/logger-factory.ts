import {Issue} from '../issue';
import {ChalkLoggerDecorator} from './chalk-logger-decorator';
import {IssueLogger} from './issue-logger';
import {Logger} from './logger';

export class LoggerFactory {
  /**
   * Create generic logger with colors.
   */
  createLogger(): Logger {
    return new ChalkLoggerDecorator(new Logger());
  }

  /**
   * Create issue specific logger.
   * @param issue Issue info to be used.
   */
  createIssueLogger(issue: Issue): Logger {
    return new ChalkLoggerDecorator(new IssueLogger(issue));
  }
}
