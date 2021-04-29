import {isBoolean} from './is-boolean';

describe('isBoolean()', (): void => {
  describe.each([0, 1, undefined, null, ''])(
    'when the given value is not a boolean',
    (value): void => {
      it('should return false', (): void => {
        expect.assertions(1);

        const result = isBoolean(value);

        expect(result).toStrictEqual(false);
      });
    }
  );

  describe.each([false, true])(
    'when the given value is a boolean',
    (value): void => {
      it('should return true', (): void => {
        expect.assertions(1);

        const result = isBoolean(value);

        expect(result).toStrictEqual(true);
      });
    }
  );
});
