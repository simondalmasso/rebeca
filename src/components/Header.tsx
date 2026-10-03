import { Instagram, Menu, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../app/store';
import { WHATSAPP_URL } from '../../shared/whatsapp-order';

export function Header() {
  const { cart, settings, catalog } = useStore();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);

  const categoryLinks = useMemo(() => {
    if (!catalog) return [];
    return catalog.categories
      .filter((category) => catalog.products.some((product) => product.category?.slug === category.slug))
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => [`/categoria/${category.slug}`, category.name] as const);
  }, [catalog]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return (
    <>
      <header className="site-header fashion-header">
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

        <nav className="fashion-header-nav" aria-label="Principal">
          <NavLink to="/tienda">Tienda</NavLink>
          {categoryLinks.map(([to, label]) => <NavLink to={to} key={to}>{label}</NavLink>)}
        </nav>

        <div className="header-actions">
          <a className="fashion-header-action" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <MessageCircle />
          </a>
          <a
            className="fashion-header-action"
            href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Instagram />
          </a>
          <Link className="cart-button" to="/carrito" aria-label={`Carrito, ${count} productos`}>
            <ShoppingBag />
            {count ? <b>{count}</b> : null}
          </Link>
        </div>
      </header>

      {open ? (
        <div className="mobile-menu fashion-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Menú principal">
          <div className="mobile-menu-head">
            <span className="mobile-brand"><span className="wordmark">REBECA</span><small>SANTA FE</small></span>
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X /></button>
          </div>

          <nav className="mobile-menu-nav" aria-label="Navegación móvil">
            <Link onClick={() => setOpen(false)} to="/">Inicio</Link>
            <Link onClick={() => setOpen(false)} to="/tienda">Tienda</Link>
            {categoryLinks.map(([to, label]) => <Link key={to} onClick={() => setOpen(false)} to={to}>{label}</Link>)}
          </nav>

          <div className="mobile-menu-meta">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp ↗</a>
            <a href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">Instagram ↗</a>
          </div>
        </div>
      ) : null}
    </>
  );
}
