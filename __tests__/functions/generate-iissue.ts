import {IIssue} from '../../src/interfaces/issue';

export function generateIIssue(
  partialIssue?: Readonly<Partial<IIssue>>
): IIssue {
  return {
    milestone: undefined,
    assignees: [],
    labels: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    number: Math.round(Math.random() * 5000),
    pull_request: null,
    title: 'dummy-title',
    locked: false,
    state: 'dummy-state',
    ...partialIssue
  };
}
