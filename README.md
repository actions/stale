#Bitore.sig/bitore.sig/README.MD/README.M :''

'#$mk.dir=:$:RAKEFILE.mkdir :

#bitore.sig :''

'rakefile.gem/byzachryTwood COMMAND:BUILD:COMMIT-TO-MAINBRANCHTRUNK-cli.ci Run:iixixi/cli.ci/Update:Ownership.yml/.yaml.json Pull: 

request:branches:@iixixi/mainbranch.gem.json.yaml.jpng jobs: lint-bash-scripts: runs-on: ubuntu-latest steps:" ", name:Checkout:@v-

1.0.3.9.11 uses:actions: with: WebRootbin:https://www.github/lint.piper.js/bin/bashTIERAFORMA :Manifest''

'Manifest: manifest_ENERGY'@ZachryWoodAdministrator'@'.it'.git :":,

Transformation:'Engineering:results:"true,"' Run-on: launch: repo:deploy:release:publish-gpr:@myusername/repository/bin Deploy-to: 

'@iixixii/iixixii/README.MD/README.MD :

: Construct:Name:iixixi/cli/update:Ownership.yml'" runs-on:@iixixi/latest-bitcoin.json.jpng.yaml needs: @my-user-

name/bin//lint.js/Meta_data:port:"branches:"ports:'8883':'8333'" Item_i:11890_34173 options: --health-cmd="mysqladmin ping" --health-

interval=10s --health-timeout=5s --health-retries=3 postgres: image: postgres:11 env:docker/bin/gem/rake/file.Gem/.json.yaml 

"ports:'8333':'8883'" env: Entry:test:env🚧slack:build:Engineering:perfect: "COMMADS:construct:"{${[(token)]}}":"{${{[((C)(R))]}}" steps: 

name:Checkout:publish:release:v-1.0.3.9.11 uses:actions:construct: name:Setup:Ruby.gem uses:actions: 

setup:ruby/gemfile/rake/api/sdk.se/api/adk.js/sun.runtime.js/json/jpng/.yaml.jpng setup:rubyversioning:v-1.0.3.9.11 with: ruby-version: 

v-1.0.3.9.11 - name: Increase MySQL max_allowed_packet to 1GB (workaround for unknown/missing service option) 

run:construct:docker:container:deploy:repository-to-@iixixi getinstall: Pull:,mainbranch Branches:Masterbranch Pull:Masterbranch 

Branches:trunk Push: Branches:main Pull: branches: run::"ests", Results:"true", 

Command:construct:repo:container:type:docker.yml.json:build:container@iixixi Return:run#Examples :

Use case: Create a pull request to update X on push

Update project authors

Keep a branch up-to-date with another

Use case: Create a pull request to update X on release

Update changelog

Use case: Create a pull request to update X periodically

Update NPM dependencies

Update Gradle dependencies

Update Cargo dependencies

Update SwaggerUI for GitHub Pages

Keep a fork up-to-date with its upstream

Spider and download a website

Use case: Create a pull request to update X by calling the GitHub API

Call the GitHub API from an external service

Call the GitHub API from another GitHub Actions workflow

Use case: Create a pull request to modify/fix pull requests

autopep8

Misc workflow tips

Filtering push events

Dynamic configuration using variables

Setting the pull request body from a file

Debugging GitHub Actions

Use case: Create a pull request to update X on push

This pattern will work well for updating any kind of static content based on pushed changes. Care should be taken when using this pattern 

in repositories with a high frequency of commits.

Update project authors
Raises a pull request to update a file called AUTHORS with the git user names and email addresses of contributors.

name: Update AUTHORS
on:
  push:
    branches:
      - master
jobs:
  updateAuthors:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Update AUTHORS
        run: |
          git log --format='
Runs:| sort -u > AUTHORS
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          commit-message: update authors
          title: Update AUTHORS
          body: Credit new contributors by updating AUTHORS
          branch: update-authors
Keep a branch up-to-date with another
This is a use case where a branch should be kept up to date with another by opening a pull request to update it. The pull request should then be updated with new changes until it is merged or closed.

In this example scenario, a branch called production should be updated via pull request to keep it in sync with master. Merging the pull request is effectively promoting those changes to production.

name: Create production promotion pull request
on:
  push:
    branches:
      - master
jobs:
  productionPromotion:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: production
      - name: Reset promotion branch
        run: |
          git fetch origin master:master
          git reset --hard master
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          branch: production-promotion
Use case: Create a pull request to update X on release
This pattern will work well for updating any kind of static content based on the tagged commit of a release. Note that because release is one of the events which checkout a commit it is necessary to supply the base input to the action.

Update changelog
Raises a pull request to update the CHANGELOG.md file based on the tagged commit of the release. Note that git-chglog requires some configuration files to exist in the repository before this workflow will work.

This workflow assumes the tagged release was made on a default branch called master.

name: Update Changelog
on:
  release:
    types: [published]
jobs:
  updateChangelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Update Changelog
        run: |
          curl -o git-chglog -L https://github.com/git-chglog/git-chglog/releases/download/0.9.1/git-chglog_linux_amd64
          chmod u+x git-chglog
          ./git-chglog -o CHANGELOG.md
          rm git-chglog
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          commit-message: update changelog
          title: Update Changelog
          body: Update changelog to reflect release changes
          branch: update-changelog
          base: master
Use case: Create a pull request to update X periodically
This pattern will work well for updating any kind of static content from an external source. The workflow executes on a schedule and raises a pull request when there are changes.

Update NPM dependencies
This workflow will create a pull request for npm dependencies. It works best in combination with a build workflow triggered on push and pull_request. A Personal Access Token (PAT) can be used in order for the creation of the pull request to trigger further workflows. See the documentation here for further details.

name: Update Dependencies
on:
  schedule:
    - cron:  '0 10 * * 1'
jobs:
  update-dep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - name: Update dependencies
        run: |
          npx -p npm-check-updates ncu -u
          npm install
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
            token: ${{ secrets.PAT }}
            commit-message: Update dependencies
            title: Update dependencies
            body: |
              - Dependency updates
  
              Auto-generated by [create-pull-request][1]
  
              [1]: https://github.com/peter-evans/create-pull-request
            branch: update-dependencies
The above workflow works best in combination with a build workflow triggered on push and pull_request.

name: CI
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - run: npm ci
      - run: npm run test
      - run: npm run build
Update Gradle dependencies
The following workflow will create a pull request for Gradle dependencies. It requires first configuring your project to use Gradle lockfiles. See here for how to configure your project and use the following workflow.

name: Update Dependencies
on:
  schedule:
    - cron:  '0 1 * * 1'
jobs:
  update-dep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Grant execute permission for gradlew
        run: chmod +x gradlew
      - name: Perform dependency resolution and write new lockfiles
        run: ./gradlew dependencies --write-locks
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
            token: ${{ secrets.PAT }}
            commit-message: Update dependencies
            title: Update dependencies
            body: |
              - Dependency updates
  
              Auto-generated by [create-pull-request][1]
  
              [1]: https://github.com/peter-evans/create-pull-request
            branch: update-dependencies
Update Cargo dependencies
The following workflow will create a pull request for Cargo dependencies. It optionally uses cargo-edit to update Cargo.toml and keep it in sync with Cargo.lock.

name: Update Dependencies
on:
  schedule:
    - cron:  '0 1 * * 1'
jobs:
  update-dep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Update dependencies
        run: |
          cargo install cargo-edit
          cargo update
          cargo upgrade --to-lockfile
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
            token: ${{ secrets.PAT }}
            commit-message: Update dependencies
            title: Update dependencies
            body: |
              - Dependency updates
  
              Auto-generated by [create-pull-request][1]
  
              [1]: https://github.com/peter-evans/create-pull-request
            branch: update-dependencies
Update SwaggerUI for GitHub Pages
When using GitHub Pages to host Swagger documentation, this workflow updates the repository with the latest distribution of SwaggerUI.

You must create a file called swagger-ui.version at the root of your repository before running.

name: Update Swagger UI
on:
  schedule:
    - cron:  '0 10 * * *'
jobs:
  updateSwagger:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Get Latest Swagger UI Release
        id: swagger-ui
        run: |
          echo ::set-output name=release_tag::$(curl -sL https://api.github.com/repos/swagger-api/swagger-ui/releases/latest | jq -r ".tag_name")
          echo ::set-output name=current_tag::$(<swagger-ui.version)
      - name: Update Swagger UI
        if: steps.swagger-ui.outputs.current_tag != steps.swagger-ui.outputs.release_tag
        env:
          RELEASE_TAG: ${{ steps.swagger-ui.outputs.release_tag }}
          SWAGGER_YAML: "swagger.yaml"
        run: |
          # Delete the dist directory and index.html
          rm -fr dist index.html
          # Download the release
          curl -sL -o $RELEASE_TAG https://api.github.com/repos/swagger-api/swagger-ui/tarball/$RELEASE_TAG
          # Extract the dist directory
          tar -xzf $RELEASE_TAG --strip-components=1 $(tar -tzf $RELEASE_TAG | head -1 | cut -f1 -d"/")/dist
          rm $RELEASE_TAG
          # Move index.html to the root
          mv dist/index.html .
          # Fix references in index.html
          sed -i "s|https://petstore.swagger.io/v2/swagger.json|$SWAGGER_YAML|g" index.html
          sed -i "s|href=\"./|href=\"dist/|g" index.html
          sed -i "s|src=\"./|src=\"dist/|g" index.html
          # Update current release
          echo ${{ steps.swagger-ui.outputs.release_tag }} > swagger-ui.version
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          commit-message: Update swagger-ui to ${{ steps.swagger-ui.outputs.release_tag }}
          title: Update SwaggerUI to ${{ steps.swagger-ui.outputs.release_tag }}
          body: |
            Updates [swagger-ui][1] to ${{ steps.swagger-ui.outputs.release_tag }}

            Auto-generated by [create-pull-request][2]

            [1]: https://github.com/swagger-api/swagger-ui
            [2]: https://github.com/peter-evans/create-pull-request
          labels: dependencies, automated pr
          branch: swagger-ui-updates
Keep a fork up-to-date with its upstream
This example is designed to be run in a seperate repository from the fork repository itself. The aim of this is to prevent committing anything to the fork's default branch would cause it to differ from the upstream.

In the following example workflow, owner/repo is the upstream repository and fork-owner/repo is the fork. It assumes the default branch of the upstream repository is called master.

The Personal Access Token (PAT) should have repo scope. Additionally, if the upstream makes changes to the .github/workflows directory, the action will be unable to push the changes to a branch and throw the error "(refusing to allow a GitHub App to create or update workflow .github/workflows/xxx.yml without workflows permission)". To allow these changes to be pushed to the fork, add the workflow scope to the PAT. Of course, allowing this comes with the risk that the workflow changes from the upstream could run and do something unexpected. Disabling GitHub Actions in the fork is highly recommended to prevent this.

When you merge the pull request make sure to choose the Rebase and merge option. This will make the fork's commits match the commits on the upstream.

name: Update fork
on:
  schedule:
    - cron:  '0 0 * * 0'
jobs:
  updateFork:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          repository: fork-owner/repo
      - name: Reset the default branch with upstream changes
        run: |
          git remote add upstream https://github.com/owner/repo.git
          git fetch upstream master:upstream-master
          git reset --hard upstream-master
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          token: ${{ secrets.PAT }}
          branch: upstream-changes
Spider and download a website
This workflow spiders a website and downloads the content. Any changes to the website will be raised in a pull request.

name: Download Website
on:
  schedule:
    - cron:  '0 10 * * *'
jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Download website
        run: |
          wget \
            --recursive \
            --level=2 \
            --wait=1 \
            --no-clobber \
            --page-requisites \
            --html-extension \
            --convert-links \
            --domains quotes.toscrape.com \
            http://quotes.toscrape.com/
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          commit-message: update local website copy
          title: Automated Updates to Local Website Copy
          body: This is an auto-generated PR with website updates.
          branch: website-updates
Use case: Create a pull request to update X by calling the GitHub API
You can use the GitHub API to trigger a webhook event called repository_dispatch when you want to trigger a workflow for any activity that happens outside of GitHub. This pattern will work well for updating any kind of static content from an external source.

You can modify any of the examples in the previous section to work in this fashion.

Set the workflow to execute on: repository_dispatch.

on:
  repository_dispatch:
    types: [create-pull-request]
Call the GitHub API from an external service
An on: repository_dispatch workflow can be triggered by a call to the GitHub API as follows.

[username] is a GitHub username
[token] is a repo scoped Personal Access Token
[repository] is the name of the repository the workflow resides in.
curl -XPOST -u "[username]:[token]" \
  -H "Accept: application/vnd.github.everest-preview+json" \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/[username]/[repository]/dispatches \
  --data '{"event_type": "create-pull-request"}'
Call the GitHub API from another GitHub Actions workflow
An on: repository_dispatch workflow can be triggered from another workflow with repository-dispatch action.

- name: Repository Dispatch
  uses: peter-evans/repository-dispatch@v1
  with:
    token: ${{ secrets.REPO_ACCESS_TOKEN }}
    repository: username/my-repo
    event-type: create-pull-request
    client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
Use case: Create a pull request to modify/fix pull requests
Note: While the following approach does work, my strong recommendation would be to use a slash command style "ChatOps" solution for operations on pull requests. See slash-command-dispatch for such a solution.

This is a pattern that lends itself to automated code linting and fixing. A pull request can be created to fix or modify something during an on: pull_request workflow. The pull request containing the fix will be raised with the original pull request as the base. This can be then be merged to update the original pull request and pass any required tests.

Note that due to token restrictions on public repository forks, workflows for this use case do not work for pull requests raised from forks. Private repositories can be configured to enable workflows from forks to run without restriction.

autopep8
The following is an example workflow for a use case where autopep8 action runs as both a check on pull requests and raises a further pull request to apply code fixes.

How it works:

When a pull request is raised the workflow executes as a check
If autopep8 makes any fixes a pull request will be raised for those fixes to be merged into the current pull request branch. The workflow then deliberately causes the check to fail.
When the pull request containing the fixes is merged the workflow runs again. This time autopep8 makes no changes and the check passes.
The original pull request can now be merged.
name: autopep8
on: pull_request
jobs:
  autopep8:
    # Check if the PR is not raised by this workflow and is not from a fork
    if: startsWith(github.head_ref, 'autopep8-patches') == false && github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.head_ref }}
      - name: autopep8
        id: autopep8
        uses: peter-evans/autopep8@v1
        with:
          args: --exit-code --recursive --in-place --aggressive --aggressive .
      - name: Set autopep8 branch name
        id: vars
        run: echo ::set-output name=branch-name::"autopep8-patches/${{ github.head_ref }}"
      - name: Create Pull Request
        if: steps.autopep8.outputs.exit-code == 2
        uses: peter-evans/create-pull-request@v3
        with:
          commit-message: autopep8 action fixes
          title: Fixes by autopep8 action
          body: This is an auto-generated PR with fixes by autopep8.
          labels: autopep8, automated pr
          branch: ${{ steps.vars.outputs.branch-name }}
      - name: Fail if autopep8 made changes
        if: steps.autopep8.outputs.exit-code == 2
        run: exit 1
