import { useState, useEffect } from "react";

const key = "341e3adc";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.length <= 3) {
      setMovies([]);
      setError("");
      return;
    }

    const fetchMovies = async () => {
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

        setMovies(json.Search);
        console.log(json.Search);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  return { movies, isLoading, error };
}
