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
$ npm run test:only-errors
```

Run the tests with the watch mode :heavy_check_mark:

```bash
$ npm run test:watch
```

Run the linter and fix (almost) every issue for you :heavy_check_mark:

```bash
$ npm run lint:all:fix
```

# Before creating a PR

## Build and quality checks

Build, lint, package and test everything.

```bash
$ npm run all
```

# Release

Based on [standard-version](https://github.com/conventional-changelog/standard-version).

## Define the new version

You can run `npm run release:dry-run` to create a dry-run, or you can directly run `npm run release` to create a new local release.  
It will run `prerelease` beforehand to build and pack everything.

If the `prerelease` succeeded, a bump of version will happen based on the unreleased commits.  
It will:

- Update the _package.json_ version field
- Update the _package-lock.json_ version field
- Update the _CHANGELOG.md_ to include the release notes of the new version
- Create a local tag
- Create a commit

If everything generated seems ok for you, you can push your tag by running `git push --follow-tags origin {your-branch-name}`.
