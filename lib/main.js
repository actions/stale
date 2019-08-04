"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const args = getAndValidateArgs();
            const octokit = new github.GitHub(args.token);
            const issues = yield octokit.issues.listForRepo({
                owner: args.repo_owner,
                repo: args.repo_name,
                state: 'open'
            });
            let operationsLeft = args.max_operations_per_run - 1;
            for (var issue of issues.data.values()) {
                core.debug(`found issue: ${issue.title} last updated ${issue.updated_at}`);
                if (isLabeledStale(issue, args.stale_label)) {
                    if (wasLastUpdatedBefore(issue, args.wait_after_stale_days)) {
                        operationsLeft -= yield closeIssue(octokit, issue, args);
                    }
                    else {
                        continue;
                    }
                }
                else if (wasLastUpdatedBefore(issue, args.stale_age_days)) {
                    operationsLeft -= yield markStale(octokit, issue, args);
                }
                if (operationsLeft <= 0) {
                    core.warning(`performed ${args.max_operations_per_run} operations, exiting to avoid rate limit`);
                    break;
                }
            }
        }
        catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
    });
}
function isLabeledStale(issue, label) {
    return issue.labels.filter(i => i.name === label).length > 0;
}
function wasLastUpdatedBefore(issue, num_days) {
    const daysInMillis = (1000 * 60 * 60 * num_days);
    const millisSinceLastUpdated = new Date().getTime() - new Date(issue.updated_at).getTime();
    core.debug(`${daysInMillis}, ${millisSinceLastUpdated}`);
    return millisSinceLastUpdated >= daysInMillis;
}
function markStale(octokit, issue, args) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(`marking issue${issue.title} as stale`);
        yield octokit.issues.createComment({
            owner: args.repo_owner,
            repo: args.repo_name,
            issue_number: issue.number,
            body: args.stale_message
        });
        yield octokit.issues.addLabels({
            owner: args.repo_owner,
            repo: args.repo_name,
            issue_number: issue.number,
            labels: [args.stale_label]
        });
        return 2; // operations performed
    });
}
function closeIssue(octokit, issue, args) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(`closing issue ${issue.title} for being stale`);
        yield octokit.issues.update({
            owner: args.repo_owner,
            repo: args.repo_name,
            issue_number: issue.number,
            state: "closed"
        });
        return 1; // operations performed
    });
}
function getAndValidateArgs() {
    const args = {
        token: process.env.GITHUB_TOKEN || '',
        repo_owner: (process.env.GITHUB_REPOSITORY || '').split("/")[0],
        repo_name: (process.env.GITHUB_REPOSITORY || '').split("/")[1],
        stale_age_days: parseInt(core.getInput('stale_age_days')),
        wait_after_stale_days: parseInt(core.getInput('wait_after_stale_days')),
        max_operations_per_run: parseInt(core.getInput('max_operations_per_run')),
        stale_label: core.getInput('stale_label'),
        stale_message: core.getInput('stale_message')
    };
    if (!args.token) {
        throw new Error('could not resolve token from GITHUB_TOKEN');
    }
    if (!args.repo_owner || !args.repo_name) {
        throw new Error('could not resolve repo from GITHUB_REPOSITORY');
    }
    for (var stringInput of ["stale_label", "stale_message"]) {
        if (!args[stringInput]) {
            throw Error(`input ${stringInput} was empty`);
        }
    }
    for (var numberInput of ["stale_age_days", "wait_after_stale_days", "max_operations_per_run"]) {
        if (isNaN(args[numberInput])) {
            throw Error(`input ${numberInput} did not parse to a valid integer`);
        }
    }
    return args;
}
run();
