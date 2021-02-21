### Building and testing

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

### Before creating a PR

Build, lint, package and test everything.

```bash
$ npm all
```
