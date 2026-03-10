# Movies App

A modern React application for browsing movies and TV shows using The Movie Database (TMDB) API. Built with Vite, Redux Toolkit (RTK Query), and React Router.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC?logo=redux)
![React Router](https://img.shields.io/badge/React_Router-6.30.3-CA4245?logo=react-router)

## Features

- **Browse Movies**: Popular movies, horror genre, and TV shows
- **Search**: Real-time search with debounce (1s delay to optimize API calls)
- **Filter by Genre**: Category filter with TMDB genres
- **Movie Details**: Full movie info including cast, trailer (YouTube embed), and recommendations
- **Favorites**: Persistent favorites using localStorage (survives page reload)
- **View Transitions**: Smooth morph animations between movie cards and detail view using the native ViewTransition API
- **URL State Sync**: Search params persist in URL (shareable links, browser history support)
- **Responsive Design**: Mobile-friendly sidebar navigation

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.2 with Vite 7 |
| **State Management** | Redux Toolkit + RTK Query |
| **Routing** | React Router DOM 6 |
| **HTTP Client** | RTK Query (fetchBaseQuery) |
| **Styling** | CSS Modules |
| **Build Tool** | Vite with SWC plugin |
| **API** | TMDB (The Movie Database) |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API account ([sign up here](https://www.themoviedb.org/signup))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mango0-cell/movies-app.git
   cd movies-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_READ_TOKEN=your_tmdb_read_access_token_here
   ```
   
   > Get your Read Access Token from [TMDB API Settings](https://www.themoviedb.org/settings/api) (v4 auth)

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                    # Application core
│   ├── App.jsx             # Router configuration
│   ├── app.css             # Global styles + ViewTransition CSS
│   └── pages/              # Route components
│       ├── index.jsx       # Home page (popular movies)
│       ├── search.jsx      # Search with filters
│       ├── horror.jsx      # Horror genre page
│       ├── tvshows.jsx     # TV shows page
│       ├── favorites.jsx   # User favorites
│       └── viewInfo.jsx    # Movie detail page
│
├── components/             # Reusable UI components
│   ├── Layout/             # App layout (sidebar, navbar)
│   ├── Movies/             # Movie-related components
│   ├── Search/             # Search bar and filters
│   └── ui/                 # Generic UI components
│
├── hooks/                  # Custom React hooks
│   └── useDebouncedValue.js
│
├── store/                  # Redux store
│   ├── store.js            # Store configuration
│   ├── favoritesSlice.js   # Favorites state + localStorage
│   └── services/           # RTK Query API definitions
│       ├── tmdbApi.js      # TMDB endpoints
│       └── googleFontsApi.js
│
├── lib/                    # External libraries config
│   └── axios.js            # Axios instance (legacy)
│
└── main.jsx                # App entry point
```

## Key Features Explained

### RTK Query for Data Fetching

All TMDB API calls use RTK Query with automatic caching, deduplication, and loading states:

```javascript
// Auto-generated hook with caching
const { data: movies, isLoading } = useGetPopularMoviesQuery({ page: 1 });
```

### ViewTransition API

Smooth morph animations when navigating to movie details:

```jsx
// MovieCard.jsx - triggers transition on click
document.startViewTransition(() => {
  flushSync(() => navigate(`/movie/${movie.id}`));
});

// Both card and detail page share the same viewTransitionName
<img style={{ viewTransitionName: `movie-poster-${movie.id}` }} />
```

### URL State Persistence

Search state syncs with the URL using `useSearchParams`:

```
/search                     # Empty search
/search?q=batman            # Text search
/search?genre=28            # Genre filter (Action)
/search?q=batman&genre=28   # Combined
```

### Debounced Search

Custom hook prevents excessive API calls while typing:

```javascript
const debouncedSearchTerm = useDebouncedValue(searchTerm, 1000);
// API only called 1 second after user stops typing
```

## API Reference

This app uses the [TMDB API v3](https://developer.themoviedb.org/reference/intro/getting-started). Key endpoints:

| Endpoint | Description |
|----------|-------------|
| `/movie/popular` | Popular movies |
| `/discover/movie` | Movies by genre |
| `/tv/popular` | Popular TV shows |
| `/search/movie` | Search movies by text |
| `/movie/{id}` | Movie details (with videos, credits) |
| `/genre/movie/list` | Available genres |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes (bootcamp project).

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie data API
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [Redux Toolkit](https://redux-toolkit.js.org/) for simplified state management
