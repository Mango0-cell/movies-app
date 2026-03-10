import { useGetHorrorMoviesQuery } from '../../store/services/tmdbApi';
import MovieGrid from '../../components/Movies/MovieGrid';
import HeroPoster from '../../components/Movies/HeroPoster';


const HorrorPage = () => {
    const { data: movies = [], error, isLoading } = useGetHorrorMoviesQuery({ page: 1 });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error?.data?.status_message ?? error.message}</p>;

    return (
        <div>
            <HeroPoster movie={movies[0]} />
            <div style={{ height: '20px' }} /> {/* Espacio entre el poster y la grilla */}
            <MovieGrid movies={movies} title="Horror Movies" />
            <div style={{ height: '40px' }} /> {/* Espacio extra al final de la página */}
        </div>
    );
};

export default HorrorPage;