import { NextRequest, NextResponse } from "next/server";

// get all movies

// filter by genre
// filter by release year
// filter by rating (from/to)

// get one movie

export async function GET(request: Request) {
  // const { query } = request;

  // const apiKey = process.env.API_KEY;
  const accessToken = process.env.ACCESS_TOKEN;
  const baseURL = process.env.TMDB_BASE_URL;

  const sortingType = 'popularity' || 'popularity';
  const sortingOrder = 'desc' || 'asc';
  const URL = `${baseURL}/discover/movie?sort_by=${sortingType}.${sortingOrder}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  };

  try {
    const res = await fetch(URL, options);
    console.log(URL);
    
    const films = await res.json();
    return Response.json(films)

  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message });
    }
    return Response.json({ error: 'Unknown Error' });
  }
}