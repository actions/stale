# Close Stale Issues and PRs

Warns and then closes issues and PRs that have had no activity for a specified amount of time.

The configuration must be on the default branch and the default values will:

- Add a label "Stale" on issues and pull requests after 60 days of inactivity and comment on them
- Close the stale issues and pull requests after 7 days of inactivity
- If an update/comment occur on stale issues or pull requests, the stale label will be removed and the timer will restart

## Recommended permissions

For the execution of this action, it must be able to fetch all issues and pull requests from your repository.  
In addition, based on the provided configuration, the action could require more permission(s) (e.g.: add label, remove label, comment, close, etc.).  
This can be achieved with the following [configuration in the action](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#permissions) if the permissions are restricted:

```yaml
permissions:
  issues: write
  pull-requests: write
```

You can find more information about the required permissions under the corresponding options that you wish to use.

## All options

### List of input options

Every argument is optional.

| Input                                                               | Description                                                                 | Default               |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| [repo-token](#repo-token)                                           | PAT for GitHub API authentication                                           | `${{ github.token }}` |
| [days-before-stale](#days-before-stale)                             | Idle number of days before marking issues/PRs stale                         | `60`                  |
| [days-before-issue-stale](#days-before-issue-stale)                 | Override [days-before-stale](#days-before-stale) for issues only            |                       |
| [days-before-pr-stale](#days-before-pr-stale)                       | Override [days-before-stale](#days-before-stale) for PRs only               |                       |
| [days-before-close](#days-before-close)                             | Idle number of days before closing stale issues/PRs                         | `7`                   |
| [days-before-issue-close](#days-before-issue-close)                 | Override [days-before-close](#days-before-close) for issues only            |                       |
| [days-before-pr-close](#days-before-pr-close)                       | Override [days-before-close](#days-before-close) for PRs only               |                       |
| [stale-issue-message](#stale-issue-message)                         | Comment on the staled issues                                                |                       |
| [stale-pr-message](#stale-pr-message)                               | Comment on the staled PRs                                                   |                       |
| [close-issue-message](#close-issue-message)                         | Comment on the staled issues while closed                                   |                       |
| [close-pr-message](#close-pr-message)                               | Comment on the staled PRs while closed                                      |                       |
| [stale-issue-label](#stale-issue-label)                             | Label to apply on staled issues                                             | `Stale`               |
| [close-issue-label](#close-issue-label)                             | Label to apply on closed issues                                             |                       |
| [stale-pr-label](#stale-pr-label)                                   | Label to apply on staled PRs                                                | `Stale`               |
| [close-pr-label](#close-pr-label)                                   | Label to apply on closed PRs                                                |                       |
| [exempt-issue-labels](#exempt-issue-labels)                         | Labels on issues exempted from stale                                        |                       |
| [exempt-pr-labels](#exempt-pr-labels)                               | Labels on PRs exempted from stale                                           |                       |
| [only-labels](#only-labels)                                         | Only issues/PRs with ALL these labels are checked                           |                       |
| [only-issue-labels](#only-issue-labels)                             | Override [only-labels](#only-labels) for issues only                        |                       |
| [only-pr-labels](#only-pr-labels)                                   | Override [only-labels](#only-labels) for PRs only                           |                       |
| [any-of-labels](#any-of-labels)                                     | Only issues/PRs with ANY of these labels are checked                        |                       |
| [any-of-issue-labels](#any-of-issue-labels)                         | Override [any-of-labels](#any-of-labels) for issues only                    |                       |
| [any-of-pr-labels](#any-of-pr-labels)                               | Override [any-of-labels](#any-of-labels) for PRs only                       |                       |
| [operations-per-run](#operations-per-run)                           | Max number of operations per run                                            | `30`                  |
| [remove-stale-when-updated](#remove-stale-when-updated)             | Remove stale label from issues/PRs on updates                               | `true`                |
| [remove-issue-stale-when-updated](#remove-issue-stale-when-updated) | Remove stale label from issues on updates/comments                          |                       |
| [remove-pr-stale-when-updated](#remove-pr-stale-when-updated)       | Remove stale label from PRs on updates/comments                             |                       |
| [labels-to-add-when-unstale](#labels-to-add-when-unstale)           | Add specified labels from issues/PRs when they become unstale               |                       |
| [labels-to-remove-when-unstale](#labels-to-remove-when-unstale)     | Remove specified labels from issues/PRs when they become unstale            |                       |
| [debug-only](#debug-only)                                           | Dry-run                                                                     | `false`               |
| [ascending](#ascending)                                             | Order to get issues/PRs                                                     | `false`               |
| [start-date](#start-date)                                           | Skip stale action for issues/PRs created before it                          |                       |
| [delete-branch](#delete-branch)                                     | Delete branch after closing a stale PR                                      | `false`               |
| [exempt-milestones](#exempt-milestones)                             | Milestones on issues/PRs exempted from stale                                |                       |
| [exempt-issue-milestones](#exempt-issue-milestones)                 | Override [exempt-milestones](#exempt-milestones) for issues only            |                       |
| [exempt-pr-milestones](#exempt-pr-milestones)                       | Override [exempt-milestones](#exempt-milestones) for PRs only               |                       |
| [exempt-all-milestones](#exempt-all-milestones)                     | Exempt all issues/PRs with milestones from stale                            | `false`               |
| [exempt-all-issue-milestones](#exempt-all-issue-milestones)         | Override [exempt-all-milestones](#exempt-all-milestones) for issues only    |                       |
| [exempt-all-pr-milestones](#exempt-all-pr-milestones)               | Override [exempt-all-milestones](#exempt-all-milestones) for PRs only       |                       |
| [exempt-assignees](#exempt-assignees)                               | Assignees on issues/PRs exempted from stale                                 |                       |
| [exempt-issue-assignees](#exempt-issue-assignees)                   | Override [exempt-assignees](#exempt-assignees) for issues only              |                       |
| [exempt-pr-assignees](#exempt-pr-assignees)                         | Override [exempt-assignees](#exempt-assignees) for PRs only                 |                       |
| [exempt-all-assignees](#exempt-all-assignees)                       | Exempt all issues/PRs with assignees from stale                             | `false`               |
| [exempt-all-issue-assignees](#exempt-all-issue-assignees)           | Override [exempt-all-assignees](#exempt-all-assignees) for issues only      |                       |
| [exempt-all-pr-assignees](#exempt-all-pr-assignees)                 | Override [exempt-all-assignees](#exempt-all-assignees) for PRs only         |                       |
| [exempt-draft-pr](#exempt-draft-pr)                                 | Skip the stale action for draft PRs                                         | `false`               |
| [enable-statistics](#enable-statistics)                             | Display statistics in the logs                                              | `true`                |
| [ignore-updates](#ignore-updates)                                   | Any update (update/comment) can reset the stale idle time on the issues/PRs | `false`               |
| [ignore-issue-updates](#ignore-issue-updates)                       | Override [ignore-updates](#ignore-updates) for issues only                  |                       |
| [ignore-pr-updates](#ignore-pr-updates)                             | Override [ignore-updates](#ignore-updates) for PRs only                     |                       |

### List of output options

| Output            | Description                                 |
| ----------------- | ------------------------------------------- |
| staled-issues-prs | List of all staled issues and pull requests |
| closed-issues-prs | List of all closed issues and pull requests |

### Detailed options

#### repo-token

Personal Access Token (PAT) that allows the stale workflow to authenticate and perform API calls to GitHub.  
Under the hood, it uses the [@actions/github](https://www.npmjs.com/package/@actions/github) package.

Default value: `${{ github.token }}`

#### days-before-stale

The idle number of days before marking the issues or the pull requests as stale (by adding a label).  
The issues or the pull requests will be marked as stale if the last update (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`) is older than the idle number of days.  
It means that any updates made, or any comments added to the issues or to the pull requests will restart the counter of days before marking as stale.  
However, if you wish to ignore this behaviour so that the creation date (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `created_at`) only matters, you can disable the [ignore-updates](#ignore-updates) option.

If set to a negative number like `-1`, no issues or pull requests will be marked as stale automatically.  
In that case, you can still add the stale label manually to mark as stale.

The label used to stale is defined by these two options:

- [stale-issue-label](#stale-issue-label)
- [stale-pr-label](#stale-pr-label)

A comment can also be added to notify about the stale and is defined by these two options:

- [stale-issue-message](#stale-issue-message)
- [stale-pr-message](#stale-pr-message)

You can fine tune which issues or pull requests should be marked as stale based on the milestones, the assignees, the creation date and the missing/present labels from these options:

- [exempt-issue-labels](#exempt-issue-labels)
- [exempt-pr-labels](#exempt-pr-labels)
- [only-labels](#only-labels)
- [any-of-labels](#any-of-labels)
- [start-date](#start-date)
- [exempt-milestones](#exempt-milestones)
- [exempt-all-milestones](#exempt-all-milestones)
- [exempt-assignees](#exempt-assignees)
- [exempt-all-assignees](#exempt-all-assignees)
- [ignore-updates](#ignore-updates)

Default value: `60`

#### days-before-issue-stale

Useful to override [days-before-stale](#days-before-stale) but only for the idle number of days before marking the issues as stale.

Default value: unset

#### days-before-pr-stale

Useful to override [days-before-stale](#days-before-stale) but only for the idle number of days before marking the pull requests as stale.

Default value: unset

#### days-before-close

The idle number of days before closing the stale issues or the stale pull requests (due to the stale label).  
The issues or the pull requests will be closed if the last update (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`) is older than the idle number of days.  
Since adding the stale label will alter the last update date, we can calculate the number of days from this date.

If set to a negative number like `-1`, the issues or the pull requests will never be closed automatically.

The label used to stale is defined by these two options:

- [stale-issue-label](#stale-issue-label)
- [stale-pr-label](#stale-pr-label)

Default value: `7`

#### days-before-issue-close

Override [days-before-close](#days-before-close) but only for the idle number of days before closing the stale issues.

Default value: unset

#### days-before-pr-close

Override [days-before-close](#days-before-close) but only for the idle number of days before closing the stale pull requests.

Default value: unset

#### stale-issue-message

The message that will be added as a comment to the issues when the stale workflow marks it automatically as stale with a label.

You can skip the comment sending by passing an empty string.

Default value: unset  
Required Permission: `issues: write`

#### stale-pr-message

The message that will be added as a comment to the pull requests when the stale workflow marks it automatically as stale with a label.

You can skip the comment sending by passing an empty string.

Default value: unset  
Required Permission: `pull-requests: write`

#### close-issue-message

The message that will be added as a comment to the issues when the stale workflow closes it automatically after being stale for too long.

Default value: unset  
Required Permission: `issues: write`

#### close-pr-message

The message that will be added as a comment to the pull requests when the stale workflow closes it automatically after being stale for too long.

Default value: unset  
Required Permission: `pull-requests: write`

#### stale-issue-label

The label that will be added to the issues when automatically marked as stale.  
If you wish to speedup the stale workflow for the issues, you can add this label manually to mark as stale.

Default value: `Stale`  
Required Permission: `issues: write`

#### close-issue-label

The label that will be added to the issues when closed automatically.  
It will be automatically removed if the issues are no longer closed nor locked.

Default value: unset  
Required Permission: `issues: write`

#### stale-pr-label

The label that will be added to the pull requests when automatically marked as stale.  
If you wish to speedup the stale workflow for the pull requests, you can add this label manually to mark as stale.

Default value: `Stale`  
Required Permission: `pull-requests: write`

#### close-pr-label

The label that will be added to the pull requests when closed automatically.  
It will be automatically removed if the pull requests are no longer closed nor locked.

Default value: unset  
Required Permission: `pull-requests: write`

#### exempt-issue-labels

The label(s) that can exempt to automatically mark as stale the issues.  
It can be a comma separated list of labels (e.g: `question,bug`).

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

#### exempt-pr-labels

The label(s) that can exempt to automatically mark as stale the pull requests.  
It can be a comma separated list of labels (e.g: `need-help,WIP`).

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

#### only-labels

An allow-list of label(s) to only process the issues or the pull requests that contain all these label(s).  
It can be a comma separated list of labels (e.g: `answered,needs-rebase`).

If unset (or an empty string), this option will not alter the stale workflow.

If you wish to only check that the issues or the pull requests contain one of these label(s), use instead [any-of-labels](#any-of-labels).

Default value: unset

#### only-issue-labels

Override [only-labels](#only-labels) but only to process the issues that contain all these label(s).

Default value: unset

#### only-pr-labels

Override [only-labels](#only-labels) but only to process the pull requests that contain all these label(s).

Default value: unset

#### any-of-labels

An allow-list of label(s) to only process the issues or the pull requests that contain one of these label(s).  
It can be a comma separated list of labels (e.g: `answered,needs-rebase`).

If unset (or an empty string), this option will not alter the stale workflow.

If you wish to only check that the issues or the pull requests contain all these label(s), use instead [only-labels](#only-labels).

Default value: unset

#### any-of-issue-labels

Override [any-of-labels](#any-of-labels) but only to process the issues that contain one of these label(s).

Default value: unset

#### any-of-pr-labels

Override [any-of-labels](#any-of-labels) but only to process the pull requests that contain one of these label(s).

Default value: unset

#### operations-per-run

_Context:_  
This action performs some API calls to GitHub to fetch or close issues and pull requests, set or update labels, add comments, delete branches, etc.  
These operations are made in a very short period of time — because the action is very fast to run — and can be numerous based on your project action configuration and the quantity of issues and pull requests within it.  
GitHub has a [rate limit](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) and if reached will block these API calls for one hour (or API calls from other actions using the same user (a.k.a.: the github-token from the [repo-token](#repo-token) option)).  
This option helps you to stay within the GitHub rate limits, as you can use this option to limit the number of operations for a single run.

_Purpose:_  
This option aims to limit the number of operations made with the GitHub API to avoid reaching the [rate limit](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

Based on your project, your GitHub business plan and the date of the cron job you set for this action, you can increase this limit to a higher number.
If you are not sure which is the right value for you or if the default value is good enough, you could enable the logs and look at the end of the stale action.  
If you reached the limit, you will see a warning message in the logs, telling you that you should increase the number of operations.
If you choose not to increase the limit, you might end up with unprocessed issues or pull requests after a stale action run.

When [debugging](#Debugging), you can set it to a much higher number like `1000` since there will be fewer operations made with the GitHub API.  
Only the [actor](#repo-token) and the batch of issues (100 per batch) will consume the operations.

Default value: `30`

#### remove-stale-when-updated

Automatically remove the stale label when the issues or the pull requests are updated (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`) or commented.

Default value: `true`  
Required Permission: `issues: write` and `pull-requests: write`

#### remove-issue-stale-when-updated

Override [remove-stale-when-updated](#remove-stale-when-updated) but only to automatically remove the stale label when the issues are updated (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`) or commented.

Default value: unset  
Required Permission: `issues: write`

#### remove-pr-stale-when-updated

Override [remove-stale-when-updated](#remove-stale-when-updated) but only to automatically remove the stale label when the pull requests are updated (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`) or commented.

Default value: unset

#### labels-to-add-when-unstale

A comma delimited list of labels to add when a stale issue or pull request receives activity and has the [stale-issue-label](#stale-issue-label) or [stale-pr-label](#stale-pr-label) removed from it.

Default value: unset

#### labels-to-remove-when-unstale

A comma delimited list of labels to remove when a stale issue or pull request receives activity and has the [stale-issue-label](#stale-issue-label) or [stale-pr-label](#stale-pr-label) removed from it.

Warning: each label results in a unique API call which can drastically consume the limit of [operations-per-run](#operations-per-run).

Default value: unset  
Required Permission: `pull-requests: write`

#### debug-only

Run the stale workflow as dry-run.  
No GitHub API calls that can alter your issues and pull requests will happen.  
Useful to debug or when you want to configure the stale workflow safely.

Default value: `false`

#### ascending

Change the order used to fetch the issues and pull requests from GitHub:

- `true` is for ascending.
- `false` is for descending.

It can be useful if your repository is processing so many issues and pull requests that you reach the [operations-per-run](#operations-per-run) limit.  
Based on the order, you could prefer to focus on the new content or on the old content of your repository.

Default value: `false`

#### start-date

The start date is used to ignore the issues and pull requests created before the start date.  
Particularly useful when you wish to add this stale workflow on an existing repository and only wish to stale the new issues and pull requests.

If set, the date must be formatted following the `ISO 8601` or `RFC 2822` standard.

Default value: unset

#### delete-branch

If set to `true`, the stale workflow will automatically delete the GitHub branches related to the pull requests automatically closed by the stale workflow.

Default value: `false`  
Required Permission: `pull-requests: write`

#### exempt-milestones

A white-list of milestone(s) to only process the issues or the pull requests that does not contain one of these milestone(s).  
It can be a comma separated list of milestones (e.g: `V1,next`).

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

#### exempt-issue-milestones

Override [exempt-milestones](#exempt-milestones) but only to process the issues that does not contain one of these milestone(s).

Default value: unset

#### exempt-pr-milestones

Override [exempt-milestones](#exempt-milestones) but only to process the pull requests that does not contain one of these milestone(s).

Default value: unset

#### exempt-all-milestones

If set to `true`, the issues or the pull requests with a milestone will not be marked as stale automatically.

Priority over [exempt-milestones](#exempt-milestones).

Default value: `false`

#### exempt-all-issue-milestones

Override [exempt-all-milestones](#exempt-all-milestones) but only to exempt the issues with a milestone to be marked as stale automatically.

Default value: unset

#### exempt-all-pr-milestones

Override [exempt-all-milestones](#exempt-all-milestones) but only to exempt the pull requests with a milestone to be marked as stale automatically.

Default value: unset

#### exempt-assignees

An allow-list of assignee(s) to only process the issues or the pull requests that does not contain one of these assignee(s).  
It can be a comma separated list of assignees (e.g: `marco,polo`).

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

#### exempt-issue-assignees

Override [exempt-assignees](#exempt-assignees) but only to process the issues that does not contain one of these assignee(s).

Default value: unset

#### exempt-pr-assignees

Override [exempt-assignees](#exempt-assignees) but only to process the pull requests that does not contain one of these assignee(s).

Default value: unset

#### exempt-all-assignees

If set to `true`, the issues or the pull requests with an assignee will not be marked as stale automatically.

Priority over [exempt-assignees](#exempt-assignees).

Default value: `false`

#### exempt-all-issue-assignees

Override [exempt-all-assignees](#exempt-all-assignees) but only to exempt the issues with an assignee to be marked as stale automatically.

Default value: unset

#### exempt-all-pr-assignees

Override [exempt-all-assignees](#exempt-all-assignees) but only to exempt the pull requests with an assignee to be marked as stale automatically.

Default value: unset

#### exempt-draft-pr

If set to `true`, the pull requests currently in draft will not be marked as stale automatically.  
⚠️ This option consume one operation per pull request to process because we need to fetch the pull request with the GitHub API to know if it's a draft one or not.

Default value: `false`  
Required Permission: `pull-requests: read`

#### enable-statistics

Collects and display statistics at the end of the stale workflow logs to get a summary of what happened during the run.  
This option is only useful if the debug output secret `ACTIONS_STEP_DEBUG` is set to `true` in your repository to display the logs.

Default value: `true`

#### ignore-updates

The option [days-before-stale](#days-before-stale) will define the number of days before considering the issues or the pull requests as stale.  
In most cases, the purpose of this action is to only stale when necessary so if any update occurs or if a comment is added to them, the counter will restart.  
Nonetheless, if you don't care about this, and you prefer to stick to this number of days no matter the update, you can enable this option.  
Instead of comparing the number of days based on the [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`, it will be based on the [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `created_at`.

Default value: `false`

#### ignore-issue-updates

Useful to override [ignore-updates](#ignore-updates) but only to ignore the updates for the issues.

Default value: unset

#### ignore-pr-updates

Useful to override [ignore-updates](#ignore-updates) but only to ignore the updates for the pull requests.

Default value: unset

### Usage

See also [action.yml](./action.yml) for a comprehensive list of all the options.

Basic:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          stale-issue-message: 'Message to comment on stale issues. If none provided, will not mark issues stale'
          stale-pr-message: 'Message to comment on stale PRs. If none provided, will not mark PRs stale'
```

Configure stale timeouts:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days.'
          days-before-stale: 30
          days-before-close: 5
```

Configure different stale timeouts but never close a PR:

```yaml
name: 'Close stale issues and PR'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days.'
          stale-pr-message: 'This PR is stale because it has been open 45 days with no activity. Remove stale label or comment or this will be closed in 10 days.'
          close-issue-message: 'This issue was closed because it has been stalled for 5 days with no activity.'
          days-before-stale: 30
          days-before-close: 5
          days-before-pr-close: -1
```

Configure different stale timeouts:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days.'
          stale-pr-message: 'This PR is stale because it has been open 45 days with no activity. Remove stale label or comment or this will be closed in 10 days.'
          close-issue-message: 'This issue was closed because it has been stalled for 5 days with no activity.'
          close-pr-message: 'This PR was closed because it has been stalled for 10 days with no activity.'
          days-before-issue-stale: 30
          days-before-pr-stale: 45
          days-before-issue-close: 5
          days-before-pr-close: 10
```

Configure labels:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          stale-issue-message: 'Stale issue message'
          stale-pr-message: 'Stale pull request message'
          stale-issue-label: 'no-issue-activity'
          exempt-issue-labels: 'awaiting-approval,work-in-progress'
          stale-pr-label: 'no-pr-activity'
          exempt-pr-labels: 'awaiting-approval,work-in-progress'
          only-labels: 'awaiting-feedback,awaiting-answers'
```

Configure the stale action to only stale issue/PR created after the 18th april 2020:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          start-date: '2020-04-18T00:00:00Z' # ISO 8601 or RFC 2822
```

Avoid stale for specific milestones:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          exempt-issue-milestones: 'future,alpha,beta'
          exempt-pr-milestones: 'bugfix,improvement'
```

Avoid stale for all PR with milestones:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          exempt-all-pr-milestones: true
```

Check stale for specific labels:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          any-of-labels: 'needs-more-info,needs-demo'
          # You can opt for 'only-labels' instead if your use-case requires all labels
          # to be present in the issue/PR
```

Avoid stale for specific assignees:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          exempt-issue-assignees: 'marco,polo'
          exempt-pr-assignees: 'marco'
```

Avoid stale for all PR with assignees:

```yaml
name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v4
        with:
          exempt-all-pr-assignees: true
```

### Debugging

**Logs:**  
To see the debug output from this action, you must set the secret `ACTIONS_STEP_DEBUG` to `true` in your repository.  
There are many logs, so this can be very helpful!

**Statistics:**  
If the logs are enabled, you can also enable the statistics log which will be visible at the end of the logs once all issues were processed.  
This is very helpful to have a quick understanding of the whole stale workflow.  
Set `enable-statistics` to `true` in your workflow configuration file.

**Dry-run:**  
You can run this action in debug only mode (no actions will be taken on your issues and pull requests) by passing `debug-only` to `true` as an argument to the action.

**More operations:**  
You can increase the maximum number of operations per run by passing `operations-per-run` to `1000` for example which will help you to handle more operations in a single stale workflow run.  
If the `debug-only` option is enabled, this is very helpful because the workflow will (almost) never reach the GitHub API rate, and you will be able to deep-dive into the logs.

**Job frequency:**  
You could change the cron job frequency in the stale workflow to run the stale workflow more often.  
Usually, this is not very helpful though.

### Contributing

We welcome contributions!
Please read the [contributing](CONTRIBUTING.md) file before starting your work.
