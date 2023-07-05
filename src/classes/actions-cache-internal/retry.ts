import {
  HttpClientError,
  HttpClientResponse,
  HttpCodes
} from '@actions/http-client';
import {
  isServerErrorStatusCode,
  TypedResponseWithError
} from './http-responses';
import * as core from '@actions/core';

const isRetryableStatusCode = (statusCode?: number): boolean => {
  if (!statusCode) {
    return false;
  }
  const retryableStatusCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
  ];
  return retryableStatusCodes.includes(statusCode);
};

const sleep = (milliseconds: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, milliseconds));
// The default number of retry attempts.
const DefaultRetryAttempts = 2;
// The default delay in milliseconds between retry attempts.
const DefaultRetryDelay = 5000;

const retry = async <T>(
  name: string,
  method: () => Promise<T>,
  getStatusCode: (arg0: T) => number | undefined,
  maxAttempts = DefaultRetryAttempts,
  delay = DefaultRetryDelay,
  onError: ((arg0: Error) => T | undefined) | undefined = undefined
): Promise<T> => {
  let errorMessage = '';
  let attempt = 1;

  while (attempt <= maxAttempts) {
    let response: T | undefined = undefined;
    let statusCode: number | undefined = undefined;
    let isRetryable = false;

    try {
      response = await method();
    } catch (error) {
      if (onError) {
        response = onError(error);
      }

      isRetryable = true;
      errorMessage = error.message;
    }

    if (response) {
      statusCode = getStatusCode(response);

      if (!isServerErrorStatusCode(statusCode)) {
        return response;
      }
    }

    if (statusCode) {
      isRetryable = isRetryableStatusCode(statusCode);
      errorMessage = `Cache service responded with ${statusCode}`;
    }

    core.debug(
      `${name} - Attempt ${attempt} of ${maxAttempts} failed with error: ${errorMessage}`
    );

    if (!isRetryable) {
      core.debug(`${name} - Error is not retryable`);
      break;
    }

    await sleep(delay);
    attempt++;
  }

  throw Error(`${name} failed: ${errorMessage}`);
};

export const retryHttpClientResponse = async (
  name: string,
  method: () => Promise<HttpClientResponse>,
  maxAttempts = DefaultRetryAttempts,
  delay = DefaultRetryDelay
): Promise<HttpClientResponse> => {
  return await retry(
    name,
    method,
    (response: HttpClientResponse) => response.message.statusCode,
    maxAttempts,
    delay
  );
};
export const retryTypedResponse = <T>(
  name: string,
  method: () => Promise<TypedResponseWithError<T>>,
  maxAttempts = DefaultRetryAttempts,
  delay = DefaultRetryDelay
): Promise<TypedResponseWithError<T>> =>
  retry(
    name,
    method,
    (response: TypedResponseWithError<T>) => response.statusCode,
    maxAttempts,
    delay,
    // If the error object contains the statusCode property, extract it and return
    // an TypedResponse<T> so it can be processed by the retry logic.
    (error: Error) => {
      if (error instanceof HttpClientError) {
        return {
          statusCode: error.statusCode,
          result: null,
          headers: {},
          error
        };
      } else {
        return undefined;
      }
    }
  );
