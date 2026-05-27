import {Issue} from '../classes/issue';
import {isLabeled} from './is-labeled';

describe('isLabeled()', (): void => {
  let issue: Issue;
  let label: string;

  describe('when the given issue contains no label', (): void => {
    beforeEach((): void => {
      issue = {
        labels: []
      } as unknown as Issue;
    });

    describe('when the given label is a simple label', (): void => {
      beforeEach((): void => {
        label = 'label';
      });

      it('should return false', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(false);
      });
    });
  });

  describe('when the given issue contains a simple label', (): void => {
    beforeEach((): void => {
      issue = {
        labels: [
          {
            name: 'label'
          }
        ]
      } as Issue;
    });

    describe('when the given label is a simple label', (): void => {
      beforeEach((): void => {
        label = 'label';
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(true);
      });
    });
  });

  describe('when the given issue contains a kebab case label', (): void => {
    beforeEach((): void => {
      issue = {
        labels: [
          {
            name: 'kebab-case-label'
          }
        ]
      } as Issue;
    });

    describe('when the given label is a kebab case label', (): void => {
      beforeEach((): void => {
        label = 'kebab-case-label';
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(true);
      });
    });
  });

  describe('when the given issue contains a multiple word label', (): void => {
    beforeEach((): void => {
      issue = {
        labels: [
          {
            name: 'label like a sentence'
          }
        ]
      } as Issue;
    });

    describe('when the given label is a multiple word label', (): void => {
      beforeEach((): void => {
        label = 'label like a sentence';
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(true);
      });
    });
  });

  describe('when the given issue contains a multiple word label with %20 spaces', (): void => {
    beforeEach((): void => {
      issue = {
        labels: [
          {
            name: 'label%20like%20a%20sentence'
          }
        ]
      } as Issue;
    });

    describe('when the given label is a multiple word label with %20 spaces', (): void => {
      beforeEach((): void => {
        label = 'label%20like%20a%20sentence';
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(true);
      });
    });
  });

  describe('when the given issue contains a label with diacritical marks', (): void => {
    beforeEach((): void => {
      issue = {
        labels: [
          {
            name: 'déjà vu'
          }
        ]
      } as Issue;
    });

    describe('when the given issue contains a label', (): void => {
      beforeEach((): void => {
        label = 'deja vu';
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(true);
      });
    });

    describe('when the given issue contains an uppercase label', (): void => {
      beforeEach((): void => {
        label = 'DEJA VU';
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(true);
      });
    });

    describe('when the given issue contains a label with diacritical marks', (): void => {
      beforeEach((): void => {
        label = 'déjà vu';
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = isLabeled(issue, label);

        expect(result).toStrictEqual(true);
      });
    });
  });
});
