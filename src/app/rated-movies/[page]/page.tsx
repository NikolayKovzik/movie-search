'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Grid, Pagination, Text } from '@mantine/core';
import FilmCard from '@/components/FilmCard/FilmCard';
import { DetailedMovie, StoredRatedMovies } from '@/types';
import { getMoviesFromLocalStorage } from '@/utils/local-storage-handlers';
import { ITEMS_PER_PAGE } from '@/utils/constants';

const RatedMoviesPage: React.FC<{ params: { page: string } }> = ({ params }) => {
  const router = useRouter();
  const pageFromUrl = parseInt(params.page) || 1;
  //! Otherwise, redirect to notfound.

  const [ratedMovies, setRatedMovies] = useState<DetailedMovie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(pageFromUrl);

  const fetchRatedMovies = async (): Promise<void> => {
    const storedRatedMovies: StoredRatedMovies = getMoviesFromLocalStorage();
    const movieIds = Object.keys(storedRatedMovies);
    const movies = await Promise.all(
      movieIds.map(async id => {
        const res = await fetch(`/api/movie?movie_id=${id}`);
        return res.json();
      })
    );

    setRatedMovies(movies);
    setTotalPages(Math.ceil(movies.length / ITEMS_PER_PAGE));
  };

  useEffect(() => {
    fetchRatedMovies();
  }, []);

  useEffect(() => {
    if (activePage !== pageFromUrl) {
      router.push(`/rated-movies/${activePage}`);
    }
  }, [activePage]);

  const calcDisplayedMovies = (): DetailedMovie[] => {
    return ratedMovies.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);
  };

  const removeMovieFromRated = (movieId: number): void => {
    const updatedMovies = ratedMovies.filter(movie => movie.id !== movieId);
    const newTotalPages = Math.ceil(updatedMovies.length / ITEMS_PER_PAGE);

    setRatedMovies(updatedMovies);
    setTotalPages(newTotalPages);

    if ((activePage - 1) * ITEMS_PER_PAGE >= updatedMovies.length && activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const changePage = (page: number): void => {
    setActivePage(page);
  };

  const displayedMovies = useMemo(calcDisplayedMovies, [ratedMovies, activePage]);

  return (
    <>
      <Container>
        <Text mb="20">Rated Movies</Text>
        <Grid>
          {displayedMovies.map((movie, index) => (
            <Grid.Col span={6} key={index}>
              <FilmCard
                movie={movie}
                genres={movie.genres.map(genre => genre.name)}
                onRemoveRating={removeMovieFromRated}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      <Pagination total={totalPages} value={activePage} onChange={changePage} mt="20" />
    </>
  );
};

export default RatedMoviesPage;
