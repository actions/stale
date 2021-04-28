# Building and testing

Install the dependencies.

```bash
$ npm install
```

Build the typescript and package it for distribution.

```bash
$ npm run build && npm run pack
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

Run the tests and display only the first failing tests :heavy_check_mark:

```bash
$ npm test:only-errors
```

Run the tests with the watch mode :heavy_check_mark:

```bash
$ npm test:watch
```

Run the linter and fix (almost) every issue for you :heavy_check_mark:

```bash
$ npm lint:all:fix
```

# Before creating a PR

## Build and quality checks

Build, lint, package and test everything.

```bash
$ npm all
```

## Changelog update

Update the [CHANGELOG](CHANGELOG.md) and be user-friendly.  
Only add some content inside the unreleased section at the top of the file.

Based on your PR, you can either add:

- A new feature (### :rocket: New Features)
- A bugfix (### :bug: Bug Fixes)

**Example before:**

```
# Actions stale

# Unreleased

# [v3.0.18](https://github.com/actions/stale/compare/v3.0.17...v3.0.18) (2021-03-5)
...
```

**Example after:**

```
# Actions stale

# Unreleased

### :rocket: New Features

- Add 2 new options `any-of-issue-labels` and `any-of-pr-labels` to customize the `any-of-labels` option for issues and PRs

# [v3.0.18](https://github.com/actions/stale/compare/v3.0.17...v3.0.18) (2021-03-5)
...
```

# Release

## Changelog update

You need to update the current unreleased changes to associate them with the new release.  
Simply add a new row containing the tag name, a link to compare the code between this release and the previous one and the release date.  
You also need to add a link to the commits introducing these changes.

**Example before:**

```
# Actions stale

# Unreleased

### :rocket: New Features

- Add 2 new options `any-of-issue-labels` and `any-of-pr-labels` to customize the `any-of-labels` option for issues and PRs
...
```

**Example after:**

```
# Actions stale

# Unreleased

# [v3.0.18](https://github.com/actions/stale/compare/v3.0.17...v3.0.18) (2021-03-5)

### :rocket: New Features

- Add 2 new options `any-of-issue-labels` and `any-of-pr-labels` to customize the `any-of-labels` option for issues and PRs ([c70e174](https://github.com/actions/stale/commit/c70e174d4ae9c9e534150ad4f9ad307ba5a613db))
...
```
