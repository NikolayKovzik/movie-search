// components/FilmCard.js
import React from 'react';
import { Card, Image, Text, Group, Rating, Stack, useMantineTheme } from '@mantine/core';

const FilmCard = ({ movie }: { movie: any }) => {
  const theme = useMantineTheme();
  const { poster_path, title, release_date, vote_average, vote_count, genre_ids } = movie;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group align="flex-start" style={{ marginBottom: 5 }}>
        <Image src={`/api/poster${poster_path}`} height={180} alt={title} />
        <Stack>
          <Text fw={500} size="lg" style={{ color: theme.colors.blue[7] }}>
            {title}
          </Text>
          <Text size="sm">{release_date}</Text>
          <Group>
            <Rating count={1} value={1} readOnly />
            <Text size="sm">({vote_average})</Text>
            <Text size="sm">({vote_count})</Text>
          </Group>
          <Text size="sm">Genres:</Text>
          <Group>
            {genre_ids.map((genre: any) => (
              <Text size="sm" key={genre}>
                ({genre})
              </Text>
            ))}
          </Group>
        </Stack>
      </Group>
    </Card>
  );
};

export default FilmCard;
