import axios from 'axios';

// A diferencia de api_key (que va como query param), el Read Access Token va en el
// header Authorization como Bearer token — es el método recomendado por TMDB v3/v4
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

// Single axios instance — configured once, reused everywhere
const tmdbClient = axios.create({
    // URL base de TMDB API v3. Todas las peticiones se construyen sobre esta ruta
    baseURL: 'https://api.themoviedb.org/3',

    // Headers por defecto que se envían en CADA petición
    headers: {
        // Authorization: Bearer <token> — esquema estándar de autenticación HTTP
        // El servidor lee este header, decodifica el JWT y verifica:
        //   1. Que el token no esté expirado (campo "nbf" / "exp" del JWT)
        //   2. Que el "aud" (audience) coincida con tu api_key
        //   3. Que los "scopes" incluyan los permisos necesarios (api_read, etc.)
        // Con Bearer token puedes acceder a endpoints que requieren autenticación
        // como crear listas, añadir/eliminar películas de listas, etc.
        Authorization: `Bearer ${READ_TOKEN}`,

        // Content-Type: le dice al servidor el formato del body en peticiones POST/PUT
        // application/json es requerido por TMDB para mutations (crear lista, añadir items)
        // Sin este header, TMDB rechaza el body y retorna 422 Unprocessable Entity
        'Content-Type': 'application/json',
    },
});

// Request interceptor — runs before every request
// Los interceptors son middleware de axios que se ejecutan en cadena
tmdbClient.interceptors.request.use(
    (config) => {
        // Aquí podrías: log de requests, añadir timestamps, etc.
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — runs after every response
tmdbClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejo centralizado de errores HTTP
        if (error.response?.status === 401) {
            // 401 Unauthorized: el token es inválido, expiró, o no tiene permisos
            console.error('Unauthorized — check your VITE_TMDB_READ_TOKEN');
        }
        if (error.response?.status === 403) {
            // 403 Forbidden: el token es válido pero no tiene el scope necesario
            // Ejemplo: intentar escribir con un token que solo tiene "api_read"
            console.error('Forbidden — your token lacks the required permissions');
        }
        return Promise.reject(error);
    }
);

export default tmdbClient;
