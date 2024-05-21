'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Text } from '@mantine/core';
import FilmCard from '@/components/FilmCard/FilmCard';
import { DetailedMovie } from '@/types';
import { getMoviesFromLocalStorage } from '@/utils/local-storage-handlers';

const RatedMoviesPage: React.FC = () => {
  const [ratedMovies, setRatedMovies] = useState<DetailedMovie[]>([]);

  const fetchRatedMovies = async (): Promise<void> => {
    const storedRatedMovies = getMoviesFromLocalStorage();
    const movieIds = Object.keys(storedRatedMovies);
    const movies = await Promise.all(
      movieIds.map(async id => {
        const res = await fetch(`/api/movie?movie_id=${id}`);
        return res.json();
      })
    );
    setRatedMovies(movies);
  };

  useEffect(() => {
    fetchRatedMovies();
  }, []);

  const handleRemoveRating = (movieId: number): void => {
    setRatedMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
  };

  return (
    <Container>
      <Text mb="20">Rated Movies</Text>
      <Grid>
        {ratedMovies.map((movie, index) => (
          <Grid.Col span={6} key={index}>
            <FilmCard
              movie={movie}
              genres={movie.genres.map(genre => genre.name)}
              onRemoveRating={handleRemoveRating}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default RatedMoviesPage;
