/**
 * @description
 * Transform a string of comma separated labels
 * to an array of labels
 *
 * @example
 * labelsToList('label') => ['label']
 * labelsToList('label,label') => ['label', 'label']
 * labelsToList('kebab-label') => ['kebab-label']
 * labelsToList('kebab%20label') => ['kebab%20label']
 * labelsToList('label with words') => ['label with words']
 *
 * @param {Readonly<string>} labels A string of comma separated labels
 *
 * @return {string[]} A list of labels
 */
export function labelsToList(labels: Readonly<string>): string[] {
  if (!labels.length) {
    return [];
  }

  return labels.split(',').map(l => l.trim());
}
