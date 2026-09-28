import { ArrowLeft, MessageCircle } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../../app/store';
import { formatArs, lineTotalCents } from '../../../shared/money';
import { buildOrderCode, buildWhatsAppMessage, buildWhatsAppUrl } from '../../../shared/whatsapp-order';

export function CheckoutPage() {
  const { cart, settings } = useStore();
  const [name, setName] = useState('');
  const [delivery, setDelivery] = useState('');
  const [note, setNote] = useState('');
  const [outbound, setOutbound] = useState<{ code: string; url: string } | null>(null);
  const total = useMemo(
    () => cart.reduce((sum, line) => sum + lineTotalCents(line.unitPriceCents, line.quantity), 0),
    [cart],
  );

  if (!cart.length) return <Navigate to="/carrito" replace />;
  if (cart.some((line) => line.stale)) return <Navigate to="/carrito" replace />;

  const options = [settings?.deliveryLabel ?? 'Coordinar envío', settings?.pickupLabel ?? 'Retiro'];
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!settings?.whatsappNumber) return;
    const code = buildOrderCode();
    const message = buildWhatsAppMessage({
      code,
      name,
      delivery,
      note,
      items: cart.map((line) => ({
        title: line.title,
        size: line.size,
        color: line.color,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
      })),
    });
    setOutbound({ code, url: buildWhatsAppUrl(settings.whatsappNumber, message) });
  };

  return (
    <section className="checkout-page">
      <div className="checkout-form-wrap">
        <Link className="back-link" to="/carrito">
          <ArrowLeft />
          Volver al carrito
        </Link>
        <p className="overline">Último paso</p>
        <h1>Finalizá tu pedido</h1>
        <p>Dejanos lo mínimo para preparar el mensaje. La coordinación continúa por WhatsApp.</p>

        <form onSubmit={submit} className="checkout-form">
          <label>
            Nombre
            <input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" />
          </label>
          <fieldset>
            <legend>Entrega</legend>
            {options.map((option) => (
              <label className="radio" key={option}>
                <input
                  type="radio"
                  name="delivery"
                  required
                  value={option}
                  checked={delivery === option}
                  onChange={() => setDelivery(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
          <label>
            Nota <span>(opcional)</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              placeholder="Color, horario o detalle que quieras aclarar"
            />
          </label>
          {settings?.whatsappNumber ? (
            <button className="button primary full" type="submit">
              Preparar pedido <MessageCircle />
            </button>
          ) : (
            <div className="config-warning">
              <strong>WhatsApp todavía no configurado.</strong>
              <span>La tienda sigue en modo demo y no abre un número ficticio.</span>
            </div>
          )}
        </form>

        {outbound ? (
          <div className="whatsapp-ready" role="status">
            <p>
              Pedido <strong>{outbound.code}</strong> listo.
            </p>
            <a data-testid="whatsapp-link" className="button whatsapp full" href={outbound.url} target="_blank" rel="noreferrer">
              Abrir WhatsApp <MessageCircle />
            </a>
          </div>
        ) : null}
      </div>

      <aside className="checkout-summary">
        <p className="overline">Detalle</p>
        <h2>Tu pedido</h2>
        {cart.map((line) => (
          <div className="checkout-line" key={line.key}>
            <span>
              {line.title}
              <small>
                {[line.size, line.color].filter(Boolean).join(' / ')} × {line.quantity}
              </small>
            </span>
            <strong>{formatArs(lineTotalCents(line.unitPriceCents, line.quantity))}</strong>
          </div>
        ))}
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatArs(total)}</strong>
        </div>
        <small>No se procesa un pago online.</small>
      </aside>
    </section>
  );
}
