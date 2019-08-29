# Close Stale Issues and PRs

Warns and then closes issues and PRs that have had no activity for a specified amount of time.

### Usage

See [action.yml](./action.yml) For comprehensive list of options.
 
Basic:
```
name: "Close stale issues"
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/stale@v1
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        stale-issue-message: 'Message to comment on stale issues. If none provided, will not mark issues stale'
        stale-pr-message: 'Message to comment on stale PRs. If none provided, will not mark PRs stale'
```
 
Configure stale timeouts:
```
name: "Close stale issues"
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/stale@v1
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days'
        days-before-stale: 30
        days-before-close: 5
```
 
Configure labels:
```
name: "Close stale issues"
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/stale@v1
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        stale-issue-message: 'Stale issue message'
        stale-pr-message: 'Stale issue message'
        stale-issue-label: 'no-issue-activity'
        exempt-issue-label: 'awaiting-approval'
        stale-pr-label: 'no-pr-activity'
        exempt-pr-label: 'awaiting-approval'
```
