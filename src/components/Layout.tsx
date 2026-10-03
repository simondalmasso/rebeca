import { Link, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useStore } from '../app/store';
import { WHATSAPP_URL } from '../../shared/whatsapp-order';

export function Layout() {
  const { settings } = useStore();

  return (
    <>
      <Header />
      <main><Outlet /></main>

      <footer className="footer fashion-footer">
        <div className="footer-brand">
          <strong>REBECA</strong>
          <p>Santa Fe</p>
        </div>
        <nav className="footer-links" aria-label="Pie de página">
          <Link to="/tienda">Tienda</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">Instagram</a>
        </nav>
      </footer>
    </>
  );
}
