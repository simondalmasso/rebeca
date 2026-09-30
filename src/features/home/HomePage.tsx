import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/store';
import { CategoryRail } from '../../components/CategoryRail';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';

export function HomePage() {
  const { catalog, settings, loading, error } = useStore();
  if (loading) return <div className="page-state">Cargando tienda…</div>;
  if (error || !catalog) return <div className="page-state error">{error ?? 'No se pudo cargar.'}</div>;

  const products=catalog.products.slice().sort((a,b)=>Number(b.featured)-Number(a.featured));
  const lead=products.find((product)=>product.media[0]) ?? products[0];
  const secondary=products.filter((product)=>product.id!==lead?.id).slice(0,2);

  return (
    <div className="shop-home">
      <section className="rebeca-edit" aria-labelledby="rebeca-edit-title">
        <div className="rebeca-edit-copy">
          <p className="edition-kicker">REBECA EDIT · 01</p>
          <h1 id="rebeca-edit-title">Tu ropa.<br/><em>Tu forma.</em></h1>
          <p className="edit-lead">Una selección más visual, más directa y con el pulso de lo que aparece en Rebeca Santa Fe.</p>
          <div className="edit-actions">
            <Link className="button primary" to="/tienda">Entrar a la tienda <ArrowRight/></Link>
            <a href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">Ver Instagram</a>
          </div>
        </div>

        <div className="rebeca-edit-collage">
          {lead ? <Link className="edit-image edit-image-main" to={`/producto/${lead.slug}`}><ProductImage media={lead.media[0]} alt={lead.title} priority/></Link> : null}
          {secondary.map((product,index)=>(
            <Link className={`edit-image edit-image-${index+2}`} to={`/producto/${product.slug}`} key={product.id}>
              <ProductImage media={product.media[0]} alt={product.title}/>
            </Link>
          ))}
          <span className="edit-stamp">SANTA FE<br/>✦<br/>REBECA</span>
        </div>
      </section>

      <section className="home-categories" aria-label="Explorar categorías">
        <div className="rail-title"><span>Encontrá tu categoría</span><small>deslizá →</small></div>
        <CategoryRail categories={catalog.categories} products={catalog.products}/>
      </section>

      {settings?.demoMode ? <div className="demo-notice">Propuesta demo · catálogo ilustrativo inspirado en referencias públicas de REBECA.</div> : null}

      <section className="catalog-showcase">
        <div className="showcase-head">
          <div><p className="overline">CURADURÍA REBECA</p><h2>Lo que queremos mostrarte</h2></div>
          <Link to="/tienda">Ver todo <ArrowRight/></Link>
        </div>
        <div className="product-grid storefront-grid">
          {products.slice(0,12).map((product,index)=><ProductCard key={product.id} product={product} priority={index<4}/>)}
        </div>
      </section>

      <section className="signature-band" aria-label="Identidad REBECA">
        <span>REBECA</span><b>NO UNIFORMES. NO REGLAS.</b><span>SANTA FE</span>
      </section>

      <section className="home-instagram">
        <div><p className="overline">DE LA RED A LA TIENDA</p><h2>@rebeca_santafee</h2><p>Las referencias visuales del catálogo se adaptan desde las publicaciones de Rebeca.</p></div>
        <a className="button secondary" href={settings?.instagramUrl ?? 'https://www.instagram.com/rebeca_santafee/'} target="_blank" rel="noreferrer">Ir a Instagram <ArrowRight/></a>
      </section>
    </div>
  );
}
