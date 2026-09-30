import { Link } from 'react-router-dom';
import type { PublicCategory, PublicProduct } from '../../shared/catalog-contract';
import { ProductImage } from './ProductImage';

type Props = { categories: PublicCategory[]; products: PublicProduct[] };

export function CategoryRail({ categories, products }: Props) {
  const featured = categories.slice().sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 8);

  const findCategoryImage = (slug: string) => (
    products.find((item) => !item.id.startsWith('demo-product-') && item.category?.slug === slug && item.media[0])
    ?? products.find((item) => item.category?.slug === slug && item.media[0])
  );

  return (
    <nav className="category-rail" aria-label="Categorías">
      <Link className="category-ticket category-ticket-all" to="/tienda">
        <span className="category-number">00</span>
        <span className="category-bubble-media category-bubble-all"><b>R.</b></span>
        <span className="category-ticket-copy"><b>Todo</b><small>{products.length} prendas</small></span>
      </Link>
      {featured.map((category, index) => {
        const product = findCategoryImage(category.slug);
        const count = products.filter((item) => item.category?.slug === category.slug).length;
        return (
          <Link className="category-ticket" to={`/categoria/${category.slug}`} key={category.id}>
            <span className="category-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="category-bubble-media">
              <ProductImage media={product?.media[0]} alt={category.name} />
            </span>
            <span className="category-ticket-copy"><b>{category.name}</b><small>{count} {count === 1 ? 'prenda' : 'prendas'}</small></span>
          </Link>
        );
      })}
    </nav>
  );
}
