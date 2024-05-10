'use client'

import { Button } from "@mantine/core";


export default function HomePage() {

  const fetchMovies = async function() {
    const res = await fetch('/api/movies', {
      headers: {
        accept: 'application/json',
      }
    });  // установить хедеры тоже?
    const films = await res.json();
    console.log(films);
  }
  

  return <Button onClick={fetchMovies}>CLICK</Button>;
}