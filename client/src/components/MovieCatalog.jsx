import { ArrowRight, ArrowUpRight, Heart, Search } from "lucide-react";

export default function MovieCatalog({
  movies,
  loading,
  error,
  query,
  onQueryChange,
  favorites,
  onToggleFavorite,
  onSelectMovie,
}) {
  return (
    <section
      className="px-[8.3%] pt-24 pb-19.25 max-md:px-[6%] max-md:pt-19 max-sm:px-[6%] max-sm:pt-[68px] max-sm:pb-[52px]"
      id="movies"
    >
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5 text-[9px] font-bold tracking-[1.55px] text-[#8c8a83]">
            <span className="h-px w-[22px] bg-accent" /> NOW PLAYING IN INDIA
          </div>
          <h2 className="mt-3 font-display text-[43px] font-semibold tracking-[-1.3px] max-sm:text-4xl">
            On the <em className="text-accent">big screen.</em>
          </h2>
        </div>
        <span className="mb-1.5 text-[9px] tracking-[.9px] text-[#79776f] max-sm:text-[7px]">
          CURRENTLY IN CINEMAS
        </span>
      </div>
      <div className="mt-[38px] flex items-center justify-between border-b border-[#e8e6e0] pb-3 max-sm:mt-[25px] max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <span className="text-[10px] text-[#8d8a83]">
          Currently released films · India
        </span>
        <label className="flex items-center gap-2 border-b border-[#cfccc3] py-1.5 text-[#8e8b84] max-sm:self-end">
          <Search size={16} />
          <input
            className="w-[115px] border-0 bg-transparent text-[10px] text-ink outline-none placeholder:text-[#9c9992]"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Find a film"
            aria-label="Find a film"
          />
        </label>
      </div>
      {loading && (
        <div className="py-16 text-center text-sm text-[#8d8a83]">
          Finding films for you…
        </div>
      )}
      {!loading && error && (
        <div className="py-16 text-center text-sm text-[#8d8a83]">
          {error}
          <small className="mt-2 block">
            Check the MovieGlu credentials in server/.env and restart the API.
          </small>
        </div>
      )}
      {!loading && !error && movies.length > 0 && (
        <div className="mt-[27px] grid grid-cols-3 gap-x-6 gap-y-[38px] max-md:grid-cols-3 max-sm:mt-5 max-sm:grid-cols-2 max-sm:gap-x-[13px] max-sm:gap-y-[26px]">
          {movies.map((movie) => (
            <article className="min-w-0" key={movie.id}>
              <button
                className="group relative block h-[310px] w-full overflow-hidden border-0 bg-[#e5e2dc] p-0 text-left max-md:h-[260px] max-sm:h-[240px]"
                onClick={() => onSelectMovie(movie)}
                aria-label={`Find theatres for ${movie.title}`}
              >
                <img
                  className="size-full object-cover saturate-[.72] transition duration-500 group-hover:scale-[1.035] group-hover:saturate-100"
                  src={movie.image}
                  alt={`${movie.title} movie poster`}
                  loading="lazy"
                />
                <span className="absolute top-3.5 left-3.5 bg-black/50 px-2.5 py-2 text-[8px] tracking-[1.1px] text-white max-sm:top-2 max-sm:left-2 max-sm:px-1.5 max-sm:py-1.5 max-sm:text-[6px]">
                  {movie.tag}
                </span>
                <span className="absolute top-3.5 right-3.5 bg-black/50 px-2 py-1 text-[9px] text-white max-sm:top-2 max-sm:right-2">
                  {movie.rating}
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-[8px] tracking-[1px] text-white opacity-0 transition group-hover:opacity-100">
                  FIND A THEATRE{" "}
                  <ArrowUpRight className="ml-1 inline" size={13} />
                </span>
              </button>
              <div className="flex items-start justify-between gap-2 pt-3">
                <div>
                  <h3 className="mb-1.5 text-[13px] font-semibold tracking-[-.2px] max-sm:text-[11px]">
                    {movie.title}
                  </h3>
                  <p className="text-[9px] text-[#8d8a83] max-sm:text-[8px]">
                    {movie.year}
                  </p>
                </div>
                <button
                  className={`p-0.5 transition ${favorites.includes(movie.id) ? "text-accent" : "text-[#8b8983] hover:text-accent"}`}
                  aria-label={
                    favorites.includes(movie.id)
                      ? "Remove from watchlist"
                      : "Add to watchlist"
                  }
                  onClick={() => onToggleFavorite(movie.id)}
                >
                  <Heart
                    size={18}
                    fill={
                      favorites.includes(movie.id) ? "currentColor" : "none"
                    }
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {!loading && !error && movies.length === 0 && (
        <div className="py-16 text-center text-sm text-[#8d8a83]">
          {query
            ? "No films match that search."
            : "No currently playing films found."}
        </div>
      )}
      {!loading && !error && movies.length > 0 && (
        <div className="mt-[38px] flex items-center justify-between border-t border-[#e8e6e0] pt-4 text-[8px] tracking-[1px] text-[#9b9991] max-sm:mt-7">
          <span>SHOWING {movies.length} NOW PLAYING FILMS</span>
          <button
            className="flex items-center gap-3 border-0 bg-transparent text-[9px] tracking-[.8px]"
            onClick={() => onQueryChange("")}
          >
            CLEAR SEARCH <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
