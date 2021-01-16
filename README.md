# Close Stale Issues and PRs

Warns and then closes issues and PRs that have had no activity for a specified amount of time.

### Building and testing

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run pack
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

### Arguments

| Input                       | Description                                                                          | Usage    |
| --------------------------- | ------------------------------------------------------------------------------------ | -------- |
| `repo-token`                | PAT(Personal Access Token) for authorizing repository.                               | Optional |
| `days-before-stale`         | Idle number of days before marking an issue/pr as stale. _Defaults to **60**_        | Optional |
| `days-before-issue-stale`   | Idle number of days before marking an issue as stale (override `days-before-stale`). | Optional |
| `days-before-pr-stale`      | Idle number of days before marking an pr as stale (override `days-before-stale`).    | Optional |
| `days-before-close`         | Idle number of days before closing an stale issue/pr. _Defaults to **7**_            | Optional |
| `days-before-issue-close`   | Idle number of days before closing an stale issue (override `days-before-close`).    | Optional |
| `days-before-pr-close`      | Idle number of days before closing an stale pr (override `days-before-close`).       | Optional |
| `stale-issue-message`       | Message to post on the stale issue.                                                  | Optional |
| `stale-pr-message`          | Message to post on the stale pr.                                                     | Optional |
| `close-issue-message`       | Message to post on the stale issue while closing it.                                 | Optional |
| `close-pr-message`          | Message to post on the stale pr while closing it.                                    | Optional |
| `stale-issue-label`         | Label to apply on the stale issue. _Defaults to **stale**_                           | Optional |
| `close-issue-label`         | Label to apply on closing issue.                                                     | Optional |
| `stale-pr-label`            | Label to apply on the stale pr.                                                      | Optional |
| `close-pr-label`            | Label to apply on the closing pr.                                                    | Optional |
| `exempt-issue-labels`       | Labels on an issue exempted from being marked as stale.                              | Optional |
| `exempt-pr-labels`          | Labels on the pr exempted from being marked as stale.                                | Optional |
| `only-labels`               | Only labels checked for stale issue/pr.                                              | Optional |
| `operations-per-run`        | Maximum number of operations per run (GitHub API CRUD related). _Defaults to **30**_                           | Optional |
| `remove-stale-when-updated` | Remove stale label from issue/pr on updates or comments. _Defaults to **true**_      | Optional |
| `debug-only`                | Dry-run on action. _Defaults to **false**_                                           | Optional |
| `ascending`                 | Order to get issues/pr. _Defaults to **false**_                                      | Optional |
| `skip-stale-issue-message`  | Skip adding stale message on stale issue. _Defaults to **false**_                    | Optional |
| `skip-stale-pr-message`     | Skip adding stale message on stale pr. _Defaults to **false**_                       | Optional |

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

Configure different stale timeouts but never close a pr:

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
          stale-pr-message: 'This pr is stale because it has been open 45 days with no activity. Remove stale label or comment or this will be closed in 10 days.'
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
          stale-pr-message: 'This pr is stale because it has been open 45 days with no activity. Remove stale label or comment or this will be closed in 10 days.'
          close-issue-message: 'This issue was closed because it has been stalled for 5 days with no activity.'
          close-pr-message: 'This pr was closed because it has been stalled for 10 days with no activity.'
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

### Debugging

To see debug output from this action, you must set the secret `ACTIONS_STEP_DEBUG` to `true` in your repository. You can run this action in debug only mode (no actions will be taken on your issues) by passing `debug-only` `true` as an argument to the action.
