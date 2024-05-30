import { generateSortingOptions, generateNumericOptions } from './select-data-generators';

export const validSortingTypes = [
  'popularity',
  'original_title',
  'revenue',
  'primary_release_date',
  'vote_average',
  'vote_count',
] as const;

export const startYear = 1888;

export const currentYear = new Date().getFullYear();

export const sortingPatternsMap = {
  ['popularity.desc']: 'Most popular',
  ['popularity.asc']: 'Least popular',
  ['original_title.desc']: 'Alphabetical order',
  ['original_title.asc']: 'Reverse alphabetical order',
  ['revenue.desc']: 'Highest revenue',
  ['revenue.asc']: 'Lowest revenue',
  ['primary_release_date.desc']: 'Latest release date',
  ['primary_release_date.asc']: 'Earliest release date',
  ['vote_average.desc']: 'Highest average score',
  ['vote_average.asc']: 'Lowest average score',
  ['vote_count.desc']: 'Highest vote count',
  ['vote_count.asc']: 'Lowest vote count',
};

export const sortingOptions = generateSortingOptions(sortingPatternsMap);

export const yearOptions = generateNumericOptions(currentYear, startYear);

export const ratingOptions = generateNumericOptions(10, 0);

export const ITEMS_PER_PAGE = 4;
