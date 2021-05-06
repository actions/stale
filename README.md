# Close Stale Issues and PRs

Warns and then closes issues and PRs that have had no activity for a specified amount of time.

## All options

### List of options

Every argument is optional.

| Input                             | Description                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `repo-token`                      | PAT (Personal Access Token) for authorizing the repository.<br>_Defaults to **${{ github.token }}**_.                                                         |
| `days-before-stale`               | Idle number of days before marking an issue/PR as stale.<br>_Defaults to **60**_.                                                                             |
| `days-before-issue-stale`         | Idle number of days before marking an issue as stale.<br>_Override `days-before-stale`_.                                                                      |
| `days-before-pr-stale`            | Idle number of days before marking a PR as stale.<br>_Override `days-before-stale`_.                                                                         |
| `days-before-close`               | Idle number of days before closing a stale issue/PR.<br>_Defaults to **7**_.                                                                                 |
| `days-before-issue-close`         | Idle number of days before closing a stale issue.<br>_Override `days-before-close`_.                                                                         |
| `days-before-pr-close`            | Idle number of days before closing a stale PR.<br>_Override `days-before-close`_.                                                                            |
| `stale-issue-message`             | Message to post on the stale issue.                                                                                                                           |
| `stale-pr-message`                | Message to post on the stale PR.                                                                                                                              |
| `close-issue-message`             | Message to post on the stale issue while closing it.                                                                                                          |
| `close-pr-message`                | Message to post on the stale PR while closing it.                                                                                                             |
| `stale-issue-label`               | Label to apply on the stale issue.<br>_Defaults to **Stale**_.                                                                                                |
| `close-issue-label`               | Label to apply on closing issue.<br>Automatically removed if no longer closed nor locked).                                                                    |
| `stale-pr-label`                  | Label to apply on the stale PR.<br>_Defaults to **Stale**_.                                                                                                   |
| `close-pr-label`                  | Label to apply on the closing PR.<br>Automatically removed if no longer closed nor locked).                                                                   |
| `exempt-issue-labels`             | Labels on an issue exempted from being marked as stale.                                                                                                       |
| `exempt-pr-labels`                | Labels on the PR exempted from being marked as stale.                                                                                                         |
| `only-labels`                     | Only issues and PRs with ALL these labels are checked.<br>Separate multiple labels with commas (eg. "question,answered").                                     |
| `only-issue-labels`               | Only issues with ALL these labels are checked.<br>Separate multiple labels with commas (eg. "question,answered").<br>_Override `only-labels`_.                |
| `only-pr-labels`                  | Only PRs with ALL these labels are checked.<br>Separate multiple labels with commas (eg. "question,answered").<br>_Override `only-labels`_.                   |
| `any-of-labels`                   | Only issues and PRs with ANY of these labels are checked.<br>Separate multiple labels with commas (eg. "incomplete,waiting-feedback").                        |
| `any-of-issue-labels`             | Only issues with ANY of these labels are checked.<br>Separate multiple labels with commas (eg. "incomplete,waiting-feedback").<br>_Override `any-of-labels`_. |
| `any-of-pr-labels`                | Only PRs with ANY of these labels are checked.<br>Separate multiple labels with commas (eg. "incomplete,waiting-feedback").<br>_Override `any-of-labels`_.    |
| `operations-per-run`              | Maximum number of operations per run.<br>GitHub API CRUD related.<br>_Defaults to **30**_.                                                                    |
| `remove-stale-when-updated`       | Remove stale label from issue/PR on updates or comments.<br>_Defaults to **true**_.                                                                           |
| `remove-issue-stale-when-updated` | Remove stale label from issue on updates or comments.<br>_Defaults to **true**_.<br>_Override `remove-stale-when-updated`_.                                   |
| `remove-pr-stale-when-updated`    | Remove stale label from PR on updates or comments.<br>_Defaults to **true**_.<br>_Override `remove-stale-when-updated`_.                                      |
| `remove-issue-stale-when-updated` | Remove stale label from issue on updates or comments.<br>_Defaults to **true**_.<br>_Override `remove-stale-when-updated`_.                                   |
| `remove-pr-stale-when-updated`    | Remove stale label from PR on updates or comments.<br>_Defaults to **true**_.<br>_Override `remove-stale-when-updated`_.                                      |
| `debug-only`                      | Dry-run on action.<br>_Defaults to **false**_.                                                                                                                |
| `ascending`                       | Order to get issues/PR.<br>`true` is ascending, `false` is descending.<br>_Defaults to **false**_.                                                            |
| `skip-stale-issue-message`        | Skip adding stale message on stale issue.<br>_Defaults to **false**_.                                                                                         |
| `skip-stale-pr-message`           | Skip adding stale message on stale PR.<br>_Defaults to **false**_.                                                                                            |
| `start-date`                      | The date used to skip the stale action on issue/PR created before it.<br>ISO 8601 or RFC 2822.                                                                |
| `delete-branch`                   | Delete the git branch after closing a stale pull request.<br>_Defaults to **false**_.                                                                         |
| `exempt-milestones`               | Milestones on an issue or a PR exempted from being marked as stale.                                                                                           |
| `exempt-issue-milestones`         | Milestones on an issue exempted from being marked as stale.<br>_Override `exempt-milestones`_.                                                                |
| `exempt-pr-milestones`            | Milestones on the PR exempted from being marked as stale.<br>_Override `exempt-milestones`_.                                                                  |
| `exempt-all-milestones`           | Exempt all issues and PRs with milestones from being marked as stale.<br>_Priority over `exempt-milestones` rules_.                                           |
| `exempt-all-issue-milestones`     | Exempt all issues with milestones from being marked as stale.<br>_Override `exempt-all-milestones`_.                                                          |
| `exempt-all-pr-milestones`        | Exempt all PRs with milestones from being marked as stale.<br>_Override `exempt-all-milestones`_.                                                             |
| `exempt-assignees`                | Assignees on an issue or a PR exempted from being marked as stale.                                                                                            |
| `exempt-issue-assignees`          | Assignees on an issue exempted from being marked as stale.<br>_Override `exempt-assignees`_.                                                                  |
| `exempt-pr-assignees`             | Assignees on the PR exempted from being marked as stale.<br>_Override `exempt-assignees`_.                                                                    |
| `exempt-all-assignees`            | Exempt all issues and PRs with assignees from being marked as stale.<br>_Priority over `exempt-assignees` rules_.                                             |
| `exempt-all-issue-assignees`      | Exempt all issues with assignees from being marked as stale.<br>_Override `exempt-all-assignees`_.                                                            |
| `exempt-all-pr-assignees`         | Exempt all PRs with assignees from being marked as stale.<br>_Override `exempt-all-assignees`_.                                                               |
| `enable-statistics`               | Display some statistics at the end of the logs regarding the stale workflow.<br>Only when the logs are enabled.<br>_Defaults to **true**_.                    |

