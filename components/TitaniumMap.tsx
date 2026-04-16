'use client';
import { useState, useEffect, useRef } from 'react';
import { calculatePatientScore, RECOVERY_SOP_LABELS, RecoveryStatus, PatientScoreResult } from '@/lib/recoveryEngine';

// ═══════════════════════════════════════════════════════════════
// TITANIUM SOVEREIGN IoT MAP — 27 SADC/EA Countries
// Google Maps with live telemetry pins: Blue/Red/Green
// Fly-to logic | GPS search | Amanda escalation alerts
// ═══════════════════════════════════════════════════════════════

interface MapAsset {
  id: string; name: string; lat: number; lng: number;
  country: string; type: string; status: RecoveryStatus;
  score: number; currency: string;
}

// 27-country representative seed assets
const SEED_ASSETS: MapAsset[] = [
  { id:'KE-001', name:'Karen Estate — Nairobi', lat:-1.3194, lng:36.7065, country:'KE', type:'real_estate', status:'GREEN', score:88, currency:'KES' },
  { id:'KE-002', name:'Land Cruiser V8 2022', lat:-1.2921, lng:36.8219, country:'KE', type:'vehicle', status:'GREEN', score:91, currency:'KES' },
  { id:'UG-001', name:'Kampala Office Complex', lat:0.3163, lng:32.5822, country:'UG', type:'real_estate', status:'BLUE', score:62, currency:'UGX' },
  { id:'TZ-001', name:'Dar Beachfront Villa', lat:-6.7924, lng:39.2083, country:'TZ', type:'real_estate', status:'GREEN', score:79, currency:'TZS' },
  { id:'ZA-001', name:'Johannesburg Commercial Hub', lat:-26.2041, lng:28.0473, country:'ZA', type:'real_estate', status:'GREEN', score:85, currency:'ZAR' },
  { id:'RW-001', name:'Kigali Innovation Centre', lat:-1.9441, lng:30.0619, country:'RW', type:'real_estate', status:'GREEN', score:93, currency:'RWF' },
  { id:'ET-001', name:'Addis Ababa Warehouse', lat:9.0280, lng:38.7469, country:'ET', type:'commercial', status:'BLUE', score:58, currency:'ETB' },
  { id:'ZM-001', name:'Lusaka Medical Plaza', lat:-15.4167, lng:28.2833, country:'ZM', type:'real_estate', status:'BLUE', score:67, currency:'ZMW' },
  { id:'GH-001', name:'Accra Tech Hub', lat:5.5502, lng:-0.2174, country:'GH', type:'real_estate', status:'GREEN', score:80, currency:'GHS' },
  { id:'NG-001', name:'Lagos Marina Penthouse', lat:6.4698, lng:3.5852, country:'NG', type:'real_estate', status:'BLUE', score:55, currency:'NGN' },
  { id:'MZ-001', name:'Maputo Coastal Asset', lat:-25.9692, lng:32.5732, country:'MZ', type:'real_estate', status:'RED', score:38, currency:'MZN' },
  { id:'BW-001', name:'Gaborone Business Park', lat:-24.6282, lng:25.9231, country:'BW', type:'commercial', status:'GREEN', score:82, currency:'BWP' },
  { id:'DJ-001', name:'Djibouti Port Logistics', lat:11.5892, lng:43.1456, country:'DJ', type:'commercial', status:'BLUE', score:61, currency:'DJF' },
  { id:'MU-001', name:'Mauritius Luxury Resort', lat:-20.2883, lng:57.5504, country:'MU', type:'real_estate', status:'GREEN', score:95, currency:'MUR' },
  { id:'NA-001', name:'Windhoek Residential Complex', lat:-22.5597, lng:17.0832, country:'NA', type:'real_estate', status:'GREEN', score:77, currency:'NAD' },
];

const STATUS_COLORS: Record<RecoveryStatus, string> = {
  GREEN: '#27AE60', BLUE: '#3498DB', RED: '#E74C3C',
};

const STATUS_LABELS: Record<RecoveryStatus, string> = {
  GREEN: '✅ Sovereign Verified', BLUE: '⏳ AI Processing', RED: '🚨 Escalate to Human',
};

