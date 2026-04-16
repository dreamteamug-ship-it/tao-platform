'use client';
import { useState } from 'react';
import MediaEnhancer from '@/components/MediaEnhancer';

const PLANS = [
  {
    id: 'free', name: 'Buyer Access', price: 0, currency: 'Free',
    color: 'var(--silver)', icon: 'fa-eye',
    features: ['Browse all listings', 'View GPS locations', 'Basic search & filter', 'Contact agents via WhatsApp'],
    cta: 'Current Plan',
  },
  {
    id: 'provider', name: 'Service Provider', price: 2500, currency: 'KSh 2,500/mo',
    color: '#4A90E2', icon: 'fa-briefcase',
    features: ['Everything in Free', 'List your services', 'KYC Verification badge', 'Amanda SOP daily reports', 'Featured in directory'],
    cta: 'Subscribe via M-Pesa',
    popular: true,
  },
  {
    id: 'premium', name: 'Verified Landlord', price: 5000, currency: 'KSh 5,000/mo',
    color: 'var(--gold)', icon: 'fa-crown',
    features: ['Everything in Provider', 'Unlimited property listings', 'AI investment scoring', 'Smart Escrow access', 'Priority human support', 'Cross-border SADC reach'],
    cta: 'Subscribe — Full Access',
  },
];

export default function PricingPage() {
  const [payModal, setPayModal] = useState<null | typeof PLANS[0]>(null);
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [payResult, setPayResult] = useState<null | string>(null);

  const handleMpesa = async (plan: typeof PLANS[0]) => {
    if (!phone || phone.length < 9) { alert('Enter a valid M-Pesa phone number'); return; }
    setPaying(true);
    try {
      const res = await fetch('/api/mpesa', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: plan.price, reference: `TAO-${plan.id.toUpperCase()}`, description: `TAO ${plan.name} Subscription` }),
      });
      const data = await res.json();
      setPayResult(data.message || 'STK Push sent! Check your phone for PIN prompt.');
    } catch {
      setPayResult('M-Pesa service initializing. Please try again in a moment.');
    }
    setPaying(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--deep-blue)', paddingTop: 70 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #050a10, #0a192f)', padding: '60px 24px 48px', textAlign: 'center', borderBottom: '1px solid var(--border-gold)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', borderRadius: 30, padding: '6px 20px', marginBottom: 20, fontSize: '0.82rem', color: 'var(--gold)', fontFamily: "'Share Tech Mono', monospace" }}>
          ✦ SOVEREIGN ACCESS TIERS
        </div>
        <h1 style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: 12 }}>
          Choose Your Power Level
        </h1>
        <p style={{ color: 'var(--silver)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Unlock AI-powered real estate intelligence across 26 SADC & East African nations. Pay via M-Pesa. No cards needed.
        </p>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{
            background: 'var(--charcoal)',
            border: `2px solid ${plan.popular ? plan.color : 'var(--border-gold)'}`,
            borderRadius: 20, overflow: 'hidden', position: 'relative',
            transform: plan.popular ? 'scale(1.03)' : 'none',
          }}>
            {plan.popular && (
              <div style={{ background: plan.color, color: '#000', textAlign: 'center', padding: '6px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: 1 }}>
                ⭐ MOST POPULAR
              </div>
            )}
            <div style={{ padding: '28px 24px', borderBottom: '1px solid var(--border-gold)', background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))` }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${plan.color}33, ${plan.color}11)`, border: `2px solid ${plan.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: '1.3rem', color: plan.color }}>
                <i className={`fas ${plan.icon}`} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: 6 }}>{plan.name}</h3>
              <div style={{ color: plan.color, fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700 }}>
                {plan.currency}
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, color: 'var(--silver)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    <i className="fas fa-check" style={{ color: plan.color, marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.price === 0 ? (
                <div style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: 'var(--silver)', textAlign: 'center', fontSize: '0.9rem', border: '1px solid var(--border-gold)' }}>
                  <i className="fas fa-check-circle" style={{ marginRight: 8 }} /> Always Free
                </div>
              ) : (
                <button className="btn-gold" style={{ width: '100%', padding: 13, background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, color: plan.id === 'provider' ? '#fff' : '#000' }}
                  onClick={() => { setPayModal(plan); setPayResult(null); }}>
                  <i className="fas fa-mobile-alt" style={{ marginRight: 8 }} />{plan.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* M-Pesa Payment Modal */}
      {payModal && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setPayModal(null)}>
          <div className="modal-card" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/320px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" style={{ height: 28, verticalAlign: 'middle', marginRight: 10 }} />
                M-Pesa Checkout
              </h3>
              <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '5px 12px' }} onClick={() => setPayModal(null)}>✕</button>
            </div>
            {!payResult ? (
              <>
                <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 700 }}>{payModal.name}</div>
                  <div style={{ color: 'var(--silver)', fontSize: '0.85rem' }}>{payModal.currency} — Monthly Subscription</div>
                </div>
                <input type="tel" placeholder="M-Pesa Phone (e.g. 0712345678)"
                  value={phone} onChange={e => setPhone(e.target.value)} autoFocus />
                <p style={{ color: 'var(--silver)', fontSize: '0.78rem', marginTop: -8, marginBottom: 16 }}>
                  You will receive a PIN prompt on your phone to confirm payment.
                </p>
                <button className="btn-gold" style={{ width: '100%', padding: 14 }} onClick={() => handleMpesa(payModal)} disabled={paying}>
                  {paying ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Initiating STK Push...</> : <><i className="fas fa-paper-plane" style={{ marginRight: 8 }} />Pay KSh {payModal.price.toLocaleString()}</>}
                </button>
              </>
            ) : (
              <div className="receipt-box" style={{ display: 'block', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>📱</div>
                <p style={{ color: 'var(--silver)', lineHeight: 1.7 }}>{payResult}</p>
                <button className="btn-outline" style={{ marginTop: 16, width: '100%' }} onClick={() => setPayModal(null)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
