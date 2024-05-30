import React, { useState, useEffect } from 'react';
import { Card, Image, Text, Group, Rating, Stack, Button } from '@mantine/core';
import { DetailedMovie, Movie } from '@/types';

import {
  getMoviesFromLocalStorage,
  removeMovieFromLocalStorage,
  saveMovieToLocalStorage,
} from '@/utils/local-storage-handlers';
import Link from 'next/link';
import ModalWindow from '../ModalWindow/ModalWindow';

const FilmCard: React.FC<{
  movie: Movie | DetailedMovie;
  genres: string[];
  onRemoveRating?: (movieId: number) => void;
}> = ({ movie, genres, onRemoveRating }) => {
  const { poster_path, title, release_date, vote_average, vote_count } = movie;
  const [ratingModalOpened, setRatingModalOpened] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    const ratedMovies = getMoviesFromLocalStorage();
    setUserRating(ratedMovies[movie.id] || null);
  }, [movie.id]); //! ?

  const handleSaveRating = (): void => {
    if (userRating) {
      saveMovieToLocalStorage(movie.id, userRating);
      setRatingModalOpened(false);
    } else {
      //!
    }
  };

  const handleRemoveRating = (): void => {
    removeMovieFromLocalStorage(movie.id);
    setUserRating(null);
    setRatingModalOpened(false);
    if (onRemoveRating) {
      onRemoveRating(movie.id);
    }
  };

  return (
    <>
      <Card p="10" radius="10">
        <Group align="flex-start" style={{ marginBottom: 5 }}>
          <Image src={`/api/poster${poster_path}`} height={180} alt={title} />
          <Stack>
            <Link href={`/movies/${movie.id}`} passHref>
              <Text fw={500} size="lg" style={{ color: 'blue', cursor: 'pointer' }}>
                {title}
              </Text>
            </Link>
            <Text size="sm">{release_date}</Text>
            <Group>
              <Rating count={1} value={1} readOnly />
              <Text size="sm">({vote_average})</Text>
              <Text size="sm">({vote_count})</Text>
            </Group>
            <Text size="sm">Genres:</Text>
            <Group>
              {genres.map((genre: string) => (
                <Text size="sm" key={genre}>
                  ({genre})
                </Text>
              ))}
            </Group>
          </Stack>
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Text size="sm" mr="20">
              {userRating !== null ? userRating : ''}
            </Text>
            <Button onClick={(): void => setRatingModalOpened(true)}>X</Button>
          </div>
        </Group>
      </Card>
      <ModalWindow
        opened={ratingModalOpened}
        onClose={(): void => setRatingModalOpened(false)}
        userRating={userRating}
        setUserRating={setUserRating}
        handleSaveRating={handleSaveRating}
        handleRemoveRating={handleRemoveRating}
      />
    </>
  );
};

export default FilmCard;
