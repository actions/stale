import {HttpClient} from '@actions/http-client';
import {BearerCredentialHandler} from '@actions/http-client/lib/auth';
import {RequestOptions} from '@actions/http-client/lib/interfaces';
import * as core from '@actions/core';

const createAcceptHeader = (type: string, apiVersion: string): string =>
  `${type};api-version=${apiVersion}`;
const getRequestOptions = (): RequestOptions => ({
  headers: {
    Accept: createAcceptHeader('application/json', '6.0-preview.1')
  }
});

export const createHttpClient = (): HttpClient => {
  const token = process.env['ACTIONS_RUNTIME_TOKEN'] || '';
  const bearerCredentialHandler = new BearerCredentialHandler(token);

  return new HttpClient(
    'actions/cache',
    [bearerCredentialHandler],
    getRequestOptions()
  );
};
export const getGitHubActionsApiUrl = (resource: string): string => {
  const baseUrl: string = process.env['GITHUB_API_URL'] || '';
  if (!baseUrl) {
    throw new Error('GitHub API Url not found, unable to restore cache.');
  }

  const repo = process.env['GITHUB_REPOSITORY'];
  const url = `${baseUrl}/repos/${repo}/actions/${resource}`;
  core.debug(`Resource Url: ${url}`);
  return url;
};
export const getCacheApiUrl = (resource: string): string => {
  const baseUrl: string = process.env['ACTIONS_CACHE_URL'] || '';
  if (!baseUrl) {
    throw new Error('Cache Service Url not found, unable to restore cache.');
  }

  const url = `${baseUrl}_apis/artifactcache/${resource}`;
  core.debug(`Resource Url: ${url}`);
  return url;
};
