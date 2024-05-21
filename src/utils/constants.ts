export const validSortingTypes = [
  'popularity',
  'original_title',
  'revenue',
  'primary_release_date',
  'vote_average',
  'vote_count',
] as const;

export const startYear = 1880;

export const currentYear = new Date().getFullYear();

export const ratings = [
  //генератор из массива 1-10?
  { value: '10', label: '10' },
  { value: '9', label: '9' },
  { value: '8', label: '8' },
  { value: '7', label: '7' },
  { value: '6', label: '6' },
  { value: '5', label: '5' },
  { value: '4', label: '4' },
  { value: '3', label: '3' },
  { value: '2', label: '2' },
  { value: '1', label: '1' },
] as const;

export const sortingPatterns = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'popularity.asc', label: 'Least popular' },
  { value: 'original_title.desc', label: 'Alphabetical order' },
  { value: 'original_title.asc', label: 'Reverse alphabetical order' },
  { value: 'revenue.desc', label: 'Highest revenue' },
  { value: 'revenue.asc', label: 'Lowest revenue' },
  { value: 'primary_release_date.desc', label: 'Latest release date' },
  { value: 'primary_release_date.asc', label: 'Earliest release date' },
  { value: 'vote_average.desc', label: 'Highest average score' },
  { value: 'vote_average.asc', label: 'Lowest average score' },
  { value: 'vote_count.desc', label: 'Highest vote count' },
  { value: 'vote_count.asc', label: 'Lowest vote count' },
] as const;

export const defaultGenres = ['Action', 'Comedy', 'Thriller'];
export const defaultReleaseYear = { value: `${currentYear}`, label: `${currentYear}` };
export const defaultSortingPattern = { value: 'popularity.desc', label: 'Most popular' };
export const defaultMinRating = { value: '7', label: '7' };
export const defaultMaxRating = { value: '10', label: '10' };

export const RATED_MOVIES_STORAGE_KEY = 'tmdb_user_ratings';
