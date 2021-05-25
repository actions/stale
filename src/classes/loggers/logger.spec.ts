import {Logger} from './logger';
import * as core from '@actions/core';

describe('Logger', (): void => {
  let logger: Logger;

  beforeEach((): void => {
    logger = new Logger();
  });

  describe('warning()', (): void => {
    let message: string;

    let coreWarningSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';

      coreWarningSpy = jest.spyOn(core, 'warning').mockImplementation();
    });

    it('should log a warning with the given message', (): void => {
      expect.assertions(2);

      logger.warning(message);

      expect(coreWarningSpy).toHaveBeenCalledTimes(1);
      expect(coreWarningSpy).toHaveBeenCalledWith(
        expect.stringContaining('dummy-message')
      );
    });
  });

  describe('info()', (): void => {
    let message: string;

    let coreInfoSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';

      coreInfoSpy = jest.spyOn(core, 'info').mockImplementation();
    });

    it('should log an information with the given message', (): void => {
      expect.assertions(2);

      logger.info(message);

      expect(coreInfoSpy).toHaveBeenCalledTimes(1);
      expect(coreInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('dummy-message')
      );
    });
  });

  describe('error()', (): void => {
    let message: string;

    let coreErrorSpy: jest.SpyInstance;

    beforeEach((): void => {
      message = 'dummy-message';

      coreErrorSpy = jest.spyOn(core, 'error').mockImplementation();
    });

    it('should log an error with the given message', (): void => {
      expect.assertions(2);

      logger.error(message);

      expect(coreErrorSpy).toHaveBeenCalledTimes(1);
      expect(coreErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('dummy-message')
      );
    });
  });
});
