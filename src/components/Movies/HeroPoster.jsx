import { useSelector, useDispatch } from 'react-redux';
import styles from './HeroPoster.module.css';
import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { toggleFavorite, selectIsFavorite } from '../../store/favoritesSlice';

const HeroPoster = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selector: lee del store de Redux si esta película está en favoritos
  const isFavorite = useSelector((state) => selectIsFavorite(state, movie?.id));

  if (!movie) return null;

  const imageUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  const handleFavorite = () => {
    if (!movie.id) return;
    dispatch(toggleFavorite(movie));
  };

  // Navegar con ViewTransition para animación suave
  const handleNavigate = () => {
    const url = `/movie/${movie.id}`;
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => navigate(url));
      });
    } else {
      navigate(url);
    }
  };

  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `linear-gradient(to top, #141414, transparent), url(${imageUrl})` }}
    >
      <div className={styles.content}>
        <h1 className={styles.title}>{movie.title || movie.name}</h1>
        <p className={styles.overview}>{movie.overview}</p>

        <div className={styles.buttons}>
          <button
            className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
            onClick={handleFavorite}
          >
            <span className="material-symbols-outlined">
              {isFavorite ? 'star' : 'star_border'}
            </span>
          </button>
          <button className={styles.infoBtn} onClick={handleNavigate}>
            <span className="material-symbols-outlined">info</span> Get Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroPoster;