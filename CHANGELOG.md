# Changelog

# [9.1.0]

## What's Changed
* Documentation update by @Marukome0743 in https://github.com/actions/stale/pull/1116
* Add workflow file for publishing releases to immutable action package by @Jcambass in https://github.com/actions/stale/pull/1179
* Update undici from 5.28.2 to 5.28.4 by @dependabot in https://github.com/actions/stale/pull/1150
* Update actions/checkout from 3 to 4 by @dependabot in https://github.com/actions/stale/pull/1091
* Update actions/publish-action from 0.2.2 to 0.3.0 by @dependabot in https://github.com/actions/stale/pull/1147
* Update ts-jest from 29.1.1 to 29.2.5 by @dependabot in https://github.com/actions/stale/pull/1175
* Update @actions/core from 1.10.1 to 1.11.1 by @dependabot in https://github.com/actions/stale/pull/1191
* Update @types/jest from 29.5.11 to 29.5.14 by @dependabot in https://github.com/actions/stale/pull/1193
* Update @actions/cache from 3.2.2 to 4.0.0 by @dependabot in https://github.com/actions/stale/pull/1194

# [9.0.0]

## Breaking Changes
1. Action is now stateful: If the action ends because of [operations-per-run](https://github.com/actions/stale#operations-per-run) then the next run will start from the first unprocessed issue skipping the issues processed during the previous run(s). The state is reset when all the issues are processed. This should be considered for scheduling workflow runs.
2. Version 9 of this action updated the runtime to Node.js 20. All scripts are now run with Node.js 20 instead of Node.js 16 and are affected by any breaking changes between Node.js 16 and 20.

## What Else Changed
1. Performance optimization that removes unnecessary API calls by @dsame in [#1033](https://github.com/actions/stale/pull/1033/); fixes [#792](https://github.com/actions/stale/issues/792)
2. Logs displaying current GitHub API rate limit by @dsame in [#1032](https://github.com/actions/stale/pull/1032); addresses [#1029](https://github.com/actions/stale/issues/1029)

For more information, please read the [action documentation](https://github.com/actions/stale#readme) and its [section about statefulness](https://github.com/actions/stale#statefulness)



# [4.1.1]

In scope of this release we updated [actions/core to 1.10.0](https://github.com/actions/stale/pull/957) for v4 and [fixed issues operation count](https://github.com/actions/stale/pull/662). 

# [8.0.0]

:warning: This version contains breaking changes :warning:

* New option labels-to-remove-when-stale enables users to specify list of comma delimited labels that will be removed when the issue or PR becomes stale by @panticmilos https://github.com/actions/stale/issues/770
* Skip deleting the branch in the upstream of a forked repo by @dsame https://github.com/actions/stale/pull/913
* abort the build on the error by @dsame in https://github.com/actions/stale/pull/935

# [7.0.0]

:warning: Breaking change :warning:

* Allow daysBeforeStale options to be float by @irega in https://github.com/actions/stale/pull/841
* Use cache in check-dist.yml by @jongwooo in https://github.com/actions/stale/pull/876
* fix print outputs step in existing workflows by @irega in https://github.com/actions/stale/pull/859
* Update issue and PR templates, add/delete workflow files by @IvanZosimov in https://github.com/actions/stale/pull/880
* Update how stale handles exempt items by @johnsudol in https://github.com/actions/stale/pull/874

# [6.0.1]

Update @actions/core to v1.10.0 ([#839](https://github.com/actions/stale/pull/839))

# [6.0.0]

:warning: Breaking change :warning:

Issues/PRs default `close-issue-reason` is now `not_planned`([#789](https://github.com/actions/stale/issues/789))

# [5.1.0]

[Don't process stale issues right after they're marked stale](https://github.com/actions/stale/issues/696)
[Add close-issue-reason option][#764](https://github.com/actions/stale/pull/764)[#772](https://github.com/actions/stale/pull/772)
Various dependabot/dependency updates

## [4.1.0](https://github.com/actions/stale/compare/v3.0.19...v4.1.0) (2021-07-14)

## Features

- [Ability to exempt draft PRs](https://github.com/actions/stale/commit/9912fa74d1c01b5d6187793d97441019cbe325d0)

## [4.0.0](https://github.com/actions/stale/compare/v3.0.19...v4.0.0) (2021-07-14)

### Features

- **options:** simplify config by removing skip stale message options ([#457](https://github.com/actions/stale/issues/457)) ([6ec637d](https://github.com/actions/stale/commit/6ec637d238067ab8cc96c9289dcdac280bbd3f4a)), closes [#405](https://github.com/actions/stale/issues/405) [#455](https://github.com/actions/stale/issues/455)
- **output:** print output parameters ([#458](https://github.com/actions/stale/issues/458)) ([3e6d35b](https://github.com/actions/stale/commit/3e6d35b685f0b2fa1a69be893fa07d3d85e05ee0))

### Bug Fixes

- **dry-run:** forbid mutations in dry-run ([#500](https://github.com/actions/stale/issues/500)) ([f1017f3](https://github.com/actions/stale/commit/f1017f33dd159ea51366375120c3e6981d7c3097)), closes [#499](https://github.com/actions/stale/issues/499)
- **logs:** coloured logs ([#465](https://github.com/actions/stale/issues/465)) ([5fbbfba](https://github.com/actions/stale/commit/5fbbfba142860ea6512549e96e36e3540c314132))
- **operations:** fail fast the current batch to respect the operations limit ([#474](https://github.com/actions/stale/issues/474)) ([5f6f311](https://github.com/actions/stale/commit/5f6f311ca6aa75babadfc7bac6edf5d85fa3f35d)), closes [#466](https://github.com/actions/stale/issues/466)
- **label comparison**: make label comparison case insensitive [#517](https://github.com/actions/stale/pull/517), closes [#516](https://github.com/actions/stale/pull/516)
- **filtering comments by actor could have strange behavior**: "stale" comments are now detected based on if the message is the stale message not _who_ made the comment([#519](https://github.com/actions/stale/pull/519)), fixes [#441](https://github.com/actions/stale/pull/441), [#509](https://github.com/actions/stale/pull/509), [#518](https://github.com/actions/stale/pull/518)

### Breaking Changes

- The options `skip-stale-issue-message` and `skip-stale-pr-message` were removed. Instead, setting the options `stale-issue-message` and `stale-pr-message` will be enough to let the stale workflow add a comment. If the options are unset, a comment will not be added which was the equivalent of setting `skip-stale-issue-message` to `true`.
- The `operations-per-run` option will be more effective. After migrating, you could face a failed-fast process workflow if you let the default value (30) or set it to a small number. In that case, you will see a warning at the end of the logs (if enabled) indicating that the workflow was stopped sooner to avoid consuming too much API calls. In most cases, you can just increase this limit to make sure to process everything in a single run.

