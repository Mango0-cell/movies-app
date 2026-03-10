/*
  ARCHIVO: src/components/Movies/MovieGrid.jsx
  ROL: Componente contenedor de grilla. Renderiza una lista de MovieCards.
  USADO EN: src/app/pages/ (index.jsx, horror.jsx, tvshows.jsx)
  RECIBE:
    movies  (array de objetos TMDB)
    title   (string - titulo de la seccion.

  PENDIENTE:
    - Considerar agregar un estado de "empty" cuando movies.length === 0
*/
import { MovieCard } from '../ui/MovieCard';
import styles from './MovieGrid.module.css';

const MovieGrid = ({ movies, title, }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;   