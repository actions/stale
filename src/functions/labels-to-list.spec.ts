import {labelsToList} from './labels-to-list';

describe('labelsToList()', (): void => {
  let labels: string;

  describe('when the given labels is empty', (): void => {
    beforeEach((): void => {
      labels = '';
    });

    it('should return an empty list of labels', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual([]);
    });
  });

  describe('when the given labels is a simple label', (): void => {
    beforeEach((): void => {
      labels = 'label';
    });

    it('should return a list of one label', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual(['label']);
    });
  });

  describe('when the given labels is a label with extra spaces before and after', (): void => {
    beforeEach((): void => {
      labels = '   label   ';
    });

    it('should return a list of one label and remove all spaces before and after', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual(['label']);
    });
  });

  describe('when the given labels is a kebab case label', (): void => {
    beforeEach((): void => {
      labels = 'kebab-case-label';
    });

    it('should return a list of one label', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual(['kebab-case-label']);
    });
  });

  describe('when the given labels is two kebab case labels separated with a comma', (): void => {
    beforeEach((): void => {
      labels = 'kebab-case-label-1,kebab-case-label-2';
    });

    it('should return a list of two labels', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual([
        'kebab-case-label-1',
        'kebab-case-label-2'
      ]);
    });
  });

  describe('when the given labels is a multiple word label', (): void => {
    beforeEach((): void => {
      labels = 'label like a sentence';
    });

    it('should return a list of one label', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual(['label like a sentence']);
    });
  });

  describe('when the given labels is two multiple word labels separated with a comma', (): void => {
    beforeEach((): void => {
      labels = 'label like a sentence, another label like a sentence';
    });

    it('should return a list of two labels', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual([
        'label like a sentence',
        'another label like a sentence'
      ]);
    });
  });

  describe('when the given labels is a multiple word label with %20 spaces', (): void => {
    beforeEach((): void => {
      labels = 'label%20like%20a%20sentence';
    });

    it('should return a list of one label', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual(['label%20like%20a%20sentence']);
    });
  });

  describe('when the given labels is two multiple word labels with %20 spaces separated with a comma', (): void => {
    beforeEach((): void => {
      labels =
        'label%20like%20a%20sentence,another%20label%20like%20a%20sentence';
    });

    it('should return a list of two labels', (): void => {
      expect.assertions(1);

      const result = labelsToList(labels);

      expect(result).toStrictEqual([
        'label%20like%20a%20sentence',
        'another%20label%20like%20a%20sentence'
      ]);
    });
  });
});
