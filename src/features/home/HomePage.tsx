import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/store';
import { CategoryRail } from '../../components/CategoryRail';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';

const heroPriority = ['pijama-leopardo', 'bralette-seamless-neutro', 'top-morley-color'];

const isEditorialProduct = (id: string) => !id.startsWith('demo-product-');

export function HomePage() {
  const { catalog, settings, loading, error } = useStore();
  if (loading) return <div className="page-state">Cargando tienda…</div>;
  if (error || !catalog) return <div className="page-state error">{error ?? 'No se pudo cargar.'}</div>;

  const editorialProducts = catalog.products.filter((product) => isEditorialProduct(product.id) && product.media[0]);
  const fallbackProducts = catalog.products.filter((product) => product.media[0]);
  const visualPool = editorialProducts.length ? editorialProducts : fallbackProducts;

  const prioritized = heroPriority
    .map((slug) => visualPool.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const heroProducts = [
    ...prioritized,
    ...visualPool.filter((product) => !heroPriority.includes(product.slug)),
  ].slice(0, 3);

  const storefrontProducts = [
    ...editorialProducts.slice().sort((a, b) => Number(b.featured) - Number(a.featured)),
    ...catalog.products
      .filter((product) => !isEditorialProduct(product.id))
      .slice()
      .sort((a, b) => Number(b.featured) - Number(a.featured)),
  ];

  const lead = heroProducts[0];

  return (
    <div className="shop-home">
      <section className="rebeca-hero" aria-labelledby="rebeca-hero-title">
        <div className="hero-background-word" aria-hidden="true">REBECA</div>

        <div className="rebeca-hero-copy">
          <p className="hero-eyebrow">REBECA / SANTA FE / EDIT 01</p>
          <h1 id="rebeca-hero-title"><span>NO HAY</span><strong>UNIFORME.</strong></h1>
          <p className="hero-lead">Pijamas, lencería, tops e infantil. Lo que aparece en REBECA, ordenado para mirar mejor y pedir sin vueltas.</p>
          <div className="hero-actions-new">
            <Link className="hero-cta" to="/tienda">Ver tienda <ArrowRight aria-hidden="true" /></Link>
            <a className="hero-link" href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">Instagram ↗</a>
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
              <span className="hero-shot-label">
                <b>{String(index + 1).padStart(2, '0')}</b>
                <span>{product.title}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="hero-dock">
          <span>{catalog.products.length} prendas</span>
          <span aria-hidden="true">●</span>
          <span>9 categorías</span>
          {lead ? <Link to={`/producto/${lead.slug}`}>Abrir selección <ArrowRight aria-hidden="true" /></Link> : null}
        </div>
      </section>

      <section className="home-categories" aria-label="Explorar categorías">
        <div className="rail-title">
          <div><span>Elegí por categoría</span><small>Arrastrá. Tocá. Entrá.</small></div>
          <Link to="/tienda">Todo <ArrowRight aria-hidden="true" /></Link>
        </div>
        <CategoryRail categories={catalog.categories} products={catalog.products} />
      </section>

      {settings?.demoMode ? (
        <div className="demo-notice">Catálogo ilustrativo: precios y disponibilidad se confirman con REBECA.</div>
      ) : null}

      <section className="catalog-showcase" id="seleccion">
        <div className="showcase-head">
          <div>
            <p className="overline">SELECCIÓN REBECA</p>
            <h2>Primero, lo que se siente más REBECA.</h2>
          </div>
          <Link to="/tienda">Ver las {catalog.products.length} <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="product-grid storefront-grid">
          {storefrontProducts.slice(0, 14).map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </section>

      <section className="brand-manifesto" aria-label="Identidad REBECA">
        <p>REBECA / SANTA FE</p>
        <h2>MENOS CATÁLOGO.<br /><span>MÁS ACTITUD.</span></h2>
        <div>
          <span>Prendas que entran por los ojos.</span>
          <span>Elegí talle. Elegí color. Pedí por WhatsApp.</span>
        </div>
      </section>

      <section className="home-instagram">
        <div>
          <p className="overline">DE INSTAGRAM A LA TIENDA</p>
          <h2>@rebeca_santafee</h2>
          <p>Las prendas nuevas entran primero como referencia visual y después se terminan de confirmar con REBECA.</p>
        </div>
        <a className="instagram-action" href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">
          Abrir Instagram <ArrowRight aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
