import {Issue} from '../issue';
import {StylingLoggerDecorator} from './styling-logger-decorator';
import {IssueLogger} from './issue-logger';
import {Logger} from './logger';

export class LoggerFactory {
  /**
   * Create generic logger with colors.
   */
  createLogger(): Logger {
    return new StylingLoggerDecorator(new Logger());
  }

  /**
   * Create issue specific logger.
   * @param issue Issue info to be used.
   */
  createIssueLogger(issue: Issue): Logger {
    return new StylingLoggerDecorator(new IssueLogger(issue));
  }
}
