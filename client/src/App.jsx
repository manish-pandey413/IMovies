import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import MovieCatalog from "./components/MovieCatalog.jsx";
import BookingModal from "./components/BookingModal.jsx";
import { getMovies } from "./services/api.js";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMovie, setActiveMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let active = true;
    getMovies()
      .then((results) => active && setMovies(results))
      .catch(
        (cause) =>
          active && setError(cause.message || "Could not load movies."),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const visibleMovies = useMemo(
    () =>
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [movies, query],
  );

  const toggleFavorite = (id) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  return (
    <div className="mx-auto max-w-[1600px] overflow-hidden">
      <Header />
      <main id="home">
        <Hero />
        <MovieCatalog
          movies={visibleMovies}
          loading={loading}
          error={error}
          query={query}
          onQueryChange={setQuery}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelectMovie={setActiveMovie}
        />
      </main>
      <footer
        id="footer"
        className="flex min-h-[100px] items-center justify-between gap-5 px-[8.3%] text-[8px] tracking-[1px] text-[#97958e] max-md:px-[6%] max-sm:min-h-[88px] max-sm:px-[6%] max-sm:text-[6px]"
      >
        <a
          className="flex shrink-0 items-center gap-2 text-ink no-underline"
          href="#home"
        >
          <span className="font-display text-3xl font-bold leading-none tracking-[-5px]">
            i<span className="text-accent">.</span>
          </span>
          <span className="ml-1 text-[15px] font-semibold tracking-[-.7px]">
            movies
          </span>
        </a>
        <span className="max-sm:hidden">MADE FOR THE LOVE OF FILM.</span>
        <span className="text-[7px] tracking-normal">
          Now-showing data by MovieGlu
        </span>
        <span className="shrink-0">© 2025 iMOVIES</span>
      </footer>

      {activeMovie && (
        <BookingModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
        />
      )}
    </div>
  );
}
