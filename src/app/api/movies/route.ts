import { NextRequest, NextResponse } from 'next/server';
import { currentYear, startYear, validSortingTypes } from '@/utils/constants';
import {
  validateGenreIDs,
  validateReleaseYear,
  validateSortingOrder,
  validateSortingType,
  validateVoteAverageGTE,
  validateVoteAverageLTE,
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

  const releaseYear = searchParams.get('primary_release_year');
  const voteAverageGTE = searchParams.get('vote_average.gte');
  const voteAverageLTE = searchParams.get('vote_average.lte');
  const page = searchParams.get('page');

  let URL = `${baseURL}/discover/movie?language=en-US`;

  if (sortingType !== undefined && sortingType !== null) {
    const isValidSortingType = validateSortingType(sortingType);
    if (!isValidSortingType) {
      return NextResponse.json(
        {
          error: `Invalid sorting_by value. Please use only the following values: ${validSortingTypes.join(', ')}`,
        },
        { status: 400 }
      );
    } else {
      URL += `&sort_by=${sortingType}`;
      if (sortingOrder !== undefined && sortingOrder !== null) {
        const isValidSortingOrder = validateSortingOrder(sortingOrder);
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
    }
  }

  if (genreIDs !== undefined && genreIDs !== null) {
    const isValidGenreIDs = validateGenreIDs(genreIDs);
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
  }

  if (releaseYear !== undefined && releaseYear !== null) {
    const convertedReleaseYear = Number(searchParams.get('primary_release_year'));
    const isValidReleaseYear = validateReleaseYear(convertedReleaseYear);
    if (!isValidReleaseYear) {
      return NextResponse.json(
        {
          error: `Invalid release_year value. Please use only positive integers from ${startYear} to ${currentYear}`,
        },
        { status: 400 }
      );
    } else {
      URL += `&primary_release_year=${convertedReleaseYear}`;
    }
  }

  if (voteAverageGTE !== undefined && voteAverageGTE !== null) {
    const convertedVoteAverageGTE = Number(searchParams.get('vote_average.gte'));
    const isValidVoteAverageGTE = validateVoteAverageGTE(convertedVoteAverageGTE);
    if (!isValidVoteAverageGTE) {
      return NextResponse.json(
        {
          error:
            'Invalid vote_average_gte value. Please use only positive integers from 0 to 10. vote_average_gte should be >= 0 and <= 10',
        },
        { status: 400 }
      );
    } else {
      URL += `&vote_average.gte=${convertedVoteAverageGTE}`;
    }
  }

  if (voteAverageLTE !== undefined && voteAverageLTE !== null) {
    const convertedVoteAverageLTE = Number(searchParams.get('vote_average.lte'));
    const isValidVoteAverageLTE = validateVoteAverageLTE(convertedVoteAverageLTE);
    if (!isValidVoteAverageLTE) {
      return NextResponse.json(
        {
          error:
            'Invalid vote_average_lte values. Please use only positive integers from 0 to 10. vote_average_lte should be gshould be >= 0 and <= 10',
        },
        { status: 400 }
      );
    } else {
      URL += `&vote_average.lte=${convertedVoteAverageLTE}`;
    }
  }

  if (page !== undefined && page !== null) {
    const convertedPage = Number(searchParams.get('page'));
    const isValidPageNumber = validatePageNumber(convertedPage);
    if (!isValidPageNumber) {
      return NextResponse.json(
        {
          error: 'Invalid page value. Please use only positive integers from 1 to 500.',
        },
        { status: 400 }
      );
    } else {
      URL += `&page=${convertedPage}`;
    }
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
