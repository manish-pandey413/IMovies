import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 20000,
});
const photonClient = axios.create({
  baseURL: "https://photon.komoot.io",
  timeout: 12000,
});

export async function getMovies() {
  try {
    const { data } = await apiClient.get("/movies");
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          `Movie API returned ${error.response.status}.`,
      );
    }
    throw new Error(
      "Cannot reach the iMovies API. Start the server and check VITE_API_URL/CORS.",
    );
  }
}

export async function geocodePlace(query) {
  const { data } = await photonClient.get("/api/", {
    params: { q: `${query.trim()}, India`, limit: 1, lang: "en" },
  });
  const place = data.features?.[0];
  if (!place)
    throw new Error("Location not found. Try a city or Indian PIN code.");
  const [lon, lat] = place.geometry.coordinates;
  return {
    lat,
    lon,
    name: place.properties.city || place.properties.name || query,
  };
}

export async function getMovieShowtimes(filmId, lat, lon, date) {
  const { data } = await apiClient.get("/showtimes", {
    params: { filmId, lat, lon, date },
  });
  return data;
}

export async function getBookingLink(cinemaId, filmId, date, time) {
  const { data } = await apiClient.get("/booking-link", {
    params: { cinemaId, filmId, date, time },
  });
  return data.url;
}