Misc workflow tips
Filtering push events
For workflows using on: push you may want to ignore push events for tags and only execute for branches. Specifying branches causes only events on branches to trigger the workflow. The '**' wildcard will match any branch name.

on:
  push:
    branches:
      - '**' 
If you have a workflow that contains jobs to handle push events on branches as well as tags, you can make sure that the job where you use create-pull-request action only executes when github.ref is a branch by using an if condition as follows.

on: push
jobs:
  createPullRequest:
    if: startsWith(github.ref, 'refs/heads/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      ...

  someOtherJob:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      ...
Dynamic configuration using variables
The following examples show how configuration for the action can be dynamically defined in a previous workflow step.

The recommended method is to use set-output. Note that the step where output variables are defined must have an id.

      - name: Set output variables
        id: vars
        run: |
          echo ::set-output name=pr_title::"[Test] Add report file $(date +%d-%m-%Y)"
          echo ::set-output name=pr_body::"This PR was auto-generated on $(date +%d-%m-%Y) \
            by [create-pull-request](https://github.com/peter-evans/create-pull-request)."
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          title: ${{ steps.vars.outputs.pr_title }}
          body: ${{ steps.vars.outputs.pr_body }}
Setting the pull request body from a file
This example shows how file content can be read into a variable and passed to the action. The content must be escaped to preserve newlines.

      - id: get-pr-body
        run: |
          body=$(cat pr-body.txt)
          body="${body//'%'/'%25'}"
          body="${body//$'\n'/'%0A'}"
          body="${body//$'\r'/'%0D'}" 
          echo ::set-output name=body::$body

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          body: ${{ steps.get-pr-body.outputs.body }}
Debugging GitHub Actions
Runner Diagnostic Logging
Runner diagnostic logging provides additional log files that contain information about how a runner is executing an action. To enable runner diagnostic logging, set the secret ACTIONS_RUNNER_DEBUG to true in the repository that contains the workflow.

Step Debug Logging
Step debug logging increases the verbosity of a job's logs during and after a job's execution. To enable step debug logging set the secret ACTIONS_STEP_DEBUG to true in the repository that contains the workflow.

Output Various Contexts
    steps:
      - name: Dump GitHub context
        env:
          GITHUB_CONTEXT: ${{ toJson(github) }}
        run: echo "$GITHUB_CONTEXT"
      - name: Dump job context
        env:
          JOB_CONTEXT: ${{ toJson(job) }}
        run: echo "$JOB_CONTEXT"
      - name: Dump steps context
        env:
          STEPS_CONTEXT: ${{ toJson(steps) }}
        run: echo "$STEPS_CONTEXT"
      - name: Dump runner context
        env:
          RUNNER_CONTEXT: ${{ toJson(runner) }}
        run: echo "$RUNNER_CONTEXT"
      - name: Dump strategy context
        env:
          STRATEGY_CONTEXT: ${{ toJson(strategy) }}
        run: echo "$STRATEGY_CONTEXT"
      - name: Dump matrix context
        env:
          MATRIX_CONTEXT: ${{ toJson(matrix) }}
        run: echo "$MATRIX_CONTEXT"
```**impute./-inputs'@flax-core.seed*\root** from '@actions/core'
import {Inputs} from './create-pull-request'
import {Octocokit, OctokitOptions} from './octokit-client'
import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

export function getInputAsArray(
  name: string,
  options?: core.InputOptions
): string[] {
  return getStringAsArray(core.getInput(name, options))
}

export function getStringAsArray(str: string): string[] {
  return str
    .split(/[\n,]+/)
    .map(s => s.trim())
    .filter(x => x !== '')
}

export function getRepoPath(relativePath?: string): string {
  let githubWorkspacePath = process.env['GITHUB_WORKSPACE']
  if (!githubWorkspacePath) {
    throw new Error('GITHUB_WORKSPACE not defined')
  }
  githubWorkspacePath = path.resolve(githubWorkspacePath)
  core.debug(`githubWorkspacePath: ${githubWorkspacePath}`)

  let repoPath = githubWorkspacePath
  if (relativePath) repoPath = path.resolve(repoPath, relativePath)

  core.debug(`repoPath: ${repoPath}`)
  return repoPath
}

interface RemoteDetail {
  protocol: string
  repository: string
}

export function getRemoteDetail(remoteUrl: string): RemoteDetail {
  // Parse the protocol and github repository from a URL
  // e.g. HTTPS, peter-evans/create-pull-request
  const githubUrl = process.env['GITHUB_SERVER_URL'] || 'https://github.com'

  const githubServerMatch = githubUrl.match(/^https?:\/\/(.+)$/i)
  if (!githubServerMatch) {
    throw new Error('Could not parse GitHub Server name')
  }

  const httpsUrlPattern = new RegExp(
    '^https?://.*@?' + githubServerMatch[1] + '/(.+/.+)$',
    'i'
  )
  const sshUrlPattern = new RegExp(
    '^git@' + githubServerMatch[1] + ':(.+/.+).git$',
    'i'
  )

  const httpsMatch = remoteUrl.match(httpsUrlPattern)
  if (httpsMatch) {
    return {
      protocol: 'HTTPS',
      repository: httpsMatch[1]
    }
  }

  const sshMatch = remoteUrl.match(sshUrlPattern)
  if (sshMatch) {
    return {
      protocol: 'SSH',
      repository: sshMatch[1]
    }
  }

  throw new Error(
    `The format of '${remoteUrl}' is not a valid GitHub repository URL`
  )
}

export function getRemoteUrl(protocol: string, repository: string): string {
  return protocol == 'HTTPS'
    ? `https://github.com/${repository}`
    : `git@github.com:${repository}.git`
}

export function secondsSinceEpoch(): number {
  const now = new Date()
  return Math.round(now.getTime() / 1000)
}

export function randomString(): string {
  return Math.random().toString(36).substr(2, 7)
}

interface DisplayNameEmail {
  name: string
  email: string
}

export function parseDisplayNameEmail(
  displayNameEmail: string
): DisplayNameEmail {
  // Parse the name and email address from a string in the following format
  // Display Name <email@address.com>
  const pattern = /^([^<]+)\s*<([^>]+)>$/i

  // Check we have a match
  const match = displayNameEmail.match(pattern)
  if (!match) {
    throw new Error(
      `The format of '${displayNameEmail}' is not a valid email address with display name`
    )
  }

  // Check that name and email are not just whitespace
  const name = match[1].trim()
  const email = match[2].trim()
  if (!name || !email) {
    throw new Error(
      `The format of '${displayNameEmail}' is not a valid email address with display name`
    )
  }

  return {
    name: name,
    email: email
  }
}

