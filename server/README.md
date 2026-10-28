## iMovies server

Express proxy for MovieGlu now-playing films, real showtimes and cinema booking links. Credentials stay server-side. MovieGlu redirects bookings to cinema sites; it does not sell tickets or expose seat/payment APIs.

Endpoints: `GET /api/movies`, `GET /api/showtimes?filmId=&lat=&lon=&date=`, and `GET /api/booking-link?cinemaId=&filmId=&date=&time=`. The client geocodes a city/PIN with Photon, then requests film-specific showtimes from MovieGlu.

Get MovieGlu credentials at [developer.movieglu.com](https://developer.movieglu.com/). Their sandbox includes up to 10,000 test requests; evaluation access has a 75-request limit. Copy `.env.example` to `.env` and use the sandbox credentials. Set the matching territory (for India, `IN`). Start the API with `npm run dev`; set client `VITE_API_URL=http://localhost:5000/api`. Never put MovieGlu credentials in the Vite client.
