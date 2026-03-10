import { useState, useEffect } from 'react';

/**
 * useDebouncedValue — Hook que retrasa la actualización de un valor
 * 
 * Útil para evitar llamadas a la API en cada keystroke.
 * El valor "debounced" solo se actualiza después de que el usuario
 * deja de escribir durante el tiempo especificado.
 * 
 * @param value - El valor a "debouncear" (ej: searchTerm del input)
 * @param delay - Milisegundos a esperar antes de actualizar (default: 500ms)
 * @returns El valor debounced
 * 
 * example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebouncedValue(searchTerm, 1000);
 * 
 * // searchTerm cambia inmediatamente (input responsivo)
 * // debouncedSearch cambia 1 segundo después del último cambio
 * 
 * useSearchMoviesQuery({ query: debouncedSearch }); // menos llamadas a la API
 */
export function useDebouncedValue(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Crear un timer que actualiza el valor después del delay
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: si el valor cambia antes de que expire el timer,
        // cancelar el timer anterior y empezar uno nuevo
        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay]);

    return debouncedValue;
}
