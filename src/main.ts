import * as core from '@actions/core';
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
  const args = {
    repoToken: core.getInput('repo-token', {required: true}),
    staleIssueMessage: core.getInput('stale-issue-message'),
    stalePrMessage: core.getInput('stale-pr-message'),
    closeIssueMessage: core.getInput('close-issue-message'),
    closePrMessage: core.getInput('close-pr-message'),
    daysBeforeStale: parseInt(
      core.getInput('days-before-stale', {required: true})
    ),
    daysBeforeClose: parseInt(
      core.getInput('days-before-close', {required: true})
    ),
    dateField: core.getInput('date-field', {required: false}),
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
    skipStaleIssueMessage: core.getInput('skip-stale-issue-message') === 'true'
  };

  for (const numberInput of [
    'days-before-stale',
    'days-before-close',
    'operations-per-run'
  ]) {
    if (!!core.getInput(numberInput) && isNaN(parseInt(core.getInput(numberInput)))) {
      throw Error(`input ${numberInput} did not parse to a valid integer`);
    }
  }

  return args;
}

run();