### Detailed options

#### operations-per-run

_Context:_  
This action performs some API calls to GitHub to fetch or close issues and pull requests, set or update labels, add comments, delete branches, etc.  
These operations are made in a very short period of time - because the action is very fast to run - and can be numerous based on your project action configuration and the quantity of issues and pull requests within it.  
GitHub has a [rate limit](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) and if reached will block all of these API calls for one hour (or API calls from other actions using the same user (a.k.a: the github-token from the [repo-token](#repo-token) option)).  
This option helps you to stay within the GitHub rate limits, as you can use this option to limit the number of operations for a single run.

_Purpose:_  
This option aims to limit the number of operations made with the GitHub API to avoid reaching the [rate limit](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

Based on your project, your GitHub business plan and the date of the cron job you set for this action, you can increase this limit to a higher number.
If you are not sure which is the right value for you or if the default value is good enough, you could enable the logs and look at the end of the stale action.  
If you reached the limit, you will see a warning message in the logs, telling you that you should increase the number of operations.
If you choose not to increase the limit, you might end up with un-processed issues or pull requests after a stale action run.

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
There is a lot of logs so this can be very helpful!

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
Usually this is not very helpful though.

### Contributing

You wish to contribute?  
Check out the [contributing](CONTRIBUTING.md) file before helping us.
