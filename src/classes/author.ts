import deburr from 'lodash.deburr';
import {Option} from '../enums/option';
import {wordsToList} from '../functions/words-to-list';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';
import {LoggerService} from '../services/logger.service';

export class Author {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;
  
  private readonly _anyOfAuthors: string[];

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);

    // allow-list of authors that should only be processed
    this._anyOfAuthors = wordsToList(options.anyOfAuthors);
  }

  shouldExemptAuthor(): boolean {
    if(this._issue.user === null) {
        return false;
    }

    if(this._anyOfAuthors.length > 0) {
        // if author is in the allow-list, return false to not skip processing this issue
        if(this._anyOfAuthors.indexOf(this._issue.user.login) > -1) {
            return false;
        }

        // else, return true to skip this issue because the 
        return true;
    }

    return false;
  }
}
