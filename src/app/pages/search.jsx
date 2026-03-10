import { useSearchParams } from 'react-router-dom';
import { useSearchMoviesQuery, useDiscoverByGenreQuery } from '../../store/services/tmdbApi';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import MovieGrid from '../../components/Movies/MovieGrid';
import Searchbar from '../../components/Search/Searchbar';
import CategoryFilter from '../../components/Search/CategoryFilter';

// ─── URL Params ─────────────────────────────────────────────────────────────────
// useSearchParams sincroniza el estado con la URL del navegador:
//   /search               sin búsqueda
//   /search?q=batman      búsqueda por texto
//   /search?genre=28      filtro por género (Action = 28)
//   /search?q=batman&genre=28 ambos
//
// Beneficios:
//   1. El estado persiste al navegar atrás/adelante
//   2. La URL es compartible (copiando el link)
//   3. El historial del navegador funciona correctamente
//   4. No hay flash de contenido vacío al volver
// ───────────────────────────────────────────────────────────────────────────────

const SearchPage = () => {
    // useSearchParams: hook de react-router-dom para leer/escribir query params
    // [searchParams, setSearchParams] similar a useState pero sincronizado con la URL
    const [searchParams, setSearchParams] = useSearchParams();

    // Leer valores de la URL (con defaults)
    const searchTerm = searchParams.get('q') || '';
    const selectedGenre = searchParams.get('genre') ? Number(searchParams.get('genre')) : null;

    // ─── Debounce del término de búsqueda ─────────────────────────────────────
    // El input se actualiza inmediatamente (UX responsiva),
    // pero la API se llama 1 segundo después del último cambio.
    // Esto evita hacer una petición por cada letra que el usuario escribe.
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 1000);

    // ─── Handlers que actualizan la URL ───────────────────────────────────────
    // Estos reemplazan useState. Cuando el usuario escribe, la URL cambia:
    //   setSearchTerm('batman') → /search?q=batman

    const handleSearchChange = (value) => {
        setSearchParams((prev) => {
            // Crear copia de los params actuales
            const newParams = new URLSearchParams(prev);
            
            if (value) {
                newParams.set('q', value);
            } else {
                // Si el input está vacío, eliminar el param de la URL
                newParams.delete('q');
            }
            
            return newParams;
        }, { replace: true }); // replace: true evita llenar el historial con cada keystroke
    };

    const handleGenreChange = (genreId) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            
            if (genreId) {
                newParams.set('genre', String(genreId));
            } else {
                newParams.delete('genre');
            }
            
            return newParams;
        }); // Sin replace: cada cambio de género crea una entrada en el historial
    };

    // ─── RTK Query hooks ─────────────────────────────────────────────
    // Búsqueda por texto — usa el término debounced para evitar llamadas excesivas
    const { data: searchResults = [], isLoading: isSearching, error: searchError } = useSearchMoviesQuery(
        { query: debouncedSearchTerm, page: 1 },
        { skip: !debouncedSearchTerm }
    );

    // Descubrir por género — solo se ejecuta si hay género y NO hay texto debounced
    const { data: genreResults = [], isLoading: isDiscovering, error: genreError } = useDiscoverByGenreQuery(
        { genreId: selectedGenre, page: 1 },
        { skip: !selectedGenre || !!debouncedSearchTerm }
    );

    // Combinar resultados: texto tiene prioridad, género filtra localmente
    // Nota: usamos debouncedSearchTerm para la lógica, ya que es lo que la API devolvió
    const movies = debouncedSearchTerm
        ? (selectedGenre ? searchResults.filter(m => m.genre_ids?.includes(selectedGenre)) : searchResults)
        : genreResults;

    // isLoading también considera si estamos esperando el debounce
    const isPendingDebounce = searchTerm !== debouncedSearchTerm && searchTerm !== '';
    const isLoading = isSearching || isDiscovering || isPendingDebounce;
    const error = searchError || genreError;

    // Título dinámico según el estado
    const getTitle = () => {
        if (searchTerm && selectedGenre) return `Results for "${searchTerm}" (filtered)`;
        if (searchTerm) return `Results for "${searchTerm}"`;
        if (selectedGenre) return 'Browse by Genre';
        return 'Search Movies';
    };

    return (
        <div>
            <Searchbar value={searchTerm} onChange={handleSearchChange} />
            <CategoryFilter selectedGenre={selectedGenre} onSelect={handleGenreChange} />
            {isLoading && <p>Searching...</p>}
            {error && <p>Error: {error?.data?.status_message ?? error.message}</p>}
            {!isLoading && !error && movies.length > 0 && (
                <MovieGrid movies={movies} title={getTitle()} />
            )}
            {!isLoading && !error && movies.length === 0 && (searchTerm || selectedGenre) && (
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)' }}>
                    No results found
                </p>
            )}
        </div>
    );
};

export default SearchPage;
