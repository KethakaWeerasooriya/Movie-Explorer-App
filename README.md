# 🎬 Movie Explorer

A responsive React web app for searching movies, browsing what's trending, viewing rich movie details (cast, genres, trailers) and keeping a personal favorites list. All movie data comes from [The Movie Database (TMDb) API](https://developer.themoviedb.org/docs).

**Live demo:** _add your Vercel/Netlify URL here after deploying_

---

## ✨ Features

### Core requirements
| Requirement | Implementation |
| --- | --- |
| Login with username & password | `/login` page with validation, show/hide password, loading state and redirect back to the requested page. Routes behind it are protected. |
| Search bar | Debounced search (500 ms), instant search on Enter, clear button. |
| Poster grid (title, year, rating) | `MovieGrid` + `MovieCard`: responsive CSS grid, lazy-loaded posters, rating badge, skeleton loaders. |
| Movie details view | `/movie/:id`: backdrop hero, poster, rating & vote count, runtime, release date, genres, tagline, overview, director, top cast, budget/revenue, production info, similar movies. |
| Trending section | "Trending" carousel with a **Today / This week** toggle. |
| Light / dark mode | Toggle in the header (and on the login page). Defaults to the OS preference; choice is persisted. |
| TMDb integration via axios | Trending, search, discover, details (with `append_to_response=videos,credits,similar`), genres. |
| Infinite scrolling | `IntersectionObserver`-based `useInfiniteScroll` hook. |
| Friendly error handling | All API errors are mapped to plain-English messages (missing/invalid key, offline, timeout, rate limit, 404) with **Retry** buttons. |
| State management | React **Context API** + `useReducer` (`MovieContext`, `FavoritesContext`, `AuthContext`, `ColorModeContext`). |
| Last search persisted | The last searched query is saved to `localStorage` and restored on reload. |
| Favorites | Heart any movie; saved to `localStorage` **per user**. Favorites page with sorting and "clear all". |

### Bonus features
- **Filters** by genre, release year and minimum rating (work for both search results and browsing).
- **YouTube trailers** embedded in a modal (full-screen on phones), plus a "Watch on YouTube" link.
- **"Load More" button** as the default pagination, with a switch to turn on infinite scroll instead (choice is remembered).
- Cancelled stale requests (AbortController) so fast typing never shows out-of-date results.
- De-duplication of results across pages, 404 page, per-page document titles, accessible labels and keyboard support.

---

## 🧱 Tech stack
- **React 18** (Create React App / `react-scripts`)
- **React Router v6** – Home, Movie Details, Favorites, Login
- **Material UI (MUI v5)** – components & theming
- **axios** – HTTP client
- **Context API + useReducer** – state management
- **Jest** – unit tests for helpers

---

## 🚀 Getting started

