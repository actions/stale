import {Issue} from '../classes/issue';
import {ILabel} from '../interfaces/label';
import {cleanLabel} from './clean-label';

/**
 * @description
 * Check if the given label is listed as a label of the given issue
 *
 * @param {Readonly<Issue>} issue A GitHub issue containing some labels
 * @param {Readonly<string>} label The label to check the presence with
 *
 * @return {boolean} Return true when the given label is also in the given issue labels
 */
export function isLabeled(
  issue: Readonly<Issue>,
  label: Readonly<string>
): boolean {
  return !!issue.labels.find((issueLabel: Readonly<ILabel>): boolean => {
    return cleanLabel(label) === cleanLabel(issueLabel.name);
  });
}
