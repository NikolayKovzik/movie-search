export type SortingType =
  | 'popularity'
  | 'original_title'
  | 'revenue'
  | 'primary_release_date'
  | 'vote_average'
  | 'vote_count';

export type SortingOrder = 'asc' | 'desc';

export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type Genres = { id: number; name: string }[];

type ExtractArrType<Arr> = Arr extends (infer G)[] ? G : never;

export type Genre = ExtractArrType<Genres>;

export type GenresMap = {
  [key: string]: number;
};

export type TMDBMoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type TMDBGenresResponse = {
  genres: Genres;
};

export type ErrorResponse = {
  error: string;
};
