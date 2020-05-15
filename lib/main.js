"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const args = getAndValidateArgs();
            const client = new github.GitHub(args.repoToken);
            yield processIssues(client, args, args.operationsPerRun);
        }
        catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
    });
}
function processIssues(client, args, operationsLeft, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const issues = yield client.issues.listForRepo({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            state: 'open',
            per_page: 100,
            page: page
        });
        operationsLeft -= 1;
        if (issues.data.length === 0 || operationsLeft === 0) {
            return operationsLeft;
        }
        for (var issue of issues.data.values()) {
            core.debug(`found issue: ${issue.title} last updated ${issue.updated_at}`);
            let isPr = !!issue.pull_request;
            let staleMessage = isPr ? args.stalePrMessage : args.staleIssueMessage;
            if (!staleMessage) {
                core.debug(`skipping ${isPr ? 'pr' : 'issue'} due to empty message`);
                continue;
            }
            let staleLabel = isPr ? args.stalePrLabel : args.staleIssueLabel;
            let exemptLabel = isPr ? args.exemptPrLabel : args.exemptIssueLabel;
            if (exemptLabel && isLabeled(issue, exemptLabel)) {
                continue;
            }
            else if (isLabeled(issue, staleLabel)) {
                if (wasLastUpdatedBefore(issue, args.daysBeforeClose)) {
                    operationsLeft -= yield closeIssue(client, issue);
                }
                else {
                    continue;
                }
            }
            else if (wasLastUpdatedBefore(issue, args.daysBeforeStale)) {
                operationsLeft -= yield markStale(client, issue, staleMessage, staleLabel);
            }
            if (operationsLeft <= 0) {
                core.warning(`performed ${args.operationsPerRun} operations, exiting to avoid rate limit`);
                return 0;
            }
        }
        return yield processIssues(client, args, operationsLeft, page + 1);
    });
}
function isLabeled(issue, label) {
    const labelComparer = l => label.localeCompare(l.name, undefined, { sensitivity: 'accent' }) === 0;
    return issue.labels.filter(labelComparer).length > 0;
}
function wasLastUpdatedBefore(issue, num_days) {
    const daysInMillis = 1000 * 60 * 60 * 24 * num_days;
    const millisSinceLastUpdated = new Date().getTime() - new Date(issue.updated_at).getTime();
    return millisSinceLastUpdated >= daysInMillis;
}
function markStale(client, issue, staleMessage, staleLabel) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(`marking issue${issue.title} as stale`);
        yield client.issues.createComment({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: issue.number,
            body: staleMessage
        });
        yield client.issues.addLabels({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: issue.number,
            labels: [staleLabel]
        });
        return 2; // operations performed
    });
}
function closeIssue(client, issue) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(`closing issue ${issue.title} for being stale`);
        yield client.issues.update({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: issue.number,
            state: 'closed'
        });
        return 1; // operations performed
    });
}
function getAndValidateArgs() {
    const args = {
        repoToken: core.getInput('repo-token', { required: true }),
        staleIssueMessage: core.getInput('stale-issue-message'),
        stalePrMessage: core.getInput('stale-pr-message'),
        daysBeforeStale: parseInt(core.getInput('days-before-stale', { required: true })),
        daysBeforeClose: parseInt(core.getInput('days-before-close', { required: true })),
        staleIssueLabel: core.getInput('stale-issue-label', { required: true }),
        exemptIssueLabel: core.getInput('exempt-issue-label'),
        stalePrLabel: core.getInput('stale-pr-label', { required: true }),
        exemptPrLabel: core.getInput('exempt-pr-label'),
        operationsPerRun: parseInt(core.getInput('operations-per-run', { required: true }))
    };
    for (var numberInput of [
        'days-before-stale',
        'days-before-close',
        'operations-per-run'
    ]) {
        if (isNaN(parseInt(core.getInput(numberInput)))) {
            throw Error(`input ${numberInput} did not parse to a valid integer`);
        }
    }
    return args;
}
run();