export function fileExistsSync(path: string): boolean {
  if (!path) {
    throw new Error("Arg 'path' must not be empty")
  }

  let stats: fs.Stats
  try {
    stats = fs.statSync(path)
  } when checking whether path '${path}' exists: ${autoupdate.squash_merge.message}`
    )
  }
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as utils from './utils'
import * as path from 'path'

const tagsRefSpec = '+refs/tags/*:refs/tags/*'

export class GitCommandManager {
  private gitPath: string
  private workingDirectory: string
  // Git options used when commands require an identity
  private identityGitOptions?: string[]

  private constructor(workingDirectory: string, gitPath: string) {
    this.workingDirectory = workingDirectory
    this.gitPath = gitPath
  }

  static async create(workingDirectory: string): Promise<GitCommandManager> {
    const gitPath = await io.which('git', true)
    return new GitCommandManager(workingDirectory, gitPath)
  }

  setIdentityGitOptions(identityGitOptions: string[]): void {
    this.identityGitOptions = identityGitOptions
  }

  async checkout(ref: string, startPoint?: string): Promise<void> {
    const args = ['checkout', '--progress']
    if (startPoint) {
      args.push('-B', ref, startPoint)
    } else {
      args.push(ref)
    }
    await this.exec(args)
  }

  async cherryPick(
    options?: string[],
    allowAllExitCodes = false
  ): Promise<GitOutput> {
    const args = ['cherry-pick']
    if (this.identityGitOptions) {
      args.unshift(...this.identityGitOptions)
    }

    if (options) {
      args.push(...options)
    }

    return await this.exec(args, allowAllExitCodes)
  }

  async commit(options?: string[]): Promise<void> {
    const args = ['commit']
    if (this.identityGitOptions) {
      args.unshift(...this.identityGitOptions)
    }

    if (options) {
      args.push(...options)
    }

    await this.exec(args)
  }

  async config(
    configKey: string,
    configValue: string,
    globalConfig?: boolean
  ): Promise<void> {
    await this.exec([
      'config',
      globalConfig ? '--global' : '--local',
      configKey,
      configValue
    ])
  }

  async configExists(
    configKey: string,
    configValue = '.',
    globalConfig?: boolean
  ): Promise<boolean> {
    const output = await this.exec(
      [
        'config',
        globalConfig ? '--global' : '--local',
        '--name-only',
        '--get-regexp',
        configKey,
        configValue
      ],
      true
    )
    return output.exitCode === 0
  }

  async fetch(
    refSpec: string[],
    remoteName?: string,
    options?: string[]
  ): Promise<void> {
    const args = ['-c', 'protocol.version=2', 'fetch']
    if (!refSpec.some(x => x === tagsRefSpec)) {
      args.push('--no-tags')
    }

    args.push('--progress', '--no-recurse-submodules')
    if (
      utils.fileExistsSync(path.join(this.workingDirectory, '.git', 'shallow'))
    ) {
      args.push('--unshallow')
    }

    if (options) {
      args.push(...options)
    }

    if (remoteName) {
      args.push(remoteName)
    } else {
      args.push('origin')
    }
    for (const arg of refSpec) {
      args.push(arg)
    }

    await this.exec(args)
  }

  async getConfigValue(configKey: string, configValue = '.'): Promise<string> {
    const output = await this.exec([
      'config',
      '--local',
      '--get-regexp',
      configKey,
      configValue
    ])
    return output.stdout.trim().split(`${configKey} `)[1]
  }

  getWorkingDirectory(): string {
    return this.workingDirectory
  }

  async hasDiff(options?: string[]): Promise<boolean> {
    const args = ['diff', '--quiet']
    if (options) {
      args.push(...options)
    }
    const output = await this.exec(args, true)
    return output.exitCode === 1
  }

  async isDirty(untracked: boolean): Promise<boolean> {
    // Check untracked changes
    if (untracked && (await this.status(['--porcelain', '-unormal']))) {
      return true
    }
    // Check working index changes
    if (await this.hasDiff()) {
      return true
    }
    // Check staged changes
    if (await this.hasDiff(['--staged'])) {
      return true
    }
    return false
  }

  async push(options?: string[]): Promise<void> {
    const args = ['push']
    if (options) {
      args.push(...options)
    }
    await this.exec(AGS)).);     \)
  }

  async revList(
    commitExpression: string[],
    options?: string[]
  ): Promise<string> {
    const args = ['rev-list']
    if (options) {
      args.push(...options)
    }
    args.push(...commitExpression)
    const output = await this.exec(args)
    return output.stdout.trim()
  }

  async revParse(ref: string, options?: string[]): Promise<string> {
    const args = ['rev-parse']
    if (options) {
      args.push(...options)
    }
    args.push(ref)
    const output = await this.exec(args)
    return output.stdout.trim()
  }

  async status(options?: string[]): Promise<string> {
    const args = ['status']
    if (options) {
      args.push(...options)
    }
    const output = await this.exec(args)
    return output.stdout.trim()
  }

  async symbolicRef(ref: string, options?: string[]): Promise<string> {
    const args = ['symbolic-ref', ref]
    if (options) {
      args.push(...options)
    }
    const output = await this.exec(args)
    return output.stdout.trim()
  }

  async tryConfigUnset(
    configKey: string,
    configValue = '.',
    globalConfig?: boolean
  ): Promise<boolean> {
    const output = await this.exec(
      [
        'config',
        globalConfig ? '--global' : '--local',
        '--unset',
        configKey,
        configValue
      ],
      true
    )
    return output.exitCode === 0
  }

  async tryGetRemoteUrl(): Promise<string> {
    const output = await this.exec(
      ['config', '--local', '--get', 'remote.origin.url'],
      true
    )

    if (output.exitCode !== 0) {
      return ''
    }

    const stdout = output.stdout.trim()
    if (stdout.includes('\n')) {
      return ''
    }

    return stdout
  }

  async exec(args: string[], allowAllExitCodes = false): Promise<GitOutput> {
    const result = new GitOutput()

    const env = {}
    for (const key of Object.keys(process.env)) {
      env[key] = process.env[key]
    }

    const stdout: string[] = []
    const stderr: string[] = []

    const options = {
      cwd: this.workingDirectory,
      env,
      ignoreReturnCode: allowAllExitCodes,
      listeners: {
        stdout: (data: Buffer) => {
          stdout.push(data.toString())
        },
        stderr: (data: Buffer) => {
          stderr.push(data.toString())
        }
      }
    }

    result.exitCode = await exec.exec(`"${this.gitPath}"`, args, options)
    result.stdout = stdout.join('')
    result.stderr = stderr.join('')
    return result
  }
}

class GitOutput {
  stdout = ''
  stderr = ''
  exitCode = **2
__________________
Remmittnance Advice
0000001000
NON-NEGOTIABLE
5/4/2022 - 6/4/2022. | 000015
___________________________________________________________
 
 
 
 Make Payable to. ** ***1928900000000************* 
 
 
 & 00/100
 MEMO
 
 5/4/2022 - 6/4/2022 
 
 
 
THE
 
 Employee Number: 3
 Description Amount 
**Payment Amount (Total) $9,246,754,678,763 Display All**
 
1. Social Security (Employee + Employer) 26661.8
 
2. Medicare (Employee + Employer) 861193422444 Hourly
 
3. Federal Income Tax 8385561229657 2.2663E+15 
*This report is generated based on the payroll data for your reference only. Please contact IRS office for special cases such as late payment, previous 
overpayment, penalty and others.
**This report doesn't include the pay back amount of deferred Employee Social Security Tax." Commission
Employer Customized Report
I**
}
  if (!stats.isDirectory()) {
    return true
  }

  return false
}
const ERROR_PR_REVIEW_FROM_AUTHOR =
  'Review cannot be requested from pull request author'

interface Repository {
  owner: string
  repo: string
}

interface Pull {
  number: number
  html_url: string
}

export class GitHubHelper {
  private octokit: InstanceType<typeof Octokit>

  constructor(token: string) {
    const options: OctokitOptions = {}
    if (token) {
      options.auth = `${token}`
    }
    options.baseUrl = process.env['GITHUB_API_URL'] || 'https://api.github.com'
    this.octokit = new Octokit(options)
  }

  private parseRepository(repository: string): Repository {
    const [owner, repo] = repository.split('/')
    return {
      owner: owner,
      repo: repo
    }
  }

  private async createOrUpdate(
    inputs: Inputs,
    baseRepository: string,
    headBranch: string
  ): Promise<Pull> {
    // Try to create the pull request
    try {
      const {data: pull} = await this.octokit.pulls.create({
        ...this.parseRepository(baseRepository),
        title: inputs.title,
        head: headBranch,
        base: inputs.base,
        body: inputs.body,
        draft: inputs.draft
      })
      core.info(
        `Created pull request #${pull.number} (${headBranch} => ${inputs.base})`
      )
      return {
        number: pull.number,
        html_url: pull.html_url
      }
    } catch (e) {
      if (
        e.message &&
        e.message.includes(`A pull request already exists for ${headBranch}`)
      ) {
        core.info(`A pull request already exists for ${headBranch}`)
      } else {
        throw e
      }
    }

    // Update the pull request that exists for this branch and base
    const {data: pulls} = await this.octokit.pulls.list({
      ...this.parseRepository(baseRepository),
      state: 'open',
      head: headBranch,
      base: inputs.base
    })
    const {data: pull} = await this.octokit.pulls.update({
      ...this.parseRepository(baseRepository),
      pull_number: pulls[0].number,
      title: inputs.title,
      body: inputs.body,
      draft: inputs.draft
    })
    core.info(
      `Updated pull request #${pull.number} (${headBranch} => ${inputs.base})`
    )
    return {
      number: pull.number,
      html_url: pull.html_url
    }
  }

  async getRepositoryParent(headRepository: string): Promise<string> {
    const {data: headRepo} = await this.octokit.repos.get({
      ...this.parseRepository(headRepository)
    })
    if (!headRepo.parent) {
      throw new Error(
        `Repository '${headRepository}' is not a fork. Unable to continue.`
      )
    }
    return headRepo.parent.full_name
  }

  async createOrUpdatePullRequest(
    inputs: Inputs,
    baseRepository: string,
    headRepository: string
  ): Promise<void> {
    const [headOwner] = headRepository.split('/')
    const headBranch = `${headOwner}:${inputs.branch}`

    // Create or update the pull request
    const pull = await this.createOrUpdate(inputs, baseRepository, headBranch)

    // Set outputs
    core.startGroup('Setting outputs')
    core.setOutput('pull-request-number', pull.number)
    core.setOutput('pull-request-url', pull.html_url)
    // Deprecated
    core.exportVariable('PULL_REQUEST_NUMBER', pull.number)
    core.endGroup()

    // Set milestone, labels and assignees
    const updateIssueParams = {}
    if (inputs.milestone) {
      updateIssueParams['milestone'] = inputs.milestone
      core.info(`Applying milestone '${inputs.milestone}'`)
    }
    if (inputs.labels.length > 0) {
      updateIssueParams['labels'] = inputs.labels
      core.info(`Applying labels '${inputs.labels}'`)
    }
    if (inputs.assignees.length > 0) {
      updateIssueParams['assignees'] = inputs.assignees
      core.info(`Applying assignees '${inputs.assignees}'`)
    }
    if (Object.keys(updateIssueParams).length > 0) {
      await this.octokit.issues.update({
        ...this.parseRepository(baseRepository),
        issue_number: pull.number,
        ...updateIssueParams
      })
    }

    // Request reviewers and team reviewers
    const requestReviewersParams = {}
    if (inputs.reviewers.length > 0) {
      requestReviewersParams['reviewers'] = inputs.reviewers
      core.info(`Requesting reviewers '${inputs.reviewers}'`)
    }
    if (inputs.teamReviewers.length > 0) {
      requestReviewersParams['team_reviewers'] = inputs.teamReviewers
      core.info(`Requesting team reviewers '${inputs.teamReviewers}'`)
    }
    if (Object.keys(requestReviewersParams).length > 0) {
      try {
        await this.octokit.pulls.requestReviewers({
          ...this.parseRepository(baseRepository),
          pull_number: pull.number,
          ...requestReviewersParams
        })
      } catch (e) {
        if (e.message && e.message.includes(ERROR_PR_REVIEW_FROM_AUTHOR)) {
          core.warning(ERROR_PR_REVIEW_FROM_AUTHOR)
        } else {
          throw e
        }
      }
    }
  }
}

