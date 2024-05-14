'use client'

import { Container, Grid, Button } from '@mantine/core';
import FilmCard from '../../components/FilmCard/FilmCard';
import { useState } from 'react';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const res = await fetch('/api/movies?sorting_order=desc&sorting_type=popularity&genres=28|12|16&release_year=2020&vote_average_gte=5&vote_average_lte=6&page=2', {
      headers: {
        accept: 'application/json',
      },
    });
    const films = await res.json();
    setMovies(films.results);
    console.log(films);
  };
  
  return (
    <>
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