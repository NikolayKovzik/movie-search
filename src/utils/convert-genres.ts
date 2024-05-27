import { GenresMapByName } from '@/types';

export function convertGenresToQueryParam(
  gneres: string[],
  genresMapByName: GenresMapByName
): string {
  return gneres
    .reduce<number[]>((acc, genreName) => {
      const genreId = genresMapByName[genreName];
      if (genreId) {
        acc.push(genreId);
      }
      return acc;
    }, [])
    .join('|');
}