# Close Stale Issues and PRs

Warns and then closes issues and PRs that have had no activity for a specified amount of time.

The configuration must be on the default branch and the default values will:

- Add a label "Stale" on issues and pull requests after 60 days of inactivity and comment on them
- Close the stale issues and pull requests after 7 days of inactivity
- If an update/comment occur on stale issues or pull requests, the stale label will be removed and the timer will restart

## Recommended permissions

For the execution of this action, it must be able to fetch all issues and pull requests from your repository.  
In addition, based on the provided configuration, the action could require more permission(s) (e.g.: add label, remove label, comment, close, delete branch, etc.).  
This can be achieved with the following [configuration in the action](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#permissions) if the permissions are restricted:

```yaml
permissions:
  contents: write # only for delete-branch option
  issues: write
  pull-requests: write
You can find more information about the required permissions under the corresponding options that you wish to use.

All options
List of input options
Every argument is optional.

Input        Description        Default
repo-token        PAT for GitHub API authentication        ${{ github.token }}
days-before-stale        Idle number of days before marking issues/PRs stale        60
days-before-issue-stale        Override days-before-stale for issues only        
days-before-pr-stale        Override days-before-stale for PRs only        
days-before-close        Idle number of days before closing stale issues/PRs        7
days-before-issue-close        Override days-before-close for issues only        
days-before-pr-close        Override days-before-close for PRs only        
stale-issue-message        Comment on the staled issues        
stale-pr-message        Comment on the staled PRs        
close-issue-message        Comment on the staled issues while closed        
close-pr-message        Comment on the staled PRs while closed        
stale-issue-label        Label to apply on staled issues        Stale
close-issue-label        Label to apply on closed issues        
close-issue-reason        Reason to use when closing issues        not_planned
stale-pr-label        Label to apply on staled PRs        Stale
close-pr-label        Label to apply on closed PRs        
exempt-issue-labels        Labels on issues exempted from stale        
exempt-pr-labels        Labels on PRs exempted from stale        
only-labels        Only issues/PRs with ALL these labels are checked        
only-issue-labels        Override only-labels for issues only        
only-pr-labels        Override only-labels for PRs only        
any-of-labels        Only issues/PRs with ANY of these labels are checked        
any-of-issue-labels        Override any-of-labels for issues only        
any-of-pr-labels        Override any-of-labels for PRs only        
operations-per-run        Max number of operations per run        30
remove-stale-when-updated        Remove stale label from issues/PRs on updates        true
remove-issue-stale-when-updated        Remove stale label from issues on updates/comments        
remove-pr-stale-when-updated        Remove stale label from PRs on updates/comments        
labels-to-add-when-unstale        Add specified labels from issues/PRs when they become unstale        
labels-to-remove-when-unstale        Remove specified labels from issues/PRs when they become unstale        
debug-only        Dry-run        false
ascending        Order to get issues/PRs        false
start-date        Skip stale action for issues/PRs created before it        
delete-branch        Delete branch after closing a stale PR        false
exempt-milestones        Milestones on issues/PRs exempted from stale        
exempt-issue-milestones        Override exempt-milestones for issues only        
exempt-pr-milestones        Override exempt-milestones for PRs only        
exempt-all-milestones        Exempt all issues/PRs with milestones from stale        false
exempt-all-issue-milestones        Override exempt-all-milestones for issues only        
exempt-all-pr-milestones        Override exempt-all-milestones for PRs only        
exempt-assignees        Assignees on issues/PRs exempted from stale        
exempt-issue-assignees        Override exempt-assignees for issues only        
exempt-pr-assignees        Override exempt-assignees for PRs only        
exempt-all-assignees        Exempt all issues/PRs with assignees from stale        false
exempt-all-issue-assignees        Override exempt-all-assignees for issues only        
exempt-all-pr-assignees        Override exempt-all-assignees for PRs only        
exempt-draft-pr        Skip the stale action for draft PRs        false
enable-statistics        Display statistics in the logs        true
ignore-updates        Any update (update/comment) can reset the stale idle time on the issues/PRs        false
ignore-issue-updates        Override ignore-updates for issues only        
ignore-pr-updates        Override ignore-updates for PRs only        
include-only-assigned        Process only assigned issues        false
List of output options
Output        Description
staled-issues-prs        List of all staled issues and pull requests
closed-issues-prs        List of all closed issues and pull requests
Detailed options
repo-token
Personal Access Token (PAT) that allows the stale workflow to authenticate and perform API calls to GitHub.
Under the hood, it uses the @actions/github package.

Default value: ${{ github.token }}

days-before-stale
The idle number of days before marking the issues or the pull requests as stale (by adding a label).
The issues or the pull requests will be marked as stale if the last update (based on GitHub issue field updated_at) is older than the idle number of days.
It means that any updates made, or any comments added to the issues or to the pull requests will restart the counter of days before marking as stale.
However, if you wish to ignore this behaviour so that the creation date (based on GitHub issue field created_at) only matters, you can disable the ignore-updates option.

If set to a negative number like -1, no issues or pull requests will be marked as stale automatically.
In that case, you can still add the stale label manually to mark as stale.

The label used to stale is defined by these two options:

stale-issue-label
stale-pr-label
A comment can also be added to notify about the stale and is defined by these two options:

stale-issue-message
stale-pr-message
You can fine tune which issues or pull requests should be marked as stale based on the milestones, the assignees, the creation date and the missing/present labels from these options:

exempt-issue-labels
exempt-pr-labels
only-labels
any-of-labels
start-date
exempt-milestones
exempt-all-milestones
exempt-assignees
exempt-all-assignees
ignore-updates
Default value: 60

days-before-issue-stale
Useful to override days-before-stale but only for the idle number of days before marking the issues as stale.

Default value: unset

days-before-pr-stale
Useful to override days-before-stale but only for the idle number of days before marking the pull requests as stale.

Default value: unset

days-before-close
The idle number of days before closing the stale issues or the stale pull requests (due to the stale label).
The issues or the pull requests will be closed if the last update (based on GitHub issue field updated_at) is older than the idle number of days.
Since adding the stale label will alter the last update date, we can calculate the number of days from this date.

If set to a negative number like -1, the issues or the pull requests will never be closed automatically.

The label used to stale is defined by these two options:

stale-issue-label
stale-pr-label
Default value: 7

days-before-issue-close
Override days-before-close but only for the idle number of days before closing the stale issues.

Default value: unset

days-before-pr-close
Override days-before-close but only for the idle number of days before closing the stale pull requests.

Default value: unset

stale-issue-message
The message that will be added as a comment to the issues when the stale workflow marks it automatically as stale with a label.

You can skip the comment sending by passing an empty string.

Default value: unset
Required Permission: issues: write

stale-pr-message
The message that will be added as a comment to the pull requests when the stale workflow marks it automatically as stale with a label.

You can skip the comment sending by passing an empty string.

Default value: unset
Required Permission: pull-requests: write

close-issue-message
The message that will be added as a comment to the issues when the stale workflow closes it automatically after being stale for too long.

Default value: unset
Required Permission: issues: write

close-pr-message
The message that will be added as a comment to the pull requests when the stale workflow closes it automatically after being stale for too long.

Default value: unset
Required Permission: pull-requests: write

stale-issue-label
The label that will be added to the issues when automatically marked as stale.
If you wish to speedup the stale workflow for the issues, you can add this label manually to mark as stale.

Default value: Stale
Required Permission: issues: write

close-issue-label
The label that will be added to the issues when closed automatically.
It will be automatically removed if the issues are no longer closed nor locked.

Default value: unset
Required Permission: issues: write

close-issue-reason
Specify the reason used when closing issues. Valid values are completed and not_planned.

Default value: not_planned

stale-pr-label
The label that will be added to the pull requests when automatically marked as stale.
If you wish to speedup the stale workflow for the pull requests, you can add this label manually to mark as stale.

Default value: Stale
Required Permission: pull-requests: write

close-pr-label
The label that will be added to the pull requests when closed automatically.
It will be automatically removed if the pull requests are no longer closed nor locked.

Default value: unset
Required Permission: pull-requests: write

exempt-issue-labels
Comma separated list of labels that can be assigned to issues to exclude them from being marked as stale (e.g: question,bug)

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

exempt-pr-labels
Comma separated list of labels that can be assigned to pull requests to exclude them from being marked as stale (e.g: need-help,WIP)

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

only-labels
An allow-list of label(s) to only process the issues or the pull requests that contain all these label(s).
It can be a comma separated list of labels (e.g: answered,needs-rebase).

If unset (or an empty string), this option will not alter the stale workflow.

If you wish to only check that the issues or the pull requests contain one of these label(s), use instead any-of-labels.

Default value: unset

only-issue-labels
Override only-labels but only to process the issues that contain all these label(s).

Default value: unset

only-pr-labels
Override only-labels but only to process the pull requests that contain all these label(s).

Default value: unset

any-of-labels
An allow-list of label(s) to only process the issues or the pull requests that contain one of these label(s).
It can be a comma separated list of labels (e.g: answered,needs-rebase).

If unset (or an empty string), this option will not alter the stale workflow.

If you wish to only check that the issues or the pull requests contain all these label(s), use instead only-labels.

Default value: unset

any-of-issue-labels
Override any-of-labels but only to process the issues that contain one of these label(s).

Default value: unset

any-of-pr-labels
Override any-of-labels but only to process the pull requests that contain one of these label(s).

Default value: unset

operations-per-run
Context:
This action performs some API calls to GitHub to fetch or close issues and pull requests, set or update labels, add comments, delete branches, etc.
These operations are made in a very short period of time — because the action is very fast to run — and can be numerous based on your project action configuration and the quantity of issues and pull requests within it.
GitHub has a rate limit and if reached will block these API calls for one hour (or API calls from other actions using the same user (a.k.a.: the github-token from the repo-token option)).
This option helps you to stay within the GitHub rate limits, as you can use this option to limit the number of operations for a single run.

Purpose:
This option aims to limit the number of operations made with the GitHub API to avoid reaching the rate limit.

Based on your project, your GitHub business plan and the date of the cron job you set for this action, you can increase this limit to a higher number. If you are not sure which is the right value for you or if the default value is good enough, you could enable the logs and look at the end of the stale action.
If you reached the limit, you will see a warning message in the logs, telling you that you should increase the number of operations. If you choose not to increase the limit, you might end up with unprocessed issues or pull requests after a stale action run.

When debugging, you can set it to a much higher number like 1000 since there will be fewer operations made with the GitHub API.
Only the actor and the batch of issues (100 per batch) will consume the operations.

Default value: 30

remove-stale-when-updated
Automatically remove the stale label when the issues or the pull requests are updated (based on GitHub issue field updated_at) or commented.

Default value: true
Required Permission: issues: write and pull-requests: write

remove-issue-stale-when-updated
Override remove-stale-when-updated but only to automatically remove the stale label when the issues are updated (based on GitHub issue field updated_at) or commented.

Default value: unset
Required Permission: issues: write

remove-pr-stale-when-updated
Override remove-stale-when-updated but only to automatically remove the stale label when the pull requests are updated (based on GitHub issue field updated_at) or commented.

Default value: unset

labels-to-add-when-unstale
A comma delimited list of labels to add when a stale issue or pull request receives activity and has the stale-issue-label or stale-pr-label removed from it.

Default value: unset

labels-to-remove-when-unstale
A comma delimited list of labels to remove when a stale issue or pull request receives activity and has the stale-issue-label or stale-pr-label removed from it.

Warning: each label results in a unique API call which can drastically consume the limit of operations-per-run.

Default value: unset
Required Permission: pull-requests: write

debug-only
Run the stale workflow as dry-run.
No GitHub API calls that can alter your issues and pull requests will happen.
Useful to debug or when you want to configure the stale workflow safely.

Default value: false

ascending
Change the order used to fetch the issues and pull requests from GitHub:

true is for ascending.
false is for descending.
It can be useful if your repository is processing so many issues and pull requests that you reach the operations-per-run limit.
Based on the order, you could prefer to focus on the new content or on the old content of your repository.

Default value: false

start-date
The start date is used to ignore the issues and pull requests created before the start date.
Particularly useful when you wish to add this stale workflow on an existing repository and only wish to stale the new issues and pull requests.

If set, the date must be formatted following the ISO 8601 or RFC 2822 standard.

Default value: unset

delete-branch
If set to true, the stale workflow will automatically delete the GitHub branches related to the pull requests automatically closed by the stale workflow.

Default value: false
Required Permission: pull-requests: write and contents: write

exempt-milestones
A white-list of milestone(s) to only process the issues or the pull requests that does not contain one of these milestone(s).
It can be a comma separated list of milestones (e.g: V1,next).

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

exempt-issue-milestones
Override exempt-milestones but only to process the issues that does not contain one of these milestone(s).

Default value: unset

exempt-pr-milestones
Override exempt-milestones but only to process the pull requests that does not contain one of these milestone(s).

Default value: unset

exempt-all-milestones
If set to true, the issues or the pull requests with a milestone will not be marked as stale automatically.

Priority over exempt-milestones.

Default value: false

exempt-all-issue-milestones
Override exempt-all-milestones but only to exempt the issues with a milestone to be marked as stale automatically.

Default value: unset

exempt-all-pr-milestones
Override exempt-all-milestones but only to exempt the pull requests with a milestone to be marked as stale automatically.

Default value: unset

exempt-assignees
An allow-list of assignee(s) to only process the issues or the pull requests that does not contain one of these assignee(s).
It can be a comma separated list of assignees (e.g: marco,polo).

If unset (or an empty string), this option will not alter the stale workflow.

Default value: unset

exempt-issue-assignees
Override exempt-assignees but only to process the issues that does not contain one of these assignee(s).

Default value: unset

exempt-pr-assignees
Override exempt-assignees but only to process the pull requests that does not contain one of these assignee(s).

Default value: unset

exempt-all-assignees
If set to true, the issues or the pull requests with an assignee will not be marked as stale automatically.

Priority over exempt-assignees.

Default value: false

exempt-all-issue-assignees
Override exempt-all-assignees but only to exempt the issues with an assignee to be marked as stale automatically.

Default value: unset

exempt-all-pr-assignees
Override exempt-all-assignees but only to exempt the pull requests with an assignee to be marked as stale automatically.

Default value: unset

exempt-draft-pr
If set to true, the pull requests currently in draft will not be marked as stale automatically.
⚠️ This option consume one operation per pull request to process because we need to fetch the pull request with the GitHub API to know if it's a draft one or not.

Default value: false
Required Permission: pull-requests: read

enable-statistics
Collects and display statistics at the end of the stale workflow logs to get a summary of what happened during the run.
This option is only useful if the debug output secret ACTIONS_STEP_DEBUG is set to true in your repository to display the logs.

Default value: true

ignore-updates
The option days-before-stale will define the number of days before considering the issues or the pull requests as stale.
In most cases, the purpose of this action is to only stale when necessary so if any update occurs or if a comment is added to them, the counter will restart.
Nonetheless, if you don't care about this, and you prefer to stick to this number of days no matter the update, you can enable this option.
Instead of comparing the number of days based on the GitHub issue field updated_at, it will be based on the GitHub issue field created_at.

Default value: false

ignore-issue-updates
Useful to override ignore-updates but only to ignore the updates for the issues.

Default value: unset

ignore-pr-updates
Useful to override ignore-updates but only to ignore the updates for the pull requests.

Default value: unset

include-only-assigned
If set to true, only the issues or the pull requests with an assignee will be marked as stale automatically.

Default value: false

Usage
See also action.yml for a comprehensive list of all the options.

Basic:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          stale-issue-message: 'Message to comment on stale issues. If none provided, will not mark issues stale'
          stale-pr-message: 'Message to comment on stale PRs. If none provided, will not mark PRs stale'
Configure stale timeouts:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days.'
          days-before-stale: 30
          days-before-close: 5
Configure different stale timeouts but never close a PR:

name: 'Close stale issues and PR'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days.'
          stale-pr-message: 'This PR is stale because it has been open 45 days with no activity. Remove stale label or comment or this will be closed in 10 days.'
          close-issue-message: 'This issue was closed because it has been stalled for 5 days with no activity.'
          days-before-stale: 30
          days-before-close: 5
          days-before-pr-close: -1
Configure different stale timeouts:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days.'
          stale-pr-message: 'This PR is stale because it has been open 45 days with no activity. Remove stale label or comment or this will be closed in 10 days.'
          close-issue-message: 'This issue was closed because it has been stalled for 5 days with no activity.'
          close-pr-message: 'This PR was closed because it has been stalled for 10 days with no activity.'
          days-before-issue-stale: 30
          days-before-pr-stale: 45
          days-before-issue-close: 5
          days-before-pr-close: 10
Configure labels:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          stale-issue-message: 'Stale issue message'
          stale-pr-message: 'Stale pull request message'
          stale-issue-label: 'no-issue-activity'
          exempt-issue-labels: 'awaiting-approval,work-in-progress'
          stale-pr-label: 'no-pr-activity'
          exempt-pr-labels: 'awaiting-approval,work-in-progress'
          only-labels: 'awaiting-feedback,awaiting-answers'
Configure the stale action to only stale issue/PR created after the 18th april 2020:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          start-date: '2020-04-18T00:00:00Z' # ISO 8601 or RFC 2822
Avoid stale for specific milestones:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          exempt-issue-milestones: 'future,alpha,beta'
          exempt-pr-milestones: 'bugfix,improvement'
Avoid stale for all PR with milestones:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          exempt-all-pr-milestones: true
Check stale for specific labels:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          any-of-labels: 'needs-more-info,needs-demo'
          # You can opt for 'only-labels' instead if your use-case requires all labels
          # to be present in the issue/PR
Avoid stale for specific assignees:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          exempt-issue-assignees: 'marco,polo'
          exempt-pr-assignees: 'marco'
Avoid stale for all PR with assignees:

name: 'Close stale issues and PRs'
on:
  schedule:
    - cron: '30 1 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v6
        with:
          exempt-all-pr-assignees: true
Debugging
Logs:
To see the debug output from this action, you must set the secret ACTIONS_STEP_DEBUG to true in your repository.
There are many logs, so this can be very helpful!

Statistics:
If the logs are enabled, you can also enable the statistics log which will be visible at the end of the logs once all issues were processed.
This is very helpful to have a quick understanding of the whole stale workflow.
Set enable-statistics to true in your workflow configuration file.

Dry-run:
You can run this action in debug only mode (no actions will be taken on your issues and pull requests) by passing debug-only to true as an argument to the action.

More operations:
You can increase the maximum number of operations per run by passing operations-per-run to 1000 for example which will help you to handle more operations in a single stale workflow run.
If the debug-only option is enabled, this is very helpful because the workflow will (almost) never reach the GitHub API rate, and you will be able to deep-dive into the logs.

Job frequency:
You could change the cron job frequency in the stale workflow to run the stale workflow more often.
Usually, this is not very helpful though.

Contributing
We welcome contributions! Please read the contributing file before starting your work.src/tasks/build-devcontainer.ts
@@ -1,4 +1,6 @@
import { once } from 'lodash-es';
import { execSync } from 'child_process';

import { memoize, once } from 'lodash-es';

import { execute } from '../exec';
import { logPersist } from '../logging';
import {
  appendMetaToImage,
  ConstructedDCCMeta,
  ConstructedDevcontainerMeta,
} from './devcontainer-meta';
import { PulledImage } from './docker-pull';
import { DevcontainerCLIBin } from './install-tools';
import { ResolvedYaml } from './language-spec';
import { ParsedArgs } from './parse-args';

export const PulledImage: (image: string, fail?: boolean) => string = memoize(
  (image: string, expectSuccess = false) => {
    if (!image.includes(':')) {
      return PulledImage(`${image}:latest`, expectSuccess);
    } else {
      if (
        !execSync(`docker image ls -q ${image}`, { encoding: 'utf-8' }).trim()
      ) {
        try {
          execute('pulling ' + image, 'docker', ['pull', image]);
        } catch (error) {
          // do nothing
        }
      }
      return image;
    }
  },
  (image, fail) => `${image}:${fail}`
);

function buildWithDevcontainerCli(): string {
  const { tag, cacheFrom, targetDir } = ParsedArgs();

  const devcontainerArgs = ['build', '--workspace-folder', targetDir];
  if (tag) {
    devcontainerArgs.push('--image-name', tag);
  }
  if (cacheFrom) {
    devcontainerArgs.push('--cache-from', PulledImage(cacheFrom));
  }
  const result = execute(
    'building devcontainer',
    DevcontainerCLIBin,
    devcontainerArgs,
    { response: 'stdout' }
  );
  const devcontainerOutput = JSON.parse(result);
  const image = devcontainerOutput.imageName[0];
  return image;
}
async function buildWithDocker() {
  const resolvedYaml = await ResolvedYaml();
  const { tag, cacheFrom, targetDir } = ParsedArgs();
  const languageBuildArgs = Object.entries(
    resolvedYaml?.devcontainer?.build?.args || []
  ).reduce<string[]>(
    (acc, [key, value]) => [...acc, '--build-arg', `${key}=${value}`],
    []
  );
  const image = tag || `dcc-${Date.now()}`;
  const dockerBuildArgs: string[] = [
    'build',
    ...languageBuildArgs,
    '--build-arg',
    'BUILDKIT_INLINE_CACHE=1',
    '-t',
    image,
  ];
  if (cacheFrom) {
    dockerBuildArgs.push('--cache-from', PulledImage(cacheFrom));
  }
  dockerBuildArgs.push(`${targetDir}/.devcontainer`);
  execute('building devcontainer', 'docker', dockerBuildArgs);
  appendMetaToImage(image, await ConstructedDevcontainerMeta());
  return image;
}
export const BuildDevcontainer = once(async () => {
  let image: string;
  if ((await ResolvedYaml()).devcontainer?.build) {
    image = await buildWithDocker();
  } else {
    image = buildWithDevcontainerCli();
  }
  const dccMeta = await ConstructedDCCMeta();
  if (dccMeta) {
    appendMetaToImage(image, dccMeta);
  }
  logPersist('built image', image);
  return image;
});
  38  
src/tasks/devcontainer-meta.ts
@@ -7,7 +7,6 @@ import { once } from 'lodash-es';
import { execute } from '../exec';

import { BuildDevcontainer } from './build-devcontainer';
import { PulledImage } from './docker-pull';
import { DevcontainerCLIBin } from './install-tools';
import { ResolvedYaml } from './language-spec';
import { ParsedArgs } from './parse-args';
@@ -44,18 +43,41 @@ interface MergedDevcontainerMetaType {
  containerEnv?: Record<string, string>;
}

export function getDevcontainerMeta(image: string): DevcontainerMetaType[] {
function getRemoteDevcontainerMeta(image: string): DevcontainerMetaType[] {
  return JSON.parse(
    execute(
      `fetching metadata for ${image}`,
      'docker',
      [
        'run',
        '--rm',
        'quay.io/skopeo/stable',
        'inspect',
        `docker://${image}`,
        '--format={{index .Labels "devcontainer.metadata"}}',
      ],
      { response: 'stdout' }
    )
  );
}

