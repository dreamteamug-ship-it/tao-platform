'use client';
import dynamic from 'next/dynamic';
import { Property } from '@/types';
import { calculateBookingPrice } from '@/lib/pricingCalculator';

const BookingCalendar = dynamic(() => import('@/components/BookingCalendar'), { ssr: false });

interface ProductDashboardProps {
  property: Property;
  lang: string;
  onClose: () => void;
  onOpenFinance: (type: string, propertyId: string) => void;
}

export default function ProductDashboard({ property, lang, onClose, onOpenFinance }: ProductDashboardProps) {
  const isAirbnb = property.category === 'Airbnb';
  const nightlyRate = Math.floor(property.price / 30);

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="card-category" style={{ marginRight: 10 }}>{property.category}</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.2rem' }}>{property.title}</h2>
          </div>
          <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '5px 12px' }} onClick={onClose}>✕</button>
        </div>

        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden', borderRadius: 12, margin: '0 20px 16px' }}>
          <img src={property.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <span style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700 }}>
              KSh {property.price.toLocaleString()}
            </span>
            {isAirbnb && <span style={{ color: 'var(--silver)', fontSize: '0.82rem', marginLeft: 6 }}>≈ KSh {nightlyRate.toLocaleString()}/night</span>}
          </div>
          {property.gps_active && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,200,100,0.2)', border: '1px solid var(--success)', borderRadius: 20, padding: '4px 10px', color: 'var(--success)', fontSize: '0.72rem', fontWeight: 600 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', marginRight: 5, animation: 'pulse 1.5s infinite' }} />
              GPS LIVE
            </div>
          )}
        </div>

        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: isAirbnb ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* Left column — details */}
          <div>
            {/* Property Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { icon: 'fa-bed', label: 'Beds', val: property.bedrooms || '—' },
                { icon: 'fa-bath', label: 'Baths', val: property.bathrooms || '—' },
                { icon: 'fa-ruler-combined', label: 'Size', val: `${property.land_size || '—'}m²` },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                  <i className={`fas ${s.icon}`} style={{ color: 'var(--gold)', fontSize: '1rem', display: 'block', marginBottom: 4 }} />
                  <div style={{ color: '#fff', fontWeight: 700 }}>{s.val}</div>
                  <div style={{ color: 'var(--silver)', fontSize: '0.72rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Agent & Verification */}
            <div style={{ marginBottom: 20 }}>
              {property.agent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700 }}>
                    {property.agent[0]}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.88rem' }}>{property.agent}</div>
                    <div style={{ color: 'var(--silver)', fontSize: '0.74rem' }}>Licensed TAO Agent</div>
                  </div>
                  {property.verified && <span style={{ marginLeft: 'auto', color: 'var(--success)', fontSize: '0.74rem' }}>✓ Verified</span>}
                </div>
              )}
            </div>

            {/* Finance / Action Buttons */}
            {!isAirbnb && (
              <div>
                <h4 style={{ color: 'var(--gold)', marginBottom: 12, fontSize: '0.9rem' }}>
                  <i className="fas fa-landmark" style={{ marginRight: 8 }} />Property Finance
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { key: 'mortgage', label: 'Mortgage', icon: 'fa-home' },
                    { key: 'equity', label: 'Equity Release', icon: 'fa-unlock-alt' },
                    { key: 'construction', label: 'Construction', icon: 'fa-hard-hat' },
                    { key: 'bridging', label: 'Bridging Loan', icon: 'fa-bridge' },
                  ].map(ft => (
                    <a key={ft.key} href={`/finance/${ft.key}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', borderRadius: 10, color: 'var(--silver)', fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                      <i className={`fas ${ft.icon}`} style={{ color: 'var(--gold)' }} />
                      {ft.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Contact */}
            <div style={{ marginTop: 16 }}>
              <a href={`https://wa.me/254718554383?text=Hi, I'm interested in ${property.title} (${property.id})`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', background: '#25D366', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
                <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }} />
                Contact Agent on WhatsApp
              </a>
            </div>
          </div>

          {/* Right column — Booking Calendar for Airbnb */}
          {isAirbnb && (
            <div>
              <h4 style={{ color: 'var(--gold)', marginBottom: 12, fontSize: '0.9rem' }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: 8 }} />Book Your Stay
              </h4>
              <BookingCalendar
                propertyId={property.id}
                baseRate={nightlyRate}
                onBooked={(data) => console.log('Booked:', data)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
