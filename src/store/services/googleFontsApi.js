// Importa la función createApi de Redux Toolkit Query (RTK Query)
// createApi es el núcleo de RTK Query, permite definir un conjunto de endpoints de API
// y genera automáticamente hooks de React para realizar peticiones HTTP
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';

// Crea y exporta la instancia de la API utilizando createApi de RTK Query
// Este objeto contendrá los reducers, middleware y hooks generados automáticamente
export const googleFontsApi = createApi({
    // reducerPath: Define la clave bajo la cual se almacenará este slice en el store de Redux
    reducerPath: 'googleFontsApi',
    
    // baseQuery: Configura la función que realizará las peticiones HTTP
    // fetchBaseQuery es un wrapper de fetch API nativo del navegador
    // Añade automáticamente la baseUrl a todas las peticiones realizadas por estos endpoints
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),

    // Recibe un builder que proporciona métodos para crear queries (GET) y mutations (POST/PUT/DELETE)
    endpoints: (builder) => ({
        // getMaterialSymbols: Define un endpoint de tipo query (operación de lectura/GET)
        // builder.query se usa para operaciones que obtienen datos sin modificar el servidor
        // Este endpoint específico obtiene la hoja de estilos CSS de Material Symbols
        getMaterialSymbols: builder.query({
            // query: Función que retorna la configuración de la petición HTTP
            // Un string vacío ('') significa que no se añade ninguna ruta adicional a la baseUrl
            // Por lo tanto, la petición final será a: https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined
            // Podría retornar un objeto con más configuración: { url: '', method: 'GET', headers: {...} }
            query: () => ({
                url: '',
                responseHandler: response => response.text(), // Especifica que queremos el texto plano (CSS) en lugar de JSON
            }),

        }),
    }),
});

// Desestructura y exporta los hooks generados automáticamente por RTK Query
// RTK Query genera automáticamente hooks de React para cada endpoint definido
// El patrón de nomenclatura es: use[NombreEndpoint]Query para queries
// useGetMaterialSymbolsQuery es un hook personalizado que:
// - Ejecuta automáticamente la petición cuando el componente se monta
// - Retorna { data, error, isLoading, isFetching, isSuccess, isError, refetch }
// - Implementa caché automático para evitar peticiones duplicadas
// - Sincroniza el estado entre múltiples componentes que usen el mismo hook
export const { useGetMaterialSymbolsQuery } = googleFontsApi;