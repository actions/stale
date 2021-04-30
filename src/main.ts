import * as core from '@actions/core';
import {IssuesProcessor} from './classes/issues-processor';
import {isValidDate} from './functions/dates/is-valid-date';
import {IIssuesProcessorOptions} from './interfaces/issues-processor-options';

async function _run(): Promise<void> {
  try {
    const args = _getAndValidateArgs();

    await new IssuesProcessor(args).processIssues();
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
    daysBeforeStale: parseInt(
      core.getInput('days-before-stale', {required: true})
    ),
    daysBeforeIssueStale: parseInt(core.getInput('days-before-issue-stale')),
    daysBeforePrStale: parseInt(core.getInput('days-before-pr-stale')),
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
      core.getInput('remove-issue-stale-when-updated')
    ),
    removePrStaleWhenUpdated: _toOptionalBoolean(
      core.getInput('remove-pr-stale-when-updated')
    ),
    debugOnly: core.getInput('debug-only') === 'true',
    ascending: core.getInput('ascending') === 'true',
    skipStalePrMessage: core.getInput('skip-stale-pr-message') === 'true',
    skipStaleIssueMessage: core.getInput('skip-stale-issue-message') === 'true',
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
    enableStatistics: core.getInput('enable-statistics') === 'true'
  };

  for (const numberInput of [
    'days-before-stale',
    'days-before-close',
    'operations-per-run'
  ]) {
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

  return args;
}

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

void _run();
