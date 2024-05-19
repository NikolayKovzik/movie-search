import { Genre, GenreMaps, Genres } from '@/types';

export function createGenreMaps(genres: Genres): GenreMaps {
  return genres.reduce(
    (acc: GenreMaps, genre: Genre) => {
      acc.mapByName[genre.name] = genre.id;
      acc.mapById[genre.id] = genre.name;
      return acc;
    },
    { mapByName: {}, mapById: {} }
  );
}
