import { useSelector } from 'react-redux';
import MovieGrid from '../../components/Movies/MovieGrid';
import { selectFavorites } from '../../store/favoritesSlice';

const FavoritesPage = () => {
    // useSelector lee del store de Redux → state.favorites.items
    // Cada vez que el array cambia (toggle), el componente se re-renderiza
    const favorites = useSelector(selectFavorites);

    return (
        <div>
            {favorites.length > 0 ? (
                <MovieGrid movies={favorites} title={'My Favorite Movies'} />
            ) : (
                <p style={{ color: 'gray', textAlign: 'center' }}>
                    You haven't added any movies to your favorites yet.
                </p>
            )}
        </div>
    );
};

export default FavoritesPage;