import {wordsToList} from './words-to-list';

describe('wordsToList()', (): void => {
  let words: string;

  describe('when the given words is empty', (): void => {
    beforeEach((): void => {
      words = '';
    });

    it('should return an empty list of words', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual([]);
    });
  });

  describe('when the given words is a simple word', (): void => {
    beforeEach((): void => {
      words = 'word';
    });

    it('should return a list of one word', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual(['word']);
    });
  });

  describe('when the given words is a word with extra spaces before and after', (): void => {
    beforeEach((): void => {
      words = '   word   ';
    });

    it('should return a list of one word and remove all spaces before and after', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual(['word']);
    });
  });

  describe('when the given words is a kebab case word', (): void => {
    beforeEach((): void => {
      words = 'kebab-case-word';
    });

    it('should return a list of one word', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual(['kebab-case-word']);
    });
  });

  describe('when the given words is two kebab case words separated with a comma', (): void => {
    beforeEach((): void => {
      words = 'kebab-case-word-1,kebab-case-word-2';
    });

    it('should return a list of two words', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual(['kebab-case-word-1', 'kebab-case-word-2']);
    });
  });

  describe('when the given words is a multiple word word', (): void => {
    beforeEach((): void => {
      words = 'word like a sentence';
    });

    it('should return a list of one word', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual(['word like a sentence']);
    });
  });

  describe('when the given words is two multiple word words separated with a comma', (): void => {
    beforeEach((): void => {
      words = 'word like a sentence, another word like a sentence';
    });

    it('should return a list of two words', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual([
        'word like a sentence',
        'another word like a sentence'
      ]);
    });
  });

  describe('when the given words is a multiple word word with %20 spaces', (): void => {
    beforeEach((): void => {
      words = 'word%20like%20a%20sentence';
    });

    it('should return a list of one word', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual(['word%20like%20a%20sentence']);
    });
  });

  describe('when the given words is two multiple word words with %20 spaces separated with a comma', (): void => {
    beforeEach((): void => {
      words = 'word%20like%20a%20sentence,another%20word%20like%20a%20sentence';
    });

    it('should return a list of two words', (): void => {
      expect.assertions(1);

      const result = wordsToList(words);

      expect(result).toStrictEqual([
        'word%20like%20a%20sentence',
        'another%20word%20like%20a%20sentence'
      ]);
    });
  });
});
