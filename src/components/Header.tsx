import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../app/store';

const mobileLinks = [
  ['/tienda', 'Tienda'],
  ['/categoria/lenceria', 'Lencería'],
  ['/categoria/pijamas', 'Pijamas'],
  ['/categoria/tops-remeras', 'Tops y remeras'],
  ['/categoria/infantil', 'Infantil'],
  ['/categoria/jeans-pantalones', 'Jeans y pantalones'],
  ['/categoria/vestidos-faldas', 'Vestidos y faldas'],
] as const;

export function Header() {
  const { cart } = useStore();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div className="announcement">
        <span>Comprá online</span>
        <span aria-hidden="true">·</span>
        <span>Coordiná entrega por WhatsApp</span>
      </div>
      <header className="site-header">
        <button
          className="icon-button mobile-only"
          aria-label="Abrir menú"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
        <Link className="wordmark" to="/" aria-label="REBECA, inicio">
          REBECA
        </Link>
        <nav className="desktop-nav" aria-label="Principal">
          <NavLink to="/tienda">Tienda</NavLink>
          <NavLink to="/categoria/lenceria">Lencería</NavLink>
          <NavLink to="/categoria/pijamas">Pijamas</NavLink>
          <NavLink to="/categoria/tops-remeras">Tops</NavLink>
          <NavLink to="/categoria/infantil">Infantil</NavLink>
        </nav>
        <div className="header-actions">
          <Link className="icon-button" to="/tienda" aria-label="Buscar productos">
            <Search />
          </Link>
          <Link className="cart-button" to="/carrito" aria-label={`Carrito, ${count} productos`}>
            <ShoppingBag />
            <span>{count}</span>
          </Link>
        </div>
      </header>
      {open ? (
        <div
          className="mobile-menu"
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          <div className="mobile-menu-head">
            <span className="wordmark">REBECA</span>
            <button className="icon-button" onClick={close} aria-label="Cerrar menú">
              <X />
            </button>
          </div>
          <nav className="mobile-menu-nav" aria-label="Navegación móvil">
            {mobileLinks.map(([to, label]) => (
              <Link key={to} onClick={close} to={to}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-meta">
            <span>Santa Fe</span>
            <span>Moda para elegir a tu ritmo.</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
