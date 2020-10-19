import deburr from 'lodash.deburr';
import {Issue, Label} from '../IssueProcessor';

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