### 1. Prerequisites
- Node.js 18+ and npm
- A free TMDb account and API key: sign up at [themoviedb.org](https://www.themoviedb.org/signup), then go to **Settings → API** and create a key.

### 2. Install
```bash
git clone <your-gitlab-repo-url>
cd movie-explorer-app
npm install
```

### 3. Configure your API key
Copy `.env.example` to `.env` and set **one** of:
```bash
REACT_APP_TMDB_API_KEY=your_v3_api_key
# or
REACT_APP_TMDB_READ_TOKEN=your_v4_read_access_token
```
> Restart `npm start` after changing `.env`. The `.env` file is git-ignored.

### 4. Run
```bash
npm start        # dev server on http://localhost:3000
npm test         # run unit tests
npm run build    # production build in /build
```

### 5. Log in
The app has no backend, so login is **simulated on the client**: any username (3+ characters: letters, numbers, `.`, `-`, `_`) and password (6+ characters) works. The session is kept in `localStorage` (the password is never stored), and each username gets its own favorites list. `AuthContext.login` is the single place to swap in a real authentication API.

---

## 🔌 API usage

All requests live in [`src/api/tmdb.js`](src/api/tmdb.js), using a shared axios instance (base URL `https://api.themoviedb.org/3`, 10 s timeout, API key or Bearer token attached automatically).

| Function | Endpoint | Used for |
| --- | --- | --- |
| `getTrending(window)` | `GET /trending/movie/{day\|week}` | Trending carousel |
| `searchMovies(query, page, { year })` | `GET /search/movie` | Search results (paginated) |
| `discoverMovies({ genre, year, minRating, page })` | `GET /discover/movie` | Browsing and filtering when there's no search query |
| `getMovieDetails(id)` | `GET /movie/{id}?append_to_response=videos,credits,similar` | Details page, trailer, cast, similar movies in **one** request |
| `getGenres()` | `GET /genre/movie/list` | Genre filter options |

Images are loaded from `https://image.tmdb.org/t/p/{size}{path}`.

**Filtering note:** TMDb's search endpoint only supports filtering by year, so genre and rating filters are applied client-side to search results. When there's no search query, all filters are applied by TMDb's `/discover` endpoint.

**Error handling:** `toFriendlyError()` turns axios errors into user-facing messages; cancelled requests are ignored silently.

---

## 🗂️ Project structure

```
src/
├── api/
│   └── tmdb.js               # axios client + all TMDb endpoints + error mapping
├── components/
│   ├── AppHeader.js          # nav bar, theme toggle, user menu
│   ├── AppLayout.js          # protected layout + route guard + providers
│   ├── CastList.js           # cast carousel
│   ├── FilterBar.js          # genre / year / rating filters
│   ├── MovieCard.js          # poster tile with rating + favorite toggle
│   ├── MovieGrid.js          # responsive grid + skeletons
│   ├── MovieRow.js           # horizontal carousel (trending, similar)
│   ├── SearchBar.js          # debounced search input
│   ├── StatusMessages.js     # ErrorMessage + EmptyState
│   ├── TrailerDialog.js      # YouTube embed modal
│   └── TrendingSection.js    # trending carousel with day/week toggle
├── context/
│   ├── AuthContext.js        # simulated login/logout
│   ├── ColorModeContext.js   # light/dark mode + MUI ThemeProvider
│   ├── FavoritesContext.js   # favorites persisted per user
│   └── MovieContext.js       # search, filters, pagination, trending, genres
├── hooks/
│   ├── useDebounce.js
│   └── useInfiniteScroll.js
├── pages/
│   ├── FavoritesPage.js
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── MovieDetailsPage.js
│   └── NotFoundPage.js
├── utils/
│   ├── format.js             # year/rating/runtime/money helpers, trailer picker
│   ├── format.test.js
│   └── storage.js            # safe localStorage helpers + keys
├── App.js                    # routes
├── index.js                  # providers + router
└── theme.js                  # MUI light/dark theme
```

---

## ☁️ Deployment

Both configs are included so client-side routes work when the page is refreshed.

### Vercel
1. Import the GitLab repository at [vercel.com/new](https://vercel.com/new) (framework preset: **Create React App**).
2. Add the environment variable `REACT_APP_TMDB_API_KEY` (or `REACT_APP_TMDB_READ_TOKEN`).
3. Deploy. `vercel.json` rewrites every route to `index.html`.

### Netlify
1. **Add new site → Import from Git** and pick the GitLab repository.
2. Build settings come from `netlify.toml` (`npm run build`, publish `build`).
3. Add `REACT_APP_TMDB_API_KEY` under **Site configuration → Environment variables**, then deploy.

> ⚠️ Create React App embeds `REACT_APP_*` variables into the JavaScript bundle, so the TMDb key is visible to anyone using the site. That's normal for TMDb's free, read-only keys, but don't reuse this pattern for secret credentials.

---

## 📱 Responsive design
Styles are written mobile-first (base styles for phones, with `sm`/`md`/`lg` overrides): two-column grid on phones, auto-filling columns on larger screens, icon-only navigation on small screens, edge-to-edge swipeable carousels, and a full-screen trailer player on mobile.

---

## 🙏 Attribution
This product uses the TMDb API but is not endorsed or certified by TMDb.
