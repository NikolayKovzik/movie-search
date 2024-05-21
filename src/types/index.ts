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

export type DetailedMovie = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: Collection;
  budget: number;
  genres: Genres;
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Language[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  videos: { results: Video[] };
  vote_average: number;
  vote_count: number;
};

export type ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type Language = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

type Video = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
};

type Collection = {
  backdrop_path: string;
  id: number;
  name: string;
  poster_path: string;
};

export type Genres = { id: number; name: string }[];

type ExtractArrType<Arr> = Arr extends (infer G)[] ? G : never;

export type Genre = ExtractArrType<Genres>;

export type GenresMapByName = {
  [key: string]: number;
};

export type GenresMapById = {
  [key: number]: string;
};

export type GenreMaps = {
  mapByName: GenresMapByName;
  mapById: GenresMapById;
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

export type StoredMovieRating = {
  [key: string]: number;
};
