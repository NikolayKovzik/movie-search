import { ComboboxItem } from '@mantine/core';
import { sortingPatternsMap } from './constants';
import { GenresMapById, SortingPattern } from '@/types';
import {
  ValidateGenreIDs,
  ValidatePageNumber,
  ValidateReleaseYear,
  ValidateSortingPattern,
  ValidateVoteAverageValue,
} from './url-query-params-validation';
//! try generics

export const calcInitialGenresValue = (
  urlParamValue: string | null,
  genresMapById: GenresMapById | null,
  validateValue: ValidateGenreIDs
): string[] => {
  if (urlParamValue && genresMapById && validateValue(urlParamValue)) {
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

export const calcInitialReleaseYearValue = (
  urlParamValue: string | null,
  validateValue: ValidateReleaseYear
): ComboboxItem | null => {
  if (urlParamValue && validateValue(parseInt(urlParamValue))) {
    return {
      value: urlParamValue,
      label: urlParamValue,
    };
  }
  return null;
};

export const calcInitialMinRatingValue = (
  urlParamValue: string | null,
  validateValue: ValidateVoteAverageValue
): ComboboxItem | null => {
  if (urlParamValue && validateValue(parseInt(urlParamValue))) {
    return {
      value: urlParamValue,
      label: urlParamValue,
    };
  }
  return null;
};

export const calcInitialMaxRatingValue = (
  urlParamValue: string | null,
  validateValue: ValidateVoteAverageValue
): ComboboxItem | null => {
  if (urlParamValue && validateValue(parseInt(urlParamValue))) {
    return {
      value: urlParamValue,
      label: urlParamValue,
    };
  }
  return null;
};

//! split the function so that only one of the parameters is discarded in case of an incorrect value
export const calcInitialSortingPatternValue = (
  urlParamValue: string | null,
  validateValue: ValidateSortingPattern
): ComboboxItem | null => {
  if (urlParamValue && validateValue(urlParamValue)) {
    return {
      value: urlParamValue,
      label: sortingPatternsMap[urlParamValue as SortingPattern],
    };
  }
  return null;
};

export const calcCurrentPageValue = (value: string, validateValue: ValidatePageNumber): number => {
  const parsedValue = parseInt(value);
  return validateValue(parsedValue) ? parsedValue : 1;
};
