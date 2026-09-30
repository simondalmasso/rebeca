import { Instagram, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../app/store';

const navLinks = [
  ['/tienda', 'Tienda'],
  ['/categoria/lenceria', 'Lencería'],
  ['/categoria/pijamas', 'Pijamas'],
  ['/categoria/tops-remeras', 'Tops'],
  ['/categoria/infantil', 'Infantil'],
] as const;

export function Header() {
  const { cart, settings } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/tienda?q=${encodeURIComponent(value)}` : '/tienda');
  };

  return (
    <>
      <div className="announcement">
        <span>REBECA · Santa Fe</span>
        <span aria-hidden="true">✦</span>
        <span>Coordinación por WhatsApp</span>
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

        <Link className="brand-lockup" to="/" aria-label="REBECA Santa Fe, inicio">
          <span className="wordmark">REBECA</span>
          <span className="brand-city">SANTA FE</span>
        </Link>

        <form className="header-search" role="search" onSubmit={submitSearch}>
          <Search aria-hidden="true" />
          <input
            aria-label="Buscar productos"
            placeholder="Buscar productos..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>

        <div className="header-actions">
          <a
            className="desktop-instagram"
            href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram />
            <span>Instagram</span>
          </a>
          <Link className="cart-button" to="/carrito" aria-label={`Carrito, ${count} productos`}>
            <ShoppingBag />
            <span className="cart-label">Carrito</span>
            <b>{count}</b>
          </Link>
        </div>
      </header>

      <nav className="desktop-nav" aria-label="Principal">
        <NavLink to="/">Inicio</NavLink>
        {navLinks.map(([to, label]) => <NavLink to={to} key={to}>{label}</NavLink>)}
      </nav>

      {open ? (
        <div className="mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Menú principal">
          <div className="mobile-menu-head">
            <span className="mobile-brand">
              <span className="wordmark">REBECA</span>
              <small>SANTA FE</small>
            </span>
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X /></button>
          </div>

          <form className="mobile-search" role="search" onSubmit={(event) => { submitSearch(event); setOpen(false); }}>
            <Search aria-hidden="true" />
            <input
              aria-label="Buscar productos"
              placeholder="Buscar productos..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          <nav className="mobile-menu-nav" aria-label="Navegación móvil">
            <Link onClick={() => setOpen(false)} to="/">Inicio</Link>
            {navLinks.map(([to, label]) => <Link key={to} onClick={() => setOpen(false)} to={to}>{label}</Link>)}
          </nav>

          <div className="mobile-menu-meta">
            <span>Moda para elegir a tu ritmo.</span>
            <a href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      ) : null}
    </>
  );
}
