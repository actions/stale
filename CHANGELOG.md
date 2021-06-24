# Changelog
Starting in version 4.0.0 we will maintain a changelog

## [4.0.0](https://github.com/actions/stale/compare/v3.0.19...v4.0.0) (2021-06-18)


### Features

* **options:** add new options to avoid stale base on comments ([#494](https://github.com/actions/stale/issues/494)) ([1efddcb](https://github.com/actions/stale/commit/1efddcbe9ff0497885b9746a8ea5fa0314286053)), closes [#441](https://github.com/actions/stale/issues/441) [#470](https://github.com/actions/stale/issues/470) [#435](https://github.com/acti
ons/stale/issues/435) [#390](https://github.com/actions/stale/issues/390)
* **options:** simplify config by removing skip stale message options ([#457](https://github.com/actions/stale/issues/457)) ([6ec637d](https://github.com/actions/stale/commit/6ec637d238067ab8cc96c9289dcdac280bbd3f4a)), closes [#405](https://github.com/actions/stale/issues/405) [#455](https://github.com/actions/stale/issues/455)
* **output:** print output parameters ([#458](https://github.com/actions/stale/issues/458)) ([3e6d35b](https://github.com/actions/stale/commit/3e6d35b685f0b2fa1a69be893fa07d3d85e05ee0))


### Bug Fixes

* **dry-run:** forbid mutations in dry-run ([#500](https://github.com/actions/stale/issues/500)) ([f1017f3](https://github.com/actions/stale/commit/f1017f33dd159ea51366375120c3e6981d7c3097)), closes [#499](https://github.com/actions/stale/issues/499)
* **logs:** coloured logs ([#465](https://github.com/actions/stale/issues/465)) ([5fbbfba](https://github.com/actions/stale/commit/5fbbfba142860ea6512549e96e36e3540c314132))
* **operations:** fail fast the current batch to respect the operations limit ([#474](https://github.com/actions/stale/issues/474)) ([5f6f311](https://github.com/actions/stale/commit/5f6f311ca6aa75babadfc7bac6edf5d85fa3f35d)), closes [#466](https://github.com/actions/stale/issues/466)
---

### Breaking Changes

??

### Features
[Docs Overhaul](https://github.com/actions/stale/pull/456)

[Remove Options](https://github.com/actions/stale/pull/457) :warning: Breaking Change :warning:
- Remove `skip-stale-issue-message` and `skip-stale-pr-message` options. 
- If you used these options, replace it with an empty string for the options `stale-issue-message` and `stale-pr-message`

[Output Issues/PRs that are stale](https://github.com/actions/stale/pull/458)

[Log Grouping](https://github.com/actions/stale/pull/483)

[Add Custom Labels after Unstale](https://github.com/actions/stale/pull/468)

Dependency Updates

### Bug Fixes
[Fix Colored Logs](https://github.com/actions/stale/pull/465)
