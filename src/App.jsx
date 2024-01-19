import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import TrailerButton from "./TrailerBtn";
const key = "341e3adc";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedID] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });
  function handleSelectMovie(id) {
    setSelectedID((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedID(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  useEffect(
    function () {
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
      handleCloseMovie();
      fetchMovies();
    },
    [query]
  );
  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main movies={movies}>
        <Box>
          {/* {IsLoading ? <Loader /> : <MoiveList movies={movies} />} */}
          {IsLoading && <Loader />}
          {!IsLoading && !error && (
            <MoiveList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatch={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummery watched={watched} />
              <WatchedMoiveList
                watched={watched}
                onDeleteWatch={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading... </p>;
}
function Error({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResults({ movies }) {
  return (
    <div className="num-results">
      {movies && movies.length > 0 && (
        <p>
          Number of results: <span>{movies.length}</span>
        </p>
      )}
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
/*
function WatchedList() {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchSummery watched={watched} />
          <WatchedMoiveList watched={watched} />
        </>
      )}
    </div>
  );
}
  */
function MoiveList({ movies, onSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <li
      onClick={() => onSelectMovie(movie.imdbID)}
      className="movie"
      key={movie.imdbID}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetail({ selectedId, onCloseMovie, onAddWatch, watched }) {
  const [movie, setMovies] = useState({});
  const [IsLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("0");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    imdbID: imdbID,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  useEffect(() => {
    function callback(e) {
      if (e.key === "Escape") {
        onCloseMovie();
      }
    }

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]);

  useEffect(() => {
    async function getMoiveDetails() {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${selectedId}&apikey=${key}`
        );
        const json = await res.json();
        setMovies(json);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
      setIsLoading(false);
    }

    getMoiveDetails();

    return () => {
      // console.log("unmount");
    };
  }, [selectedId]);
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "UsePopcorn";
      };
    },
    [title]
  );
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating,
    };
    onAddWatch(newWatchedMovie);
    onCloseMovie();
  }
  return (
    <div className="details">
      {IsLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating ">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    on
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list{" "}
                    </button>
                  )}
                </>
              ) : (
                <p>
                  you rated with movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <TrailerButton movieTitle={movie.Title} />
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoiveList({ watched, onDeleteWatch }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMoive
          movie={movie}
          key={movie.imdbID}
          onDeleteWatch={onDeleteWatch}
        />
      ))}
    </ul>
  );
}
function WatchedMoive({ movie, onDeleteWatch }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatch(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