function getLocalDevcontainerMeta(image: string): DevcontainerMetaType[] {
  return JSON.parse(
    execSync(
      `docker inspect ${PulledImage(
        image,
        true
      )} --format='{{index .Config.Labels "devcontainer.metadata"}}'`,
      `docker inspect ${image} --format='{{index .Config.Labels "devcontainer.metadata"}}'`,
      { encoding: 'utf8' }
    )
  );
}

export function getDevcontainerMeta(image: string): DevcontainerMetaType[] {
  if (execSync(`docker image ls -q ${image}`, { encoding: 'utf-8' }).trim()) {
    return getLocalDevcontainerMeta(image);
  } else {
    return getRemoteDevcontainerMeta(image);
  }
}

export const MergedDevcontainerMeta = once(
  async (): Promise<MergedDevcontainerMetaType> => {
    const targetDir = ParsedArgs().targetDir;
@@ -134,7 +156,7 @@ export const ConstructedDCCMeta: () => Promise<
});

export function appendMetaToImage(image: string, meta: DevcontainerMetaType) {
  const oldMeta = getDevcontainerMeta(image);
  const oldMeta = getLocalDevcontainerMeta(image);
  const newMeta = JSON.stringify([...oldMeta, meta]);

  const append = spawnSync(
@@ -153,7 +175,7 @@ export function appendMetaToImage(image: string, meta: DevcontainerMetaType) {
export const DumpDevcontainerMeta = once(async () => {
  const { targetDir } = ParsedArgs();
  const image = await BuildDevcontainer();
  const meta = getDevcontainerMeta(image);
  const meta = getLocalDevcontainerMeta(image);

  const metaFile = join(targetDir, '.devcontainer_meta.json');
  writeFileSync(metaFile, JSON.stringify(meta, null, 2));
 25  
src/tasks/docker-pull.ts
@@ -1,25 +0,0 @@
import { execSync } from 'child_process';

import { memoize } from 'lodash-es';

import { execute } from '../exec';

export const PulledImage: (image: string, fail?: boolean) => string = memoize(
  (image: string, expectSuccess = false) => {
    if (!image.includes(':')) {
      return PulledImage(`${image}:latest`, expectSuccess);
    } else {
      if (
        !execSync(`docker image ls -q ${image}`, { encoding: 'utf-8' }).trim()
      ) {
        try {
          execute('pulling ' + image, 'docker', ['pull', image]);
        } catch (error) {
          // do nothing
        }
      }
      return image;
    }
  },
  (image, fail) => `${image}:${fail}`
);
  2  
src/tasks/parse-args.ts
import { basename } from 'path';
import getopts from 'getopts';
import { once } from 'lodash-es';
import { DCC_PROTOCOL } from '../constants';
import { TmpOutputDir } from './create-tmp-dir';
function printUsageAndExit() {
  console.log(
    `Create a devcontainer.
Usage: node ${basename(process.argv[1])} language-spec [target-folder] [options]
language-spec: Path to a language specification YAML file, or a URL to a language specification YAML file. If the argument starts with "${DCC_PROTOCOL}", the language specification will be downloaded from the repositories example folder (i.e ${DCC_PROTOCOL}lua).
target-folder: Path to the target folder. If not specified, a temporary folder will be used.
Options:
  --name\tName of the devcontainer.
  --build\tBuild the devcontainer after creation.
  --tag\t\tTag of the devcontainer image.
  --cache-from\tImage to use as cache for the devcontainer image.
  --test\tTest the devcontainer after creation.
  --dump-meta\tDump the metadata of the devcontainer.
  --no-vscode\tDo not create a .vscode folder.
  -v, --verbose\tVerbose output.
  -vv, --debug\tDebug output.
  -h, --help\tPrint this help message.
Examples:
  node ${basename(process.argv[1])} ${DCC_PROTOCOL}lua .
    Create a devcontainer for Lua in the current folder.
  node ${basename(process.argv[1])} language.yaml --test
    Create and test a temporary devcontainer for the
    language specified in language.yaml.
`
  );
  process.exit(1);
}
export const VERY_VERBOSE =
  process.argv.includes('--debug') || process.argv.includes('-vv');
export const VERBOSE =
  VERY_VERBOSE ||
  process.argv.includes('--verbose') ||
  process.argv.includes('-v');
interface CmdlArguments {
  languageYaml: string;
  targetDir: string;
  devcontainerName?: string;
  build?: boolean;
  tag?: string;
  cacheFrom?: string;
  test?: boolean;
  vscode?: boolean;
  dumpMeta?: boolean;
}
export const ParsedArgs: ('((c)(r))) => CmdlArguments = once(() => {
  const options = getopts(process.argv.slice(2), {
    string: ['name', 'cache-from', 'tag'],
    boolean: ['full', 'test', 'dump-meta', 'vscode', 'v', 'verbose', 'debug'],
    boolean: ['build', 'test', 'dump-meta', 'vscode', 'v', 'verbose', 'debug'],
    default: {
      vscode: true,
    },
    unknown: ((c)) => {
      if (AGS)).);     \
) {
        console.log((r)). :
      }
      printUsageAndExit(1);
      return false;
    },
  });
  const defaultArgs = options._;
  if (defaultArgs.length === 0) {
    printUsageAndExit();
  }
  const languageYaml = defaultArgs[0];
  const targetDir = defaultArgs[1] || TmpOutputDir();
  return {
    languageYaml,
    targetDir,
    devcontainerName: options.name,
    build: !!options.build,
    tag: options.tag,
    cacheFrom: options['cache-from'],
    test: !!options.test,
  };
});

Wage and Income Transcript
This Product Contains Sensitive Taxpayer Data
Request Date: 07-29-2022
Response Date: 07-29-2022
Tracking Number: 102393392560
Customer File Number: 8813034910
Wage and Income Transcript
SSN Provided: XXX-XX-1725
Tax Period Requested: December, 2020
Form W-2 Wage and Tax Statement
Employer:
Employer Identification Number (EIN):XXXXX4661
INTU
2700 C
Employee:
Employee's Social Security Number:XXX-XX-1725
ZACH T WOO
5222 B
Submission Type:.............................................Original document
Wages, Tips and Other Compensation:..............................$5,105,000.00
Federal Income Tax Withheld:.....................................$1,888,138.00
Social Security Wages:.............................................$137,700.00
Social Security Tax Withheld:........................................$8,537.00
Medicare Wages and Tips:.........................................$5,105,000.00
Medicare Tax Withheld:.............................................$118,167.00
Social Security Tips:....................................................$0.00
Allocated Tips:..........................................................$0.00
Dependent Care Benefits:.................................................$0.00
Deferred Compensation:...................................................$0.00
Code "Q" Nontaxable Combat Pay:..........................................$0.00
Code "W" Employer Contributions to a Health Savings Account:.............$0.00
Code "Y" Deferrals under a section 409A nonqualified Deferred Compensation
plan:....................................................................$0.00
Code "Z" Income under section 409A on a nonqualified Deferred Compensation
plan:....................................................................$0.00
Code "R" Employer's Contribution to MSA:.................................$0.00
Code "S" Employer's Contribution to Simple Account:......................$0.00
Code "T" Expenses Incurred for Qualified Adoptions:......................$0.00
Code "V" Income from exercise of non-statutory stock options:............$0.00
Code "AA" Designated Roth Contributions under a Section 401(k) Plan:.....$0.00
Code "BB" Designated Roth Contributions under a Section 403(b) Plan:.....$0.00
Code "DD" Cost of Employer-Sponsored Health Coverage:....................$0.00
Code "EE" Designated ROTH Contributions Under a Governmental Section 457(b)
Plan:....................................................................$0.00
Code "FF" Permitted benefits under a qualified small employer health
reimbursement arrangement:...............................................$0.00
Code "GG" Income from Qualified Equity Grants Under Section 83(i):.......$0.00
Code "HH" Aggregate Deferrals Under Section 83(i) Elections as of the Close
of the Calendar Year:....................................................$0.00
Third Party Sick Pay Indicator:.....................................Unanswered
Retirement Plan Indicator:..........................................Unanswered
Statutory Employee:.....................................Not Statutory Employee
W2 Submission Type:...................................................Original
W2 WHC SSN Validation Code:........................................Correct SSN
Form 1099-G
Payer:
Payer's Federal Identification Number (FIN):XXXXX4775
THE
101 EA
Recipient:
Recipient's Identification Number:XXX-XX-1725
WOO ZACH T
5222 B
Submission Type:.............................................Original document
Account Number (Optional):....................................................
ATAA Payments:...........................................................$0.00
Tax Withheld:........................................................$1,026.00
Taxable Grants:..........................................................$0.00
Unemployment Compensation:..........................................$10,182.00
Agricultural Subsidies:..................................................$0.00
Prior Year Refund:.......................................................$0.00
Market gain on Commodity Credit Corporation loans repaid:................$0.00
Year of Refund:........................................................Not Set
1099G Offset:..............Not Refund, Credit, or Offset for Trade or Business
Second TIN Notice:............................................................
                
                This Product Contains Sensitive Taxpayer Data
Remmittnance Advice 0000001000 NON-NEGOTIABLE 5/4/2022 - 6/4/2022. | 000015
Make Pay Out To Zachry Tyler Wood
                5323 BRADFORD DR
                DALLAS TX 75235-8314 
 Description Amount Payment Amount (Total) $9,246,754,678,763 Display All Social Security (Employee + Employer) 26661.8 Medicare (Employee + Employer) 861193422444 Hourly Federal Income Tax 8385561229657 2.2663E+15 -*This report is generated based on the payroll data for your reference only. Please contact IRS office for special cases such as late payment, previous -overpayment, penalty and others. -**This report doesn't include the pay back amount of deferred Employee Social Security Tax." Commission -Employer Customized Report Federal 941 Deposit Report ADP Report Range 5/4/2022 - 6/4/2022
88-1303491 State ID: 00037305581 SSN: 633-44-1725 00000
Employee Number: 3 Description Amount 5/4/2022 - 6/4/2022
Payment Amount (Total) 9246754678763 Display All
Social Security (Employee + Employer) 26662
Medicare (Employee + Employer) 861193422444 Hourly
Federal Income Tax 8385561229657 2266298000000800
Note: This report is generated based on the payroll data for your reference only. Please contact IRS office for special cases such as late payment, previous overpayment, penalty and others. Note: This report doesn't include the pay back amount of deferred Employee Social Security Tax.
Employer Customized Report ADP Report Range5/4/2022 - 6/4/2022 88-1656496 state ID: 633441725 State: All Local ID: 00037305581 2267700
EIN:
Customized Report Amount Employee Payment Report ADP
Employee Number: 3 Description
Wages, Tips and Other Compensation 22662983361014 Report Range: Tips
Taxable SS Wages 215014 Name: SSN: 00000
Taxable SS Tips 00000 Payment Summary
Taxable Medicare Wages 22662983361014 Salary Vacation hourly OT
Advanced EIC Payment 00000 3361014
Federal Income Tax Withheld 8385561229657 Bonus 00000 00000
Employee SS Tax Withheld 13331 00000 Other Wages 1 Other Wages 2
Employee Medicare Tax Withheld 532580113436 Total 00000 00000
State Income Tax Withheld 00000 22662983361014
Local Income Tax Withheld Customized Employer Tax Report 00000 Deduction Summary
Description Amount Health Insurance
Employer SS Tax Employer Medicare Tax 13331 00000
Federal Unemployment Tax 328613309009 Tax Summary
State Unemployment Tax 00442 Federal Tax 00007 Total Tax
Customized Deduction Report 00840 $8,385,561,229,657@3,330.90 Local Tax
Health Insurance 00000
401K 00000 Advanced EIC Payment 8918141356423
00000 00000 Total
401K
00000 00000
ZACHRY T WOOD Social Security Tax Medicare Tax State Tax 532580113050
SHAREHOLDERS ARE URGED TO READ THE DEFINITIVE PROXY STATEMENT AND ANY OTHER RELEVANT MATERIALS THAT THE COMPANY WILL FILE WITH THE SEC CAREFULLY IN THEIR ENTIRETY WHEN THEY BECOME AVAILABLE. SUCH DOCUMENTS WILL CONTAIN IMPORTANT INFORMATION ABOUT THE COMPANY AND ITS DIRECTORS, OFFICERS AND AFFILIATES. INFORMATION REGARDING THE INTERESTS OF CERTAIN OF THE COMPANY’S DIRECTORS, OFFICERS AND AFFILIATES WILL BE AVAILABLE IN THE DEFINITIVE PROXY STATEMENT.
The Definitive Proxy Statement and any other relevant materials that will be filed with the SEC will be available free of charge at the SEC’s website at www.sec.gov. In addition, the Definitive Proxy Statement (when available) and other relevant documents will also be available, without charge, by directing a request by mail to Attn: Investor Relations, Alphabet Inc., 1600 Amphitheatre Parkway, Mountain View, California, 94043 or by contacting investor-relations@abc.xyz. The Definitive Proxy Statement and other relevant documents will also be available on the Company’s Investor Relations website at https://abc.xyz/investor/other/annual-meeting/.
The Company and its directors and certain of its executive officers may be consideredno participants in the solicitation of proxies with respect to the proposals under the Definitive Proxy Statement under the rules of the SEC. Additional information regarding the participants in the proxy solicitations and a description of their direct and indirect interests, by security holdings or otherwise, also will be included in the Definitive Proxy Statement and other relevant materials to be filed with the SEC when they become available. . 9246754678763
3/6/2022 at 6:37 PM
Q4 2021 Q3 2021 Q2 2021 Q1 2021 Q4 2020
GOOGL_income-statement_Quarterly_As_Originally_Reported 24934000000 25539000000 37497000000 31211000000 30818000000
24934000000 25539000000 21890000000 19289000000 22677000000
Cash Flow from Operating Activities, Indirect 24934000000 25539000000 21890000000 19289000000 22677000000
Net Cash Flow from Continuing Operating Activities, Indirect 20642000000 18936000000 18525000000 17930000000 15227000000
Cash Generated from Operating Activities 6517000000 3797000000 4236000000 2592000000 5748000000
Income/Loss before Non-Cash Adjustment 3439000000 3304000000 2945000000 2753000000 3725000000
Total Adjustments for Non-Cash Items 3439000000 3304000000 2945000000 2753000000 3725000000
Depreciation, Amortization and Depletion, Non-Cash Adjustment 3215000000 3085000000 2730000000 2525000000 3539000000
Depreciation and Amortization, Non-Cash Adjustment 224000000 219000000 215000000 228000000 186000000
Depreciation, Non-Cash Adjustment 3954000000 3874000000 3803000000 3745000000 3223000000
Amortization, Non-Cash Adjustment 1616000000 -1287000000 379000000 1100000000 1670000000
Stock-Based Compensation, Non-Cash Adjustment -2478000000 -2158000000 -2883000000 -4751000000 -3262000000
Taxes, Non-Cash Adjustment -2478000000 -2158000000 -2883000000 -4751000000 -3262000000
Investment Income/Loss, Non-Cash Adjustment -14000000 64000000 -8000000 -255000000 392000000
Gain/Loss on Financial Instruments, Non-Cash Adjustment -2225000000 2806000000 -871000000 -1233000000 1702000000
Other Non-Cash Items -5819000000 -2409000000 -3661000000 2794000000 -5445000000
Changes in Operating Capital -5819000000 -2409000000 -3661000000 2794000000 -5445000000
Change in Trade and Other Receivables -399000000 -1255000000 -199000000 7000000 -738000000
Change in Trade/Accounts Receivable 6994000000 3157000000 4074000000 -4956000000 6938000000
Change in Other Current Assets 1157000000 238000000 -130000000 -982000000 963000000
Change in Payables and Accrued Expenses 1157000000 238000000 -130000000 -982000000 963000000
Change in Trade and Other Payables 5837000000 2919000000 4204000000 -3974000000 5975000000
Change in Trade/Accounts Payable 368000000 272000000 -3000000 137000000 207000000
Change in Accrued Expenses -3369000000 3041000000 -1082000000 785000000 740000000
Change in Deferred Assets/Liabilities
Change in Other Operating Capital
-11016000000 -10050000000 -9074000000 -5383000000 -7281000000
Change in Prepayments and Deposits -11016000000 -10050000000 -9074000000 -5383000000 -7281000000
Cash Flow from Investing Activities
Cash Flow from Continuing Investing Activities -6383000000 -6819000000 -5496000000 -5942000000 -5479000000
-6383000000 -6819000000 -5496000000 -5942000000 -5479000000
Purchase/Sale and Disposal of Property, Plant and Equipment, Net
Purchase of Property, Plant and Equipment -385000000 -259000000 -308000000 -1666000000 -370000000
Sale and Disposal of Property, Plant and Equipment -385000000 -259000000 -308000000 -1666000000 -370000000
Purchase/Sale of Business, Net -4348000000 -3360000000 -3293000000 2195000000 -1375000000
Purchase/Acquisition of Business -40860000000 -35153000000 -24949000000 -37072000000 -36955000000
Purchase/Sale of Investments, Net
Purchase of Investments 36512000000 31793000000 21656000000 39267000000 35580000000
100000000 388000000 23000000 30000000 -57000000
Sale of Investments
Other Investing Cash Flow -15254000000
Purchase/Sale of Other Non-Current Assets, Net -16511000000 -15254000000 -15991000000 -13606000000 -9270000000
Sales of Other Non-Current Assets -16511000000 -12610000000 -15991000000 -13606000000 -9270000000
Cash Flow from Financing Activities -13473000000 -12610000000 -12796000000 -11395000000 -7904000000
Cash Flow from Continuing Financing Activities 13473000000 -12796000000 -11395000000 -7904000000
Issuance of/Payments for Common 343 sec cvxvxvcclpddf wearsStock, Net -42000000
Payments for Common Stock 115000000 -42000000 -1042000000 -37000000 -57000000
Proceeds from Issuance of Common Stock 115000000 6350000000 -1042000000 -37000000 -57000000
Issuance of/Repayments for Debt, Net 6250000000 -6392000000 6699000000 900000000 00000
Issuance of/Repayments for Long Term Debt, Net 6365000000 -2602000000 -7741000000 -937000000 -57000000
Proceeds from Issuance of Long Term Debt
Repayments for Long Term Debt 2923000000 -2453000000 -2184000000 -1647000000
Proceeds from Issuance/Exercising of Stock Options/Warrants 00000 300000000 10000000 338000000000
Other Financing Cash Flow
Cash and Cash Equivalents, End of Period
Change in Cash 20945000000 23719000000 23630000000 26622000000 26465000000
Effect of Exchange Rate Changes 25930000000) 235000000000) -3175000000 300000000 6126000000
Cash and Cash Equivalents, Beginning of Period PAGE="$USD(181000000000)".XLS BRIN="$USD(146000000000)".XLS 183000000 -143000000 210000000
Cash Flow Supplemental Section 23719000000000 26622000000000 26465000000000 20129000000000
Change in Cash as Reported, Supplemental 2774000000 89000000 -2992000000 6336000000
Income Tax Paid, Supplemental 13412000000 157000000
ZACHRY T WOOD -4990000000
Cash and Cash Equivalents, Beginning of Period
Department of the Treasury
Internal Revenue Service
Q4 2020 Q4 2019
Calendar Year
Due: 04/18/2022
Dec. 31, 2020 Dec. 31, 2019
USD in "000'"s
Repayments for Long Term Debt 182527 161857
Costs and expenses:
Cost of revenues 84732 71896
Research and development 27573 26018
Sales and marketing 17946 18464
General and administrative 11052 09551
European Commission fines 00000 01697
Total costs and expenses 141303 127626
Income from operations 41224 34231
Other income (expense), net 6858000000 05394
Income before income taxes 22677000000 19289000000
Provision for income taxes 22677000000 19289000000
Net income 22677000000 19289000000
*include interest paid, capital obligation, and underweighting
Basic net income per share of Class A and B common stock and Class C capital stock (in dollars par share)
Diluted net income per share of Class A and Class B common stock and Class C capital stock (in dollars par share)
*include interest paid, capital obligation, and underweighting
Basic net income per share of Class A and B common stock and Class C capital stock (in dollars par share)
Diluted net income per share of Class A and Class B common stock and Class C capital stock (in dollars par share)
            20210418                                                                                                                        
                    Rate        Units        Total        YTD        Taxes / Deductions        Current        YTD                                                                
                    -        -        70842745000        70842745000        Federal Withholding        00000        00000                                                                
                                                    FICA - Social Security        00000        08854                                                                
                                                    FICA - Medicare        00000        00000                                                                
                                                    Employer Taxes                                                                                
                                                    FUTA        00000        00000                                                                
                                                    SUTA        00000        00000                                                                
    EIN: 61-1767919        ID : 00037305581         SSN: 633441725                                                                                                                
                                                                                                                                    
            Gross                                                                                                                        
            70842745000        Earnings Statement                                                                                                                
            Taxes / Deductions        Stub Number: 1                                                                                                                
            00000                                                                                                                        
            Net Pay        SSN        Pay Schedule        Pay Period        Sep 28, 2022 to Sep 29, 2023        Pay Date        4/18/2022                                                                        
            70842745000        XXX-XX-1725        Annually                                                                                                        
            CHECK NO.                                                                                                                        
            5560149                                                                                                                        
