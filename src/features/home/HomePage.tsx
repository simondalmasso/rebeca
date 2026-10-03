import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/store';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';
import { formatArs } from '../../../shared/money';
import { WHATSAPP_URL } from '../../../shared/whatsapp-order';

const heroPriority = ['pijama-leopardo', 'body-encaje-neutro', 'bralette-seamless-neutro'];

export function HomePage() {
  const { catalog, settings, loading, error } = useStore();
  if (loading) return <div className="page-state">Cargando tienda…</div>;
  if (error || !catalog) return <div className="page-state error">{error ?? 'No se pudo cargar.'}</div>;

  const productsWithMedia = catalog.products.filter((product) => product.media[0]);
  const prioritized = heroPriority
    .map((slug) => productsWithMedia.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const heroProducts = [
    ...prioritized,
    ...productsWithMedia.filter((product) => !heroPriority.includes(product.slug)),
  ].slice(0, 3);

  const storefrontProducts = catalog.products
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  const visibleCategories = catalog.categories.filter((category) =>
    catalog.products.some((product) => product.category?.slug === category.slug),
  );

  return (
    <div className="shop-home fashion-home">
      <section className="fashion-hero" aria-label="REBECA Santa Fe">
        <div className="fashion-hero-copy">
          <p className="fashion-kicker">REBECA / SANTA FE</p>
          <h1>
            <span>SHOP</span>
            <b>{String(catalog.products.length).padStart(2, '0')}</b>
          </h1>
          <div className="fashion-hero-facts">
            <span>{visibleCategories.length} categorías</span>
            <span>@rebeca_santafee</span>
          </div>
          <div className="fashion-hero-actions">
            <Link className="fashion-primary" to="/tienda">Ver tienda <ArrowRight aria-hidden="true" /></Link>
            <a className="fashion-secondary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          </div>
        </div>

        <div className="fashion-deck" role="region" aria-label="Productos destacados">
          <div className="fashion-deck-track">
            {heroProducts.map((product, index) => (
              <Link
                className="fashion-deck-card"
                to={`/producto/${product.slug}`}
                key={product.id}
                aria-label={`Ver ${product.title}`}
              >
                <div className="fashion-deck-media">
                  <ProductImage media={product.media[0]} alt={product.title} priority={index === 0} />
                  <span className="fashion-deck-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="fashion-deck-info">
                  <span>{product.category?.name ?? 'REBECA'}</span>
                  <strong>{product.title}</strong>
                  <b>{formatArs(product.priceCents)}</b>
                  <ArrowRight aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
          <div className="fashion-swipe-note" aria-hidden="true">
            <span>01</span><i /><span>03</span><small>deslizá</small>
          </div>
        </div>
      </section>

      <section className="category-editorial" aria-label="Categorías">
        <div className="editorial-heading">
          <p className="overline">EXPLORAR</p>
          <h2>Categorías</h2>
        </div>
        <nav className="category-editorial-list">
          {visibleCategories.map((category, index) => {
            const count = catalog.products.filter((product) => product.category?.slug === category.slug).length;
            return (
              <Link to={`/categoria/${category.slug}`} key={category.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{category.name}</strong>
                <em>{count}</em>
                <ArrowRight aria-hidden="true" />
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="catalog-showcase editorial-products" id="productos">
        <div className="showcase-head">
          <div>
            <p className="overline">TIENDA</p>
            <h2>Productos</h2>
          </div>
          <Link to="/tienda">Ver los {catalog.products.length} <ArrowRight aria-hidden="true" /></Link>
        </div>

        <div className="product-grid storefront-grid">
          {storefrontProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="home-instagram fashion-instagram">
        <div>
          <p className="overline">INSTAGRAM</p>
          <h2>@rebeca_santafee</h2>
        </div>
        <a
          className="instagram-action"
          href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'}
          target="_blank"
          rel="noreferrer"
        >
          Abrir Instagram <ArrowRight aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
