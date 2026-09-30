import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/store';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';
import { formatArs } from '../../../shared/money';

const categoryPriority = ['lenceria', 'pijamas', 'tops-remeras', 'infantil'];

export function HomePage() {
  const { catalog, settings, loading, error } = useStore();
  if (loading) return <div className="page-state">Cargando tienda…</div>;
  if (error || !catalog) return <div className="page-state error">{error ?? 'No se pudo cargar.'}</div>;

  const hero = catalog.products[0];
  const newItems = catalog.products.slice(-4).reverse();
  const featured = catalog.products.filter((product) => product.featured).slice(-4).reverse();
  const categories = [
    ...categoryPriority.flatMap((slug) => {
      const category = catalog.categories.find((item) => item.slug === slug);
      return category ? [category] : [];
    }),
    ...catalog.categories.filter((category) => !categoryPriority.includes(category.slug)),
  ].slice(0, 4);

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media">
          {hero ? (
            <ProductImage media={hero.media[0]} alt={hero.title} priority />
          ) : (
            <div className="hero-placeholder">
              <span>REBECA</span>
            </div>
          )}
          {hero ? (
            <Link className="hero-product-link" to={`/producto/${hero.slug}`}>
              <span>{hero.title}</span>
              <strong>{formatArs(hero.priceCents)}</strong>
            </Link>
          ) : null}
        </div>
        <div className="hero-copy">
          <p className="overline">REBECA · Santa Fe</p>
          <h1 id="hero-title">
            Nueva colección.
            <br />
            Vestite como vos.
          </h1>
          <p>Descubrí prendas para combinar a tu manera y coordiná tu pedido directamente con Rebeca.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/tienda">
              Ver tienda <ArrowRight />
            </Link>
            <Link className="hero-text-link" to="/categoria/lenceria">
              Explorar lencería
            </Link>
          </div>
        </div>
      </section>

      {settings?.demoMode ? <div className="demo-notice">Propuesta demo · catálogo ilustrativo</div> : null}

      <section className="section">
        <div className="section-head">
          <div>
            <p className="overline">Recién llegados</p>
            <h2>Lo nuevo</h2>
          </div>
          <Link to="/tienda">
            Ver todo <ArrowRight />
          </Link>
        </div>
        <div className="product-grid">
          {newItems.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="section category-section">
        <div className="section-head">
          <div>
            <p className="overline">Encontrá tu estilo</p>
            <h2>Elegí tu mood</h2>
          </div>
        </div>
        <div className="category-mosaic">
          {categories.map((category, index) => {
            const product = catalog.products.find((item) => item.category?.slug === category.slug);
            return (
              <Link
                key={category.id}
                to={`/categoria/${category.slug}`}
                className={`category-tile tile-${index + 1} ${product?.media[0] ? '' : 'no-media'}`}
              >
                <ProductImage media={product?.media[0]} alt={category.name} />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="overline">Selección</p>
            <h2>Elegidos de Rebeca</h2>
          </div>
        </div>
        <div className="product-grid">
          {(featured.length ? featured : newItems).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="instagram-callout">
        <p className="overline">Más Rebeca</p>
        <h2>@rebeca_santafee</h2>
        <a
          className="button secondary"
          href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'}
          target="_blank"
          rel="noreferrer"
        >
          Ver Instagram <ArrowRight />
        </a>
      </section>
    </div>
  );
}
