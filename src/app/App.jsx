import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './app.css'
import HomePage from './pages/index'
import SearchPage from './pages/search'
import HorrorPage from './pages/horror'
import TvShowsPage from './pages/tvshows'
import FavoritesPage from './pages/favorites'
import MainLayout from '../components/Layout/MainLayout'
import ViewInfoPage from './pages/viewInfo';
// createBrowserRouter: crea el router como un objeto de datos (en vez de JSX)
// Esto permite que React Router controle la navegación y active ViewTransitions
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'search', element: <SearchPage /> },
            { path: 'horror', element: <HorrorPage /> },
            { path: 'tvshows', element: <TvShowsPage /> },
            { path: 'favorites', element: <FavoritesPage /> },
            { path: 'movie/:id', element: <ViewInfoPage /> }
        ],
    },
])

// future.v7_startTransition: habilita la ViewTransition API del navegador
export default function App() {
    return <RouterProvider router={router} future={{ v7_startTransition: true }} />
}

