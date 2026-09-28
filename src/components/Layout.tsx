import { Link, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useStore } from '../app/store';

export function Layout() {
  const { settings } = useStore();
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-brand">
          <strong>REBECA</strong>
          <p>Santa Fe · tienda online</p>
        </div>
        <nav className="footer-links" aria-label="Pie de página">
          <Link to="/tienda">Tienda</Link>
          <a
            href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </nav>
        {settings?.demoMode ? <small>Propuesta demo · catálogo ilustrativo</small> : null}
      </footer>
    </>
  );
}
