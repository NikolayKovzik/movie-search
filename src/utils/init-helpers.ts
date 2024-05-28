import { ComboboxItem } from '@mantine/core';
import { sortingPatternsMap } from './constants';
import { GenresMapById, SortingPattern } from '@/types';
import {
  validateGenreIDs,
  validateReleaseYear,
  validateVoteAverageValue,
  validateSortingPattern,
  validatePageNumber,
} from '@/utils/url-query-params-validation';
//! try generics

export const calcInitialGenresValue = (
  urlParamValue: string | null,
  genresMapById: GenresMapById | null
): string[] => {
  if (urlParamValue && genresMapById && validateGenreIDs(urlParamValue)) {
    const filteredUrlParamValue = urlParamValue.split('|').reduce<string[]>((acc, genreID) => {
      const genreName = genresMapById[+genreID];
      if (genreName) {
        acc.push(genreName);
      }
      return acc;
    }, []);
    return filteredUrlParamValue;
  }
  return [];
};

export const calcInitialReleaseYearValue = (urlParamValue: string | null): ComboboxItem | null => {
  if (urlParamValue && validateReleaseYear(parseInt(urlParamValue))) {
    return {
      value: urlParamValue,
      label: urlParamValue,
    };
  }
  return null;
};

export const calcInitialMinRatingValue = (urlParamValue: string | null): ComboboxItem | null => {
  if (urlParamValue && validateVoteAverageValue(parseInt(urlParamValue))) {
    return {
      value: urlParamValue,
      label: urlParamValue,
    };
  }
  return null;
};

export const calcInitialMaxRatingValue = (urlParamValue: string | null): ComboboxItem | null => {
  if (urlParamValue && validateVoteAverageValue(parseInt(urlParamValue))) {
    return {
      value: urlParamValue,
      label: urlParamValue,
    };
  }
  return null;
};

//! split the function so that only one of the parameters is discarded in case of an incorrect value
export const calcInitialSortingPatternValue = (
  urlParamValue: string | null
): ComboboxItem | null => {
  if (urlParamValue && validateSortingPattern(urlParamValue)) {
    return {
      value: urlParamValue,
      label: sortingPatternsMap[urlParamValue as SortingPattern],
    };
  }
  return null;
};

export const calcInitialPageValue = (value: string): number => {
  const parsedValue = parseInt(value);
  return validatePageNumber(parsedValue) ? parsedValue : 1;
};
