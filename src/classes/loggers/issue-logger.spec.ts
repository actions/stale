import {DefaultProcessorOptions} from '../../../__tests__/constants/default-processor-options';
import {generateIIssue} from '../../../__tests__/functions/generate-iissue';
import {Issue} from '../issue';
import {IssueLogger} from './issue-logger';
import * as core from '@actions/core';

describe('IssueLogger', (): void => {
  let issue: Issue;
  let issueLogger: IssueLogger;
  let message: string;

  let coreWarningSpy: jest.SpyInstance;

  describe('warning()', (): void => {
    beforeEach((): void => {
      message = 'dummy-message';
      issue = new Issue(
        DefaultProcessorOptions,
        generateIIssue({
          number: 8
        })
      );
      issueLogger = new IssueLogger(issue);

      coreWarningSpy = jest.spyOn(core, 'warning').mockImplementation();
    });

    it('should log a warning with the given message and with the issue number as prefix', (): void => {
      expect.assertions(2);

      issueLogger.warning(message);

      expect(coreWarningSpy).toHaveBeenCalledTimes(1);
      expect(coreWarningSpy).toHaveBeenCalledWith('[#8] dummy-message');
    });
  });

  describe('info()', (): void => {
    let coreInfoSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';
      issue = new Issue(
        DefaultProcessorOptions,
        generateIIssue({
          number: 8
        })
      );
      issueLogger = new IssueLogger(issue);

      coreInfoSpy = jest.spyOn(core, 'info').mockImplementation();
    });

    it('should log an information with the given message and with the issue number as prefix', (): void => {
      expect.assertions(2);

      issueLogger.info(message);

      expect(coreInfoSpy).toHaveBeenCalledTimes(1);
      expect(coreInfoSpy).toHaveBeenCalledWith('[#8] dummy-message');
    });
  });

  describe('error()', (): void => {
    let coreErrorSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';
      issue = new Issue(
        DefaultProcessorOptions,
        generateIIssue({
          number: 8
        })
      );
      issueLogger = new IssueLogger(issue);

      coreErrorSpy = jest.spyOn(core, 'error').mockImplementation();
    });

    it('should log an error with the given message and with the issue number as prefix', (): void => {
      expect.assertions(2);

      issueLogger.error(message);

      expect(coreErrorSpy).toHaveBeenCalledTimes(1);
      expect(coreErrorSpy).toHaveBeenCalledWith('[#8] dummy-message');
    });
  });

  it('should prefix the message with the issue number', (): void => {
    expect.assertions(2);
    message = 'dummy-message';
    issue = new Issue(
      DefaultProcessorOptions,
      generateIIssue({
        number: 123
      })
    );
    issueLogger = new IssueLogger(issue);
    coreWarningSpy = jest.spyOn(core, 'warning').mockImplementation();

    issueLogger.warning(message);

    expect(coreWarningSpy).toHaveBeenCalledTimes(1);
    expect(coreWarningSpy).toHaveBeenCalledWith('[#123] dummy-message');
  });

  it.each`
    pull_request      | replacement
    ${{key: 'value'}} | ${'pull request'}
    ${{}}             | ${'pull request'}
    ${null}           | ${'issue'}
    ${undefined}      | ${'issue'}
  `(
    'should replace the special tokens "$$type" with the corresponding type',
    ({pull_request, replacement}): void => {
      expect.assertions(2);
      message = 'The $$type will stale! $$type will soon be closed!';
      issue = new Issue(
        DefaultProcessorOptions,
        generateIIssue({
          number: 8,
          pull_request
        })
      );
      issueLogger = new IssueLogger(issue);
      coreWarningSpy = jest.spyOn(core, 'warning').mockImplementation();

      issueLogger.warning(message);

      expect(coreWarningSpy).toHaveBeenCalledTimes(1);
      expect(coreWarningSpy).toHaveBeenCalledWith(
        `[#8] The ${replacement} will stale! ${replacement} will soon be closed!`
      );
    }
  );

  it.each`
    pull_request      | replacement
    ${{key: 'value'}} | ${'Pull request'}
    ${{}}             | ${'Pull request'}
    ${null}           | ${'Issue'}
    ${undefined}      | ${'Issue'}
  `(
    'should replace the special token "$$type" with the corresponding type with first letter as uppercase',
    ({pull_request, replacement}): void => {
      expect.assertions(2);
      message = '$$type will stale';
      issue = new Issue(
        DefaultProcessorOptions,
        generateIIssue({
          number: 8,
          pull_request
        })
      );
      issueLogger = new IssueLogger(issue);
      coreWarningSpy = jest.spyOn(core, 'warning').mockImplementation();

      issueLogger.warning(message);

      expect(coreWarningSpy).toHaveBeenCalledTimes(1);
      expect(coreWarningSpy).toHaveBeenCalledWith(
        `[#8] ${replacement} will stale`
      );
    }
  );
});
