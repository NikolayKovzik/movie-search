import { StoredRatedMovies } from '@/types';
import { RATED_MOVIES_STORAGE_KEY } from './constants';

export function saveMovieToLocalStorage(movieId: number, userRating: number): void {
  const ratedMovies = JSON.parse(localStorage.getItem(RATED_MOVIES_STORAGE_KEY) || '{}');
  ratedMovies[movieId] = userRating;
  localStorage.setItem(RATED_MOVIES_STORAGE_KEY, JSON.stringify(ratedMovies));
}

export function removeMovieFromLocalStorage(movieId: number): void {
  const ratedMovies = JSON.parse(localStorage.getItem(RATED_MOVIES_STORAGE_KEY) || '{}');
  delete ratedMovies[movieId];
  localStorage.setItem(RATED_MOVIES_STORAGE_KEY, JSON.stringify(ratedMovies));
}

export function getMoviesFromLocalStorage(): StoredRatedMovies {
  return JSON.parse(localStorage.getItem(RATED_MOVIES_STORAGE_KEY) || '{}');
}
