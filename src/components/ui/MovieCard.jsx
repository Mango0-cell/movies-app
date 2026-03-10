/*

  ROL: Componente presentacional puro. Muestra una tarjeta de pelicula.
  USADO EN: src/components/Movies/MovieGrid.jsx
  RECIBE: movie (objeto de la API TMDB)

  BUENA PRACTICA — Componente "dumb" (presentacional):
    No sabe nada de hooks, estado global, ni de donde vienen los datos.
    Solo recibe props y renderiza. Es reutilizable en cualquier parte.

  PENDIENTE:
    - Agregar estilos de .card en src/assets/styles/main.css
    - Considerar agregar un onClick para navegar al detalle (useNavigate)
*/
import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import styles from './MovieCard.module.css';

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const imageUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.png';

  // Navegar con ViewTransition API si está disponible
  const handleClick = () => {
    const url = `/movie/${movie.id}`;
    
    // startViewTransition: captura el estado actual, ejecuta la navegación,
    // y anima la transición entre el estado viejo y nuevo
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        // flushSync: fuerza a React a actualizar el DOM síncronamente
        // Necesario para que ViewTransition capture el nuevo estado correctamente
        flushSync(() => {
          navigate(url);
        });
      });
    } else {
      navigate(url);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <img
        className={styles.image}
        src={imageUrl}
        alt={movie?.title || 'Movie'}
        style={{ viewTransitionName: `movie-poster-${movie.id}` }}
      />
      <h3 className={styles.title}>{movie?.title}</h3>
    </div>
  );
};