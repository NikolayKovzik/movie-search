'use client';

import { DetailedMovie, Genre, ProductionCompany } from '@/types';
import { Container, Divider, Group, Text, Title, Image, Rating } from '@mantine/core';
import { useEffect, useState } from 'react';

const MoviePage: React.FC<{
  params: { movieId: string };
}> = ({ params }) => {
  const [movie, setMovie] = useState<DetailedMovie | null>(null);

  const fetchMovie = async (): Promise<void> => {
    const res = await fetch(`/api/movie?movie_id=${params.movieId}`);

    const film: DetailedMovie = await res.json();
    setMovie(film);
    console.log(film);
  };

  useEffect(() => {
    fetchMovie();
  }, []);

  return !movie ? (
    <Text>LOADING....</Text>
  ) : (
    <Container>
      <Group align="center" mb="20">
        <Image src={`/api/poster${movie.poster_path}`} alt={movie.title} width={250} height={352} />
        <div>
          <Title order={1}>{movie.title}</Title>
          <Text>{new Date(movie.release_date).getFullYear()}</Text>
          <Group>
            <Rating count={1} value={1} readOnly />
            <Text size="xs">({movie.vote_average})</Text>
            <Text size="xs">({movie.vote_count})</Text>
          </Group>
          <Text mt="20">Duration: {movie.runtime} mins</Text>
          <Text>Premiere: {new Date(movie.release_date).toLocaleDateString()}</Text>
          <Text>Budget: ${movie.budget /*!! if 0 -- NO INFO*/}</Text>
          <Text>Gross worldwide: ${movie.revenue}</Text>
          <Text>Genres: {movie.genres.map((genre: Genre) => genre.name).join(', ')}</Text>
        </div>
      </Group>

      <Divider mt="20" mb="20" />

      <Title order={3}>Trailer</Title>
      <iframe
        width="500px"
        height="281"
        src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
        title="youtube"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <Title order={3}>Description</Title>
      <Text>{movie.overview}</Text>

      <Divider mt="20" mb="20" />

      <Title order={3}>Production</Title>
      <Group>
        {movie.production_companies.map((company: ProductionCompany) => (
          <Group key={company.id}>
            {company.logo_path && (
              <Image
                src={`/api/poster${company.logo_path}`}
                alt={company.name}
                width={40}
                height={40}
              />
            )}
            <Text>{company.name}</Text>
          </Group>
        ))}
      </Group>
    </Container>
  );
};

export default MoviePage;
