import { ErrorResponse, Movie } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<Movie | ErrorResponse>> {
  const accessToken = process.env.ACCESS_TOKEN;
  const baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

  const searchParams = request.nextUrl.searchParams;
  const movieId = searchParams.get('movie_id');

  const URL = `${baseURL}/movie/${movieId}?language=en-US&append_to_response=videos`;

  //!validate movie id

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const res = await fetch(URL, options);
    const movie: Movie = await res.json();

    return NextResponse.json(movie);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown Error' }, { status: 500 });
  }
}
