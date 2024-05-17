import { NextRequest, NextResponse } from 'next/server';
import { currentYear, startYear, validSortingTypes } from '@/utils/constants';
import {
  areValidGenreIDs,
  isValidReleaseYear,
  isValidSortingOrder,
  isValidSortingType,
  areValidVoteAverageLimits,
} from '@/utils/url-query-params-validation';
import { ErrorResponse, TMDBMoviesResponse } from '@/types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<TMDBMoviesResponse | ErrorResponse>> {
  const accessToken = process.env.ACCESS_TOKEN;
  const baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

  const searchParams = request.nextUrl.searchParams;
  const sortingPattern = searchParams.get('sort_by')?.split('.');
  const sortingType = sortingPattern?.[0];
  const sortingOrder = sortingPattern?.[1];
  const genreIDs = searchParams.get('genres');
  const releaseYear = Number(searchParams.get('release_year'));
  const voteAverageGTE = Number(searchParams.get('vote_average_gte'));
  const voteAverageLTE = Number(searchParams.get('vote_average_lte'));
  const page = Number(searchParams.get('page'));

  if (!isValidSortingType(sortingType)) {
    return NextResponse.json(
      {
        error: `Invalid sorting_by value. Please use only the following values: ${validSortingTypes.join(', ')}`,
      },
      { status: 400 }
    );
  }

  if (!isValidSortingOrder(sortingOrder)) {
    return NextResponse.json(
      {
        error: 'Invalid sorting_by value. Please use only the following values: asc OR desc.',
      },
      { status: 400 }
    );
  }

  if (!areValidGenreIDs(genreIDs)) {
    return NextResponse.json(
      {
        error: 'Invalid genres format. Please use only numeric IDs separated by "|"".',
      },
      { status: 400 }
    );
  }

  if (!isValidReleaseYear(releaseYear)) {
    return NextResponse.json(
      {
        error: `Invalid release_year value. Please use only positive integers from ${startYear} to ${currentYear}`,
      },
      { status: 400 }
    );
  }

  if (!areValidVoteAverageLimits(voteAverageGTE, voteAverageLTE)) {
    return NextResponse.json(
      {
        error:
          'Invalid vote_average_lte/vote_average_gte values. Please use only positive integers from 0 to 10. vote_average_lte should be greater than vote_average_gte.',
      },
      { status: 400 }
    );
  }

  const URL =
    `${baseURL}/discover/movie?language=en-US` +
    `&sort_by=${sortingType}.${sortingOrder}` +
    `&with_genres=${genreIDs}` +
    `&primary_release_year=${releaseYear}` +
    `&vote_average.gte=${voteAverageGTE}&vote_average.lte=${voteAverageLTE}` +
    `&page=${page}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const res = await fetch(URL, options);
    const films: TMDBMoviesResponse = await res.json();

    return NextResponse.json(films);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown Error' }, { status: 500 });
  }
}
