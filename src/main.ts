import * as core from '@actions/core';
import {IssuesProcessor} from './classes/issues-processor';
import {isValidDate} from './functions/dates/is-valid-date';
import {IIssuesProcessorOptions} from './interfaces/issues-processor-options';
import {Issue} from './classes/issue';
import {getStateInstance} from './services/state.service';

async function _run(): Promise<void> {
  try {
    const args = _getAndValidateArgs();

    const state = getStateInstance(args);
    await state.restore();

    const issueProcessor: IssuesProcessor = new IssuesProcessor(args, state);

    const rateLimitAtStart = await issueProcessor.getRateLimit();
    if (rateLimitAtStart) {
      core.debug(
        `Github API rate status: limit=${rateLimitAtStart.limit}, used=${rateLimitAtStart.used}, remaining=${rateLimitAtStart.remaining}`
      );
    }

    await issueProcessor.processIssues();

    const rateLimitAtEnd = await issueProcessor.getRateLimit();

    if (rateLimitAtEnd) {
      core.debug(
        `Github API rate status: limit=${rateLimitAtEnd.limit}, used=${rateLimitAtEnd.used}, remaining=${rateLimitAtEnd.remaining}`
      );

      if (rateLimitAtStart)
        core.info(
          `Github API rate used: ${
            rateLimitAtStart.remaining - rateLimitAtEnd.remaining
          }`
        );

      core.info(
        `Github API rate remaining: ${rateLimitAtEnd.remaining}; reset at: ${rateLimitAtEnd.reset}`
      );
    }

    await state.persist();

    await processOutput(
      issueProcessor.staleIssues,
      issueProcessor.closedIssues
    );
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

function _getAndValidateArgs(): IIssuesProcessorOptions {
  const args: IIssuesProcessorOptions = {
    repoToken: core.getInput('repo-token'),
    staleIssueMessage: core.getInput('stale-issue-message'),
    stalePrMessage: core.getInput('stale-pr-message'),
    closeIssueMessage: core.getInput('close-issue-message'),
    closePrMessage: core.getInput('close-pr-message'),
    daysBeforeStale: parseFloat(
      core.getInput('days-before-stale', {required: true})
    ),
    daysBeforeIssueStale: parseFloat(core.getInput('days-before-issue-stale')),
    daysBeforePrStale: parseFloat(core.getInput('days-before-pr-stale')),
    daysBeforeClose: parseInt(
      core.getInput('days-before-close', {required: true})
    ),
    daysBeforeIssueClose: parseInt(core.getInput('days-before-issue-close')),
    daysBeforePrClose: parseInt(core.getInput('days-before-pr-close')),
    staleIssueLabel: core.getInput('stale-issue-label', {required: true}),
    closeIssueLabel: core.getInput('close-issue-label'),
    exemptIssueLabels: core.getInput('exempt-issue-labels'),
    stalePrLabel: core.getInput('stale-pr-label', {required: true}),
    closePrLabel: core.getInput('close-pr-label'),
    exemptPrLabels: core.getInput('exempt-pr-labels'),
    onlyLabels: core.getInput('only-labels'),
    onlyIssueLabels: core.getInput('only-issue-labels'),
    onlyPrLabels: core.getInput('only-pr-labels'),
    anyOfLabels: core.getInput('any-of-labels'),
    anyOfIssueLabels: core.getInput('any-of-issue-labels'),
    anyOfPrLabels: core.getInput('any-of-pr-labels'),
    operationsPerRun: parseInt(
      core.getInput('operations-per-run', {required: true})
    ),
    removeStaleWhenUpdated: !(
      core.getInput('remove-stale-when-updated') === 'false'
    ),
    removeIssueStaleWhenUpdated: _toOptionalBoolean(
      'remove-issue-stale-when-updated'
    ),
    removePrStaleWhenUpdated: _toOptionalBoolean(
      'remove-pr-stale-when-updated'
    ),
    debugOnly: core.getInput('debug-only') === 'true',
    ascending: core.getInput('ascending') === 'true',
    sortBy: _processParamtoString(core.getInput('sort-by')),
    deleteBranch: core.getInput('delete-branch') === 'true',
    startDate:
      core.getInput('start-date') !== ''
        ? core.getInput('start-date')
        : undefined,
    exemptMilestones: core.getInput('exempt-milestones'),
    exemptIssueMilestones: core.getInput('exempt-issue-milestones'),
    exemptPrMilestones: core.getInput('exempt-pr-milestones'),
    exemptAllMilestones: core.getInput('exempt-all-milestones') === 'true',
    exemptAllIssueMilestones: _toOptionalBoolean('exempt-all-issue-milestones'),
    exemptAllPrMilestones: _toOptionalBoolean('exempt-all-pr-milestones'),
    exemptAssignees: core.getInput('exempt-assignees'),
    exemptIssueAssignees: core.getInput('exempt-issue-assignees'),
    exemptPrAssignees: core.getInput('exempt-pr-assignees'),
    exemptAllAssignees: core.getInput('exempt-all-assignees') === 'true',
    exemptAllIssueAssignees: _toOptionalBoolean('exempt-all-issue-assignees'),
    exemptAllPrAssignees: _toOptionalBoolean('exempt-all-pr-assignees'),
    enableStatistics: core.getInput('enable-statistics') === 'true',
    labelsToRemoveWhenStale: core.getInput('labels-to-remove-when-stale'),
    labelsToRemoveWhenUnstale: core.getInput('labels-to-remove-when-unstale'),
    labelsToAddWhenUnstale: core.getInput('labels-to-add-when-unstale'),
    ignoreUpdates: core.getInput('ignore-updates') === 'true',
    ignoreIssueUpdates: _toOptionalBoolean('ignore-issue-updates'),
    ignorePrUpdates: _toOptionalBoolean('ignore-pr-updates'),
    exemptDraftPr: core.getInput('exempt-draft-pr') === 'true',
    closeIssueReason: core.getInput('close-issue-reason'),
    includeOnlyAssigned: core.getInput('include-only-assigned') === 'true'
  };

  for (const numberInput of ['days-before-stale']) {
    if (isNaN(parseFloat(core.getInput(numberInput)))) {
      const errorMessage = `Option "${numberInput}" did not parse to a valid float`;
      core.setFailed(errorMessage);
      throw new Error(errorMessage);
    }
  }

  for (const numberInput of ['days-before-close', 'operations-per-run']) {
    if (isNaN(parseInt(core.getInput(numberInput)))) {
      const errorMessage = `Option "${numberInput}" did not parse to a valid integer`;
      core.setFailed(errorMessage);
      throw new Error(errorMessage);
    }
  }

  for (const optionalDateInput of ['start-date']) {
    // Ignore empty dates because it is considered as the right type for a default value (so a valid one)
    if (core.getInput(optionalDateInput) !== '') {
      if (!isValidDate(new Date(core.getInput(optionalDateInput)))) {
        const errorMessage = `Option "${optionalDateInput}" did not parse to a valid date`;
        core.setFailed(errorMessage);
        throw new Error(errorMessage);
      }
    }
  }

  const validCloseReasons = ['', 'completed', 'not_planned'];
  if (!validCloseReasons.includes(args.closeIssueReason)) {
    const errorMessage = `Unrecognized close-issue-reason "${
      args.closeIssueReason
    }", valid values are: ${validCloseReasons.filter(Boolean).join(', ')}`;
    core.setFailed(errorMessage);
    throw new Error(errorMessage);
  }

  return args;
}

async function processOutput(
  staledIssues: Issue[],
  closedIssues: Issue[]
): Promise<void> {
  core.setOutput('staled-issues-prs', JSON.stringify(staledIssues));
  core.setOutput('closed-issues-prs', JSON.stringify(closedIssues));
}

/**
 * @description
 * From an argument name, get the value as an optional boolean
 * This is very useful for all the arguments that override others
 * It will allow us to easily use the original one when the return value is `undefined`
 * Which is different from `true` or `false` that consider the argument as set
 *
 * @param {Readonly<string>} argumentName The name of the argument to check
 *
 * @returns {boolean | undefined} The value matching the given argument name
 */
function _toOptionalBoolean(
  argumentName: Readonly<string>
): boolean | undefined {
  const argument: string = core.getInput(argumentName);

  if (argument === 'true') {
    return true;
  } else if (argument === 'false') {
    return false;
  }

  return undefined;
}

function _processParamtoString(
  sortByValueInput: string
): 'created' | 'updated' | 'comments' {
  return sortByValueInput === 'updated'
    ? 'updated'
    : sortByValueInput === 'comments'
    ? 'comments'
    : 'created';
}

void _run();
