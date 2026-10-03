import { Home, MessageCircle, ShoppingBag, Store } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useStore } from '../app/store';
import { WHATSAPP_URL } from '../../shared/whatsapp-order';

export function Layout() {
  const { settings, cart } = useStore();
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <>
      <Header />
      <main><Outlet /></main>

      <nav className="mobile-dock" aria-label="Accesos rápidos">
        <NavLink to="/" end><Home /><span>Inicio</span></NavLink>
        <NavLink to="/tienda"><Store /><span>Tienda</span></NavLink>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle /><span>WhatsApp</span></a>
        <NavLink to="/carrito" className="dock-cart">
          <ShoppingBag /><span>Carrito</span>{count ? <b>{count}</b> : null}
        </NavLink>
      </nav>

      <footer className="footer">
        <div className="footer-brand"><strong>REBECA</strong><p>Santa Fe · tienda online</p></div>
        <nav className="footer-links" aria-label="Pie de página">
          <Link to="/tienda">Tienda</Link>
          <a href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">Instagram</a>
        </nav>
      </footer>
    </>
  );
}