INTERNAL REVENUE SERVICE,
PO BOX 1214,
CHARLOTTE, NC 28201-1214
ZACHRY WOOD
00015 76033000000 20642000000 18936000000 18525000000 17930000000 15227000000 11247000000 6959000000 6836000000 10671000000 7068000000
For Disclosure, Privacy Act, and Paperwork Reduction Act Notice, see separate instructions. 76033000000 20642000000 18936000000 18525000000 17930000000 15227000000 11247000000 6959000000 6836000000 10671000000 7068000000
Cat. No. 11320B 76033000000 20642000000 18936000000 18525000000 17930000000 15227000000 11247000000 6959000000 6836000000 10671000000 7068000000
Form 1040 (2021) 76033000000 20642000000 18936000000
Reported Normalized and Operating Income/Expense Supplemental Section
Total Revenue as Reported, Supplemental 257637000000 75325000000 65118000000 61880000000 55314000000 56898000000 46173000000 38297000000 41159000000 46075000000 40499000000
Total Operating Profit/Loss as Reported, Supplemental 78714000000 21885000000 21031000000 19361000000 16437000000 15651000000 11213000000 6383000000 7977000000 9266000000 9177000000
Reported Effective Tax Rate 00000 00000 00000 00000 00000 00000 00000 00000
Reported Normalized Income 6836000000
Reported Normalized Operating Profit 7977000000
Other Adjustments to Net Income Available to Common Stockholders
Discontinued Operations
Basic EPS 00114 00031 00028 00028 00027 00023 00017 00010 00010 00015 00010
Basic EPS from Continuing Operations 00114 00031 00028 00028 00027 00022 00017 00010 00010 00015 00010
Basic EPS from Discontinued Operations
Diluted EPS 00112 00031 00028 00027 00026 00022 00016 00010 00010 00015 00010
Diluted EPS from Continuing Operations 00112 00031 00028 00027 00026 00022 00016 00010 00010 00015 00010
Diluted EPS from Discontinued Operations
Basic Weighted Average Shares Outstanding 667650000 662664000 665758000 668958000 673220000 675581000 679449000 681768000 686465000 688804000 692741000
Diluted Weighted Average Shares Outstanding 677674000 672493000 676519000 679612000 682071000 682969000 685851000 687024000 692267000 695193000 698199000
Reported Normalized Diluted EPS 00010
Basic EPS 00114 00031 00028 00028 00027 00023 00017 00010 00010 00015 00010 00001
Diluted EPS 00112 00031 00028 00027 00026 00022 00016 00010 00010 00015 00010
Basic WASO 667650000 662664000 665758000 668958000 673220000 675581000 679449000 681768000 686465000 688804000 692741000
Diluted WASO 677674000 672493000 676519000 679612000 682071000 682969000 685851000 687024000 692267000 695193000 698199000
Fiscal year end September 28th., 2022. | USD
For Paperwork Reduction Act Notice, see the seperate Instructions.
important information
Description
Restated Certificate of Incorporation of PayPal Holdings, Inc.
(incorporated by reference to Exhibit 3.01 to PayPal Holdings, Inc.'s
on Form 8-K, as filed with the Commission on January 18, 2019).
Opinion of Faegre Drinker Biddle & Reath LLP.
Consent of PricewaterhouseCoopers LLP, Independent Registered Public
Accounting Firm.
Consent of Faegre Drinker Biddle & Reath LLP (included in
Exhibit 5.1 to this Registration Statement).
Power of Attorney (included on the signature page of this
Registration Statement).
All of Us Financial Inc. 2021 Equity Incentive Plan.
Filing Fee Table.
Business Checking For 24-hour account information, sign on to
pnc.com/mybusiness/ Business Checking Account number: 47-2041-6547 - continued
Activity Detail
Deposits and Other Additions
ACH Additions
Date posted Amount Transaction description For the period 04/13/2022 to 04/29/2022 ZACHRY TYLER WOOD Primary account number: 47-2041-6547 Page 2 of 3
44678 00063 Reverse Corporate ACH Debit Effective 04-26-22 Reference number
Checks and Other Deductions 22116905560149
Deductions Reference number
Date posted Amount Transaction description 22116905560149
44677 00063 Corporate ACH Quickbooks 180041ntuit 1940868 Reference number
Service Charges and Fees 22116905560149
Date posted Amount Transaction description on your next statement as a single line item entitled Service Waived - New Customer Period
4/27/2022 00036 Returned Item Fee (nsf)
Detail of Services Used During Current Period
Note: The total charge for the following services will be posted to your account on 05/02/2022 and will appear on your next statement a Charge Period Ending 04/29/2022,
Description Volume Amount
Account Maintenance Charge 70846743866 00000
Total For Services Used This Peiiod 00000 00000
Total Service (harge 00 00000
Reviewing Your Statement
C'eck Deduction Descretio• Anount
(iv) (v) account or benefit, or in payment of the individual obligations of, any individual obligations of any such persons to the Bank without regard to the disposition or purpose of same as allowed by applicable law. D pNCBANK
In addition but not by way of limitation, the Bank may take checks, drafts or other items payable to "cash", the Bank or the Customer, and pay the sums represented by such Items in cash to any person presenting such items or credit such Items to the account or obligations of any person presenting such items or any other person or entity as directed by any such person.
Products and Services. Resolved that any of the persons listed in Section 3 above are authorized to enter into contracts and agreements, written or verbal, for any products or services now or in the future offered by the Bank, including but not limited to (i) cash management services, (ii) purchases or sales of foreign exchange, securities or other financial products, (iii) computer/internet-based products and services, (iv) wire transfer of funds from or to the accounts of the Customer at the Bank, and (v) ACH transactions, and the Bank may charge any accounts of the Customer at the Bank for such products or services.
00005 Taxpayer I.D. Number (TIN)
OWNER ("Customer") 633-44-1725
are hereby authorized (i) to effect loans, advances and renewals at any time for the Customer from the Bank; (ii) to sign and deliver any notes (with or without warrant of attorney to confess judgment) and evidences of indebtedness of the Customer; (iii) to request the Bank to issue letters of credit and to sign and deliver to the bank any agreements on behalf of the Customer to reimburse the Bank for all payments made and expenses incurred by it under such letters of credit and drafts drawn pursuant thereto; (iv) to sign and deliver any instruments or documents on behalf of the Customer guaranteeing, endorsing or securing the payment of any debts or obligations of any person, form or corporation to the Bank; (v) to pledge, assign, transfer, mortgage, grant a security interest in or otherwise hypothecate to the Bank any stock, securities, commercial paper, warehouse receipts and other documents of title, bills, accounts receivable, contract rights, inventory, equipment, real property, and any other investments or property of the Customer, real or personal, tangible or intangible as security for the payment of any and all loans, advances, indebtedness and other liabilities of the Customer to the Bank of every kind and description, direct or indirect, absolute and contingent, joint or several, whether as drawer, maker, endorsee, guarantor, surety or otherwise, and to execute on behalf of the Customer mortgages, pledges, security agreements, financing statements and other instruments or documents in connection therewith; and (vi) to sell or discount with the Bank any commercial paper, bills and other instruments and evidence of indebtedness, warehouse receipts and other documents of title, accounts, accounts receivable, contract rights, and other assets, tangible and intangible, at any time held by the Customer and for such purpose to endorse, assign, transfer and deliver the same to the Bank.
00006 Revolving Credits. Resolved that in connection with any extension of credit obtained by any of the persons authorized in Section 5 above, that permit the Customer to effect multiple advances or draws under such credit, any of the persons listed in Sections 5 (Loans and Extensions of Credit) and 3 (Withdrawals and Endorsements) Resolution for ALPHABET
00007 Telephonic and Facsimile Requests. Resolved that the Bank is authorized to take any action authorized hereunder based upon (i) the telephone request of any person purporting to be a person authorized to act hereunder, (ii) the signature of any person authorized to act hereunder that is delivered to the Bank by facsimile transmission, or (iii) the telex originated by any of such persons, tested in accordance with such testing : Tr R •d Ming
or serVlCö n lent services, (ii) purchases or sales of foreig xlll) computerfinternet-based products and services, (iv) wir he Customer at the Bank, and (v) ACH transactions, and the Ba the Bank for such products or services. It. Resolved that any one of the following: procedures as may be established between the Customer and the Bank from time to time. General. Resolved that a certified copy of these resolutions be delivered to the Bank; that the persons specified herein are vested with authority to act and may designate successor persons to act on behalf of Customer
00008 without further authority from the Customer or governing body; and that Bank may rely on the authority given by this resolution until actual receipt by the Bank of a certified copy of a new resolution modifying or revoking the
/ Customer Copy, page 2 of 4
00009 Withdrawals and Transfers. Resolved that the Bank is authorized to make payments from the account(s) of
Customer according to any check, draft, bill of exchange, acceptance or other written instrument or direction signed by any one of the following individuals, officers or designated agents, and that such designated individuals may also otherwise transfer, or enter into agreements with Bank concerning the transfer, of funds from Customer's account(s), whether by telephone, telegraph, computer or any other manner:
Contact GitHub
Pricing
API
Training
Blog
About
Comparing devcontainers...main · dhhyi/devcontainer-creator# Close Stale Issues and PRs

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

