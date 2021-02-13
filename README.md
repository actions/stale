# Close Stale Issues and PRs

Warns and then closes issues and PRs that have had no activity for a specified amount of time.

### Arguments

| Input                         | Description                                                                                                     | Usage    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| `repo-token`                  | PAT(Personal Access Token) for authorizing repository. _Defaults to **${{ github.token }}**_                    | Optional |
| `days-before-stale`           | Idle number of days before marking an issue/PR as stale. _Defaults to **60**_                                   | Optional |
| `days-before-issue-stale`     | Idle number of days before marking an issue as stale (override `days-before-stale`).                            | Optional |
| `days-before-pr-stale`        | Idle number of days before marking an PR as stale (override `days-before-stale`).                               | Optional |
| `days-before-close`           | Idle number of days before closing an stale issue/PR. _Defaults to **7**_                                       | Optional |
| `days-before-issue-close`     | Idle number of days before closing an stale issue (override `days-before-close`).                               | Optional |
| `days-before-pr-close`        | Idle number of days before closing an stale PR (override `days-before-close`).                                  | Optional |
| `stale-issue-message`         | Message to post on the stale issue.                                                                             | Optional |
| `stale-pr-message`            | Message to post on the stale PR.                                                                                | Optional |
| `close-issue-message`         | Message to post on the stale issue while closing it.                                                            | Optional |
| `close-pr-message`            | Message to post on the stale PR while closing it.                                                               | Optional |
| `stale-issue-label`           | Label to apply on the stale issue. _Defaults to **stale**_                                                      | Optional |
| `close-issue-label`           | Label to apply on closing issue.                                                                                | Optional |
| `stale-pr-label`              | Label to apply on the stale PR.                                                                                 | Optional |
| `close-pr-label`              | Label to apply on the closing PR.                                                                               | Optional |
| `exempt-issue-labels`         | Labels on an issue exempted from being marked as stale.                                                         | Optional |
| `exempt-pr-labels`            | Labels on the PR exempted from being marked as stale.                                                           | Optional |
| `exempt-milestones`           | Milestones on an issue or a PR exempted from being marked as stale.                                             | Optional |
| `exempt-issue-milestones`     | Milestones on an issue exempted from being marked as stale (override `exempt-milestones`).                      | Optional |
| `exempt-pr-milestones`        | Milestones on the PR exempted from being marked as stale (override `exempt-milestones`).                        | Optional |
| `exempt-all-milestones`       | Exempt all issues and PRs with milestones from being marked as stale. (priority over `exempt-milestones` rules) | Optional |
| `exempt-all-issue-milestones` | Exempt all issues with milestones from being marked as stale. (override `exempt-all-milestones`).               | Optional |
| `exempt-all-pr-milestones`    | Exempt all PRs with milestones from being marked as stale. (override `exempt-all-milestones`).                  | Optional |
| `only-labels`                 | Only labels checked for stale issue/PR.                                                                         | Optional |
| `operations-per-run`          | Maximum number of operations per run (GitHub API CRUD related). _Defaults to **30**_                            | Optional |
| `remove-stale-when-updated`   | Remove stale label from issue/PR on updates or comments. _Defaults to **true**_                                 | Optional |
| `debug-only`                  | Dry-run on action. _Defaults to **false**_                                                                      | Optional |
| `ascending`                   | Order to get issues/PR. _Defaults to **false**_                                                                 | Optional |
| `skip-stale-issue-message`    | Skip adding stale message on stale issue. _Defaults to **false**_                                               | Optional |
| `skip-stale-pr-message`       | Skip adding stale message on stale PR. _Defaults to **false**_                                                  | Optional |
| `start-date`                  | The date used to skip the stale action on issue/PR created before it (ISO 8601 or RFC 2822).                    | Optional |
| `delete-branch`               | Delete the git branch after closing a stale pull request. _Defaults to **false**_                               | Optional |

### Usage

See [action.yml](./action.yml) For comprehensive list of options.

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

### Debugging

To see the debug output from this action, you must set the secret `ACTIONS_STEP_DEBUG` to `true` in your repository.  
You can run this action in debug only mode (no actions will be taken on your issues and pull requests) by passing `debug-only` to `true` as an argument to the action.  
You can also increase the maximum number of operations per run by passing `operations-per-run` to `100` for example.  
Finally, you could also change the cron job frequency in the stale workflow to run stale more often.

### Contributing

You wish to contribute?  
Check out the [contributing](CONTRIBUTING.md) file before helping us.
