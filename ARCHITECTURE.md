# Architecture Documentation

This document describes the architecture, data flow, and design decisions of the Movies App.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Routing](#routing)
- [Component Architecture](#component-architecture)
- [API Layer](#api-layer)
- [Styling Strategy](#styling-strategy)
- [Key Design Patterns](#key-design-patterns)

---

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (React App)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │   React      │   │   Redux      │   │   React Router       │ │
│  │   Components │◄──│   Store      │◄──│   (URL State)        │ │
│  └──────────────┘   └──────────────┘   └──────────────────────┘ │
│          │                 │                      │              │
│          ▼                 ▼                      ▼              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    RTK Query Cache                        │   │
│  │    (Automatic caching, deduplication, refetch)           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
└────────────────────────────│─────────────────────────────────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │      TMDB API         │
                 │  (External Service)   │
                 └───────────────────────┘
```

---

## Directory Structure

```
src/
├── main.jsx                    # Entry point - Redux Provider + React DOM
│
├── app/                        # Application layer
│   ├── App.jsx                 # Router definition (createBrowserRouter)
│   ├── app.css                 # Global styles + ViewTransition CSS
│   └── pages/                  # Page components (route handlers)
│       ├── index.jsx           # / - Homepage with popular movies
│       ├── search.jsx          # /search - Search with URL state
│       ├── horror.jsx          # /horror - Horror genre movies
│       ├── tvshows.jsx         # /tvshows - TV shows
│       ├── favorites.jsx       # /favorites - User's saved movies
│       └── viewInfo.jsx        # /movie/:id - Movie detail view
│
├── components/                 # Presentational components
│   ├── Layout/                 # App shell
│   │   ├── MainLayout.jsx      # Outlet wrapper with sidebar
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── ResponsiveNavbar.jsx
│   │
│   ├── Movies/                 # Movie-related components
│   │   ├── MovieGrid.jsx       # Grid of MovieCard components
│   │   ├── HeroPoster.jsx      # Hero banner component
│   │   └── Information.jsx     # Movie detail view content
│   │
│   ├── Search/                 # Search functionality
│   │   ├── Searchbar.jsx       # Text input component
│   │   └── CategoryFilter.jsx  # Genre filter buttons
│   │
│   └── ui/                     # Generic UI components
│       └── MovieCard.jsx       # Individual movie card
│
├── hooks/                      # Custom React hooks
│   └── useDebouncedValue.js    # Debounce hook for search
│
├── store/                      # Redux state management
│   ├── store.js                # Store configuration
│   ├── favoritesSlice.js       # Favorites with localStorage
│   └── services/               # RTK Query API definitions
│       ├── tmdbApi.js          # TMDB API endpoints
│       └── googleFontsApi.js   # Google Fonts API
│
└── lib/                        # External library configs
    └── axios.js                # Axios instance (legacy)
```

---

## Data Flow

### 1. Initial Page Load

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   main.jsx  │────▶│   App.jsx   │────▶│ MainLayout  │────▶│   Page      │
│  (Provider) │     │  (Router)   │     │  (Outlet)   │     │ Component   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
                                                           ┌─────────────┐
                                                           │  RTK Query  │
                                                           │   useXxxQuery│
                                                           └─────────────┘
                                                                   │
                                                                   ▼
                                                           ┌─────────────┐
                                                           │  TMDB API   │
                                                           └─────────────┘
```

### 2. Search Flow (with Debounce)

```
User Types → Input onChange → URL Updates (immediate)
                                    │
                                    ▼
                    useDebouncedValue (1000ms delay)
                                    │
                                    ▼
                    useSearchMoviesQuery (API call)
                                    │
                                    ▼
                    RTK Query Cache → Component Re-render
```

### 3. Favorites Flow (localStorage)

```
User Clicks Favorite → dispatch(toggleFavorite(movie))
                                    │
                                    ▼
                        favoritesSlice reducer
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
                Redux State Update      localStorage.setItem()
                        │
                        ▼
                Component Re-render (useSelector)
```

---

## State Management

### Redux Store Structure

```javascript
{
  // RTK Query caches (auto-managed)
  tmdbApi: {
    queries: { ... },
    mutations: { ... },
    provided: { ... },
    subscriptions: { ... }
  },
  
  googleFontsApi: { ... },
  
  // Application state
  favorites: {
    items: [
      { id, title, poster_path, backdrop_path, overview, ... }
    ]
  }
}
```

### State Types

| Type | Location | Persistence | Use Case |
|------|----------|-------------|----------|
| **Server State** | RTK Query cache | Memory (session) | API data (movies, genres) |
| **Client State** | Redux slice | localStorage | Favorites |
| **URL State** | React Router | URL params | Search filters |
| **UI State** | Component useState | None | Temporary UI (modals, inputs) |

---

## Routing

### Route Configuration

```jsx
// App.jsx
createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,      // Shared layout with Outlet
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'horror', element: <HorrorPage /> },
      { path: 'tvshows', element: <TvShowsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'movie/:id', element: <ViewInfoPage /> },
    ],
  },
])
```

### URL State Pattern (Search Page)

```
/search?q=batman&genre=28

useSearchParams() ─────────────────────────────────────┐
       │                                               │
       ▼                                               │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ searchTerm   │───▶│ debouncedTerm│───▶│ API Query    │
│ (immediate)  │    │ (1s delay)   │    │ (skip if     │
└──────────────┘    └──────────────┘    │  empty)      │
                                        └──────────────┘
```

---

## Component Architecture

### Component Types

```
┌─────────────────────────────────────────────────────────────┐
│                      Page Components                         │
│  (Route handlers, data fetching, business logic)            │
│  └── pages/index.jsx, pages/search.jsx, etc.                │
├─────────────────────────────────────────────────────────────┤
│                    Container Components                      │
│  (Layout, composition, no direct API calls)                 │
│  └── Layout/MainLayout.jsx, Movies/MovieGrid.jsx            │
├─────────────────────────────────────────────────────────────┤
│                  Presentational Components                   │
│  (Pure rendering, receive props, minimal logic)             │
│  └── ui/MovieCard.jsx, Search/Searchbar.jsx                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Component Relationships

```
MainLayout
├── Sidebar (navigation)
├── ResponsiveNavbar (mobile)
└── <Outlet /> ─────────────────────────────────────┐
                                                     │
    ┌────────────────────────────────────────────────┘
    │
    ├── HomePage
    │   ├── HeroPoster
    │   └── MovieGrid → MovieCard[]
    │
    ├── SearchPage
    │   ├── Searchbar
    │   ├── CategoryFilter
    │   └── MovieGrid → MovieCard[]
    │
    └── ViewInfoPage
        └── Information
            ├── Poster (with viewTransitionName)
            ├── Cast list
            ├── Trailer (YouTube embed)
            └── Recommendations → MovieCard[]
```

---

## API Layer

### RTK Query Configuration

```javascript
// tmdbApi.js
export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.themoviedb.org/3',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPopularMovies: builder.query({ ... }),
    getHorrorMovies: builder.query({ ... }),
    getTvShows: builder.query({ ... }),
    getMovieDetails: builder.query({ ... }),
    searchMovies: builder.query({ ... }),
    discoverByGenre: builder.query({ ... }),
    getGenres: builder.query({ ... }),
  }),
});
```

### Auto-Generated Hooks

| Endpoint | Generated Hook | Usage |
|----------|---------------|-------|
| `getPopularMovies` | `useGetPopularMoviesQuery` | `{ data, isLoading, error }` |
| `searchMovies` | `useSearchMoviesQuery` | With `skip` option |
| `getMovieDetails` | `useGetMovieDetailsQuery` | Single movie |
| `getGenres` | `useGetGenresQuery` | Filter categories |

### Caching Strategy

- **Default cache time**: 60 seconds (RTK Query default)
- **Deduplication**: Multiple components using the same query share one request
- **Automatic refetch**: On component mount, window focus, or manual invalidation

---

## Styling Strategy

### CSS Modules

```
Component.jsx
Component.module.css  ─── Scoped styles, no global conflicts
```

### Naming Convention

```css
/* Component.module.css */
.container { }
.title { }
.button { }

/* Usage in JSX */
<div className={styles.container}>
```

### Global Styles (app.css)

- CSS custom properties (variables)
- ViewTransition animations
- Reset/normalize styles

### ViewTransition CSS

```css
/* Morph animation for movie posters */
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: 0.3s;
}

