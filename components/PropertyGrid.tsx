'use client';
import PropertyCard from './PropertyCard';
import { Property, Language, TRANSLATIONS } from '@/types';

interface PropertyGridProps {
  properties: Property[];
  lang: Language;
  loading: boolean;
  category: string;
  setCategory: (c: string) => void;
  sortOrder: string;
  setSortOrder: (s: string) => void;
  transFilter: string;
  setTransFilter: (t: string) => void;
  onOpenDashboard: (p: Property) => void;
  onShareUnlock: (id: string) => void;
}

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Land', 'Airbnb'];

export default function PropertyGrid({
  properties, lang, loading,
  category, setCategory, sortOrder, setSortOrder, transFilter, setTransFilter,
  onOpenDashboard, onShareUnlock,
}: PropertyGridProps) {
  const t = TRANSLATIONS[lang];

  // Client-side filter + sort (applied on local data)
  let filtered = properties.filter(p => category === 'All' || p.category === category);
  if (transFilter !== 'all') filtered = filtered.filter(p => p.transactions?.includes(transFilter));
  if (sortOrder === 'low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortOrder === 'high') filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <main className="shop-view" id="shop-view">
      {/* Controls */}
      <div className="controls" role="toolbar" aria-label="Property filters">
        <div className="filter-btns">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              id={`filter-${cat.toLowerCase()}`}
              aria-pressed={category === cat}
            >
              {cat === 'All' ? t.all : cat}
            </button>
          ))}
        </div>

        <select
          value={transFilter}
          onChange={e => setTransFilter(e.target.value)}
          className="sort-select"
          id="trans-filter"
          aria-label="Transaction type filter"
        >
          <option value="all">{t.allTrans}</option>
          <option value="buy">{t.forSale}</option>
          <option value="rent">{t.forRent}</option>
          <option value="lease">{t.forLease}</option>
          <option value="tradein">{t.tradeIn}</option>
        </select>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="sort-select"
          id="price-sort"
          aria-label="Sort order"
        >
          <option value="default">{t.sortRel}</option>
          <option value="low">{t.sortLow}</option>
          <option value="high">{t.sortHigh}</option>
        </select>

        <div style={{ marginLeft: 'auto', color: 'var(--silver)', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace" }}>
          <i className="fas fa-database" style={{ color: 'var(--gold)', marginRight: 6 }} />
          {filtered.length} listings
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--silver)' }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4, margin: '0 auto 20px' }} />
          <p>Loading properties from TAO Nexus...</p>
        </div>
      ) : (
        <div className="property-grid" id="property-grid" role="list" aria-label="Property listings">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-building" aria-hidden="true" />
              <p>No properties match the selected filters.</p>
            </div>
          ) : (
            filtered.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                lang={lang}
                onOpenDashboard={onOpenDashboard}
                onShareUnlock={onShareUnlock}
              />
            ))
          )}
        </div>
      )}
    </main>
  );
}
