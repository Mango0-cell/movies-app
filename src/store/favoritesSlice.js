// ─── Favorites Slice con localStorage ──────────────────────────────────────
// createSlice: función de Redux Toolkit que genera actions + reducer automáticamente
// Este slice reemplaza el uso de listas de la API de TMDB (endpoints /list/)
// Los favoritos se persisten en localStorage para que sobrevivan recargas del navegador

import { createSlice } from '@reduxjs/toolkit';

// ─── localStorage helpers ──────────────────────────────────────────────────
// Clave única en localStorage donde se guarda el array de películas favoritas
const STORAGE_KEY = 'favoriteMovies';

// Lee los favoritos guardados en localStorage al iniciar la app
// Si no existe o está corrupto, retorna un array vacío
const loadFromStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Guarda el array de favoritos en localStorage
const saveToStorage = (favorites) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

// ─── Slice Definition ──────────────────────────────────────────────────────
const favoritesSlice = createSlice({
    // name: prefijo para las actions generadas → 'favorites/toggleFavorite'
    name: 'favorites',

    // initialState: carga los favoritos desde localStorage al crear el store
    initialState: {
        items: loadFromStorage(),
    },

    // reducers: funciones puras que modifican el estado
    // Redux Toolkit usa Immer internamente, así que puedes "mutar" el state directamente
    reducers: {
        // toggleFavorite: añade o quita una película del array
        // action.payload = objeto movie completo (id, title, poster_path, etc.)
        toggleFavorite: (state, action) => {
            const movie = action.payload;
            const index = state.items.findIndex((item) => item.id === movie.id);

            if (index >= 0) {
                // Ya existe → quitar de favoritos
                state.items.splice(index, 1);
            } else {
                // No existe → añadir a favoritos
                // Solo guardamos los campos necesarios para no llenar localStorage
                state.items.push({
                    id: movie.id,
                    title: movie.title || movie.name,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    overview: movie.overview,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    genre_ids: movie.genre_ids,
                });
            }

            // Sincroniza con localStorage después de cada cambio
            saveToStorage(state.items);
        },

        // clearFavorites: vacía toda la lista (útil para un botón "Clear All")
        clearFavorites: (state) => {
            state.items = [];
            saveToStorage([]);
        },
    },
});

// Exporta las actions para dispatch
export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

// Selectores: funciones que leen del estado global de Redux
// Se usan con useSelector(selectFavorites) en los componentes

// Retorna el array completo de favoritos
export const selectFavorites = (state) => state.favorites.items;

// Retorna true/false si una película específica está en favoritos
// Uso: useSelector((state) => selectIsFavorite(state, movieId))
export const selectIsFavorite = (state, movieId) =>
    state.favorites.items.some((item) => item.id === movieId);

export default favoritesSlice.reducer;
