import * as core from '@actions/core';
import fs from 'fs';
import {HttpClient} from '@actions/http-client';
import {TypedResponse} from '@actions/http-client/lib/interfaces';
import {ReserveCacheError, ValidationError} from '@actions/cache';
import {isSuccessStatusCode} from './http-responses';
import {retryHttpClientResponse, retryTypedResponse} from './retry';
import {getOctokit} from '@actions/github';
import {retry as octokitRetry} from '@octokit/plugin-retry';
import {createActionsCacheClient, getCacheApiUrl} from './http-client';

const uploadChunk = async (httpClient: HttpClient): Promise<void> => {};

const uploadFile = async (
  httpClient: HttpClient,
  cacheId: number,
  filePath: string,
  fileSize: number
): Promise<void> => {
  if (fileSize <= 0) return;
  const start = 0;
  const end = fileSize - 1;
  const contentRange = `bytes ${start}-${end}/*`;
  core.debug(
    `Uploading chunk of size ${
      end - start + 1
    } bytes at offset ${start} with content range: ${contentRange}`
  );

  const additionalHeaders = {
    'Content-Type': 'application/octet-stream',
    'Content-Range': contentRange
  };

  const resourceUrl = getCacheApiUrl(`caches/${cacheId.toString()}`);
  const fd = fs.openSync(filePath, 'r');
  const openStream = () =>
    fs
      .createReadStream(filePath, {
        fd,
        start,
        end,
        autoClose: false
      })
      .on('error', error => {
        throw new Error(
          `Cache upload failed because file read failed with ${error.message}`
        );
      });

  try {
    const uploadChunkResponse = await retryHttpClientResponse(
      `uploadChunk (start: ${start}, end: ${end})`,
      async () =>
        httpClient.sendStream(
          'PATCH',
          resourceUrl,
          openStream(),
          additionalHeaders
        )
    );

    if (!isSuccessStatusCode(uploadChunkResponse.message.statusCode)) {
      throw new Error(
        `Cache service responded with ${uploadChunkResponse.message.statusCode} during upload chunk.`
      );
    }
  } finally {
    fs.closeSync(fd);
  }
};

const resetCacheWithOctokit = async (cacheKey: string): Promise<void> => {
  const token = core.getInput('repo-token');
  const client = getOctokit(token, undefined, octokitRetry);
  // TODO: better way to get repository?
  const repo = process.env['GITHUB_REPOSITORY'];
  core.debug(`remove cache "${cacheKey}"`);
  try {
    // TODO: replace with client.rest.
    await client.request(
      `DELETE /repos/${repo}/actions/caches?key=${cacheKey}`
    );
  } catch (error) {
    if (error.status) {
      core.debug(`Cache ${cacheKey} does not exist`);
    } else {
      throw error;
    }
  }
};

const reserveCache = async (
  httpClient: HttpClient,
  fileSize: number,
  cacheKey: string,
  cacheVersion: string
): Promise<number> => {
  const reserveCacheRequest = {
    key: cacheKey,
    version: cacheVersion,
    cacheSize: fileSize
  };
  const response = await retryTypedResponse('reserveCache', async () =>
    httpClient.postJson<{cacheId: number}>(
      getCacheApiUrl('caches'),
      reserveCacheRequest
    )
  );

  // handle 400 in the special way
  if (response?.statusCode === 400)
    throw new Error(
      response?.error?.message ??
        `Cache size of ~${Math.round(
          fileSize / (1024 * 1024)
        )} MB (${fileSize} B) is over the data cap limit, not saving cache.`
    );

  const cacheId = response?.result?.cacheId;

  if (cacheId === undefined)
    throw new ReserveCacheError(
      `Unable to reserve cache with key ${cacheKey}, another job may be creating this cache. More details: ${response?.error?.message}`
    );
  return cacheId;
};

const commitCache = async (
  httpClient: HttpClient,
  cacheId: number,
  filesize: number
): Promise<void> => {
  const response = (await retryTypedResponse('commitCache', async () =>
    httpClient.postJson<null>(getCacheApiUrl(`caches/${cacheId.toString()}`), {
      size: filesize
    })
  )) as TypedResponse<null>;
  if (!isSuccessStatusCode(response.statusCode)) {
    throw new Error(
      `Cache service responded with ${response.statusCode} during commit cache.`
    );
  }
};

export const uploadFileToActionsCache = async (
  filePath: string,
  cacheKey: string,
  cacheVersion: string
) => {
  try {
    await resetCacheWithOctokit(cacheKey);
    const fileSize = fs.statSync(filePath).size;

    if (fileSize === 0) {
      core.info(`the cache ${cacheKey} will be removed`);
      return;
    }

    const httpClient = createActionsCacheClient();

    const cacheId = await reserveCache(
      httpClient,
      fileSize,
      cacheKey,
      cacheVersion
    );

    await uploadFile(httpClient, cacheId, filePath, fileSize);

    await commitCache(httpClient, cacheId, fileSize);
  } catch (error) {
    const typedError = error as Error;
    if (typedError.name === ValidationError.name) {
      throw error;
    }
    if (typedError.name === ReserveCacheError.name) {
      core.info(`Failed to save: ${typedError.message}`);
      return;
    }
    core.warning(`Failed to save: ${typedError.message}`);
  }
};
