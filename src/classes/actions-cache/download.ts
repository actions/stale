import {createHttpClient, getCacheApiUrl} from './http-client';
import {retryTypedResponse} from './retry';
import {isSuccessStatusCode} from './http-responses';
import {HttpClient} from '@actions/http-client';
import {downloadCacheHttpClient} from '@actions/cache/lib/internal/downloadUtils';
import * as core from '@actions/core';

interface ArtifactCacheEntry {
  cacheKey?: string;
  scope?: string;
  cacheVersion?: string;
  creationTime?: string;
  archiveLocation?: string;
}
const getCacheArchiveUrl = async (
  httpClient: HttpClient,
  cacheKey: string,
  cacheVersion: string
): Promise<string | null> => {
  // TODO: should work with delete?
  const resource = `cache?keys=${cacheKey}&version=${cacheVersion}`;

  const response = await retryTypedResponse('getCacheEntry', async () =>
    httpClient.getJson<ArtifactCacheEntry>(getCacheApiUrl(resource))
  );
  // Cache not found
  if (response.statusCode === 204) {
    core.debug(
      `There's no cache with key ${cacheKey} & version=${cacheVersion}`
    );
    // List cache for primary key only if cache miss occurs
    return null;
  }
  if (!isSuccessStatusCode(response.statusCode)) {
    throw new Error(`Cache service responded with ${response.statusCode}`);
  }

  const cacheResult = response.result;
  core.debug(`getCacheEntry response is:\n${JSON.stringify(cacheResult)}`);
  const cacheDownloadUrl = cacheResult?.archiveLocation;
  if (!cacheDownloadUrl) {
    // Cache archiveLocation not found. This should never happen, and hence bail out.
    throw new Error('Cache not found.');
  }
  return cacheDownloadUrl;
};

export const downloadFileFromActionsCache = async (
  destFileName: string,
  cacheKey: string,
  cacheVersion: string
) => {
  const httpClient = createHttpClient();
  const archiveUrl = await getCacheArchiveUrl(
    httpClient,
    cacheKey,
    cacheVersion
  );

  if (!archiveUrl) {
    return undefined;
  }

  await downloadCacheHttpClient(archiveUrl, destFileName);
};
