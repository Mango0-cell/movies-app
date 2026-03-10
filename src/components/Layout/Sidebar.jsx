import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useGetMaterialSymbolsQuery } from '../../store/services/googleFontsApi';


const Sidebar = () => {

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
    <nav className={styles.nav}>
      {/* 💡 Inyect the CSS that comes from the API */}
      {data && <style>{data}</style>}
      <div className={styles.logo}>
        <img src="/logo.png" alt="MovieApp Logo" className={styles.logoImage} />
        MoviesApp
      </div>
      <ul className={styles.list}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
              viewTransition
            >
              <span className={styles.icon}>{item.icon}</span>
              <lable>
              {item.name}
              </lable>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;