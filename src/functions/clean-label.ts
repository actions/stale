import deburr from 'lodash.deburr';
import {CleanLabel} from '../types/clean-label';

/**
 * @description
 * Clean a label by lowercasing it and deburring it for consistency
 *
 * @param {string} label A raw GitHub label
 *
 * @return {string} A lowercased, deburred version of the passed in label
 */
export function cleanLabel(label?: Readonly<string>): CleanLabel {
  return deburr(label?.toLowerCase());
}
