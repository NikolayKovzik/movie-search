import { StoredRatedMovies } from '@/types';

const tmdbUserRatings = process.env.STORAGE_NAME || 'tmdb_user_ratings';

export function saveMovieToLocalStorage(movieId: number, userRating: number): void {
  const ratedMovies = JSON.parse(localStorage.getItem(tmdbUserRatings) || '{}');
  ratedMovies[movieId] = userRating;
  localStorage.setItem(tmdbUserRatings, JSON.stringify(ratedMovies));
}

export function removeMovieFromLocalStorage(movieId: number): void {
  const ratedMovies = JSON.parse(localStorage.getItem(tmdbUserRatings) || '{}');
  delete ratedMovies[movieId];
  localStorage.setItem(tmdbUserRatings, JSON.stringify(ratedMovies));
}

export function getMoviesFromLocalStorage(): StoredRatedMovies {
  return JSON.parse(localStorage.getItem(tmdbUserRatings) || '{}');
}
