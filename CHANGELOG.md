# Changelog

## [4.1.0](https://github.com/actions/stale/compare/v3.0.19...v4.1.0) (2021-07-14)

## Features

- [Ability to exempt draft PRs](https://github.com/actions/stale/commit/9912fa74d1c01b5d6187793d97441019cbe325d0
)

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
