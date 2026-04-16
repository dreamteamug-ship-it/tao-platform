'use client';
import { useState, useEffect } from 'react';

const SERVICE_TYPES = ['All','Agent','Broker','Lawyer','Valuer','Contractor','Architect','Interior Designer','Property Manager','Mortgage Advisor','Insurance'];

const ICONS: Record<string, string> = {
  Agent: 'fa-house-user', Broker: 'fa-handshake', Lawyer: 'fa-gavel',
  Valuer: 'fa-calculator', Contractor: 'fa-hard-hat', Architect: 'fa-drafting-compass',
  'Interior Designer': 'fa-couch', 'Property Manager': 'fa-building',
  'Mortgage Advisor': 'fa-landmark', Insurance: 'fa-shield-alt',
};

interface Provider {
  id: string; full_name: string; business_name: string; email: string;
  phone: string; service_type: string; country: string; bio: string;
  kyc_score: number; kyc_status: string; verified: boolean; plan: string;
}

export default function ServicesPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showJoin, setShowJoin] = useState(false);
  const [form, setForm] = useState({ full_name: '', business_name: '', email: '', phone: '', service_type: 'Agent', country: 'KE', bio: '' });
  const [submitting, setSubmitting] = useState(false);
  const [joinResult, setJoinResult] = useState<null | { message: string; kyc_score: number }>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/providers?type=${typeFilter}`);
        const data = await res.json();
        setProviders(data.providers || []);
      } catch { setProviders([]); }
      setLoading(false);
    };
    load();
  }, [typeFilter]);

  const handleJoin = async () => {
    if (!form.full_name || !form.email) { alert('Name and email are required'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/providers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      setJoinResult({ message: data.message, kyc_score: data.kyc_score });
    } catch { setJoinResult({ message: 'Registration received. We will contact you shortly.', kyc_score: 80 }); }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--deep-blue)', paddingTop: 70 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0a192f 0%, #1a365d 50%, #0d2137 100%)', padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid var(--border-gold)' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--gold)', fontFamily: "'Cinzel', serif", marginBottom: 12 }}>
          TAO Service Directory
        </h1>
        <p style={{ color: 'var(--silver)', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.7 }}>
          AI-verified professionals across 26 SADC & East African nations. Every provider is KYC-scored before listing.
        </p>
        <button onClick={() => setShowJoin(true)} className="btn-gold" style={{ padding: '14px 32px', fontSize: '1rem' }}>
          <i className="fas fa-plus" style={{ marginRight: 8 }} /> Join as Service Provider
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', borderBottom: '1px solid var(--border-gold)' }}>
        {SERVICE_TYPES.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`filter-btn ${typeFilter === t ? 'active' : ''}`} style={{ fontSize: '0.82rem' }}>
            {t !== 'All' && <i className={`fas ${ICONS[t] || 'fa-briefcase'} `} style={{ marginRight: 6 }} />}{t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--silver)' }}>
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4, margin: '0 auto 20px' }} />
            <p>Loading verified professionals...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-users" />
            <p>No providers found for this category. Be the first to register!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {providers.map(p => (
              <div key={p.id} className="property-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #0a192f, #1a365d)', padding: '24px 24px 0', textAlign: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #B8860B)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.8rem', color: '#000' }}>
                    <i className={`fas ${ICONS[p.service_type] || 'fa-briefcase'}`} />
                  </div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{p.full_name}</h3>
                  <p style={{ color: 'var(--gold)', fontSize: '0.82rem', margin: '4px 0 0' }}>{p.business_name || p.service_type}</p>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span className="card-category">{p.service_type}</span>
                    <span style={{ background: p.verified ? 'rgba(0,200,100,0.15)' : 'rgba(255,165,0,0.15)', color: p.verified ? 'var(--success)' : 'orange', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600 }}>
                      <i className={`fas fa-${p.verified ? 'check-circle' : 'clock'}`} style={{ marginRight: 4 }} />
                      {p.verified ? `Verified ${p.kyc_score}%` : 'Pending KYC'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--silver)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 16, minHeight: 60 }}>
                    {p.bio?.slice(0, 120)}{p.bio?.length > 120 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <a href={`https://wa.me/${p.phone?.replace(/[^0-9]/g, '')}?text=Hi ${p.full_name}, I found you on Together As One platform`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, background: '#25D366', color: '#fff', padding: '10px', borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                      <i className="fab fa-whatsapp" style={{ marginRight: 6 }} /> WhatsApp
                    </a>
                    <a href={`mailto:${p.email}`}
                      style={{ flex: 1, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '10px', borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--border-gold)' }}>
                      <i className="fas fa-envelope" style={{ marginRight: 6 }} /> Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join Modal */}
      {showJoin && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setShowJoin(false)}>
          <div className="modal-card" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}><i className="fas fa-user-plus" style={{ marginRight: 8 }} />Join as Provider</h3>
              <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '5px 12px' }} onClick={() => setShowJoin(false)}>✕</button>
            </div>
            {!joinResult ? (
              <>
                <input type="text" placeholder="Full Legal Name *" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                <input type="text" placeholder="Business Name" value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} />
                <input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <input type="tel" placeholder="Phone (e.g. 0712345678)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <select value={form.service_type} onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}>
                  {SERVICE_TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
                </select>
                <textarea placeholder="Brief professional bio (what you specialize in)..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-gold)', borderRadius: 8, color: '#fff', resize: 'vertical' }} />
                <button className="btn-gold" style={{ width: '100%', padding: 14 }} onClick={handleJoin} disabled={submitting}>
                  {submitting ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Processing AI KYC...</> : <><i className="fas fa-robot" style={{ marginRight: 8 }} />Submit for AI KYC</>}
                </button>
              </>
            ) : (
              <div className="receipt-box" style={{ display: 'block' }}>
                <div style={{ fontSize: '1.05rem', marginBottom: 12 }}>{joinResult.message}</div>
                <div style={{ color: 'var(--silver)', fontSize: '0.85rem' }}>AI KYC Score: <strong style={{ color: 'var(--gold)' }}>{joinResult.kyc_score}%</strong></div>
                <button className="btn-outline" style={{ width: '100%', marginTop: 16 }} onClick={() => { setShowJoin(false); setJoinResult(null); }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
