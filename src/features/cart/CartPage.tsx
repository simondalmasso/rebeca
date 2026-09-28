import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/store';
import { formatArs, lineTotalCents } from '../../../shared/money';
import { mediaUrl } from '../../components/ProductImage';

export function CartPage() {
  const { cart, setQuantity, removeLine } = useStore();
  const total = cart.reduce((sum, line) => sum + lineTotalCents(line.unitPriceCents, line.quantity), 0);
  const hasStale = cart.some((line) => line.stale);

  if (!cart.length)
    return (
      <section className="empty-cart">
        <p className="overline">Tu selección</p>
        <h1>Tu carrito está vacío</h1>
        <p>Cuando encuentres algo que te guste, aparece acá.</p>
        <Link className="button primary" to="/tienda">
          Ver tienda
        </Link>
      </section>
    );

  return (
    <section className="cart-page">
      <div className="cart-main">
        <p className="overline">Tu selección</p>
        <h1>Carrito</h1>
        <p className="cart-count">{cart.reduce((sum, line) => sum + line.quantity, 0)} prendas</p>
        <div className="cart-lines">
          {cart.map((line) => (
            <article className={`cart-line ${line.stale ? 'stale' : ''}`} key={line.key}>
              {line.mediaKey ? <img src={mediaUrl(line.mediaKey)} alt="" /> : <div className="cart-thumb-placeholder" />}
              <div className="cart-line-info">
                <Link to={`/producto/${line.productSlug}`}>{line.title}</Link>
                <p>{[line.size, line.color].filter(Boolean).join(' / ')}</p>
                {line.stale ? <strong className="stale-warning">Este producto cambió o ya no está disponible.</strong> : null}
                <div className="quantity-control small">
                  <button type="button" onClick={() => setQuantity(line.key, line.quantity - 1)} aria-label="Restar">
                    <Minus />
                  </button>
                  <span>{line.quantity}</span>
                  <button type="button" onClick={() => setQuantity(line.key, line.quantity + 1)} aria-label="Sumar">
                    <Plus />
                  </button>
                </div>
              </div>
              <div className="cart-line-price">
                <strong>{formatArs(lineTotalCents(line.unitPriceCents, line.quantity))}</strong>
                <button type="button" className="icon-button" onClick={() => removeLine(line.key)} aria-label={`Quitar ${line.title}`}>
                  <Trash2 />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="cart-summary">
        <p className="overline">Pedido</p>
        <h2>Resumen</h2>
        <div>
          <span>Subtotal</span>
          <strong>{formatArs(total)}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatArs(total)}</strong>
        </div>
        <p className="summary-note">La coordinación continúa por WhatsApp. No se procesa un pago online.</p>
        {hasStale ? (
          <p className="stale-warning">Revisá los productos marcados antes de continuar.</p>
        ) : (
          <Link className="button primary full" to="/checkout">
            Continuar pedido
          </Link>
        )}
        <Link className="text-link" to="/tienda">
          Seguir comprando
        </Link>
      </aside>
    </section>
  );
}
