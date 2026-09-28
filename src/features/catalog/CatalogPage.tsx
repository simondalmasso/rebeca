import { Filter, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../app/store';
import { ProductCard } from '../../components/ProductCard';

export function CatalogPage() {
  const { slug } = useParams();
  const { catalog, loading, error } = useStore();
  const [query, setQuery] = useState('');
  const [size, setSize] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sizes = useMemo(
    () =>
      [
        ...new Set(
          catalog?.products.flatMap((product) =>
            product.variants.map((variant) => variant.size).filter(Boolean),
          ) ?? [],
        ),
      ].sort() as string[],
    [catalog],
  );

  const products = useMemo(() => {
    let result = (catalog?.products ?? []).filter((item) => !slug || item.category?.slug === slug);
    const normalized = query.trim().toLowerCase();

    if (normalized) {
      result = result.filter((item) =>
        [item.title, item.category?.name, ...item.variants.flatMap((variant) => [variant.size, variant.color, variant.sku])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalized)),
      );
    }
    if (size) result = result.filter((item) => item.variants.some((variant) => variant.active && variant.size === size));
    if (availability === 'available') {
      result = result.filter((item) =>
        item.variants.some((variant) => variant.active && variant.availability !== 'out_of_stock'),
      );
    }
    if (sort === 'low') result = [...result].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === 'high') result = [...result].sort((a, b) => b.priceCents - a.priceCents);
    if (sort === 'featured') result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [catalog, slug, query, size, availability, sort]);

  if (loading) return <div className="page-state">Cargando catálogo…</div>;
  if (error || !catalog) return <div className="page-state error">{error}</div>;

  const category = slug ? catalog.categories.find((item) => item.slug === slug) : null;
  const activeFilterCount = Number(Boolean(size)) + Number(Boolean(availability));
  const reset = () => {
    setSize('');
    setAvailability('');
  };

  return (
    <section className="catalog-page">
      <div className="catalog-head">
        <div>
          <p className="overline">REBECA</p>
          <h1>{category?.name ?? 'Tienda'}</h1>
          <span>{products.length} productos</span>
        </div>
        <div className="catalog-tools">
          <label className="search-field">
            <span className="sr-only">Buscar</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar prendas, color, SKU…"
            />
          </label>
          <select className="sort-select" aria-label="Ordenar" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Destacados</option>
            <option value="low">Precio: menor a mayor</option>
            <option value="high">Precio: mayor a menor</option>
          </select>
          <button className="button secondary filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(true)}>
            <Filter />
            Filtros
            {activeFilterCount ? <span className="filter-count">{activeFilterCount}</span> : null}
          </button>
        </div>
      </div>

      <div className="catalog-body">
        <aside className="filters desktop-filters">
          <h2>Filtros</h2>
          <label>
            Talle
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              <option value="">Todos</option>
              {sizes.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Disponibilidad
            <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
              <option value="">Todas</option>
              <option value="available">Disponible</option>
            </select>
          </label>
          <button className="text-button" onClick={reset}>
            Limpiar filtros
          </button>
        </aside>
        {products.length ? (
          <div className="product-grid catalog-grid">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h2>No encontramos prendas</h2>
            <p>Probá con otra búsqueda o limpiá los filtros.</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery('');
                reset();
              }}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      {filtersOpen ? (
        <div className="filter-overlay" onClick={() => setFiltersOpen(false)}>
          <div
            className="filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sheet-head">
              <div>
                <p className="overline">Afiná la tienda</p>
                <h2>Filtros</h2>
              </div>
              <button className="icon-button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros">
                <X />
              </button>
            </div>
            <label>
              Talle
              <select value={size} onChange={(event) => setSize(event.target.value)}>
                <option value="">Todos</option>
                {sizes.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Disponibilidad
              <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                <option value="">Todas</option>
                <option value="available">Disponible</option>
              </select>
            </label>
            <div className="sheet-actions">
              <button className="button secondary" onClick={reset}>
                Limpiar
              </button>
              <button className="button primary" onClick={() => setFiltersOpen(false)}>
                Ver {products.length} productos
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
