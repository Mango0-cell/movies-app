import { useParams } from 'react-router-dom';
import { useGetMovieDetailsQuery } from '../../store/services/tmdbApi';
import Information from '../../components/Movies/Information';

const ViewInfoPage = () => {
    // useParams() de react-router-dom lee los parámetros de la ruta /movie/:id
    const { id } = useParams();
    const { data: movieDetails, error, isLoading } = useGetMovieDetailsQuery(id, { skip: !id });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error?.data?.status_message ?? error.message}</p>;

    return (
        <div>
            {movieDetails && (
                <div>
                    <Information movie={movieDetails} />
                </div>
            )}
        </div>
    );
};

export default ViewInfoPage;