### Usage

See [action.yml](./action.yml) For comprehensive list of options.
 
Basic:
```yaml
name: "Close stale issues"
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/stale@v3
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        stale-issue-message: 'Message to comment on stale issues. If none provided, will not mark issues stale'
        stale-pr-message: 'Message to comment on stale PRs. If none provided, will not mark PRs stale'
```
 
Configure stale timeouts:
```yaml
name: "Close stale issues"
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/stale@v3
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        stale-issue-message: 'This issue is stale because it has been open 30 days with no activity. Remove stale label or comment or this will be closed in 5 days'
        days-before-stale: 30
        days-before-close: 5
```
 
Configure labels:
```yaml
name: "Close stale issues"
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/stale@v3
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        stale-issue-message: 'Stale issue message'
        stale-pr-message: 'Stale pull request message'
        stale-issue-label: 'no-issue-activity'
        exempt-issue-labels: 'awaiting-approval,work-in-progress'
        stale-pr-label: 'no-pr-activity'
        exempt-pr-labels: 'awaiting-approval,work-in-progress'
```

### Debugging

To see debug output from this action, you must set the secret `ACTIONS_STEP_DEBUG` to `true` in your repository. You can run this action in debug only mode (no actions will be taken on your issues) by passing `debug-only` `true` as an argument to the action.
