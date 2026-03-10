import { useSelector, useDispatch } from 'react-redux';
import styles from './Information.module.css';
import { toggleFavorite, selectIsFavorite } from '../../store/favoritesSlice';
import { useGetPopularMoviesQuery } from '../../store/services/tmdbApi';
import { MovieCard } from '../ui/MovieCard';

const Information = ({ movie }) => {
    const dispatch = useDispatch();
    const isFavorite = useSelector((state) => selectIsFavorite(state, movie?.id));
    
    // Usamos popular movies como "recomendaciones" (excluyendo la película actual)
    const { data: popularMovies = [] } = useGetPopularMoviesQuery({ page: 1 });
    const recommendations = popularMovies.filter((m) => m.id !== movie?.id).slice(0, 10);
    const imageUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    const imageUrlPoster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <div className={styles.container}>
            <div className={styles.imageSection}>
                {imageUrl && (
                    <img
                        className={styles.backdrop}
                        src={imageUrl}
                        alt={movie.title || movie.name}
                    />
                )}

                <div className={styles.infoSection}>
                    <div className={styles.posterWrapper}> {movie.poster_path ? (
                        <img
                            className={styles.poster}
                            src={imageUrlPoster}
                            alt={movie.title || movie.name}
                            style={{ viewTransitionName: `movie-poster-${movie.id}` }}
                        />
                    ) : null} </div>
                    <div className={styles.content}>
                        <h2 className={styles.title}>{movie.title || movie.name}</h2>
                        <p className={styles.overview}>{movie.overview}</p>
                        <div className={styles.details}> {movie.release_date || movie.first_air_date} | {movie.genres?.map(g => g.name).join(', ')} | {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}</div>
                        <button
                            className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
                            onClick={() => dispatch(toggleFavorite(movie))}
                        >
                            <span className="material-symbols-outlined">
                                {isFavorite ? 'star' : 'star_border'}
                            </span>
                            <label>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</label>
                        </button>
                    </div>
                </div>

            </div>

            <h1 className={styles.mainTitle}> Main Cast </h1>
            <div className={styles.castSection}>
                <div className={styles.castListWrapper}>
                    <div className={styles.castList}>
                        {movie.credits?.cast?.slice(0, 10).map((actor) => (
                            <div key={actor.id} className={styles.actorCard}>
                                <img
                                    className={styles.actorImage}
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/placeholder.png'}
                                    alt={actor.name}
                                />
                                <div className={styles.actorInfo}>
                                    <h3 className={styles.actorName}>{actor.name}</h3>
                                    <p className={styles.characterName}>as {actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <h1 className={styles.mainTitle}> Trailer </h1>
            <div className={styles.trailerSection}>
                {movie.videos?.results?.length > 0 ? (
                    <iframe
                        className={styles.trailer}
                        src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                        title="Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <p className={styles.noTrailer}>No trailer available</p>
                )}
            </div>

            <h1 className={styles.mainTitle}> Recommended </h1>
            <div className={styles.recommendedSection}>
                    <div className={styles.moviesList}>
                        {recommendations.map((rec) => (
                            <MovieCard
                                key={rec.id}
                                movie={rec}
                            />
                        ))}
                    </div>
                </div>
            </div>
    );
};

export default Information;