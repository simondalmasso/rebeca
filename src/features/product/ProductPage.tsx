import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../app/store';
import { ProductImage } from '../../components/ProductImage';
import { formatArs } from '../../../shared/money';

export function ProductPage() {
  const { slug } = useParams();
  const { catalog, loading, addToCart } = useStore();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = catalog?.products.find((item) => item.slug === slug);
  const active = useMemo(() => product?.variants.filter((variant) => variant.active) ?? [], [product]);
  const sizes = useMemo(
    () => [...new Set(active.map((variant) => variant.size).filter(Boolean))] as string[],
    [active],
  );
  const colors = useMemo(
    () => [...new Set(active.map((variant) => variant.color).filter(Boolean))] as string[],
    [active],
  );

  useEffect(() => {
    setSize(sizes.length === 1 ? sizes[0] : null);
    setColor(colors.length === 1 ? colors[0] : null);
    setQuantity(1);
    setAdded(false);
  }, [product?.id, sizes, colors]);

  const variant = useMemo(
    () => active.find((item) => (!item.size || item.size === size) && (!item.color || item.color === color)),
    [active, size, color],
  );

  if (loading) return <div className="page-state">Cargando producto…</div>;
  if (!product)
    return (
      <div className="page-state">
        <h1>Producto no encontrado</h1>
        <Link to="/tienda">Volver a la tienda</Link>
      </div>
    );

  const available = Boolean(variant && variant.availability !== 'out_of_stock');
  const price = variant?.priceOverrideCents ?? product.priceCents;
  const chooseSize = (value: string) => {
    setSize(value);
    const possible = active.filter((item) => item.size === value && item.availability !== 'out_of_stock');
    if (color && !possible.some((item) => item.color === color)) setColor(possible[0]?.color ?? null);
  };

  return (
    <section className="pdp">
      <div className="pdp-gallery" aria-label={`Imágenes de ${product.title}`}>
        {product.media.length ? (
          product.media.map((media, index) => (
            <ProductImage key={media.id} media={media} alt={product.title} priority={index === 0} />
          ))
        ) : (
          <ProductImage alt={product.title} />
        )}
      </div>
      <div className="pdp-info">
        <p className="breadcrumb">
          <Link to="/tienda">Tienda</Link> / {product.category?.name ?? 'Producto'}
        </p>
        <h1>{product.title}</h1>
        {product.subtitle ? <p className="subtitle">{product.subtitle}</p> : null}
        <div className="pdp-price">
          <strong>{formatArs(price)}</strong>
          {product.compareAtPriceCents ? <del>{formatArs(product.compareAtPriceCents)}</del> : null}
        </div>
        {product.description ? <p className="description">{product.description}</p> : null}

        {sizes.length ? (
          <fieldset className="variant-field">
            <legend>
              Talle <span>{size ?? 'Elegí uno'}</span>
            </legend>
            <div className="variant-options">
              {sizes.map((value) => {
                const ok = active.some((item) => item.size === value && item.availability !== 'out_of_stock');
                return (
                  <button
                    type="button"
                    className={size === value ? 'selected' : ''}
                    disabled={!ok}
                    onClick={() => chooseSize(value)}
                    key={value}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {colors.length ? (
          <fieldset className="variant-field">
            <legend>
              Color <span>{color ?? 'Elegí uno'}</span>
            </legend>
            <div className="variant-options">
              {colors.map((value) => {
                const ok = active.some(
                  (item) => (!size || item.size === size) && item.color === value && item.availability !== 'out_of_stock',
                );
                return (
                  <button
                    type="button"
                    className={color === value ? 'selected' : ''}
                    disabled={!ok}
                    onClick={() => setColor(value)}
                    key={value}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <div className="purchase-row">
          <div className="quantity-control">
            <button type="button" aria-label="Restar cantidad" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
              <Minus />
            </button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" aria-label="Sumar cantidad" onClick={() => setQuantity((current) => Math.min(10, current + 1))}>
              <Plus />
            </button>
          </div>
          <button
            className="button primary add-button"
            disabled={!available}
            onClick={() => {
              if (variant) {
                addToCart(product, variant.id, quantity);
                setAdded(true);
              }
            }}
          >
            <ShoppingBag />
            {available ? 'Agregar al carrito' : 'Elegí una opción'}
          </button>
        </div>
        {added ? (
          <div className="add-success" role="status">
            Agregado. <Link to="/carrito">Ver carrito</Link>
          </div>
        ) : null}
        <p className="purchase-note">El pedido se confirma por WhatsApp. No se solicitan datos de tarjeta.</p>
      </div>
    </section>
  );
}
