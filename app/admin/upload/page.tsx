'use client';
import { useState } from 'react';
import MediaEnhancer from '@/components/MediaEnhancer';

export default function AdminUploadPage() {
  const [form, setForm] = useState({
    title: '', category: 'Residential', price: '', image_url: '', lat: '', lng: '', agent: '', transactions: ['buy'],
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | any>(null);

  const CATEGORIES = ['Residential', 'Commercial', 'Land', 'Airbnb'];
  const TX_OPTIONS = ['buy', 'rent', 'lease', 'tradein'];

  const toggleTx = (tx: string) =>
    setForm(f => ({ ...f, transactions: f.transactions.includes(tx) ? f.transactions.filter(t => t !== tx) : [...f.transactions, tx] }));

  const handleSubmit = async () => {
    if (!form.title || !form.price) { alert('Title and price are required'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          lat: form.lat ? Number(form.lat) : null,
          lng: form.lng ? Number(form.lng) : null,
          gps_active: Boolean(form.lat && form.lng),
          verified: true,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--deep-blue)', paddingTop: 70, padding: '90px 24px 40px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: '2rem', marginBottom: 8 }}>
            <i className="fas fa-upload" style={{ marginRight: 12 }} />Admin Upload Gateway
          </h1>
          <p style={{ color: 'var(--silver)' }}>Secure sovereign asset listing — INTERNAL USE ONLY</p>
        </div>

        {!result ? (
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border-gold)', borderRadius: 20, padding: '32px 28px' }}>
            <input type="text" placeholder="Property Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Price (KES) *" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>

            {/* Media Enhancer */}
            <div style={{ margin: '8px 0' }}>
              <MediaEnhancer bucket="property-images" label="Upload Property Image" onUploadComplete={url => setForm(f => ({ ...f, image_url: url }))} />
            </div>
            {form.image_url && (
              <input type="text" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Or paste image URL" />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input type="number" step="any" placeholder="GPS Latitude (e.g. -1.286)" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} />
              <input type="number" step="any" placeholder="GPS Longitude (e.g. 36.817)" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} />
            </div>

            <input type="text" placeholder="Agent Name" value={form.agent} onChange={e => setForm(f => ({ ...f, agent: e.target.value }))} />

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'var(--silver)', fontSize: '0.82rem', display: 'block', marginBottom: 8 }}>Transaction Types</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {TX_OPTIONS.map(tx => (
                  <button key={tx} type="button" onClick={() => toggleTx(tx)}
                    style={{ padding: '6px 16px', borderRadius: 20, cursor: 'pointer', background: form.transactions.includes(tx) ? 'var(--gold)' : 'transparent', color: form.transactions.includes(tx) ? '#000' : 'var(--silver)', border: '1px solid var(--border-gold)', fontWeight: form.transactions.includes(tx) ? 700 : 400 }}>
                    {tx}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-gold" style={{ width: '100%', padding: 16 }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Publishing to Sovereign Nexus...</> : <><i className="fas fa-satellite-dish" style={{ marginRight: 10 }} />List on TAO Nexus</>}
            </button>
          </div>
        ) : (
          <div className="receipt-box" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>✅</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: 8 }}>Property Listed Successfully!</h3>
            <p style={{ color: 'var(--silver)' }}>ID: {result.property?.id || result.id || 'CREATED'}</p>
            <button className="btn-outline" style={{ marginTop: 16 }} onClick={() => setResult(null)}>List Another</button>
          </div>
        )}
      </div>
    </div>
  );
}
