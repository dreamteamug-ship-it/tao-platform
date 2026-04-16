'use client';
import Image from 'next/image';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  condition: string;
  mileage?: number;
  engine_cc?: number;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  color?: string;
  image_url?: string;
  agent?: string;
  country?: string;
  verified?: boolean;
  narrative_description?: string;
  engine_url?: string; // legacy field alias
}

interface Props {
  vehicle: Vehicle;
  onExpand: (v: Vehicle) => void;
}

const FUEL_ICON: Record<string, string> = {
  Diesel: '⛽', Petrol: '⛽', Electric: '⚡', Hybrid: '🔋',
};

export default function VehicleCard({ vehicle, onExpand }: Props) {
  const fmtPrice = (p: number) =>
    p >= 1_000_000
      ? `KSh ${(p / 1_000_000).toFixed(1)}M`
      : `KSh ${p.toLocaleString()}`;

  return (
    <div
      onClick={() => onExpand(vehicle)}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-gold)',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.25s, box-shadow 0.25s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(212,175,55,0.2)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 200, background: '#0a0f1a' }}>
        <Image
          src={vehicle.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format'}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          sizes="380px"
          style={{ objectFit: 'cover' }}
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,10,16,0.85) 0%, transparent 55%)' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          <span style={{ background: 'rgba(5,10,16,0.8)', border: '1px solid var(--border-gold)', color: 'var(--gold)', padding: '3px 10px', borderRadius: 12, fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
            {vehicle.category}
          </span>
          {vehicle.verified && (
            <span style={{ background: 'rgba(39,174,96,0.2)', border: '1px solid #27ae60', color: '#27ae60', padding: '3px 10px', borderRadius: 12, fontSize: '0.7rem' }}>
              ✓ TAO Verified
            </span>
          )}
        </div>

        {/* Condition */}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span style={{ background: vehicle.condition === 'New' ? 'rgba(39,174,96,0.3)' : 'rgba(212,175,55,0.2)', border: `1px solid ${vehicle.condition === 'New' ? '#27ae60' : 'var(--border-gold)'}`, color: vehicle.condition === 'New' ? '#27ae60' : 'var(--gold)', padding: '3px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 700 }}>
            {vehicle.condition}
          </span>
        </div>

        {/* Price at bottom of image */}
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {fmtPrice(vehicle.price)}
          </div>
          {vehicle.country && (
            <span style={{ fontSize: '0.72rem', color: 'var(--silver)', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 8 }}>
              {vehicle.country}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Title */}
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </div>
          {vehicle.color && (
            <div style={{ color: 'var(--silver)', fontSize: '0.76rem', marginTop: 2 }}>{vehicle.color}</div>
          )}
        </div>

        {/* Spec chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {vehicle.mileage !== undefined && (
            <Chip icon="🛣️" label={vehicle.mileage === 0 ? 'Brand New' : `${(vehicle.mileage / 1000).toFixed(0)}k km`} />
          )}
          {vehicle.engine_cc !== undefined && vehicle.engine_cc > 0 && (
            <Chip icon="⚙️" label={`${(vehicle.engine_cc / 1000).toFixed(1)}L`} />
          )}
          {vehicle.fuel_type && (
            <Chip icon={FUEL_ICON[vehicle.fuel_type] || '⛽'} label={vehicle.fuel_type} />
          )}
          {vehicle.transmission && (
            <Chip icon="🔧" label={vehicle.transmission} />
          )}
        </div>

        {/* Agent */}
        {vehicle.agent && (
          <div style={{ color: 'var(--silver)', fontSize: '0.74rem', borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fas fa-user-tie" style={{ color: 'var(--gold)', fontSize: '0.7rem' }} />
            {vehicle.agent}
          </div>
        )}

        {/* Finance buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <a
            href="/finance/hire"
            onClick={e => e.stopPropagation()}
            style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'rgba(212,175,55,0.12)', border: '1px solid var(--border-gold)', borderRadius: 10, color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}
          >
            <i className="fas fa-car" style={{ marginRight: 4 }} />Hire Purchase
          </a>
          <a
            href="/finance/logbook"
            onClick={e => e.stopPropagation()}
            style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'rgba(74,144,226,0.1)', border: '1px solid rgba(74,144,226,0.4)', borderRadius: 10, color: '#4A90E2', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}
          >
            <i className="fas fa-file-alt" style={{ marginRight: 4 }} />Logbook Loan
          </a>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, padding: '3px 8px', fontSize: '0.7rem', color: 'var(--silver)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icon} {label}
    </span>
  );
}
