import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../../app/store';
import { formatArs, lineTotalCents } from '../../../shared/money';
import { WHATSAPP_URL } from '../../../shared/whatsapp-order';

export function CheckoutPage() {
  const { cart } = useStore();
  const total = useMemo(
    () => cart.reduce((sum, line) => sum + lineTotalCents(line.unitPriceCents, line.quantity), 0),
    [cart],
  );

  if (!cart.length) return <Navigate to="/carrito" replace />;
  if (cart.some((line) => line.stale)) return <Navigate to="/carrito" replace />;

  return (
    <section className="checkout-page">
      <div className="checkout-form-wrap">
        <Link className="back-link" to="/carrito">
          <ArrowLeft />
          Volver al carrito
        </Link>
        <p className="overline">PEDIDO</p>
        <h1>Finalizar pedido</h1>
        <p>Pago, entrega y disponibilidad se coordinan por WhatsApp.</p>
        <a data-testid="whatsapp-link" className="button whatsapp full" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          Continuar por WhatsApp <MessageCircle />
        </a>
      </div>

      <aside className="checkout-summary">
        <p className="overline">DETALLE</p>
        <h2>Tu pedido</h2>
        {cart.map((line) => (
          <div className="checkout-line" key={line.key}>
            <span>
              {line.title}
              <small>
                {[line.size, line.color].filter(Boolean).join(' / ')}
                {[line.size, line.color].some(Boolean) ? ' · ' : ''}× {line.quantity}
              </small>
            </span>
            <strong>{formatArs(lineTotalCents(line.unitPriceCents, line.quantity))}</strong>
          </div>
        ))}
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatArs(total)}</strong>
        </div>
      </aside>
    </section>
  );
}
