import * as core from '@actions/core';
import {isValidDate} from './functions/dates/is-valid-date';
import {IssueProcessor, IssueProcessorOptions} from './IssueProcessor';

async function run(): Promise<void> {
  try {
    const args = getAndValidateArgs();

    const processor: IssueProcessor = new IssueProcessor(args);
    await processor.processIssues();
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

function getAndValidateArgs(): IssueProcessorOptions {
  const args: IssueProcessorOptions = {
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
    operationsPerRun: parseInt(
      core.getInput('operations-per-run', {required: true})
    ),
    removeStaleWhenUpdated: !(
      core.getInput('remove-stale-when-updated') === 'false'
    ),
    debugOnly: core.getInput('debug-only') === 'true',
    ascending: core.getInput('ascending') === 'true',
    skipStalePrMessage: core.getInput('skip-stale-pr-message') === 'true',
    skipStaleIssueMessage: core.getInput('skip-stale-issue-message') === 'true',
    deleteBranch: core.getInput('delete-branch') === 'true',
    startDate:
      core.getInput('start-date') !== ''
        ? core.getInput('start-date')
        : undefined
  };

  for (const numberInput of [
    'days-before-stale',
    'days-before-issue-stale',
    'days-before-pr-stale',
    'days-before-close',
    'days-before-issue-close',
    'days-before-pr-close',
    'operations-per-run'
  ]) {
    if (isNaN(parseInt(core.getInput(numberInput)))) {
      throw Error(`input ${numberInput} did not parse to a valid integer`);
    }
  }

  for (const optionalDateInput of ['start-date']) {
    // Ignore empty dates because it is considered as the right type for a default value (so a valid one)
    if (core.getInput(optionalDateInput) !== '') {
      if (!isValidDate(new Date(core.getInput(optionalDateInput)))) {
        throw new Error(
          `input ${optionalDateInput} did not parse to a valid date`
        );
      }
    }
  }

  return args;
}

run();
