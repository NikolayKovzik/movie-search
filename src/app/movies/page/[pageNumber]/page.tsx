'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Grid, Select, ComboboxItem, MultiSelect, Pagination } from '@mantine/core';
import FilmCard from '@/components/FilmCard/FilmCard';
import {
  currentYear,
  defaultGenres,
  defaultMaxRating,
  defaultMinRating,
  defaultReleaseYear,
  defaultSortingPattern,
  ratings,
  sortingPatterns,
  startYear,
} from '@/utils/constants';
import { generateDataRange } from '@/utils/generate-range';
import {
  GenresMapByName,
  Genres,
  Movie,
  TMDBGenresResponse,
  GenresMapById,
  GenreMaps,
  TMDBMoviesResponse,
} from '@/types';
import { convertGenresToQueryParam } from '@/utils/convert-genres';
import { createGenreMaps } from '@/utils/create-genre-maps';

const MoviesPage: React.FC<{ params: { pageNumber: string } }> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlGenres = searchParams.get('genres')?.split(',');
  const urlReleaseYear = searchParams.get('release_year');
  const urlMinRating = searchParams.get('min_rating');
  const urlMaxRating = searchParams.get('max_rating');
  const urlSortingPattern = searchParams.get('sorting_pattern');

  const initialGenres = urlGenres && urlGenres.length ? urlGenres : defaultGenres;
  const initialReleaseYear = urlReleaseYear
    ? {
        value: urlReleaseYear,
        label: urlReleaseYear,
      }
    : defaultReleaseYear;
  const initialMinRating = urlMinRating
    ? {
        value: urlMinRating,
        label: urlMinRating,
      }
    : defaultMinRating;
  const initialMaxRating = urlMaxRating
    ? {
        value: urlMaxRating,
        label: urlMaxRating,
      }
    : defaultMaxRating;
  const initialSortingPattern = urlSortingPattern
    ? {
        value: urlSortingPattern,
        label: sortingPatterns.find(item => item.value === urlSortingPattern)?.label as string, //!
      }
    : defaultSortingPattern;

  const currentPage = parseInt(params.pageNumber) || 1;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(currentPage);
  const [genresMapByName, setGenresMapByName] = useState<GenresMapByName | null>(null); //! Bidirectional?
  const [genresMapById, setGenresMapById] = useState<GenresMapById | null>(null);

  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenres);
  const [selectedReleaseYear, setSelectedReleaseYear] = useState<ComboboxItem>(initialReleaseYear);
  const [selectedMinRating, setSelectedMinRating] = useState<ComboboxItem>(initialMinRating);
  const [selectedMaxRating, setSelectedMaxRating] = useState<ComboboxItem>(initialMaxRating);
  const [selectedSortingPattern, setSelectedSortingPattern] =
    useState<ComboboxItem>(initialSortingPattern);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    router.replace(
      `/movies/page/${currentPage}` +
        `?genres=${selectedGenres.join(',')}` +
        `&release_year=${selectedReleaseYear.value}` +
        `&min_rating=${selectedMinRating.value}` +
        `&max_rating=${selectedMaxRating.value}` +
        `&sorting_pattern=${selectedSortingPattern.value}`
    );
  }, [
    selectedGenres,
    selectedMaxRating.value,
    selectedMinRating.value,
    selectedReleaseYear.value,
    selectedSortingPattern.value,
  ]);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, genresMapByName]);

  const fetchMovies = async (pageNumber: number): Promise<void> => {
    if (!genresMapByName) {
      console.log('genres Map is empty!');
      return; //!
    }

    const genreQueryParam = convertGenresToQueryParam(selectedGenres, genresMapByName);

    const url =
      `/api/movies?sort_by=${selectedSortingPattern.value}` +
      `&genres=${genreQueryParam}` +
      `&release_year=${selectedReleaseYear.value}` +
      `&vote_average_gte=${selectedMinRating.value}` +
      `&vote_average_lte=${selectedMaxRating.value}` +
      `&page=${pageNumber}`;

    console.log('CLIENT MOVIES LINK, :  ', url);
    const res = await fetch(url);

    const films: TMDBMoviesResponse = await res.json();
    //! если ошибка запроса (например рейтинг gte > lte), то сетается undefined, и происходит ошибка
    setMovies(films.results);
    setTotalPages(films.total_pages);
    setActivePage(films.page);
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

  const genreKeys = useMemo(
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

  const handlePageChange = (page: number): void => {
    const url =
      `/movies/page/${page}` +
      `?genres=${selectedGenres.join(',')}` +
      `&release_year=${selectedReleaseYear.value}` +
      `&min_rating=${selectedMinRating.value}` +
      `&max_rating=${selectedMaxRating.value}` +
      `&sorting_pattern=${selectedSortingPattern.value}`;
    router.push(url);
  };

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
        value={selectedReleaseYear.value}
        onChange={(_, option): void => setSelectedReleaseYear(option)}
      />
      <Select
        label="Select Minimum Rating"
        placeholder="From"
        data={ratings}
        value={selectedMinRating.value}
        onChange={(_, option): void => setSelectedMinRating(option)}
      />
      <Select
        label="Select Maximum Rating"
        placeholder="To"
        data={ratings}
        value={selectedMaxRating.value}
        onChange={(_, option): void => setSelectedMaxRating(option)}
      />
      <Select
        label="Sort by"
        placeholder="REPLACE BY DEFAULT VALUE"
        data={sortingPatterns}
        value={selectedSortingPattern.value}
        onChange={(_, option): void => setSelectedSortingPattern(option)}
      />
      <Container>
        <Grid>
          {mappedMovies.map((movie, index) => (
            <Grid.Col span={6} key={index}>
              <FilmCard movie={movie} genres={movie.genreNames} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      <Pagination total={totalPages} value={activePage} onChange={handlePageChange} mt="sm" />
    </>
  );
};

export default MoviesPage;
