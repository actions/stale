import {getIssueType} from './get-issue-type';

describe('getIssueType()', (): void => {
  let isPullRequest: boolean;

  describe('when the issue is a not pull request', (): void => {
    beforeEach((): void => {
      isPullRequest = false;
    });

    it('should return that the issue is really an issue', (): void => {
      expect.assertions(1);

      const result = getIssueType(isPullRequest);

      expect(result).toStrictEqual('issue');
    });
  });

  describe('when the issue is a pull request', (): void => {
    beforeEach((): void => {
      isPullRequest = true;
    });

    it('should return that the issue is a pull request', (): void => {
      expect.assertions(1);

      const result = getIssueType(isPullRequest);

      expect(result).toStrictEqual('pr');
    });
  });
});
