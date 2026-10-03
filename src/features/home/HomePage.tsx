import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/store';
import { CategoryRail } from '../../components/CategoryRail';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';
import { WHATSAPP_URL } from '../../../shared/whatsapp-order';

const heroPriority = ['pijama-leopardo', 'body-encaje-neutro', 'bralette-seamless-neutro'];
const tape = ['REBECA', 'SANTA FE', 'LENCERÍA', 'PIJAMAS', 'TOPS', 'INFANTIL'];

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
    <div className="shop-home">
      <section className="rebeca-hero" aria-label="REBECA Santa Fe">
        <div className="hero-orbit hero-orbit-a" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-b" aria-hidden="true" />

        <div className="rebeca-hero-copy">
          <p className="hero-eyebrow">@rebeca_santafee · Santa Fe</p>
          <h1>REBECA</h1>
          <p className="hero-lead">Lencería · Pijamas · Tops · Infantil</p>
          <div className="hero-actions-new">
            <Link className="hero-cta" to="/tienda">Ver tienda <ArrowRight aria-hidden="true" /></Link>
            <a className="hero-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          </div>
        </div>

        <div className="hero-gallery">
          {heroProducts.map((product, index) => (
            <Link
              className={`hero-shot hero-shot-${index + 1}`}
              to={`/producto/${product.slug}`}
              key={product.id}
              aria-label={`Ver ${product.title}`}
            >
              <ProductImage media={product.media[0]} alt={product.title} priority={index === 0} />
              <span className="hero-shot-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="hero-shot-label">{product.title}</span>
            </Link>
          ))}
        </div>

        <div className="hero-dock">
          <span>{catalog.products.length} productos</span>
          <span>{visibleCategories.length} categorías</span>
          <Link to="/tienda">Ver catálogo <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <div className="fashion-tape" aria-hidden="true">
        <div className="fashion-tape-track">
          {[...tape, ...tape].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✦</b></span>)}
        </div>
      </div>

      <section className="home-categories" aria-label="Categorías">
        <div className="rail-title">
          <div>
            <p className="overline">EXPLORAR</p>
            <span>Categorías</span>
          </div>
          <Link to="/tienda">Ver todo <ArrowRight aria-hidden="true" /></Link>
        </div>
        <CategoryRail categories={visibleCategories} products={catalog.products} />
      </section>

      <section className="catalog-showcase" id="productos">
        <div className="showcase-head">
          <div><p className="overline">TIENDA</p><h2>Productos</h2></div>
          <Link to="/tienda">{catalog.products.length} productos <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="product-grid storefront-grid">
          {storefrontProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="home-instagram">
        <div><p className="overline">INSTAGRAM</p><h2>@rebeca_santafee</h2></div>
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
