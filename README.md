# Close Stale Issues and PRs

Warns and then closes issues and PRs that have had no activity for a specified amount of time.

## All options

### List of options

Every argument is optional.

| Input                                                               | Description                                                                                                                                                   | Default               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| [repo-token](#repo-token)                                           | PAT for GitHub API authentication                                                                                                                             | `${{ github.token }}` |
| [days-before-stale](#days-before-stale)                             | Idle number of days before marking an issue/PR as stale.                                                                                                      | `60`                  |
| [days-before-issue-stale](#days-before-issue-stale)                 | Override [days-before-stale](#days-before-stale).                                                                                                             |                       |
| [days-before-pr-stale](#days-before-pr-stale)                       | Override [days-before-stale](#days-before-stale).                                                                                                             |                       |
| [days-before-close](#days-before-close)                             | Idle number of days before closing a stale issue/PR.                                                                                                          | `7`                   |
| [days-before-issue-close](#days-before-issue-close)                 | Override [days-before-close](#days-before-close).                                                                                                             |                       |
| [days-before-pr-close](#days-before-pr-close)                       | Override [days-before-close](#days-before-close).                                                                                                             |                       |
| [stale-issue-message](#stale-issue-message)                         | Message to post on the stale issue.                                                                                                                           |                       |
| [stale-pr-message](#stale-pr-message)                               | Message to post on the stale PR.                                                                                                                              |                       |
| [close-issue-message](#close-issue-message)                         | Message to post on the stale issue while closing it.                                                                                                          |                       |
| [close-pr-message](#close-pr-message)                               | Message to post on the stale PR while closing it.                                                                                                             |                       |
| [stale-issue-label](#stale-issue-label)                             | Label to apply on the stale issue.<br>_Defaults to **Stale**_.                                                                                                |                       |
| [close-issue-label](#close-issue-label)                             | Label to apply on closing issue.<br>Automatically removed if no longer closed nor locked).                                                                    |                       |
| [stale-pr-label](#stale-pr-label)                                   | Label to apply on the stale PR.<br>_Defaults to **Stale**_.                                                                                                   |                       |
| [close-pr-label](#close-pr-label)                                   | Label to apply on the closing PR.<br>Automatically removed if no longer closed nor locked).                                                                   |                       |
| [exempt-issue-labels](#exempt-issue-labels)                         | Labels on an issue exempted from being marked as stale.                                                                                                       |                       |
| [exempt-pr-labels](#exempt-pr-labels)                               | Labels on the PR exempted from being marked as stale.                                                                                                         |                       |
| [only-labels](#only-labels)                                         | Only issues and PRs with ALL these labels are checked.<br>Separate multiple labels with commas (eg. "question,answered").                                     |                       |
| [only-issue-labels](#only-issue-labels)                             | Only issues with ALL these labels are checked.<br>Separate multiple labels with commas (eg. "question,answered").<br>_Override `only-labels`_.                |                       |
| [only-pr-labels](#only-pr-labels)                                   | Only PRs with ALL these labels are checked.<br>Separate multiple labels with commas (eg. "question,answered").<br>_Override `only-labels`_.                   |                       |
| [any-of-labels](#any-of-labels)                                     | Only issues and PRs with ANY of these labels are checked.<br>Separate multiple labels with commas (eg. "incomplete,waiting-feedback").                        |                       |
| [any-of-issue-labels](#any-of-issue-labels)                         | Only issues with ANY of these labels are checked.<br>Separate multiple labels with commas (eg. "incomplete,waiting-feedback").<br>_Override `any-of-labels`_. |                       |
| [any-of-pr-labels](#any-of-pr-labels)                               | Only PRs with ANY of these labels are checked.<br>Separate multiple labels with commas (eg. "incomplete,waiting-feedback").<br>_Override `any-of-labels`_.    |                       |
| [operations-per-run](#operations-per-run)                           | Maximum number of operations per run.<br>GitHub API CRUD related.<br>_Defaults to **30**_.                                                                    |                       |
| [remove-stale-when-updated](#remove-stale-when-updated)             | Remove stale label from issue/PR on updates or comments.<br>_Defaults to **true**_.                                                                           |                       |
| [remove-issue-stale-when-updated](#remove-issue-stale-when-updated) | Remove stale label from issue on updates or comments.<br>_Defaults to **true**_.<br>_Override `remove-stale-when-updated`_.                                   |                       |
| [remove-pr-stale-when-updated](#remove-pr-stale-when-updated)       | Remove stale label from PR on updates or comments.<br>_Defaults to **true**_.<br>_Override `remove-stale-when-updated`_.                                      |                       |
| [debug-only](#debug-only)                                           | Dry-run on action.<br>_Defaults to **false**_.                                                                                                                |                       |
| [ascending](#ascending)                                             | Order to get issues/PR.<br>`true` is ascending, `false` is descending.<br>_Defaults to **false**_.                                                            |                       |
| [skip-stale-issue-message](#skip-stale-issue-message)               | Skip adding stale message on stale issue.<br>_Defaults to **false**_.                                                                                         |                       |
| [skip-stale-pr-message](#skip-stale-pr-message)                     | Skip adding stale message on stale PR.<br>_Defaults to **false**_.                                                                                            |                       |
| [start-date](#start-date)                                           | The date used to skip the stale action on issue/PR created before it.<br>ISO 8601 or RFC 2822.                                                                |                       |
| [delete-branch](#delete-branch)                                     | Delete the git branch after closing a stale pull request.<br>_Defaults to **false**_.                                                                         |                       |
| [exempt-milestones](#exempt-milestones)                             | Milestones on an issue or a PR exempted from being marked as stale.                                                                                           |                       |
| [exempt-issue-milestones](#exempt-issue-milestones)                 | Milestones on an issue exempted from being marked as stale.<br>_Override `exempt-milestones`_.                                                                |                       |
| [exempt-pr-milestones](#exempt-pr-milestones)                       | Milestones on the PR exempted from being marked as stale.<br>_Override `exempt-milestones`_.                                                                  |                       |
| [exempt-all-milestones](#exempt-all-milestones)                     | Exempt all issues and PRs with milestones from being marked as stale.<br>_Priority over `exempt-milestones` rules_.                                           |                       |
| [exempt-all-issue-milestones](#exempt-all-issue-milestones)         | Exempt all issues with milestones from being marked as stale.<br>_Override `exempt-all-milestones`_.                                                          |                       |
| [exempt-all-pr-milestones](#exempt-all-pr-milestones)               | Exempt all PRs with milestones from being marked as stale.<br>_Override `exempt-all-milestones`_.                                                             |                       |
| [exempt-assignees](#exempt-assignees)                               | Assignees on an issue or a PR exempted from being marked as stale.                                                                                            |                       |
| [exempt-issue-assignees](#exempt-issue-assignees)                   | Assignees on an issue exempted from being marked as stale.<br>_Override `exempt-assignees`_.                                                                  |                       |
| [exempt-pr-assignees](#exempt-pr-assignees)                         | Assignees on the PR exempted from being marked as stale.<br>_Override `exempt-assignees`_.                                                                    |                       |
| [exempt-all-assignees](#exempt-all-assignees)                       | Exempt all issues and PRs with assignees from being marked as stale.<br>_Priority over `exempt-assignees` rules_.                                             |                       |
| [exempt-all-issue-assignees](#exempt-all-issue-assignees)           | Exempt all issues with assignees from being marked as stale.<br>_Override `exempt-all-assignees`_.                                                            |                       |
| [exempt-all-pr-assignees](#exempt-all-pr-assignees)                 | Exempt all PRs with assignees from being marked as stale.<br>_Override `exempt-all-assignees`_.                                                               |                       |
| [enable-statistics](#enable-statistics)                             | Display some statistics at the end of the logs regarding the stale workflow.<br>Only when the logs are enabled.<br>_Defaults to **true**_.                    |                       |

### Detailed options

#### repo-token

PAT (Personal Access Token) to allow the stale workflow to authenticate and perform API calls to GitHub.  
Under the hook, used by [@actions/github](https://www.npmjs.com/package/@actions/github).

Default value: `${{ github.token }}`

#### days-before-stale

The idle number of days before marking an issue or a pull request as stale (by adding a label).  
The issue or the pull request will be marked as stale if the last update (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`) is older than the idle number of days.

If set to a negative number like `-1`, the issue or the pull request will never be marked as stale automatically.  
In that case, you can still add the stale label manually to mark as stale.

The label used to stale is defined by these two options:

- [stale-issue-label](#stale-issue-label)
- [stale-pr-label](#stale-pr-label)

Default value: `60`

#### days-before-issue-stale

Useful to override [days-before-stale](#days-before-stale) but only for the idle number of days before marking an issue as stale.

Default value: unset

#### days-before-pr-stale

Useful to override [days-before-stale](#days-before-stale) but only for the idle number of days before marking a pull request as stale.

Default value: unset

#### days-before-close

The idle number of days before closing a stale issue or a stale pull request (due to the stale label).  
The issue or the pull request will be closed if the last update (based on [GitHub issue](https://docs.github.com/en/rest/reference/issues) field `updated_at`) is older than the idle number of days.  
Since adding the stale label will alter the last update date, we can calculate the number of days from this date.

If set to a negative number like `-1`, the issue or the pull request will never be closed automatically.

The label used to stale is defined by these two options:

- [stale-issue-label](#stale-issue-label)
- [stale-pr-label](#stale-pr-label)

Default value: `7`

#### days-before-issue-close

Useful to override [days-before-close](#days-before-close) but only for the idle number of days before closing a stale issue.

Default value: unset

#### days-before-pr-close

Useful to override [days-before-close](#days-before-close) but only for the idle number of days before closing a stale pull request.

Default value: unset

#### stale-issue-message

Define the message that will be added as a comment to the issue when the stale workflow mark it automatically as stale with a label.

You can omit the comment by setting [skip-stale-issue-message](#skip-stale-issue-message) to `true`.

Default value: unset

#### stale-pr-message

Define the message that will be added as a comment to the pull request when the stale workflow mark it automatically as stale with a label.

You can omit the comment by setting [skip-stale-issue-message](#skip-stale-pr-message) to `true`.

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
      - uses: actions/stale@v3
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
      - uses: actions/stale@v3
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
      - uses: actions/stale@v3
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
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
      - uses: actions/stale@v3
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
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
      - uses: actions/stale@v3
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
      - uses: actions/stale@v3
        with:
          start-date: '2020-18-04T00:00:00Z' // ISO 8601 or RFC 2822
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
      - uses: actions/stale@v3
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
      - uses: actions/stale@v3
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
      - uses: actions/stale@v3
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
      - uses: actions/stale@v3
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
      - uses: actions/stale@v3
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
Usually, this is not very helpful, though.

### Contributing

Do you wish to contribute?  
Have a look at the [contributing](CONTRIBUTING.md) file before helping us.
