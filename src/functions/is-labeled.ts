import deburr from 'lodash.deburr';
import {Issue, Label} from '../IssueProcessor';

/**
 * @description
 * Check if the label is listed as a label of the issue
 *
 * @param {Readonly<Issue>} issue A GitHub issue containing some labels
 * @param {Readonly<string>} label The label to check the presence with
 *
 * @return {boolean} Return true when the given label is also in the issue labels
 */
export function isLabeled(
  issue: Readonly<Issue>,
  label: Readonly<string>
): boolean {
  return !!issue.labels.find((issueLabel: Readonly<Label>): boolean => {
    return cleanLabel(label) === cleanLabel(issueLabel.name);
  });
}

function cleanLabel(label: Readonly<string>): string {
  return deburr(label.toLowerCase());
}
