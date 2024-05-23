import { NextRequest, NextResponse } from 'next/server';
import { currentYear, startYear, validSortingTypes } from '@/utils/constants';
import {
  validateGenreIDs,
  validateReleaseYear,
  validateSortingOrder,
  validateSortingType,
  validateVoteAverageBottomLimit,
  validateVoteAverageUpperLimit,
  validatePageNumber,
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
  const genreIDs = searchParams.get('with_genres');
  const releaseYear = Number(searchParams.get('primary_release_year'));
  const voteAverageGTE = Number(searchParams.get('vote_average.gte'));
  const voteAverageLTE = Number(searchParams.get('vote_average.lte'));
  const page = Number(searchParams.get('page'));

  const isValidSortingType = validateSortingType(sortingType);
  const isValidSortingOrder = validateSortingOrder(sortingOrder);
  const isValidGenreIDs = validateGenreIDs(genreIDs);
  const isValidReleaseYear = validateReleaseYear(releaseYear);
  const isValidVoteAverageBottomLimit = validateVoteAverageBottomLimit(
    voteAverageGTE,
    voteAverageLTE
  );
  const isValidVoteAverageUpperLimit = validateVoteAverageUpperLimit(
    voteAverageGTE,
    voteAverageLTE
  );
  const isValidPageNumber = validatePageNumber(page);

  let URL = `${baseURL}/discover/movie?language=en-US`;

  if (!isValidSortingType) {
    return NextResponse.json(
      {
        error: `Invalid sorting_by value. Please use only the following values: ${validSortingTypes.join(', ')}`,
      },
      { status: 400 }
    );
  } else {
    URL += `&sort_by=${sortingType}`;
    if (!isValidSortingOrder) {
      return NextResponse.json(
        {
          error: 'Invalid sorting_by value. Please use only the following values: asc OR desc.',
        },
        { status: 400 }
      );
    } else {
      URL += `.${sortingOrder}`;
    }
  }

  if (!isValidGenreIDs) {
    return NextResponse.json(
      {
        error: 'Invalid genres format. Please use only numeric IDs separated by "|"".',
      },
      { status: 400 }
    );
  } else {
    URL += `&with_genres=${genreIDs}`;
  }

  if (!isValidReleaseYear) {
    return NextResponse.json(
      {
        error: `Invalid release_year value. Please use only positive integers from ${startYear} to ${currentYear}`,
      },
      { status: 400 }
    );
  } else {
    URL += `&primary_release_year=${releaseYear}`;
  }

  if (!isValidVoteAverageBottomLimit) {
    return NextResponse.json(
      {
        error:
          'Invalid vote_average_gte value. Please use only positive integers from 0 to 10. vote_average_lte should be greater than vote_average_gte.',
      },
      { status: 400 }
    );
  } else {
    URL += `&vote_average.gte=${voteAverageGTE}`;
  }

  if (!isValidVoteAverageUpperLimit) {
    return NextResponse.json(
      {
        error:
          'Invalid vote_average_lte values. Please use only positive integers from 0 to 10. vote_average_lte should be greater than vote_average_gte.',
      },
      { status: 400 }
    );
  } else {
    URL += `&vote_average.lte=${voteAverageLTE}`;
  }

  if (!isValidPageNumber) {
    return NextResponse.json(
      {
        error: 'Invalid page value. Please use only positive integers from 1 to 500.',
      },
      { status: 400 }
    );
  } else {
    URL += `&page=${page}`;
  }

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
