import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import type { AdminProduct } from './admin-types';

export function AdminDashboard() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi<{ products: AdminProduct[] }>('/api/admin/products')
      .then((response) => setProducts(response.products))
      .catch((cause) => setError(cause.message));
  }, []);

  const published = products.filter((product) => product.status === 'published').length;
  const drafts = products.filter((product) => product.status === 'draft').length;

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <p>Back-office</p>
          <h1>Resumen</h1>
        </div>
        <Link className="admin-button primary" to="/admin/productos/nuevo">
          Nuevo producto
        </Link>
      </header>
      {error ? <div className="admin-alert error">{error}</div> : null}
      <div className="admin-stats">
        <div>
          <span>Productos</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Publicados</span>
          <strong>{published}</strong>
        </div>
        <div>
          <span>Borradores</span>
          <strong>{drafts}</strong>
        </div>
      </div>
      <div className="admin-panel">
        <h2>Operación simple</h2>
        <p>Creá o editá productos acá. Al publicar, el storefront los lee desde Workers KV sin reconstruir el frontend.</p>
        <div className="admin-actions">
          <Link to="/admin/productos">Gestionar catálogo</Link>
          <Link to="/admin/importar">Importar CSV/JSON</Link>
          <Link to="/admin/configuracion">Configurar WhatsApp</Link>
        </div>
      </div>
    </section>
  );
}
