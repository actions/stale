/**
 * @description
 * Transform a string of comma separated words
 * to an array of words
 *
 * @example
 * wordsToList('label') => ['label']
 * wordsToList('label,label') => ['label', 'label']
 * wordsToList('kebab-label') => ['kebab-label']
 * wordsToList('kebab%20label') => ['kebab%20label']
 * wordsToList('label with words') => ['label with words']
 *
 * @param {Readonly<string>} words A string of comma separated words
 *
 * @return {string[]} A list of words
 */
export function wordsToList(words: Readonly<string>): string[] {
  if (!words.length) {
    return [];
  }

  return words.split(',').map((word: Readonly<string>): string => word.trim());
}
