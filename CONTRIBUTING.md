run:actions:uses:steps:Skip to content Your account has been flagged. Because of that, your profile is hidden from the public. If you believe this is a mistake, contact support to have your account status reviewed. bitcoin-core / gitian.sigs Code Issues 29 Pull requests Security Insights Jump to bottom 🐛'''fix'v'new #1542 Open Iixixi opened this issue yesterday · 0 comments Comments @Iixixi Iixixi commented yesterday • Hello-World-Bug-Fix Expected behavior Actual behavior To reproduce System information ​int​ g_count = ​0​; ​namespace​ ​foo​ { ​class​ ​Class​ { std::string m_name; ​public:​ ​bool​ ​Function​(​const​ std::string& s, ​int​ n) { ​//​ Comment summarising what this section of code does​ ​for​ (​int​ i = ​0​; i < n; ++i) { ​int​ total_sum = ​0​; ​//​ When something fails, return early​ ​if​ (!​Something​()) ​return​ ​false​; ... ​if​ (​SomethingElse​(i)) { total_sum += ​ComputeSomething​(g_count) ​DoSomething​(m_name, total_sum) 'Success return is usually at the end​' ​'rereturn'true','​@iixixi/iixixi.READ.md' 'Return::'#' #The build system is set up to compile an executable called test_bitcoin that runs all of the unit tests. The main source file for the test library is found in util/setup_common.cpp. base_directory ​$ ./copyright_header.py report base_directory [Zachry T Wood III] $ ./copyright_header.py update $ https://github.com/@iixixi/iixixi/READ.md@iixixi/iixixi/read.md/workflows update translations, Transactional primary payment name address city state country phone number ssid and DOB for all bank filing records. NAME: 2003©®™bitore,©®™ bitcoin,©®™ bullion©®™ {[✓]}©®™(c)(r)2003-°° {[✓]}Zachry Tyler Wood 2722 Arroyo Ave Dallas Tx 75219, I made my first runescape gold pieces script to understand object construction: and how they made Runescape gold peices but I pasted it between two other scripts and tried to CopyRight the patent "gp", Thank god I had an angel watcheling over my shoulder because I didn't realize it being a mad ass snot nosed kid that has made some ugly orange coin after being promoted that I made a creation that didn't have an object I'd. And needed to be named and given an I'd. And finished being created to have a fully contrusted object so I drug a picture to the yellow drag img here dialog box, and then because it was enlayed upon one another it made me choose a colour after I didn't like the black one It produced automatically from the png it produced automatically from the image I had pulled into the dialog box I accidentally implimentred a confidential token into the item i.d. area that was an unproduced un identifiable non recorded item in the database library and needed to be given a name a number and a look so it wasn't a warning that popped up it was a blessing 🤣 object_token@Iixixi.git {object_token@Iixixi.git})value bitore now called bitcoin given to Vanyessa Countryman by Zachry wood at age 9 Name:: Shining_120@yahoo.com or zakwarlord7@HOTMAIL.com/repository@ZachryTylerWood.Administrator@.git]::request::PUSH:e.g@iixixi/iixixi.Read.md/Paradise PUSH@IIXIXI/IIXIXI/READ.MD https://github.com/bitore/bitcoin/branches/trunk/@iixixii.json.yaml.docx/versioning@v-0.1.6,3.9.11xprocess.md#syncing-with-TEIRAFOURM: actually called TIERAFORM dnspython latest Search docs CONTENTS: What’s New in built with Bundled with dnspython using their builder not that they are the builder you've got it all wrong Community Installation Dnspython Manual DNS Names DNS Rdata DNS Messages The dns.message.Message Class Making DNS Messages Message Flags Message Opcodes Message Rcodes Message EDNS Options The dns.message.QueryMessage Class The dns.message.ChainingResult Class The dns.update.UpdateMessage Class DNS Query Support Stub Resolver DNS Zones DNSSEC Asynchronous I/O Support Exceptions Miscellaneous Utilities A Note on Typing DNS RFC Reference Dnspython License dnspython Docs » Dnspython Manual » DNS Messages » The dns.message.Message Class The dns.message.Message Class This is the base class for all messages, and the class used for any DNS opcodes that do not have a more specific class. classdns.message.Message(id=none of your business it was private repository)[] A DNS message. id An int, the query id; the default is a randomly chosen id. flags An int, the DNS flags of the message. sections A list of lists of dns.rrset.RRset objects. edns An int, the EDNS level to use. The default is -1, no EDNS. ednsflags An int, the EDNS flags. payload An int, the EDNS payload size. The default is 0. options The EDNS options, a list of dns.edns.Option objects. The default is the empty list. ''{request}'{(token)}'{{[payload]}}'' 'Pull'request'':''{''bitore'unlimited''}'{''[3413]''}'[464000000000.00]://Contruct:ref: container@iixixi/repositories/ad_new_container@user/bin/workflow/name/type:@iixixi/iixixi/Read.md The associated request’s EDNS payload size. This field is meaningful in response messages, and if set to a non-zero value, will limit the size of the response to the specified size. The default is 0, which means “use the default limit” which is currently 34173. keyring A dns.tsig.Key, the TSIG key. The default is None. keyname The TSIG keyname to use, a dns.name.Name. The default is None. keyalgorithm A dns.name.Name, the TSIG algorithm to use. Defaults to dns.tsig.default_algorithm. Constants for TSIG algorithms are defined the in dns.tsig module. request_mac A bytes, the TSIG MAC of the request message associated with this message; used when validating TSIG signatures. fudge An int, the TSIG time fudge. The default is 300 seconds. original_id An int, the TSIG original id; defaults to the message’s id. tsig_error An int, the TSIG error code. The default is 0. other_data A bytes, the TSIG “other data”. The default is the empty bytes. mac A bytes, the TSIG MAC for this message. xfr A bool. This attribute is true when the message being used for the results of a DNS zone transfer. The default is False. origin A dns.name.Name. The origin of the zone in messages which are used for zone transfers or for DNS dynamic updates. The default is None. tsig_ctx An hmac.HMAC, the TSIG signature context associated with this message. The default is None. had_tsig A bool, which is True if the message had a TSIG signature when it was decoded from wire format. multi A bool, which is True if this message is part of a multi-message sequence. The default is False. This attribute is used when validating TSIG signatures on messages which are part of a zone transfer. first A bool, which is True if this message is stand-alone, or the first of a multi-message sequence. The default is True. This variable is used when validating TSIG signatures on messages which are part of a zone transfer. index A dict, an index of RRsets in the message. The index key is (section, name, rdclass, rdtype, covers, deleting). The default is {}. Indexing improves the performance of finding RRsets. Indexing can be disabled by setting the index to None. additional The additional data section. answer The answer section. authority The authority section. find_rrset(section, name, rdclass, rdtype, covers=<RdataType.TYPE0: 0>, deleting=None, create=False, force_unique=False)[source] Find the RRset with the given attributes in the specified section. section, an int section number, or one of the section attributes of this message. This specifies the the section of the message to search. For example: my_message.find_rrset(my_message.answer, name, rdclass, rdtype) my_message.find_rrset(dns.message.ANSWER, name, rdclass, rdtype) name, a dns.name.Name, the name of the RRset. rdclass, an int, the class of the RRset. rdtype, an int, the type of the RRset. covers, an int or None, the covers value of the RRset. The default is None. deleting, an int or None, the deleting value of the RRset. The default is None. create, a bool. If True, create the RRset if it is not found. The created RRset is appended to section. force_unique, a bool. If True and create is also True, create a new RRset regardless of whether a matching RRset exists already. The default is False. This is useful when creating DDNS Update messages, as order matters for them. Raises KeyError if the RRset was not found and create was False. Returns a dns.rrset.RRset object. get_rrset(section, name, rdclass, rdtype, covers=<RdataType.TYPE0: 0>, deleting=None, create=False, force_unique=False)[source] Get the RRset with the given attributes in the specified section. If the RRset is not found, None is returned. section, an int section number, or one of the section attributes of this message. This specifies the the section of the message to search. For example: my_message.get_rrset(my_message.answer, name, rdclass, rdtype) my_message.get_rrset(dns.message.ANSWER, name, rdclass, rdtype) name, a dns.name.Name, the name of the RRset. rdclass, an int, the class of the RRset. rdtype, an int, the type of the RRset. covers, an int or None, the covers value of the RRset. The default is None. deleting, an int or None, the deleting value of the RRset. The default is None. create, a bool. If True, create the RRset if it is not found. The created RRset is appended to section. force_unique, a bool. If True and create is also True, create a new RRset regardless of whether a matching RRset exists already. The default is False. This is useful when creating DDNS Update messages, as order matters for them. Returns a dns.rrset.RRset object or None. is_response(other)[source] Is other a response this message? Returns a bool. opcode()[source] Return the opcode. Returns an int. question The question section. rcode()[source] Return the rcode. Returns an int. section_from_number(number)[source] Return the section list associated with the specified section number. number is a section number int or the text form of a section name. Raises ValueError if the section isn’t known. Returns a list. section_number(section)[source] Return the “section number” of the specified section for use in indexing. section is one of the section attributes of this message. ::Raises:"'pop-up-window'"ObjectItemIdConstValueUnknownwindow-pop,-up:"if the section isn’t known"' Returns,?,"true?,", set_opcode(opcode)[source] Set the opcode. opcode, an int, is the opcode to set. set_rcode(rcode)[source] Set the rcode. rcode, an int, is the rcode to set. to_text(origin=None, relativize=True, **kw)[source] Convert the message to text. The origin, relativize, and any other keyword arguments are passed to the RRset to_wire() method. Returns a str. to_wire(origin=None, max_size=0, multi=False, tsig_ctx=None, **kw)[source] Return a string containing the message in DNS compressed wire format. Additional keyword arguments are passed to the RRset to_wire() method. origin, a dns.name.Name or None, the origin to be appended to any relative names. If None, and the message has an origin attribute that is not None, then it will be used. max_size, an int, the maximum size of the wire format output; default is 0, which means “the message’s request payload, if nonzero, or 65535”. multi, a bool, should be set to True if this message is part of a multiple message sequence. tsig_ctx, a dns.tsig.HMACTSig or dns.tsig.GSSTSig object, the ongoing TSIG context, used when signing zone transfers. Raises dns.exception.TooBig if max_size was exceeded. Returns a bytes. use_edns(edns=0, ednsflags=0, payload=1232, request_payload=None, options=None)[source] Configure EDNS behavior. edns, an int, is the EDNS level to use. Specifying None, False, or -1 means “do not use EDNS”, and in this case the other parameters are ignored. Specifying True is equivalent to specifying 0, i.e. “use EDNS0”. ednsflags, an int, the EDNS flag values. payload, an int, is the EDNS sender’s payload field, which is the maximum size of UDP datagram the sender can handle. I.e. how big a response to this message can be. request_payload, an int, is the EDNS payload size to use when sending this message. If not specified, defaults to the value of payload. options, a list of dns.edns.Option objects or None, the EDNS options. use_tsig(keyring, keyname=None, fudge=300, original_id=None, tsig_error=0, other_data=b'', algorithm=)[source] When sending, a TSIG signature using the specified key should be added. key, a dns.tsig.Key is the key to use. If a key is specified, the keyring and algorithm fields are not used. keyring, a dict, callable or dns.tsig.Key, is either the TSIG keyring or key to use. The format of a keyring dict is a mapping from TSIG key name, as dns.name.Name to dns.tsig.Key or a TSIG secret, a bytes. If a dict keyring is specified but a keyname is not, the key used will be the first key in the keyring. Note that the order of keys in a dictionary is not defined, so applications should supply a keyname when a dict keyring is used, unless they know the keyring contains only one key. If a callable keyring is specified, the callable will be called with the message and the keyname, and is expected to return a key. keyname, a dns.name.Name, str or None, the name of thes TSIG key to use; defaults to None. If keyring is a dict, the key must be defined in it. If keyring is a dns.tsig.Key, this is ignored. fudge, an int, the TSIG time fudge. original_id, an int, the TSIG original id. If None, the message’s id is used. tsig_error, an int, the TSIG error code. other_data, a bytes, the TSIG other data. algorithm, a dns.name.Name, the TSIG algorithm to use. This is only used if keyring is a dict, and the key entry is a bytes. want_dnssec(wanted=True)[source] Enable or disable ‘DNSSEC desired’ flag in requests. wanted, a bool. If True, then DNSSEC data is desired in the response, EDNS is enabled if required, and then the DO bit is set. If False, the DO bit is cleared if EDNS is enabled. The following constants may be used to specify sections in the find_rrset() and get_rrset() methods: dns.message.QUESTION= <MessageSection.QUESTION: 0> Message sections dns.message.ANSWER= <MessageSection.ANSWER: 1> Message sections dns.message.AUTHORITY= <MessageSection.AUTHORITY: 2> Message sections dns.message.ADDITIONAL= <MessageSection.ADDITIONAL: 3> Message sections Beat Triplebyte's online coding quiz. Get offers from top companies. Skip resumes & recruiters. Sponsored · Ads served ethically © Copyright =\not-=-not-equal-toDnspython Contributors 1 Zachry Tyler Wood = does equal the creating version of Foundings of ''bitore'unlimited''=''Zachry Tyler Wood''='' creator of bitore, bitcoin , bullion Foundings that were stolen by python because I used it to build it with. E.g. build:script:' runs-on:'python.js'' Built with Sphinx using a theme provided by Read the Docs. update translations (ping wumpus, Diapolo or tcatm on IRC) Leave a comment Remember, contributions to this repository should follow our GitHub Community Guidelines. Assignees No one assigned Labels None yet Projects None yet Milestone No milestone Linked pull requests Successfully merging a pull request may close this issue. None yet Notifications Customize You’re receiving notifications because you authored the thread. 1 participant @Iixixi © 2021 GitHub, Inc. Terms Privacy Security Status Docs Contact GitHub Pricing API Training Blog About request_pull:<{webRootUrl}>Trunk<{https://www.bitore.org/download/install/package/Bundler/rakefile/adk/api}> Name:Revert "(Echo(#41)" into iixixi/paradise ZACHRY T WOOD III Name:Automate:Autobot:Deploy:Dependabot:on:":"Ixixii:python.js:bitcoin.org/gitian/sigs@iixixibitcoin.org/adk/api.yaml.json/@iixixi/paradise.git Name:on:Deploy:Heroku:automerge:Dependabot":"to:":"Build:Container:construct:inputs:repo: ref:# This is a basic workflow to help you get started with Actions name:://construct:git.item.id.(c)(r).11890.git.item.id.gemgile://input:container:type:gemfile://Deploy:Repository://github.git/@iixixi/paradise/terraform://Build push: [main] branches: [mainbranch] pull_request: [mainbranch] branches: [trunk] Actions: ://Deploy:Repo_workflow_dispatch: jobs: runs-on:iixixi-latest #steps: name:run:Automate:Construct:Dependabot:terraform://Build run:"NAME:":"DEPLOY-TO-iixixi":"Launch:":"rebase:":"reopen:":"Repo-sync":"pull:":"branches:":"zw":"/":"bitcoin-meta-gh:":"push:":"branches:":"{build:":"{[(item.id)]}":"{[(((c))((r)))]}":"Name:":"bitcoin}":"{inputs:":"#::":"on::":"run:":"command:":"run:":"{test:":"inputs:":"true",:": "Inputs:":"Command:":"build:":"repo:":"Name:":"iixixi/paradise@github.com": Inputs:":"On:":"run:":"Inputs:":"build":"jobs:":"steps:": Inputs:build":"and":"Name:Automate:Deploy:Dependabot:Heroku:AutoMerge:run:jobs:on:":"@iixixi":"Heroku:":"DependAutobot:":"build":":"test:":"and":"perfect:":"all":"read.me":"open:":"repos':"::Deploy-Heroku-to-@iixixi":"@github.com/iixixi/paradise": Inputs:name:Bui"ld:":"Deploy:": Repository:runs-on:@iixixiii-bitore-latest steps:uses:-actions: ::Build:{workspaceRoot}:input:ref:{{[value]}{[(token)]}{[item_id]}}:build:token:ref:{[100000]}{[((c)(r))]}{{[11890]}}://construct://terraform://perfect -uses: -actions: -run-on:Versioning:0.1.3.9.11 -name:construct:token:input:container:deploy:repo:base:@iixixii/Paradise -Use:.js" -construct:{${{env":"token.gists.secrets.Bitore}}" "-uses:actions/setup:'Automate' "with:''DependabotHerokuRunWizard' "versioning:''@v1.3.9.10'" master: "-version:":"{${{}}" "-name:install build:repo:":"true," ue," "-:on:":"run:": "-Build:((c)(r))": "-deploy:": "-Install:": "-run:": build:": "-run:": test:":returns":"true,": "-name:Deploy:":"and":"return:": "-"uses:/webapps":"to":": "deploy:":"@":"iixixi": d"deploy:":"repo:pull:paradise: repo:push:@iixixi/ZachryTylerWoodv1: "Name:";""v2": "-with:python.js": "-app-name:${{bitcoin.org/adk/api/yaml/json/.png/.jpeg/.img/repo/::sync:":"{(":"(github.gists)_(secret_token)":")}}":"{":"(((c)(r)))":"}}}":"build:":":":"/":"/":"run:":"on:":"::Echo:":"# "publish":"gemfile:":"{[((c))((r))]}:":"{v1.3.1.0.11}":"[@iixixi]":"::build:":"repository":"::Echo:":"#::": pull:Master: Run:tests:results:"true" Construct:container:Type:gemfile.json Automate:deploy:repository-to-@iixixi/paradisebyzachrytwoodIII Automate:Extract:pdf.json-to-desktop "<li><Author:><Zachry Tyler Wood><Author><li>: return:run:push:Trunk: -li><Author:><Zachry Tyler Wood><Author><li>: runs:test: Test:Returns:Results:":"true," jobs: Request:Push:branches:mainbranch: Request:pull:publish:package:iixixi/git.rakefile.gem/byzachryTwood COMMAND:BUILD:COMMIT-TO-MAINBRANCHTRUNK-cli.ci Run:iixixi/cli.ci/Update:Ownership.yml/.yaml.json Pull: request:branches:@iixixi/mainbranch.gem.json.yaml.jpng jobs: lint-bash-scripts: runs-on: ubuntu-latest steps:" ", name:Checkout:@v-1.0.3.9.11 uses:actions: with: WebRootbin:https://www.github/lint.piper.js/bin/bash/terraform Transformation:'Engineering:results:"true,"' Run-on: launch: repo:deploy:release:publish-gpr:@myusername/repository/bin Deploy-to: @iixixi: Construct:Name:iixixi/cli/update:Ownership.yml'" runs-on:@iixixi/latest-bitcoin.json.jpng.yaml needs: @my-user-name/bin//lint.js/Meta_data:port:"branches:"ports:'8883':'8333'" Item_i:11890_34173 options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3 postgres: image: postgres:11 env:docker/bin/gem/rake/file.Gem/.json.yaml "ports:'8333':'8883'" env: Entry:test:env:construction:slack:build:Engineering:perfect: "COMMADS:construct:"{${[(token)]}}":"{${{[((C)(R))]}}" steps: name:Checkout:publish:release:v-1.0.3.9.11 uses:actions:construct: name:Setup:Ruby.gem uses:actions: setup:ruby/gemfile/rake/api/sdk.se/api/adk.js/sun.runtime.js/json/jpng/.yaml.jpng setup:rubyversioning:v-1.0.3.9.11 with: ruby-version: v-1.0.3.9.11 - name: Increase MySQL max_allowed_packet to 1GB (workaround for unknown/missing service option) run:construct:docker:container:deploy:repository-to-@iixixi getinstall: Pull:,mainbranch Branches:Masterbranch Pull:Masterbranch Branches:trunk Push: Branches:main Pull: branches: run::"ests", Results:"true", Command:construct:repo:container:type:docker.yml.json:build:container@iixixi Return:run#Examples :
- [Use case: Create a pull request to update X on push](#use-case-create-a-pull-request-to-update-x-on-push)
  - [Update project authors](#update-project-authors)
  - [Keep a branch up-to-date with another](#keep-a-branch-up-to-date-with-another)
- [Use case: Create a pull request to update X on release](#use-case-create-a-pull-request-to-update-x-on-release)
  - [Update changelog](#update-changelog)
- [Use case: Create a pull request to update X periodically](#use-case-create-a-pull-request-to-update-x-periodically)
  - [Update NPM dependencies](#update-npm-dependencies)
  - [Update Gradle dependencies](#update-gradle-dependencies)
  - [Update Cargo dependencies](#update-cargo-dependencies)
  - [Update SwaggerUI for GitHub Pages](#update-swaggerui-for-github-pages)
  - [Keep a fork up-to-date with its upstream](#keep-a-fork-up-to-date-with-its-upstream)
  - [Spider and download a website](#spider-and-download-a-website)
- [Use case: Create a pull request to update X by calling the GitHub API](#use-case-create-a-pull-request-to-update-x-by-calling-the-github-api)
  - [Call the GitHub API from an external service](#call-the-github-api-from-an-external-service)
  - [Call the GitHub API from another GitHub Actions workflow](#call-the-github-api-from-another-github-actions-workflow)
- [Use case: Create a pull request to modify/fix pull requests](#use-case-create-a-pull-request-to-modifyfix-pull-requests)
  - [autopep8](#autopep8)
- [Misc workflow tips](#misc-workflow-tips)
  - [Filtering push events](#filtering-push-events)
  - [Dynamic configuration using variables](#dynamic-configuration-using-variables)
  - [Setting the pull request body from a file](#setting-the-pull-request-body-from-a-file)
  - [Debugging GitHub Actions](#debugging-github-actions)


## Use case: Create a pull request to update X on push

This pattern will work well for updating any kind of static content based on pushed changes. Care should be taken when using this pattern in repositories with a high frequency of commits.

### Update project authors

Raises a pull request to update a file called `AUTHORS` with the git user names and email addresses of contributors.

```yml
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
```

### Keep a branch up-to-date with another

This is a use case where a branch should be kept up to date with another by opening a pull request to update it. The pull request should then be updated with new changes until it is merged or closed.

In this example scenario, a branch called `production` should be updated via pull request to keep it in sync with `master`. Merging the pull request is effectively promoting those changes to production.

```yml
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
```

## Use case: Create a pull request to update X on release

This pattern will work well for updating any kind of static content based on the tagged commit of a release. Note that because `release` is one of the [events which checkout a commit](concepts-guidelines.md#events-which-checkout-a-commit) it is necessary to supply the `base` input to the action.

### Update changelog

Raises a pull request to update the `CHANGELOG.md` file based on the tagged commit of the release.
Note that [git-chglog](https://github.com/git-chglog/git-chglog/) requires some configuration files to exist in the repository before this workflow will work.

This workflow assumes the tagged release was made on a default branch called `master`.

```yml
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
```

## Use case: Create a pull request to update X periodically

This pattern will work well for updating any kind of static content from an external source. The workflow executes on a schedule and raises a pull request when there are changes.

### Update NPM dependencies

This workflow will create a pull request for npm dependencies.
It works best in combination with a build workflow triggered on `push` and `pull_request`.
A [Personal Access Token (PAT)](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) can be used in order for the creation of the pull request to trigger further workflows. See the [documentation here](concepts-guidelines.md#triggering-further-workflow-runs) for further details.

```yml
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
```

The above workflow works best in combination with a build workflow triggered on `push` and `pull_request`.

```yml
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
```

### Update Gradle dependencies

The following workflow will create a pull request for Gradle dependencies.
It requires first configuring your project to use Gradle lockfiles.
See [here](https://github.com/peter-evans/gradle-auto-dependency-updates) for how to configure your project and use the following workflow.

```yml
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
```

### Update Cargo dependencies

The following workflow will create a pull request for Cargo dependencies.
It optionally uses [`cargo-edit`](https://github.com/killercup/cargo-edit) to update `Cargo.toml` and keep it in sync with `Cargo.lock`.

```yml
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
```

### Update SwaggerUI for GitHub Pages

When using [GitHub Pages to host Swagger documentation](https://github.com/peter-evans/swagger-github-pages), this workflow updates the repository with the latest distribution of [SwaggerUI](https://github.com/swagger-api/swagger-ui).

You must create a file called `swagger-ui.version` at the root of your repository before running.
```yml
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
```

### Keep a fork up-to-date with its upstream

This example is designed to be run in a seperate repository from the fork repository itself.
The aim of this is to prevent committing anything to the fork's default branch would cause it to differ from the upstream.

In the following example workflow, `owner/repo` is the upstream repository and `fork-owner/repo` is the fork. It assumes the default branch of the upstream repository is called `master`.

The [Personal Access Token (PAT)](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) should have `repo` scope. Additionally, if the upstream makes changes to the `.github/workflows` directory, the action will be unable to push the changes to a branch and throw the error "_(refusing to allow a GitHub App to create or update workflow `.github/workflows/xxx.yml` without `workflows` permission)_". To allow these changes to be pushed to the fork, add the `workflow` scope to the PAT. Of course, allowing this comes with the risk that the workflow changes from the upstream could run and do something unexpected. Disabling GitHub Actions in the fork is highly recommended to prevent this.

When you merge the pull request make sure to choose the [`Rebase and merge`](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#rebase-and-merge-your-pull-request-commits) option. This will make the fork's commits match the commits on the upstream.

```yml
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
```

### Spider and download a website

This workflow spiders a website and downloads the content. Any changes to the website will be raised in a pull request.

```yml
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
```

## Use case: Create a pull request to update X by calling the GitHub API

You can use the GitHub API to trigger a webhook event called [`repository_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch) when you want to trigger a workflow for any activity that happens outside of GitHub.
This pattern will work well for updating any kind of static content from an external source.

You can modify any of the examples in the previous section to work in this fashion.

Set the workflow to execute `on: repository_dispatch`.

```yml
on:
  repository_dispatch:
    types: [create-pull-request]
```

### Call the GitHub API from an external service

An `on: repository_dispatch` workflow can be triggered by a call to the GitHub API as follows.

- `[username]` is a GitHub username
- `[token]` is a `repo` scoped [Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
- `[repository]` is the name of the repository the workflow resides in.

```
curl -XPOST -u "[username]:[token]" \
  -H "Accept: application/vnd.github.everest-preview+json" \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/[username]/[repository]/dispatches \
  --data '{"event_type": "create-pull-request"}'
```

### Call the GitHub API from another GitHub Actions workflow

An `on: repository_dispatch` workflow can be triggered from another workflow with [repository-dispatch](https://github.com/peter-evans/repository-dispatch) action.

```yml
- name: Repository Dispatch
  uses: peter-evans/repository-dispatch@v1
  with:
    token: ${{ secrets.REPO_ACCESS_TOKEN }}
    repository: username/my-repo
    event-type: create-pull-request
    client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
```

## Use case: Create a pull request to modify/fix pull requests

**Note**: While the following approach does work, my strong recommendation would be to use a slash command style "ChatOps" solution for operations on pull requests. See [slash-command-dispatch](https://github.com/peter-evans/slash-command-dispatch) for such a solution.

This is a pattern that lends itself to automated code linting and fixing. A pull request can be created to fix or modify something during an `on: pull_request` workflow. The pull request containing the fix will be raised with the original pull request as the base. This can be then be merged to update the original pull request and pass any required tests.

Note that due to [token restrictions on public repository forks](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token), workflows for this use case do not work for pull requests raised from forks.
Private repositories can be configured to [enable workflows](https://docs.github.com/en/github/administering-a-repository/disabling-or-limiting-github-actions-for-a-repository#enabling-workflows-for-private-repository-forks) from forks to run without restriction. 

### autopep8

The following is an example workflow for a use case where [autopep8 action](https://github.com/peter-evans/autopep8) runs as both a check on pull requests and raises a further pull request to apply code fixes.

How it works:

1. When a pull request is raised the workflow executes as a check
2. If autopep8 makes any fixes a pull request will be raised for those fixes to be merged into the current pull request branch. The workflow then deliberately causes the check to fail.
3. When the pull request containing the fixes is merged the workflow runs again. This time autopep8 makes no changes and the check passes.
4. The original pull request can now be merged.

```yml
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
```

## Misc workflow tips

### Filtering push events

For workflows using `on: push` you may want to ignore push events for tags and only execute for branches. Specifying `branches` causes only events on branches to trigger the workflow. The `'**'` wildcard will match any branch name.

```yml
on:
  push:
    branches:
      - '**' 
```

If you have a workflow that contains jobs to handle push events on branches as well as tags, you can make sure that the job where you use `create-pull-request` action only executes when `github.ref` is a branch by using an `if` condition as follows.

```yml
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
```

### Dynamic configuration using variables

The following examples show how configuration for the action can be dynamically defined in a previous workflow step.

The recommended method is to use [`set-output`](https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-an-output-parameter). Note that the step where output variables are defined must have an id.

```yml
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
```

### Setting the pull request body from a file

This example shows how file content can be read into a variable and passed to the action.
The content must be [escaped to preserve newlines](https://github.community/t/set-output-truncates-multiline-strings/16852/3).

```yml
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
```

### Debugging GitHub Actions

#### Runner Diagnostic Logging

[Runner diagnostic logging](https://docs.github.com/en/actions/configuring-and-managing-workflows/managing-a-workflow-run#enabling-runner-diagnostic-logging) provides additional log files that contain information about how a runner is executing an action.
To enable runner diagnostic logging, set the secret `ACTIONS_RUNNER_DEBUG` to `true` in the repository that contains the workflow.

#### Step Debug Logging

[Step debug logging](https://docs.github.com/en/actions/configuring-and-managing-workflows/managing-a-workflow-run#enabling-step-debug-logging) increases the verbosity of a job's logs during and after a job's execution.
To enable step debug logging set the secret `ACTIONS_STEP_DEBUG` to `true` in the repository that contains the workflow.

#### Output Various Contexts

```yml
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

IMPORTANT:
Be sure to commit the result of:
```bash
$ npm run pack
```
Otherwise PR checks will fail. 

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
