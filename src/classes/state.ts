import {Issue} from './issue';
import {IState} from '../interfaces/state';
import os from 'os';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import * as artifact from '@actions/artifact';
import * as core from '@actions/core';

type IssueID = number;
export class State implements IState {
  private processedIssuesIDs: Set<IssueID>;
  /**
   * @private don't mutate in the debug mode
   */
  private readonly debug: boolean;
  constructor() {
    this.processedIssuesIDs = new Set();
    this.debug = core.getInput('debug-only') === 'true';
  }

  isIssueProcessed(issue: Issue) {
    return this.processedIssuesIDs.has(issue.number);
  }

  addIssueToProcessed(issue: Issue) {
    if (!this.debug) this.processedIssuesIDs.add(issue.number);
  }

  reset() {
    if (!this.debug) this.processedIssuesIDs.clear();
  }

  private static readonly ARTIFACT_NAME = '_stale_state';
  async persist() {
    if (this.debug) {
      core.debug('The state is not persisted in the debug mode');
      return;
    }

    const serialized = Array.from(this.processedIssuesIDs).join('|');

    const tmpDir = os.tmpdir();
    const file = path.join(
      tmpDir,
      crypto.randomBytes(8).readBigUInt64LE(0).toString()
    );
    fs.writeFileSync(file, serialized);

    core.debug(
      `Persisting state includes info about ${this.processedIssuesIDs.size} issue(s)`
    );
    const artifactClient = artifact.create();
    try {
      await artifactClient.uploadArtifact(State.ARTIFACT_NAME, [file], tmpDir);
    } catch (error) {
      core.warning(
        `Persisting the state was not successful due to "${
          error.message || 'unknown reason'
        }"`
      );
    }
  }

  async rehydrate() {
    this.reset();

    const tmpDir = os.tmpdir();
    const artifactClient = artifact.create();
    try {
      const downloadResponse = await artifactClient.downloadArtifact(
        State.ARTIFACT_NAME,
        tmpDir
      );

      const downloadedFiles = fs.readdirSync(downloadResponse.downloadPath);
      if (downloadedFiles.length === 0) {
        throw Error(
          'There is no data in the state artifact, probably because of the previous run failed'
        );
      }
      const serialized = fs.readFileSync(
        path.join(downloadResponse.downloadPath, downloadedFiles[0]),
        {encoding: 'utf8'}
      );

      if (serialized.length === 0) return;

      const issueIDs = serialized
        .split('|')
        .map(parseInt)
        .filter(i => !isNaN(i));

      this.processedIssuesIDs = new Set(issueIDs);
      core.debug(
        `Rehydrated state includes info about ${issueIDs.length} issue(s)`
      );
    } catch (error) {
      core.warning(
        `Rehydrating the state was not successful due to "${
          error.message || 'unknown reason'
        }"`
      );
    }
  }
}
