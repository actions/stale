import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Octokit from '@octokit/rest';

type Args = {
  token: string;
  repo_owner: string;
  repo_name: string;
  stale_age_days: number;
  wait_after_stale_days: number;
  max_operations_per_run: number;
  stale_label: string;
  stale_message: string;
};

async function run() {
  try {
    const args = getAndValidateArgs();

    const octokit = new github.GitHub(args.token);
    const issues = await octokit.issues.listForRepo({
      owner: args.repo_owner,
      repo: args.repo_name,
      state: 'open'
    });

    let operationsLeft = args.max_operations_per_run - 1;

    for (var issue of issues.data.values()) {
      core.debug(
        `found issue: ${issue.title} last updated ${issue.updated_at}`
      );

      if (isLabeledStale(issue, args.stale_label)) {
        if (wasLastUpdatedBefore(issue, args.wait_after_stale_days)) {
          operationsLeft -= await closeIssue(octokit, issue, args);
        } else {
          continue;
        }
      } else if (wasLastUpdatedBefore(issue, args.stale_age_days)) {
        operationsLeft -= await markStale(octokit, issue, args);
      }

      if (operationsLeft <= 0) {
        core.warning(
          `performed ${args.max_operations_per_run} operations, exiting to avoid rate limit`
        );
        break;
      }
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

function isLabeledStale(
  issue: Octokit.IssuesListForRepoResponseItem,
  label: string
) {
  return issue.labels.filter(i => i.name === label).length > 0;
}

function wasLastUpdatedBefore(
  issue: Octokit.IssuesListForRepoResponseItem,
  num_days: number
) {
  const daysInMillis = 1000 * 60 * 60 * num_days;
  const millisSinceLastUpdated =
    new Date().getTime() - new Date(issue.updated_at).getTime();
  core.debug(`${daysInMillis}, ${millisSinceLastUpdated}`);
  return millisSinceLastUpdated >= daysInMillis;
}

async function markStale(
  octokit: github.GitHub,
  issue: Octokit.IssuesListForRepoResponseItem,
  args: Args
) {
  core.debug(`marking issue${issue.title} as stale`);

  await octokit.issues.createComment({
    owner: args.repo_owner,
    repo: args.repo_name,
    issue_number: issue.number,
    body: args.stale_message
  });

  await octokit.issues.addLabels({
    owner: args.repo_owner,
    repo: args.repo_name,
    issue_number: issue.number,
    labels: [args.stale_label]
  });

  return 2; // operations performed
}

async function closeIssue(
  octokit: github.GitHub,
  issue: Octokit.IssuesListForRepoResponseItem,
  args: Args
) {
  core.debug(`closing issue ${issue.title} for being stale`);

  await octokit.issues.update({
    owner: args.repo_owner,
    repo: args.repo_name,
    issue_number: issue.number,
    state: 'closed'
  });

  return 1; // operations performed
}

function getAndValidateArgs(): Args {
  const args = {
    token: process.env.GITHUB_TOKEN || '',
    repo_owner: (process.env.GITHUB_REPOSITORY || '').split('/')[0],
    repo_name: (process.env.GITHUB_REPOSITORY || '').split('/')[1],
    stale_age_days: parseInt(core.getInput('stale_age_days')),
    wait_after_stale_days: parseInt(core.getInput('wait_after_stale_days')),
    max_operations_per_run: parseInt(core.getInput('max_operations_per_run')),
    stale_label: core.getInput('stale_label'),
    stale_message: core.getInput('stale_message')
  };

  if (!args.token) {
    throw new Error('could not resolve token from GITHUB_TOKEN');
  }

  if (!args.repo_owner || !args.repo_name) {
    throw new Error('could not resolve repo from GITHUB_REPOSITORY');
  }

  for (var stringInput of ['stale_label', 'stale_message']) {
    if (!args[stringInput]) {
      throw Error(`input ${stringInput} was empty`);
    }
  }

  for (var numberInput of [ 'stale_age_days', 'wait_after_stale_days', 'max_operations_per_run' ]) {
    if (isNaN(args[numberInput])) {
      throw Error(`input ${numberInput} did not parse to a valid integer`);
    }
  }

  return args;
}

run();
