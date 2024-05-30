import { ErrorResponse, TMDBGenresResponse } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<TMDBGenresResponse | ErrorResponse>> {
  const accessToken = process.env.ACCESS_TOKEN;
  const baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

  const URL = `${baseURL}/genre/movie/list?language=en`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const res = await fetch(URL, options);
    const genres: TMDBGenresResponse = await res.json();

    return NextResponse.json(genres);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown Error' }, { status: 500 });
  }
}
