'use client';
import { Property, Language, TRANSLATIONS } from '@/types';

interface PropertyCardProps {
  property: Property;
  lang: Language;
  onOpenDashboard: (p: Property) => void;
  onShareUnlock: (id: string) => void;
}

export default function PropertyCard({ property, lang, onOpenDashboard, onShareUnlock }: PropertyCardProps) {
  const t = TRANSLATIONS[lang];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://wa.me/?text=${encodeURIComponent(`🏢 ${property.title} - KES ${property.price.toLocaleString()} on Together As One! Check it out.`)}`;
    window.open(url, '_blank');
    setTimeout(() => onShareUnlock(property.id), 800);
  };

  const handleCardClick = () => {
    if (property.share_unlock) {
      onOpenDashboard(property);
    } else {
      alert(t.locked);
    }
  };

  return (
    <article
      className="property-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${property.title} - KES ${property.price.toLocaleString()}`}
      id={`card-${property.id}`}
    >
      <div
        className="card-image"
        style={{ backgroundImage: `url('${property.image_url}')` }}
        role="img"
        aria-label={property.title}
      >
        <div className={`gps-badge ${!property.gps_active ? 'disabled' : ''}`}>
          <i className={`fas fa-${property.gps_active ? 'satellite-dish' : 'satellite'}`} aria-hidden="true" />
          {property.gps_active ? t.gpsActive : t.gpsOff}
        </div>
        {!property.share_unlock && (
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(0,0,0,0.75)', padding: '3px 10px',
            borderRadius: 20, fontSize: '0.7rem', zIndex: 1,
          }}>
            <i className="fab fa-whatsapp" aria-hidden="true" /> Share 1×
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-category">{property.category}</div>
        <h3 className="card-title">
          {property.title}
          {property.verified && (
            <i className="fas fa-check-circle verified-badge" aria-label="Verified" />
          )}
        </h3>
        <div className="card-price">KES {property.price.toLocaleString()}</div>
        <div className="card-details">
          🏠 {property.bedrooms} bed &nbsp;|&nbsp; 🚿 {property.bathrooms} bath &nbsp;|&nbsp; {property.land_size} sqm
        </div>
        <div className="transaction-flags">
          {property.transactions.map(tx => (
            <span key={tx} className="flag">{tx.toUpperCase()}</span>
          ))}
        </div>

        {property.share_unlock ? (
          <div className="unlocked-badge">
            <i className="fas fa-unlock" aria-hidden="true" /> Finance Unlocked — Click to view
          </div>
        ) : (
          <button
            className="share-btn"
            onClick={handleShare}
            id={`share-btn-${property.id}`}
            aria-label={`Share ${property.title} on WhatsApp`}
          >
            <i className="fab fa-whatsapp" aria-hidden="true" />
            {t.unlock}
          </button>
        )}
      </div>
    </article>
  );
}
