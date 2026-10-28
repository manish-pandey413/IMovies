import "dotenv/config";
import axios from "axios";

import cors from "cors";
import express from "express";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  }),
);
app.use(express.json());

const movieGlu = axios.create({
  baseURL: process.env.MOVIEGLU_BASE_URL || "https://api-gate2.movieglu.com",
  timeout: 15000,
});

function movieGluConfig(geolocation) {
  const {
    MOVIEGLU_CLIENT,
    MOVIEGLU_API_KEY,
    MOVIEGLU_AUTHORIZATION,
    MOVIEGLU_API_VERSION,
    MOVIEGLU_TERRITORY,
  } = process.env;
  if (
    !MOVIEGLU_CLIENT ||
    !MOVIEGLU_API_KEY ||
    !MOVIEGLU_AUTHORIZATION ||
    !MOVIEGLU_TERRITORY
  ) {
    const error = new Error(
      "MovieGlu credentials are not configured. Copy server/.env.example to server/.env.",
    );
    error.status = 503;
    throw error;
  }
  return {
    headers: {
      authorization: MOVIEGLU_AUTHORIZATION,
      client: MOVIEGLU_CLIENT,
      "x-api-key": MOVIEGLU_API_KEY,
      territory: MOVIEGLU_TERRITORY,
      "api-version": MOVIEGLU_API_VERSION || "v201",
      "device-datetime": new Date().toISOString(),
      ...(geolocation ? { geolocation } : {}),
    },
  };
}

async function requestMovieGlu(path, params, geolocation) {
  const { data } = await movieGlu.get(path, {
    params,
    ...movieGluConfig(geolocation),
  });
  if (data.status?.state === "ERROR") {
    const error = new Error(data.status.message || "MovieGlu request failed.");
    error.status = 502;
    throw error;
  }
  return data;
}

function movieImage(film) {
  const posters = Object.values(film.images?.poster || {});
  return (
    posters.find((poster) => poster.medium?.film_image)?.medium.film_image || ""
  );
}

app.get("/api/movies", async (_req, res, next) => {
  try {
    const data = await requestMovieGlu("/filmsNowShowing/", { n: 25 });
    res.json(
      (data.films || []).map((film) => ({
        id: film.film_id,
        title: film.film_name,
        year:
          film.release_dates?.[0]?.release_date?.slice(0, 4) || "Now showing",

        rating: film.age_rating?.[0]?.rating?.trim() || "NOW",
        tag: "NOW SHOWING",
        image: movieImage(film),
        description: film.synopsis_long || "Currently showing in cinemas.",
      })),
    );
  } catch (error) {
    next(error);
  }
});

app.get("/api/showtimes", async (req, res, next) => {
  try {
    const filmId = Number(req.query.filmId);
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const date = String(
      req.query.date || new Date().toISOString().slice(0, 10),
    );
    if (
      !Number.isInteger(filmId) ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)
    ) {
      return res
        .status(400)
        .json({ message: "Valid filmId, coordinates and date are required." });
    }
    const data = await requestMovieGlu(
      "/filmShowTimes/",
      { film_id: filmId, date, n: 25 },
      `${lat};${lon}`,
    );
    const cinemas = (data.cinemas || [])
      .map((cinema) => ({
        id: cinema.cinema_id,
        name: cinema.cinema_name,
        distanceKm: Number(cinema.distance || 0) * 1.60934,
        showtimes: Object.entries(cinema.showings || {}).flatMap(
          ([format, showing]) =>
            (showing.times || []).map((time) => ({
              format,
              start: time.start_time,
              end: time.end_time,
            })),
        ),
      }))
      .filter((cinema) => cinema.showtimes.length);
    res.json({ movie: data.film?.film_name, date, cinemas });
  } catch (error) {
    next(error);
  }
});

app.get("/api/booking-link", async (req, res, next) => {
  try {
    const params = {
      cinema_id: Number(req.query.cinemaId),
      film_id: Number(req.query.filmId),
      date: String(req.query.date || ""),
      time: String(req.query.time || ""),
    };
    if (
      !Number.isInteger(params.cinema_id) ||
      !Number.isInteger(params.film_id) ||
      !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(params.date) ||
      !/^[0-9]{2}:[0-9]{2}$/.test(params.time)
    ) {
      return res.status(400).json({
        message: "Valid cinema, film, date and showtime are required.",
      });
    }
    const data = await requestMovieGlu("/purchaseConfirmation/", params);
    if (!data.url) throw new Error("No cinema booking link was returned.");
    res.json({ url: data.url });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error.status || error.response?.status || 500;
  console.error(
    `[MovieGlu ${status}] ${error.response?.headers?.["mg-message"] || error.message}`,
  );
  res.status(status).json({
    message:
      error.response?.headers?.["mg-message"] ||
      error.message ||
      "Movie service unavailable.",
  });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`iMovies API listening on port ${port}`));
