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
import { currentYear, ratings, sortingPatterns, startYear } from '@/utils/constants';
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
import FilmCard from '@/components/FilmCard/FilmCard';

const MoviesPage: React.FC<{ params: { pageNumber: string } }> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlGenres = searchParams.get('with_genres')?.split(',');
  const urlReleaseYear = searchParams.get('primary_release_year');
  const urlMinRating = searchParams.get('vote_average.gte');
  const urlMaxRating = searchParams.get('vote_average.lte');
  const urlSortingPattern = searchParams.get('sort_by');

  const initialGenres = urlGenres && urlGenres.length ? urlGenres : undefined;
  const initialReleaseYear = urlReleaseYear
    ? {
        value: urlReleaseYear,
        label: urlReleaseYear,
      }
    : null;
  const initialMinRating = urlMinRating
    ? {
        value: urlMinRating,
        label: urlMinRating,
      }
    : null;
  const initialMaxRating = urlMaxRating
    ? {
        value: urlMaxRating,
        label: urlMaxRating,
      }
    : null;
  const initialSortingPattern = urlSortingPattern
    ? {
        value: urlSortingPattern,
        label: sortingPatterns.find(item => item.value === urlSortingPattern)?.label as string, //!
      }
    : null;

  const currentPage = parseInt(params.pageNumber) || 1;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(currentPage);
  const [genresMapByName, setGenresMapByName] = useState<GenresMapByName | null>(null); //! Bidirectional?
  const [genresMapById, setGenresMapById] = useState<GenresMapById | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[] | undefined>(initialGenres);
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
    fetchGenres();
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      let url = `/movies/page/${currentPage}?`;
      if (selectedGenres && selectedGenres.length) {
        url += `&with_genres=${selectedGenres.join(',')}`;
      }
      if (selectedReleaseYear) {
        url += `&primary_release_year=${selectedReleaseYear.value}`;
      }
      if (selectedMinRating) {
        url += `&vote_average.gte=${selectedMinRating.value}`;
      }
      if (selectedMaxRating) {
        url += `&vote_average.lte=${selectedMaxRating.value}`;
      }
      if (selectedSortingPattern) {
        url += `&sort_by=${selectedSortingPattern.value}`;
      }

      fetchMovies(1);
      router.replace(url);
    }
  }, [
    selectedGenres,
    selectedMaxRating,
    selectedMinRating,
    selectedReleaseYear,
    selectedSortingPattern,
  ]);

  useEffect(() => {
    console.log('FETCH MOVIES');
    fetchMovies(currentPage);
  }, [currentPage, genresMapByName]);

  const fetchMovies = async (pageNumber: number): Promise<void> => {
    if (!genresMapByName) {
      console.log('genres Map is empty!');
      return; //!
    }

    const genreQueryParam = selectedGenres
      ? convertGenresToQueryParam(selectedGenres, genresMapByName)
      : [];

    let url = `/api/movies?page=${pageNumber}`;

    if (selectedGenres && selectedGenres.length) {
      url += `&with_genres=${genreQueryParam}`;
    }
    if (selectedReleaseYear) {
      url += `&primary_release_year=${selectedReleaseYear.value}`;
    }
    if (selectedMinRating) {
      url += `&vote_average.gte=${selectedMinRating.value}`;
    }
    if (selectedMaxRating) {
      url += `&vote_average.lte=${selectedMaxRating.value}`;
    }
    if (selectedSortingPattern) {
      url += `&sort_by=${selectedSortingPattern.value}`;
    }

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

  const changePage = (page: number): void => {
    let url = `/movies/page/${page}?language=en-US`;
    if (selectedGenres && selectedGenres.length) {
      url += `&with_genres=${selectedGenres.join(',')}`;
    }
    if (selectedReleaseYear) {
      url += `&primary_release_year=${selectedReleaseYear.value}`;
    }
    if (selectedMinRating) {
      url += `&vote_average.gte=${selectedMinRating.value}`;
    }
    if (selectedMaxRating) {
      url += `&vote_average.lte=${selectedMaxRating.value}`;
    }
    if (selectedSortingPattern) {
      url += `&sort_by=${selectedSortingPattern.value}`;
    }
    fetchMovies(1);
    router.replace(url);
    //router.push(1)
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
