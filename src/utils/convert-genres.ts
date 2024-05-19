import { GenresMapByName } from '@/types';

export function convertGenresToQueryParam(
  selectedGenres: string[],
  genresMapByName: GenresMapByName
): string {
  return selectedGenres
    .reduce((acc, genreName) => {
      const genreId = genresMapByName[genreName];
      if (genreId) {
        acc.push(genreId);
      }
      return acc;
    }, [] as number[])
    .join('|');
}
