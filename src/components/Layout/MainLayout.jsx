/*
  ROL: Layout route — estructura visual de la app (sidebar + contenido).
  USADO EN: src/app/App.jsx (como element de la ruta raíz)
  NO recibe props. Las páginas se renderizan a través de <Outlet />.
*/
import Sidebar from './Sidebar';
import BottomNav from '../ui/BottomNav';
import styles from './MainLayout.module.css';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>
      <main className={styles.content} style={{ viewTransitionName: 'main-content' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;