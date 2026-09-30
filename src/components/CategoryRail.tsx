import { Link } from 'react-router-dom';
import type { PublicCategory, PublicProduct } from '../../shared/catalog-contract';
import { ProductImage } from './ProductImage';

type Props = { categories: PublicCategory[]; products: PublicProduct[] };

export function CategoryRail({ categories, products }: Props) {
  const featured = categories.slice().sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 8);

  return (
    <nav className="category-rail" aria-label="Categorías">
      <Link className="category-bubble active" to="/tienda">
        <span className="category-bubble-media category-bubble-all"><b>R</b></span>
        <span>Todo</span>
      </Link>
      {featured.map((category) => {
        const product = products.find((item) => item.category?.slug === category.slug && item.media[0]);
        return (
          <Link className="category-bubble" to={`/categoria/${category.slug}`} key={category.id}>
            <span className="category-bubble-media">
              <ProductImage media={product?.media[0]} alt={category.name} />
            </span>
            <span>{category.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
