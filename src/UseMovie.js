import { useState, useEffect } from "react";
const key = "341e3adc";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      //   callback?.();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`
          );
          if (!res.ok) {
            throw new Error("Something went wrong");
          }
          const json = await res.json();

          if (json.Response === "False") {
            throw new Error("Movie Not Found");
          }

          // const json = await res.json();
          setMovies(json.Search);
          // setTotalResults(json.totalResults);
          console.log(json.Search);
          setIsLoading(false);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length > 3) {
        setMovies([]);
        setError("");
      }

      fetchMovies();
    },
    [query]
  );
  return { movies, IsLoading, error };
}
