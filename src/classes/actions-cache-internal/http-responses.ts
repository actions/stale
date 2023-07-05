import {TypedResponse} from '@actions/http-client/lib/interfaces';
import {HttpClientError} from '@actions/http-client';

export const isSuccessStatusCode = (statusCode?: number): boolean => {
  if (!statusCode) {
    return false;
  }
  return statusCode >= 200 && statusCode < 300;
};
export function isServerErrorStatusCode(statusCode?: number): boolean {
  if (!statusCode) {
    return true;
  }
  return statusCode >= 500;
}

export interface TypedResponseWithError<T> extends TypedResponse<T> {
  error?: HttpClientError;
}
