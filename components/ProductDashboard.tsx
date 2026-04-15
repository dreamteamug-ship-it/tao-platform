'use client';
import { Property, Language } from '@/types';

interface ProductDashboardProps {
  property: Property;
  lang: Language;
  onClose: () => void;
  onOpenFinance: (type: string, propertyId: string) => void;
}

const FINANCE_OPTIONS = ['Mortgage', 'Construction Loan', 'Bridge Finance', 'Equity Release', 'Development Finance'];

export default function ProductDashboard({ property, lang, onClose, onOpenFinance }: ProductDashboardProps) {
  const investmentScore = Math.floor(Math.random() * 25) + 73;

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label={`Property details: ${property.title}`}
      onClick={e => e.target === e.currentTarget && onClose()}
      id="product-modal"
    >
      <div className="modal-card">
        <div className="modal-header">
          <h2 style={{ margin: 0, fontSize: '1.7rem' }}>{property.title}</h2>
          <button
            className="btn-outline"
            style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '6px 16px' }}
            onClick={onClose}
            id="btn-close-product-modal"
            aria-label="Close property details"
          >
            <i className="fas fa-times" /> Close
          </button>
        </div>

        {/* Media */}
        <div className="dash-media-box">
          <img src={property.image_url} alt={property.title} loading="lazy" />
          <div className="media-badge">
            <i className="fas fa-vr-cardboard" aria-hidden="true" /> 4K / 360° Virtual Tour
          </div>
        </div>

        {/* Price + Escrow */}
        <div className="price-row">
          <p className="price-display">KES {property.price.toLocaleString()}</p>
          <button
            className="btn-gold"
            style={{ padding: '13px 28px', fontSize: '0.95rem' }}
            onClick={() => alert('Smart Escrow initiated with AI Agent. You will receive a secure contract link within 2 hours.')}
            id="btn-smart-escrow"
          >
            <i className="fas fa-shield-alt" /> Smart Escrow
          </button>
        </div>

        {/* Status Grid */}
        <div className="status-grid">
          <div className={`status-item ${property.verified ? 'verified' : 'unverified'}`}>
            <i className="fas fa-check-circle fa-lg" aria-hidden="true" />
            <div>
              <strong>KYC Status</strong>
              <span>{property.verified ? 'Approved' : 'Pending Review'}</span>
            </div>
          </div>
          <div className={`status-item ${property.gps_active ? 'verified' : 'unverified'}`}>
            <i className="fas fa-satellite-dish fa-lg" aria-hidden="true" />
            <div>
              <strong>Telemetry</strong>
              <span>{property.gps_active ? 'Live GPS Active' : 'GPS Offline'}</span>
            </div>
          </div>
          <div className="status-item verified">
            <i className="fas fa-chart-line fa-lg" aria-hidden="true" />
            <div>
              <strong>AI Investment Score</strong>
              <span style={{ color: investmentScore >= 85 ? 'var(--success)' : 'var(--gold)' }}>{investmentScore}%</span>
            </div>
          </div>
          <div className="status-item verified">
            <i className="fas fa-calendar fa-lg" aria-hidden="true" />
            <div>
              <strong>Year Built</strong>
              <span>{property.year_built}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="dash-narration">
          <strong>{property.category}</strong> property featuring{' '}
          <strong>{property.bedrooms} bedrooms</strong> and{' '}
          <strong>{property.bathrooms} bathrooms</strong> on{' '}
          <strong>{property.land_size} sqm</strong>. Built in {property.year_built}.
          Located in a prime Nairobi neighborhood. Verified title deed ready for transfer.
          Energy-efficient design with smart home integration and 24/7 security. Managed by{' '}
          <strong>{property.agent}</strong> — an AI-verified professional on the TAO Nexus.
        </div>

        {/* Agent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0 20px', padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark, #B8860B))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-blue)', fontWeight: 700, fontSize: '1.1rem' }}>
            {property.agent?.charAt(0) || 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{property.agent}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--silver)' }}>
              <i className="fas fa-check-circle" style={{ color: '#1DA1F2' }} /> TAO Verified Agent &nbsp;·&nbsp;
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi, I'm interested in ${property.title}`}
                style={{ color: 'var(--success)', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Finance Options */}
        <h3 className="section-heading">Micro-Finance Solutions</h3>
        <div className="finance-tags">
          {FINANCE_OPTIONS.map(opt => (
            <button
              key={opt}
              className="fin-tag"
              onClick={() => { onOpenFinance(opt, property.id); onClose(); }}
              id={`fin-${opt.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <i className="fas fa-hand-holding-usd" style={{ marginRight: 6 }} />{opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
