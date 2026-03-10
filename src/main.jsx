import { createRoot } from 'react-dom/client'
// Importa Provider: componente de React Redux que conecta el store con toda la app
// Hace que el store de Redux sea accesible a cualquier componente descendiente
// mediante hooks como useSelector, useDispatch, o hooks generados por RTK Query
import { Provider } from 'react-redux'
import App from './app/App'

// Importa el store de Redux configurado con RTK Query
// Este store contiene el estado global y los middleware necesarios
import { store } from './store/store'

// Único punto de montaje de la aplicación
// Provider envuelve App para que Redux (y RTK Query) funcionen dentro del router
// El orden es: Provider (Redux) → App → RouterProvider → MainLayout → páginas
const rootElement = document.getElementById('root')


if (rootElement) {
    // createRoot crea una raíz de React 18+ que soporta renderizado concurrente
    // .render() monta la aplicación en el DOM
    createRoot(rootElement).render(
        // Provider envuelve la aplicación completa y recibe el store como prop
        // Esto permite que todos los componentes hijos accedan al state de Redux
        // y puedan usar hooks como useGetMaterialSymbolsQuery de googleFontsApi
        <Provider store={store}>
            <App />
        </Provider>
    )
}
