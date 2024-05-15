'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Button, Select, ComboboxItem, MultiSelect } from '@mantine/core';
import FilmCard from '@/components/FilmCard/FilmCard';
import { currentYear, ratings, sortingPatterns, startYear } from '@/utils/constants';
import { generateDataRange } from '@/utils/generate-range';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState(null) as any; // нейминг
  const [genreValue, setGenreValue] = useState<string[]>([]); // нейминг
  const [releaseYearValue, setReleaseYearValue] = useState<ComboboxItem | null>(null);
  const [minRating, setMinRating] = useState<ComboboxItem | null>(null);
  const [maxRating, setMaxRating] = useState<ComboboxItem | null>(null);
  const [sortingPattern, setSortingPattern] = useState<ComboboxItem | null>(null);

  const fetchMovies = async () => {
    // нейминг
    const g = genreValue.reduce((res, item) => {
      return !res ? `${genres[item]}` : `${res}|${genres[item]}`;
    }, '');

    const url =
      `/api/movies?sort_by=${sortingPattern?.value}` +
      `&genres=${g}` +
      `&release_year=${releaseYearValue?.value}` +
      `&vote_average_gte=${minRating?.value}` +
      `&vote_average_lte=${maxRating?.value}` +
      '&page=1';

    console.log('CLIENT MOVIES LINK, :  ', url);
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
    });

    const films = await res.json();
    //если ошибка запроса (например рейтинг gte > lte), то сетается undefined, и происходит ошибка
    setMovies(films.results);
    console.log(films);
  };

  const fetchGenres = async () => {
    const res = await fetch('/api/genres', {
      headers: {
        accept: 'application/json',
      },
    });

    const genres = (await res.json()).genres;
    const formatedGenres = genres.reduce((res: any, genre: any) => {
      return {
        ...res,
        [genre.name]: genre.id,
      };
    }, {});

    console.log(formatedGenres);

    setGenres(formatedGenres);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <>
      <MultiSelect
        label="Genres"
        placeholder="Select genres"
        data={genres ? Object.keys(genres) : []}
        value={genreValue}
        onChange={setGenreValue}
      />
      <Select
        label="Release year"
        placeholder="Select release year"
        data={generateDataRange(currentYear, startYear)}
        value={releaseYearValue?.value || null}
        onChange={(_, option) => setReleaseYearValue(option)}
      />
      <Select
        label="Select Minimum Rating"
        placeholder="From"
        data={ratings}
        value={minRating?.value || null}
        onChange={(_, option) => setMinRating(option)}
      />
      <Select
        label="Select Maximum Rating"
        placeholder="To"
        data={ratings}
        value={maxRating?.value || null}
        onChange={(_, option) => setMaxRating(option)}
      />
      <Select
        label="Sort by"
        placeholder="REPLACE BY DEFAULT VALUE"
        data={sortingPatterns}
        value={sortingPattern?.value || null}
        onChange={(_, option) => setSortingPattern(option)}
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
