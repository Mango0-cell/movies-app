// Importa configureStore: función principal de Redux Toolkit para crear el store
// Simplifica la configuración del store combinando reducers, middleware y DevTools automáticamente
import { configureStore } from '@reduxjs/toolkit';
import { googleFontsApi } from './services/googleFontsApi';
import { tmdbApi } from './services/tmdbApi';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
    reducer: {
        [googleFontsApi.reducerPath]: googleFontsApi.reducer,
        [tmdbApi.reducerPath]: tmdbApi.reducer,
        // favorites: slice local con persistencia en localStorage
        favorites: favoritesReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(googleFontsApi.middleware)
            // tmdbApi.middleware habilita: caché automático, tag invalidation,
            // polling, deduplicación de peticiones y refetch en tiempo real
            .concat(tmdbApi.middleware),
});
