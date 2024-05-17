'use client';

import { useEffect, useMemo, useState } from 'react';
import { Container, Grid, Button, Select, ComboboxItem, MultiSelect } from '@mantine/core';
import FilmCard from '@/components/FilmCard/FilmCard';
import { currentYear, ratings, sortingPatterns, startYear } from '@/utils/constants';
import { generateDataRange } from '@/utils/generate-range';
import { GenresMap, Genre, Genres, Movie, TMDBGenresResponse } from '@/types';

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genresMap, setGenresMap] = useState<GenresMap | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedReleaseYear, setSelectedReleaseYear] = useState<ComboboxItem | null>(null);
  const [selectedMinRating, setSelectedMinRating] = useState<ComboboxItem | null>(null);
  const [selectedMaxRating, setSelectedMaxRating] = useState<ComboboxItem | null>(null);
  const [selectedSortingPattern, setSelectedSortingPattern] = useState<ComboboxItem | null>(null);

  const fetchMovies = async (): Promise<void> => {
    if (!genresMap) {
      console.log('genres Map is empty!');
      return; //!
    }

    const genreQueryParam = selectedGenres.reduce((res, item) => {
      return !res ? `${genresMap[item]}` : `${res}|${genresMap[item]}`;
    }, '');

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
    const genresMap: GenresMap = genres.reduce((res: GenresMap, genre: Genre) => {
      return {
        ...res,
        [genre.name]: genre.id,
      };
    }, {});

    setGenresMap(genresMap);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const genreKeys = useMemo(() => (genresMap ? Object.keys(genresMap) : []), [genresMap]);

  return (
    <>
      <MultiSelect
        label="Genres"
        placeholder="Select genres"
        data={genresMap ? genreKeys : []}
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
          {movies.map((movie, index) => (
            <Grid.Col span={6} key={index}>
              <FilmCard movie={movie} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default MoviesPage;