export default function TitaniumMap() {
  const mapRef   = useRef<HTMLDivElement>(null);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState<RecoveryStatus | 'ALL'>('ALL');
  const [selected, setSelected]   = useState<MapAsset | null>(null);
  const [recovery, setRecovery]   = useState<PatientScoreResult | null>(null);
  const [time, setTime]           = useState(new Date());

  // Digital task timer
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = SEED_ASSETS.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.country.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const countsByStatus = {
    GREEN: SEED_ASSETS.filter(a => a.status === 'GREEN').length,
    BLUE:  SEED_ASSETS.filter(a => a.status === 'BLUE').length,
    RED:   SEED_ASSETS.filter(a => a.status === 'RED').length,
  };

  const handleSelect = (asset: MapAsset) => {
    setSelected(asset);
    const result = calculatePatientScore({
      assetId:       asset.id,
      paymentHistory: asset.score,
      iotTelemetry:   asset.score * 0.9,
      marketValue:    asset.score * 1.05,
      riskIndex:      1.0,
      country:        asset.country,
      currency:       asset.currency,
    });
    setRecovery(result);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020508', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Status Bar ── */}
      <div style={{ background: 'rgba(5,10,16,0.98)', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", color: '#D4AF37', fontSize: '0.75rem' }}>
            🛰️ TITANIUM IoT MAP · 27 NATIONS
          </span>
          {(['GREEN','BLUE','RED'] as RecoveryStatus[]).map(s => (
            <button key={s} onClick={() => setFilter(filter === s ? 'ALL' : s)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, border: `1px solid ${STATUS_COLORS[s]}44`, background: filter === s ? `${STATUS_COLORS[s]}22` : 'transparent', color: STATUS_COLORS[s], fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[s], display: 'inline-block', boxShadow: `0 0 6px ${STATUS_COLORS[s]}` }} />
              {s} ({countsByStatus[s]})
            </button>
          ))}
        </div>
        {/* Digital Task Timer */}
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#D4AF37', textAlign: 'right' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: 2 }}>{time.toLocaleTimeString('en-KE', { hour12: false })}</div>
          <div style={{ fontSize: '0.6rem', color: '#666' }}>EAT · DIVINE ZENITH ACTIVE</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: 0 }}>
        {/* ── Left Panel ── */}
        <div style={{ background: '#050a10', borderRight: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Search */}
          <div style={{ padding: '16px 16px 8px' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search GPS / Asset / Country..."
              style={{ width: '100%', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: '0.82rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Asset List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
            {filtered.map(asset => (
              <div key={asset.id} onClick={() => handleSelect(asset)}
                style={{ padding: '12px', borderRadius: 10, marginBottom: 6, cursor: 'pointer', border: `1px solid ${selected?.id === asset.id ? STATUS_COLORS[asset.status] : 'rgba(212,175,55,0.1)'}`, background: selected?.id === asset.id ? `${STATUS_COLORS[asset.status]}11` : 'transparent', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{asset.name}</span>
                  {/* Blinking alert for RED */}
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[asset.status], display: 'inline-block', animation: asset.status === 'RED' ? 'pulse 1s infinite' : asset.status === 'BLUE' ? 'pulse 2s infinite' : 'none', boxShadow: `0 0 8px ${STATUS_COLORS[asset.status]}` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#888' }}>
                  <span>🌍 {asset.country} · {asset.type}</span>
                  <span style={{ color: STATUS_COLORS[asset.status], fontWeight: 700 }}>Score: {asset.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Map + Detail ── */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Map embed */}
          <div ref={mapRef} style={{ flex: 1, position: 'relative', background: '#020810', minHeight: 400 }}>
            {/* Google Maps iframe */}
            <iframe
              src={selected
                ? `https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=14&output=embed&maptype=satellite`
                : `https://maps.google.com/maps?q=-1.2921,36.8219&z=4&output=embed&maptype=satellite`
              }
              style={{ width: '100%', height: '100%', border: 'none', filter: 'hue-rotate(200deg) saturate(0.7) brightness(0.8)' }}
              allowFullScreen loading="lazy"
            />
            {/* Overlay HUD */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {/* Asset pins overlay */}
              {filtered.map(asset => (
                <div key={asset.id} style={{
                  position: 'absolute',
                  left: `${((asset.lng + 180) / 360) * 100}%`,
                  top: `${((90 - asset.lat) / 180) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'all',
                }}>
                  <button onClick={() => handleSelect(asset)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: STATUS_COLORS[asset.status], border: '2px solid rgba(255,255,255,0.8)', boxShadow: `0 0 ${asset.status === 'RED' ? '12px' : '8px'} ${STATUS_COLORS[asset.status]}`, animation: asset.status !== 'GREEN' ? 'pulse 1.5s infinite' : 'none' }} />
                  </button>
                </div>
              ))}
              {/* Top-right stats */}
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(5,10,16,0.9)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: '0.72rem', fontFamily: "'Share Tech Mono', monospace" }}>
                <div style={{ color: '#D4AF37', marginBottom: 6 }}>NEXUS TELEMETRY</div>
                <div style={{ color: '#27AE60' }}>● GREEN: {countsByStatus.GREEN} assets</div>
                <div style={{ color: '#3498DB' }}>● BLUE: {countsByStatus.BLUE} assets</div>
                <div style={{ color: '#E74C3C' }}>● RED: {countsByStatus.RED} assets</div>
                <div style={{ color: '#888', marginTop: 6, borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: 6 }}>
                  90% AI · 10% Human
                </div>
              </div>
            </div>
          </div>

          {/* ── Asset Detail + Recovery SOP ── */}
          {selected && recovery && (
            <div style={{ background: '#050a10', borderTop: '1px solid rgba(212,175,55,0.2)', padding: '16px 20px', maxHeight: 280, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>
                    {selected.name}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: STATUS_COLORS[recovery.status] }}>
                    {recovery.adjustedScore}
                    <span style={{ fontSize: '0.9rem', color: '#888', marginLeft: 8 }}>/ 100</span>
                  </div>
                  <div style={{ color: STATUS_COLORS[recovery.status], fontSize: '0.78rem', fontWeight: 700, marginBottom: 8 }}>
                    {STATUS_LABELS[recovery.status]}
                  </div>
                  <p style={{ color: '#888', fontSize: '0.75rem', lineHeight: 1.6 }}>{recovery.narrative}</p>
                </div>
                <div>
                  <div style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, fontFamily: 'monospace' }}>
                    SOP PATH — {recovery.moratoriumDays}-DAY PROTOCOL
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {recovery.sopPath.map(action => (
                      <button key={action}
                        style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${action === 'ESCALATE' ? '#E74C3C44' : 'rgba(212,175,55,0.3)'}`, background: action === 'ESCALATE' ? 'rgba(231,76,60,0.1)' : 'rgba(212,175,55,0.05)', color: action === 'ESCALATE' ? '#E74C3C' : '#D4AF37', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                        {RECOVERY_SOP_LABELS[action]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}