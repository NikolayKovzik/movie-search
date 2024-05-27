import { GenresMapByName } from '@/types';
import { ComboboxItem } from '@mantine/core';
import { convertGenresToQueryParam } from './convert-genres';

export function buildURL(
  baseURL: string,
  genres: string[],
  releaseYear: ComboboxItem | null,
  minRating: ComboboxItem | null,
  maxRating: ComboboxItem | null,
  sortingPattern: ComboboxItem | null,
  genresMapByName: GenresMapByName | null
): string {
  let resultingURL = baseURL;
  if (genres && genres.length && genresMapByName) {
    const genreQueryParam = convertGenresToQueryParam(genres, genresMapByName);
    resultingURL += `&with_genres=${genreQueryParam}`;
  }
  if (releaseYear) {
    resultingURL += `&primary_release_year=${releaseYear.value}`;
  }
  if (minRating) {
    resultingURL += `&vote_average.gte=${minRating.value}`;
  }
  if (maxRating) {
    resultingURL += `&vote_average.lte=${maxRating.value}`;
  }
  if (sortingPattern) {
    resultingURL += `&sort_by=${sortingPattern.value}`;
  }
  return resultingURL;
}
