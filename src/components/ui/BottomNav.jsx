import { NavLink } from "react-router-dom";
import styles from "./BottomNav.module.css";
import { useGetMaterialSymbolsQuery } from "../../store/services/googleFontsApi";

const BottomNav = () => {

    const { data, error, isLoading } = useGetMaterialSymbolsQuery();
    if (isLoading) return <p>Loading icons...</p>;
    if (error) return <p>Error loading icons</p>;

    const menuItems = [
        { name: 'Home', path: '/', icon: <span className="material-symbols-outlined" id="home">home</span> },
        { name: 'Horror', path: '/horror', icon: <span className="material-symbols-outlined" id="skull">skull</span> },
        { name: 'Shows', path: '/tvshows', icon: <span className="material-symbols-outlined" id="tv">tv</span> },
        { name: 'Favorite', path: '/favorites', icon: <span className="material-symbols-outlined" id="star">star</span> },
        { name: 'Search', path: '/search', icon: <span className="material-symbols-outlined" id="search">search</span> },
    ];

    return (
        <div className={styles.wrapper}>
            <nav className={styles.bottomNav}>
                {/* Inyecta el CSS de Material Symbols desde la API */}
                {data && <style>{data}</style>}
                <ul className={styles.list}>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                                viewTransition
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <label>{item.name}</label>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav >
        </div>
    );
};

export default BottomNav;
