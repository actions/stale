import {Option} from '../enums/option';
import {wordsToList} from '../functions/words-to-list';
import {IIssueEvent} from '../interfaces/issue-event';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';

/**
 * @description
 * This class is responsible for calculating the effective update time of an issue/PR
 * by filtering out label events that should be ignored when determining if an issue has been updated.
 * This is useful for excluding bot-added labels from being considered as human activity.
 */
export class IgnoredLabels {
  private readonly _options: IIssuesProcessorOptions;
  private readonly _issue: Issue;
  private readonly _issueLogger: IssueLogger;

  constructor(options: Readonly<IIssuesProcessorOptions>, issue: Issue) {
    this._options = options;
    this._issue = issue;
    this._issueLogger = new IssueLogger(issue);
  }

  /**
   * @description
   * Get the list of labels that should be ignored when determining if a PR has been updated
   *
   * @returns {string[]} The list of label names to ignore (case-insensitive)
   */
  getIgnoredLabels(): string[] {
    if (!this._issue.isPullRequest) {
      return [];
    }
    return this._getIgnoredPrLabels();
  }

  /**
   * @description
   * Calculate the effective update time for the issue/PR by filtering out ignored label events.
   * If there are events to filter, returns the most recent non-ignored event time.
   * If all events are ignored, returns the creation date.
   * If there are no ignored labels configured or no events, returns the original updated_at time.
   *
   * @param {IIssueEvent[]} events All events for the issue/PR
   * @returns {string} The effective update timestamp
   */
  getEffectiveUpdateDate(events: IIssueEvent[]): string {
    const ignoredLabels = this.getIgnoredLabels();

    // If no labels to ignore, or no events found, return original updated_at
    if (ignoredLabels.length === 0 || events.length === 0) {
      return this._issue.updated_at;
    }

    // Filter events to find the most recent non-ignored event
    // We look for events that are NOT labeled/unlabeled events with ignored labels
    const nonIgnoredEvents = events.filter(event => {
      // If it's not a label event, keep it
      if (event.event !== 'labeled' && event.event !== 'unlabeled') {
        return true;
      }

      // If it's a label event, check if the label is in the ignored list and filter it out
      const isEventFromIgnoredLabel = ignoredLabels
        .map(label => label.toLowerCase())
        .includes(event.label?.name?.toLowerCase() || '');

      return !isEventFromIgnoredLabel;
    });

    // If we have non-ignored events, return the most recent one
    if (nonIgnoredEvents.length > 0) {
      const mostRecentEvent = nonIgnoredEvents.reduce((latest, current) => {
        return new Date(latest.created_at) > new Date(current.created_at)
          ? latest
          : current;
      });

      this._issueLogger.info(
        `Most recent non-ignored activity: ${mostRecentEvent.event} at ${mostRecentEvent.created_at} (ignoring activity from labels: ${ignoredLabels})`
      );
      return mostRecentEvent.created_at;
    }

    // If all events are ignored label events, use the creation date
    this._issueLogger.info(
      `All recent activity is from ignored labels (${ignoredLabels}). Using creation date as effective update date: ${this._issue.created_at}`
    );
    return this._issue.created_at;
  }

  private _getIgnoredPrLabels(): string[] {
    if (this._options.ignoreLabelsActivityUpdatesOnPr) {
      this._issueLogger.info(
        `The option ${this._issueLogger.createOptionLink(
          Option.IgnoreLabelsActivityUpdatesOnPr
        )} is set. Activity from these labels will be ignored when checking for updates: ${
          this._options.ignoreLabelsActivityUpdatesOnPr
        }`
      );
      return wordsToList(this._options.ignoreLabelsActivityUpdatesOnPr);
    }

    return [];
  }
}
