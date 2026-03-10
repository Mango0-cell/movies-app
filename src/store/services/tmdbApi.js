import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ─── Base Query ────────────────────────────────────────────────────────────
// fetchBaseQuery es el wrapper de fetch nativo que RTK Query usa internamente.
// Configuramos la baseUrl y el header Authorization con el Bearer token de TMDB.
// Esto reemplaza la instancia de axios (lib/axios.js) para todas las queries/mutations
// gestionadas por RTK Query. axios sigue disponible para uso fuera de RTK Query si lo necesitas.
const tmdbBaseQuery = fetchBaseQuery({
    baseUrl: 'https://api.themoviedb.org/3',
    prepareHeaders: (headers) => {
        // prepareHeaders se ejecuta antes de CADA petición (como un interceptor de axios)
        // Lee el token desde las variables de entorno de Vite
        const token = import.meta.env.VITE_TMDB_READ_TOKEN;
        if (token) {
            // Bearer token: esquema estándar OAuth 2.0 para autenticación HTTP
            headers.set('Authorization', `Bearer ${token}`);
        }
        // Content-Type requerido por TMDB para aceptar body JSON en mutations
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

// ─── API Definition ────────────────────────────────────────────────────────
// createApi define todos los endpoints TMDB en un solo lugar (single source of truth).
// Genera automáticamente: reducers, middleware, hooks de React, caché, y tag invalidation.
export const tmdbApi = createApi({
    // reducerPath: clave en el store de Redux → state.tmdbApi
    reducerPath: 'tmdbApi',
    baseQuery: tmdbBaseQuery,

    // tagTypes ya no necesita 'FavoriteList' — los favoritos se manejan con localStorage
    tagTypes: [],

    endpoints: (builder) => ({
        // ═══════════════════════════════════════════════════════════════════
        // QUERIES (GET) — lectura de datos, con caché automático
        // ═══════════════════════════════════════════════════════════════════

        // Películas populares
        // Uso: const { data, error, isLoading } = useGetPopularMoviesQuery({ page: 1 })
        getPopularMovies: builder.query({
            query: ({ page = 1 } = {}) => ({
                url: '/movie/popular',
                params: { page },
            }),
            // transformResponse: modifica la respuesta ANTES de guardarla en el caché
            // TMDB envuelve los resultados en { results: [...], page, total_pages }
            // Extraemos solo el array de películas para simplificar el consumo en componentes
            transformResponse: (response) => response.results,
        }),

        // Películas de terror (género 27 en TMDB)
        getHorrorMovies: builder.query({
            query: ({ page = 1 } = {}) => ({
                url: '/discover/movie',
                params: { page, with_genres: 27 },
            }),
            transformResponse: (response) => response.results,
        }),

        // TV Shows populares
        getTvShows: builder.query({
            query: ({ page = 1 } = {}) => ({
                url: '/tv/popular',
                params: { page },
            }),
            transformResponse: (response) => response.results,
        }),

        // Detalle de una película (incluye videos y créditos)
        getMovieDetails: builder.query({
            query: (id) => ({
                url: `/movie/${id}`,
                params: { append_to_response: 'videos,credits' },
            }),
            // No necesita transformResponse: el detalle devuelve el objeto directo
        }),

        // Búsqueda de películas
        // skip: en el componente puedes pasar skip: true para no ejecutar la query
        searchMovies: builder.query({
            query: ({ query, page = 1 }) => ({
                url: '/search/movie',
                params: { query, page },
            }),
            transformResponse: (response) => response.results,
        }),

        // Descubrir por género (películas o TV)
        discoverByGenre: builder.query({
            query: ({ genreId, type = 'movie', page = 1 }) => ({
                url: `/discover/${type}`,
                params: { with_genres: genreId, page },
            }),
            transformResponse: (response) => response.results,
        }),

        // Lista de géneros de TMDB (Action, Comedy, Horror, etc.)
        // Se cachea automáticamente — solo hace 1 request y reutiliza el resultado
        getGenres: builder.query({
            query: (type = 'movie') => `/genre/${type}/list`,
            transformResponse: (response) => response.genres,
        }),

        // Lista de favoritos — provee el tag 'FavoriteList' para invalidación
        // Cuando una mutation invalida este tag, esta query se re-ejecuta automáticamente
        getFavoriteList: builder.query({
            query: (listId) => ({
                url: `/list/${listId}`,
            }),
            // providesTags: le dice a RTK Query "esta query depende de FavoriteList"
            // El id en el tag permite invalidar listas específicas (no todas)
            providesTags: (result, error, listId) => [
                { type: 'FavoriteList', id: listId },
            ],
        }),

        // ═══════════════════════════════════════════════════════════════════
        // MUTATIONS (POST/PUT/DELETE) — escritura de datos
        // ═══════════════════════════════════════════════════════════════════

        // Crear una nueva lista
        createList: builder.mutation({
            query: (body) => ({
                url: '/list',
                method: 'POST',
                body, // { name: 'My List', description: '...' }
            }),
        }),

        // Añadir película a una lista
        // invalidatesTags: cuando esta mutation se completa exitosamente,
        // RTK Query invalida el tag FavoriteList → la query getFavoriteList
        // se re-ejecuta automáticamente → la UI se actualiza en tiempo real
        addMovieToList: builder.mutation({
            query: ({ listId, mediaId }) => ({
                url: `/list/${listId}/add_item`,
                method: 'POST',
                body: { media_id: mediaId },
            }),
            invalidatesTags: (result, error, { listId }) => [
                { type: 'FavoriteList', id: listId },
            ],
        }),

        // Eliminar película de una lista
        removeMovieFromList: builder.mutation({
            query: ({ listId, mediaId }) => ({
                url: `/list/${listId}/remove_item`,
                method: 'POST',
                body: { media_id: mediaId },
            }),
            invalidatesTags: (result, error, { listId }) => [
                { type: 'FavoriteList', id: listId },
            ],
        }),
    }),
});

// ─── Auto-generated hooks ──────────────────────────────────────────────────
// RTK Query genera un hook por cada endpoint:
//   builder.query    → useGet[Name]Query     (se ejecuta automáticamente al montar)
//   builder.mutation → use[Name]Mutation      (retorna [trigger, result])
export const {
    useGetPopularMoviesQuery,
    useGetHorrorMoviesQuery,
    useGetTvShowsQuery,
    useGetMovieDetailsQuery,
    useSearchMoviesQuery,
    useDiscoverByGenreQuery,
    useGetGenresQuery,
} = tmdbApi;
