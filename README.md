# Close Stale Issues

To use, spin up a workflow. The following inputs are available:
 * stale_age_days: The number of days old an issue can be before marking it stale (default 60)
 * wait_after_stale_days: The number of days to wait to close an issue after it being marked stale (default 7)
 * max_operations_per_run:The maximum number of operations per run, used to control rate limiting (default 30)
 * stale_label: The label to apply when an item is stale (default 'Stale')
 * stale_message: The message to post on the issue when tagging it
 
You'll need to map `GITHUB_TOKEN` to a PAT token for the identity you want to use to modify the issues:
 
Example workflow:
```
name: "Close stale issues"
on:
  push: {}
  schedule:
  - cron: 0 * * * *

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: bbq-beets/stale-bot@master
      with:
        stale_age_days: 60
        wait_after_stale_days: 7
      env:
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```
