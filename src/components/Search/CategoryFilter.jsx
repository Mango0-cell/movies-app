import { useGetGenresQuery } from '../../store/services/tmdbApi';
import styles from './CategoryFilter.module.css';

// CategoryFilter: muestra botones de géneros para filtrar búsquedas
// selectedGenre: id del género seleccionado (null = todos)
// onSelect: callback que recibe el genreId al hacer click
const CategoryFilter = ({ selectedGenre, onSelect }) => {
    const { data: genres = [], isLoading } = useGetGenresQuery();

    if (isLoading) return null;

    return (
        <div className={styles.container}>

            {genres.map((genre) => (
                <button
                    key={genre.id}
                    className={`${styles.chip} ${selectedGenre === genre.id ? styles.active : ''}`}
                    onClick={() => onSelect(genre.id)}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;