import {Issue} from '../issue';
import {IssueLogger} from './issue-logger';
import * as core from '@actions/core';

describe('IssueLogger', (): void => {
  let issue: Issue;
  let issueLogger: IssueLogger;

  beforeEach((): void => {
    issue = {
      number: 8
    } as Issue;
    issueLogger = new IssueLogger(issue);
  });

  describe('warning()', (): void => {
    let message: string;

    let coreWarningSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';

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
    let message: string;

    let coreInfoSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';

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
    let message: string;

    let coreErrorSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';

      coreErrorSpy = jest.spyOn(core, 'error').mockImplementation();
    });

    it('should log an error with the given message and with the issue number as prefix', (): void => {
      expect.assertions(2);

      issueLogger.error(message);

      expect(coreErrorSpy).toHaveBeenCalledTimes(1);
      expect(coreErrorSpy).toHaveBeenCalledWith('[#8] dummy-message');
    });
  });
});
