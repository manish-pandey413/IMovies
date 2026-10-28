import { useState } from "react";
import { ArrowRight, MapPin, X } from "lucide-react";
import {
  geocodePlace,
  getBookingLink,
  getMovieShowtimes,
} from "../services/api.js";

const todayParts = new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
  .formatToParts(new Date())
  .reduce((parts, part) => ({ ...parts, [part.type]: part.value }), {});
const today = `${todayParts.year}-${todayParts.month}-${todayParts.day}`;

export default function BookingModal({ movie, onClose }) {
  const [place, setPlace] = useState("");
  const [location, setLocation] = useState("");
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opening, setOpening] = useState("");
  const [error, setError] = useState("");

  async function findCinemas(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const coordinates = await geocodePlace(place);
      const result = await getMovieShowtimes(
        movie.id,
        coordinates.lat,
        coordinates.lon,
        today,
      );
      setLocation(coordinates.name);
      setCinemas(result.cinemas);
      if (!result.cinemas.length)
        setError(
          `No showtimes found for ${movie.title} near ${coordinates.name} today.`,
        );
    } catch (cause) {
      setError(
        cause.response?.data?.message ||
          cause.message ||
          "Could not load showtimes.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function book(cinema, showtime) {
    setOpening(`${cinema.id}-${showtime.start}`);
    setError("");
    try {
      const url = await getBookingLink(
        cinema.id,
        movie.id,
        today,
        showtime.start,
      );
      window.location.assign(url);
    } catch (cause) {
      setError(
        cause.response?.data?.message ||
          cause.message ||
          "Booking link unavailable.",
      );
      setOpening("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-black/65 p-5"
      onClick={onClose}
    >
      <section
        className="relative max-h-[calc(100vh-40px)] w-full max-w-[680px] overflow-y-auto bg-paper p-8 shadow-2xl max-sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${movie.title}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 border-0 bg-transparent p-1 text-[#777]"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="grid grid-cols-[110px_1fr] items-center gap-5 border-b border-[#e8e6e0] pb-5 max-sm:grid-cols-[76px_1fr] max-sm:gap-3">
          <img
            className="h-[140px] w-[110px] object-cover max-sm:h-[100px] max-sm:w-[76px]"
            src={movie.image}
            alt=""
          />
          <div>
            <div className="text-[8px] font-bold tracking-[1.5px] text-[#8c8a83]">
              {movie.tag}
            </div>
            <h2 className="my-2 mr-5 font-display text-2xl leading-tight max-sm:text-xl">
              {movie.title}
            </h2>
            <p className="text-[9px] text-[#848179]">
              {movie.year} · {movie.rating}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-[#77756e]">
              {movie.description}
            </p>
          </div>
        </div>
        <div className="pt-5">
          <form onSubmit={findCinemas}>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[9px] font-semibold tracking-[.9px]">
                <MapPin size={16} className="text-accent" /> SHOWTIMES NEAR YOU
              </span>
              <span className="text-[8px] text-[#96938b]">{today}</span>
            </div>
            <div className="flex gap-2.5 max-sm:flex-col">
              <input
                className="min-w-0 flex-1 border border-[#e1ded6] bg-transparent p-3 text-[11px] outline-none focus:border-[#99958b]"
                value={place}
                onChange={(event) => setPlace(event.target.value)}
                placeholder="City or Indian PIN code"
                aria-label="City or Indian PIN code"
                required
              />
              <button
                className="flex items-center justify-center gap-3 border-0 bg-ink px-4 py-3 text-[10px] text-white transition hover:bg-accent disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  "Searching…"
                ) : (
                  <>
                    Find shows <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-[9px] text-[#99968e]">
              Location search uses Photon and OpenStreetMap data.
            </p>
          </form>
          {error && <p className="mt-3 text-[10px] text-red-700">{error}</p>}
          {cinemas.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-3 text-[9px] font-semibold tracking-[.9px]">
                SHOWING NEAR {location.toUpperCase()}
              </h3>
              <div className="grid gap-3">
                {cinemas.map((cinema) => (
                  <article
                    className="border border-[#e8e6e0] p-4 max-sm:p-3"
                    key={cinema.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <b className="text-xs">{cinema.name}</b>
                        <p className="mt-1 text-[9px] text-[#89867e]">
                          {cinema.distanceKm.toFixed(1)} km away
                        </p>
                      </div>
                      <span className="text-[8px] text-[#89867e]">
                        {cinema.showtimes.length} SHOWS
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cinema.showtimes.map((show) => (
                        <button
                          className="border border-[#e1ded6] bg-transparent px-2.5 py-2 text-[9px] hover:border-ink disabled:opacity-50"
                          disabled={Boolean(opening)}
                          key={`${show.format}-${show.start}`}
                          onClick={() => book(cinema, show)}
                        >
                          {opening === `${cinema.id}-${show.start}` ? (
                            "Opening…"
                          ) : (
                            <>
                              {show.start}{" "}
                              <span className="text-[#8d8a83]">
                                {show.format}
                              </span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-3 text-[9px] text-[#99968e]">
                Booking continues on the cinema’s website; MovieGlu does not
                sell tickets directly.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