/* Prevent root layout from animating */
::view-transition-group(root) {
  animation: none;
}
```

---

## Key Design Patterns

### 1. Debounce Pattern

```javascript
// hooks/useDebouncedValue.js
export function useDebouncedValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 2. URL as State Pattern

```javascript
// pages/search.jsx
const [searchParams, setSearchParams] = useSearchParams();
const searchTerm = searchParams.get('q') || '';

const handleSearchChange = (value) => {
  setSearchParams((prev) => {
    const newParams = new URLSearchParams(prev);
    value ? newParams.set('q', value) : newParams.delete('q');
    return newParams;
  }, { replace: true });
};
```

### 3. ViewTransition Pattern

```javascript
// ui/MovieCard.jsx - Trigger transition
const handleClick = () => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      flushSync(() => navigate(`/movie/${movie.id}`));
    });
  } else {
    navigate(`/movie/${movie.id}`);
  }
};

// Both components share the same viewTransitionName
<img style={{ viewTransitionName: `movie-poster-${movie.id}` }} />
```

### 4. localStorage Persistence Pattern

```javascript
// favoritesSlice.js
const loadFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  } catch {
    return [];
  }
};

// In reducer
toggleFavorite: (state, action) => {
  // ... update state.items
  saveToStorage(state.items);  // Sync after each change
},
```

---

## Performance Considerations

1. **RTK Query Caching**: Prevents redundant API calls
2. **Debounced Search**: 1 second delay reduces API calls during typing
3. **Skip Queries**: `{ skip: !searchTerm }` prevents unnecessary requests
4. **ViewTransition**: Native browser animation (GPU-accelerated)
5. **CSS Modules**: Scoped styles, no runtime overhead
6. **Vite + SWC**: Fast development builds and optimized production bundles

---

## Future Improvements

- [ ] Infinite scroll pagination
- [ ] Server-side rendering (SSR) with React Router
- [ ] Error boundaries for graceful error handling
- [ ] Unit tests with Vitest
- [ ] TypeScript migration
- [ ] PWA support (offline caching)
