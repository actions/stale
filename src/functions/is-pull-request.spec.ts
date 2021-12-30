import {Issue} from '../classes/issue';
import {isPullRequest} from './is-pull-request';

describe('isPullRequest()', (): void => {
  let issue: Issue;

  describe('when the given issue has an undefined pull request', (): void => {
    beforeEach((): void => {
      issue = {
        pull_request: undefined
      } as Issue;
    });

    it('should return false', (): void => {
      expect.assertions(1);

      const result = isPullRequest(issue);

      expect(result).toStrictEqual(false);
    });
  });

  describe('when the given issue has a null pull request', (): void => {
    beforeEach((): void => {
      issue = {
        pull_request: null
      } as Issue;
    });

    it('should return false', (): void => {
      expect.assertions(1);

      const result = isPullRequest(issue);

      expect(result).toStrictEqual(false);
    });
  });

  describe.each([{}, true])(
    'when the given issue has pull request',
    (value): void => {
      beforeEach((): void => {
        issue = {
          pull_request: value
        } as Issue;
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isPullRequest(issue);

        expect(result).toStrictEqual(true);
      });
    }
  );
});
