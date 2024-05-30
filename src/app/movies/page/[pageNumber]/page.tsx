'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Select,
  ComboboxItem,
  MultiSelect,
  Pagination,
  Button,
  Grid,
} from '@mantine/core';
import { ratingOptions, sortingOptions, yearOptions } from '@/utils/constants';
import {
  GenresMapByName,
  Genres,
  Movie,
  TMDBGenresResponse,
  GenresMapById,
  GenreMaps,
  TMDBMoviesResponse,
} from '@/types';
import { createGenreMaps } from '@/utils/create-genre-maps';
import FilmCard from '@/components/FilmCard/FilmCard';
import {
  calcInitialPageValue,
  calcInitialGenresValue,
  calcInitialMaxRatingValue,
  calcInitialMinRatingValue,
  calcInitialReleaseYearValue,
  calcInitialSortingPatternValue,
} from '@/utils/init-helpers';
import { buildURL } from '@/utils/build-url';

const MoviesPage: React.FC<{ params: { pageNumber: string } }> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlGenresValue = searchParams.get('with_genres');
  const urlReleaseYearValue = searchParams.get('primary_release_year');
  const urlMinRatingValue = searchParams.get('vote_average.gte');
  const urlMaxRatingValue = searchParams.get('vote_average.lte');
  const urlSortingPatternValue = searchParams.get('sort_by');

  const initialGenres: string[] = [];
  const initialReleaseYear = calcInitialReleaseYearValue(urlReleaseYearValue);
  const initialMinRating = calcInitialMinRatingValue(urlMinRatingValue);
  const initialMaxRating = calcInitialMaxRatingValue(urlMaxRatingValue);
  const initialSortingPattern = calcInitialSortingPatternValue(urlSortingPatternValue);
  const initialPage = calcInitialPageValue(params.pageNumber);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(initialPage);
  const [genresMapByName, setGenresMapByName] = useState<GenresMapByName | null>(null); //! Bidirectional?
  const [genresMapById, setGenresMapById] = useState<GenresMapById | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenres);
  const [selectedReleaseYear, setSelectedReleaseYear] = useState<ComboboxItem | null>(
    initialReleaseYear
  );
  const [selectedMinRating, setSelectedMinRating] = useState<ComboboxItem | null>(initialMinRating);
  const [selectedMaxRating, setSelectedMaxRating] = useState<ComboboxItem | null>(initialMaxRating);
  const [selectedSortingPattern, setSelectedSortingPattern] = useState<ComboboxItem | null>(
    initialSortingPattern
  );

  const initialRender = useRef(true); //! any better way?

  useEffect(() => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!page remount!!!!!!!!!!!!!!!!!!!!!!!!!');
    fetchGenres();
  }, []);

  useEffect(() => {
    console.log(`genresMapById changed: ${genresMapById}; initialRender ${initialRender.current}`);
    if (!initialRender.current) {
      const initialGenresValue = calcInitialGenresValue(urlGenresValue, genresMapById);

      setSelectedGenres(initialGenresValue);
    }
  }, [genresMapById]);

  useEffect(() => {
    console.log(
      `USE EFFECT FOR FILTERS(1)  activePage: ${activePage}   selectedGenres: ${selectedGenres}`
    );

    if (initialRender.current) {
      initialRender.current = false;
    } else {
      console.log('USE EFFECT FOR FILTERS (2)');
      const baseURL = `/movies/page/${activePage}?language=en-US`;
      const finalURL = buildURL(
        baseURL,
        selectedGenres,
        selectedReleaseYear,
        selectedMinRating,
        selectedMaxRating,
        selectedSortingPattern,
        genresMapByName
      );
      router.replace(finalURL);
      fetchMovies(activePage);
    }
  }, [
    selectedGenres,
    selectedMaxRating,
    selectedMinRating,
    selectedReleaseYear,
    selectedSortingPattern,
  ]);

  useEffect(() => {
    if (!initialRender.current) {
      const baseURL = `/movies/page/${activePage}?language=en-US`;
      const finalURL = buildURL(
        baseURL,
        selectedGenres,
        selectedReleaseYear,
        selectedMinRating,
        selectedMaxRating,
        selectedSortingPattern,
        genresMapByName
      );
      router.replace(finalURL);
    }
  }, [activePage]);

  const fetchMovies = async (pageNumber: number): Promise<void> => {
    if (!genresMapByName) {
      console.log('genres Map is empty!');
      return; //!
    }

    const baseURL = `/api/movies?page=${pageNumber}`;
    const finalURL = buildURL(
      baseURL,
      selectedGenres,
      selectedReleaseYear,
      selectedMinRating,
      selectedMaxRating,
      selectedSortingPattern,
      genresMapByName
    );

    const res = await fetch(finalURL);

    const films: TMDBMoviesResponse = await res.json();
    //! если ошибка запроса (например рейтинг gte > lte), то сетается undefined, и происходит ошибка
    setMovies(films.results);
    setTotalPages(films.total_pages);
    setActivePage(films.page);
    console.log('RESULT OF FETCH', films);
  };

  const fetchGenres = async (): Promise<void> => {
    const res = await fetch('/api/genres');
    const tmdbGenresResponse: TMDBGenresResponse = await res.json();
    const genres: Genres = tmdbGenresResponse.genres;
    const { mapByName, mapById }: GenreMaps = createGenreMaps(genres);
    setGenresMapByName(mapByName);
    setGenresMapById(mapById);
  };

  const genreOptions = useMemo(
    () => (genresMapByName ? Object.keys(genresMapByName) : []),
    [genresMapByName]
  );

  const mappedMovies = useMemo(() => {
    if (!movies) return [];

    return movies.map(movie => ({
      ...movie,
      genreNames: movie.genre_ids.map(id => genresMapById?.[id] || ''),
    }));
  }, [movies, genresMapById]);

  const changePage = (page: number): void => {
    //router.push(finalURL)
    setActivePage(page);
  };

  const resetFilters = (): void => {
    setSelectedGenres([]);
    setSelectedReleaseYear(null);
    setSelectedMinRating(null);
    setSelectedMaxRating(null);
    setSelectedSortingPattern(null);
    changePage(1);
  };

  return (
    <>
      <Container>
        <MultiSelect
          label="Genres"
          placeholder="Select genres"
          data={genresMapByName ? genreOptions : []}
          value={selectedGenres}
          onChange={setSelectedGenres}
        />
        <Select
          label="Release year"
          placeholder="Select release year"
          data={yearOptions}
          value={selectedReleaseYear?.value}
          onChange={(_, option): void => setSelectedReleaseYear(option)}
        />
        <Select
          label="Select Minimum Rating"
          placeholder="From"
          data={ratingOptions}
          value={selectedMinRating?.value}
          onChange={(_, option): void => setSelectedMinRating(option)}
        />
        <Select
          label="Select Maximum Rating"
          placeholder="To"
          data={ratingOptions}
          value={selectedMaxRating?.value}
          onChange={(_, option): void => setSelectedMaxRating(option)}
        />
        <Select
          label="Sort by"
          placeholder="REPLACE BY DEFAULT VALUE"
          data={sortingOptions}
          value={selectedSortingPattern?.value}
          onChange={(_, option): void => setSelectedSortingPattern(option)}
        />
        <Button onClick={resetFilters} mt="sm">
          RESET FILTERS
        </Button>
        <Container>
          <Grid>
            {mappedMovies.map((movie, index) => (
              <Grid.Col span={6} key={index}>
                <FilmCard movie={movie} genres={movie.genreNames} />
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Container>
      <Pagination total={totalPages} value={activePage} onChange={changePage} mt="sm" />
    </>
  );
};

export default MoviesPage;
