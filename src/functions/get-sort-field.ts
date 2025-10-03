type sortOptions = 'created' | 'updated' | 'comments';
export function getSortField(sortOption: sortOptions): sortOptions {
  return sortOption === 'updated'
    ? 'updated'
    : sortOption === 'comments'
    ? 'comments'
    : 'created';
}
