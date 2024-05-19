'use client';

import { useEffect, useMemo, useState } from 'react';
import { Container, Grid, Button, Select, ComboboxItem, MultiSelect } from '@mantine/core';
import FilmCard from '@/components/FilmCard/FilmCard';
import { currentYear, ratings, sortingPatterns, startYear } from '@/utils/constants';
import { generateDataRange } from '@/utils/generate-range';
import {
  GenresMapByName,
  Genres,
  Movie,
  TMDBGenresResponse,
  GenresMapById,
  GenreMaps,
} from '@/types';
import { convertGenresToQueryParam } from '@/utils/convert-genres';
import { createGenreMaps } from '@/utils/create-genre-maps';

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genresMapByName, setGenresMapByName] = useState<GenresMapByName | null>(null);
  const [genresMapById, setGenresMapById] = useState<GenresMapById | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedReleaseYear, setSelectedReleaseYear] = useState<ComboboxItem | null>(null);
  const [selectedMinRating, setSelectedMinRating] = useState<ComboboxItem | null>(null);
  const [selectedMaxRating, setSelectedMaxRating] = useState<ComboboxItem | null>(null);
  const [selectedSortingPattern, setSelectedSortingPattern] = useState<ComboboxItem | null>(null);

  const fetchMovies = async (): Promise<void> => {
    if (!genresMapByName) {
      console.log('genres Map is empty!');
      return; //!
    }

    const genreQueryParam = convertGenresToQueryParam(selectedGenres, genresMapByName);

    const url =
      `/api/movies?sort_by=${selectedSortingPattern?.value}` +
      `&genres=${genreQueryParam}` +
      `&release_year=${selectedReleaseYear?.value}` +
      `&vote_average_gte=${selectedMinRating?.value}` +
      `&vote_average_lte=${selectedMaxRating?.value}` +
      '&page=1';

    console.log('CLIENT MOVIES LINK, :  ', url);
    const res = await fetch(url);

    const films = await res.json();
    //если ошибка запроса (например рейтинг gte > lte), то сетается undefined, и происходит ошибка
    setMovies(films.results);
    console.log(films);
  };

  const fetchGenres = async (): Promise<void> => {
    const res = await fetch('/api/genres');

    const tmdbGenresResponse: TMDBGenresResponse = await res.json();
    const genres: Genres = tmdbGenresResponse.genres;

    const { mapByName, mapById }: GenreMaps = createGenreMaps(genres);

    setGenresMapByName(mapByName);
    setGenresMapById(mapById);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const genreKeys = useMemo(
    () => (genresMapByName ? Object.keys(genresMapByName) : []),
    [genresMapByName]
  );

  const mappedMovies = useMemo(() => {
    return movies.map(movie => ({
      ...movie,
      genreNames: movie.genre_ids.map(id => genresMapById?.[id] || ''),
    }));
  }, [movies, genresMapById]);

  return (
    <>
      <MultiSelect
        label="Genres"
        placeholder="Select genres"
        data={genresMapByName ? genreKeys : []}
        value={selectedGenres}
        onChange={setSelectedGenres}
      />
      <Select
        label="Release year"
        placeholder="Select release year"
        data={generateDataRange(currentYear, startYear)}
        value={selectedReleaseYear?.value}
        onChange={(_, option): void => setSelectedReleaseYear(option)}
      />
      <Select
        label="Select Minimum Rating"
        placeholder="From"
        data={ratings}
        value={selectedMinRating?.value}
        onChange={(_, option): void => setSelectedMinRating(option)}
      />
      <Select
        label="Select Maximum Rating"
        placeholder="To"
        data={ratings}
        value={selectedMaxRating?.value}
        onChange={(_, option): void => setSelectedMaxRating(option)}
      />
      <Select
        label="Sort by"
        placeholder="REPLACE BY DEFAULT VALUE"
        data={sortingPatterns}
        value={selectedSortingPattern?.value}
        onChange={(_, option): void => setSelectedSortingPattern(option)}
      />
      <Button onClick={fetchMovies}>CLICK</Button>
      <Container>
        <Grid>
          {mappedMovies.map((movie, index) => (
            <Grid.Col span={6} key={index}>
              <FilmCard movie={movie} genres={movie.genreNames} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default MoviesPage;
