import { Link } from 'react-router-dom';
import type { PublicProduct } from '../../shared/catalog-contract';
import { formatArs } from '../../shared/money';
import { ProductImage } from './ProductImage';

const colorMap: Record<string, string> = {
  negro:'#151515', blanco:'#fff', beige:'#d8bda3', arena:'#c8aa88', crudo:'#eee5d9',
  rosa:'#ef9fba', fucsia:'#e44182', bordó:'#7e263f', bordo:'#7e263f', lila:'#c5a9df',
  uva:'#76566e', gris:'#9b9b9b', 'gris melange':'#aaa7a5', chocolate:'#75523e',
  azul:'#4d6f94', 'azul claro':'#aac9df', mora:'#7a315d', verde:'#7d8b66'
};
const swatch=(color:string)=>colorMap[color.toLowerCase()]??'#d8d4d1';

export function ProductCard({ product, priority=false }:{ product:PublicProduct; priority?:boolean }) {
  const available=product.variants.some((variant)=>variant.active&&variant.availability!=='out_of_stock');
  const colors=[...new Set(product.variants.map((variant)=>variant.color).filter(Boolean))] as string[];

  return (
    <article className="product-card">
      <Link to={`/producto/${product.slug}`} className="product-card-media" aria-label={`Ver ${product.title}`}>
        <ProductImage media={product.media[0]} alt={product.title} priority={priority}/>
        {product.featured ? <span className="editor-pick">REBECA PICK</span> : null}
      </Link>
      <div className="product-card-copy">
        <div className="product-card-main">
          <Link to={`/producto/${product.slug}`} className="product-card-title">{product.title}</Link>
          {product.category ? <span className="product-card-category">{product.category.name}</span> : null}
        </div>
        <div className="product-card-price">
          <strong>{formatArs(product.priceCents)}</strong>
          {product.compareAtPriceCents ? <del>{formatArs(product.compareAtPriceCents)}</del> : null}
        </div>
      </div>
      <div className="product-card-foot">
        {colors.length ? (
          <div className="color-swatches" aria-label="Colores disponibles">
            {colors.slice(0,5).map((color)=>(
              <span className="color-swatch" title={color} aria-label={color} key={color} style={{backgroundColor:swatch(color)}}/>
            ))}
            {colors.length>5 ? <small>+{colors.length-5}</small> : null}
          </div>
        ) : <span/>}
        {!available ? <span className="soldout-label">Sin stock</span> : null}
      </div>
    </article>
  );
}
