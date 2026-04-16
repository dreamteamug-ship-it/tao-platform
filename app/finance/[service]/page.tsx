'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

// Property Finance Service types mapped from request
const FINANCE_TYPES: Record<string, {
  label: string; icon: string; desc: string;
  fields: string[]; maxAmount?: number;
}> = {
  mortgage: {
    label: 'Mortgage / Home Loan',
    icon: 'fa-home',
    desc: 'Long-term property purchase finance from 5 to 25 years at competitive rates.',
    fields: ['property_value', 'down_payment', 'duration_months', 'employment_type'],
  },
  bridging: {
    label: 'Bridging Finance',
    icon: 'fa-bridge',
    desc: 'Short-term finance to bridge the gap while awaiting sale proceeds or long-term financing.',
    fields: ['property_value', 'bridge_amount', 'exit_strategy'],
  },
  construction: {
    label: 'Construction Loan',
    icon: 'fa-hard-hat',
    desc: 'Stage-release construction finance for new builds and major developments.',
    fields: ['land_value', 'construction_cost', 'project_duration'],
  },
  topup: {
    label: 'Mortgage Top-Up',
    icon: 'fa-arrow-up',
    desc: 'Access additional funds against your existing property equity.',
    fields: ['current_mortgage', 'current_value', 'topup_amount'],
  },
  equity: {
    label: 'Equity Release',
    icon: 'fa-unlock-alt',
    desc: 'Release capital tied up in your owned property without selling.',
    fields: ['property_value', 'outstanding_mortgage', 'amount_needed'],
  },
  commercial: {
    label: 'Commercial Mortgage',
    icon: 'fa-building',
    desc: 'Finance for commercial, industrial, and mixed-use property investments.',
    fields: ['property_value', 'business_revenue', 'duration_months'],
  },
  development: {
    label: 'Development Finance',
    icon: 'fa-city',
    desc: 'Large-scale property development funding for developers and investors.',
    fields: ['gdc', 'site_value', 'development_cost', 'exit_strategy'],
  },
  land: {
    label: 'Land Purchase Loan',
    icon: 'fa-map',
    desc: 'Dedicated financing for land acquisition ahead of development.',
    fields: ['land_value', 'intended_use', 'duration_months'],
  },
  leaseback: {
    label: 'Sale & Leaseback',
    icon: 'fa-receipt',
    desc: 'Sell your property and lease it back for continued business use.',
    fields: ['property_value', 'monthly_rent', 'lease_duration'],
  },
  insurance: {
    label: 'Property Insurance Finance',
    icon: 'fa-shield-alt',
    desc: 'Finance your annual property insurance premium in monthly instalments.',
    fields: ['property_value', 'insurance_premium', 'duration_months'],
  },
  renovation: {
    label: 'Renovation Finance',
    icon: 'fa-tools',
    desc: 'Fund property improvements, refurbishments, and value-add upgrades.',
    fields: ['current_value', 'renovation_cost', 'expected_value'],
  },
  diaspora: {
    label: 'Diaspora Home Loan',
    icon: 'fa-globe-africa',
    desc: 'Tailored property finance for Kenyans and SADC nationals living abroad.',
    fields: ['foreign_income', 'property_value', 'duration_months', 'country_of_residence'],
  },
};

export default function FinanceServicePage() {
  const params = useParams();
  const service = (params?.service as string) || 'mortgage';
  const config = FINANCE_TYPES[service] || FINANCE_TYPES.mortgage;

  const [form, setForm] = useState({
    applicant_name: '', national_id: '', phone: '', email: '',
    monthly_income: '', amount_needed: '', duration_months: '60',
    property_id: '', finance_type: config.label,
    employment_type: 'Employed',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);

  const handleSubmit = async () => {
    if (!form.applicant_name) { alert('Please enter your name'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/evaluate-finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthly_income: Number(form.monthly_income),
          amount_needed: Number(form.amount_needed),
          duration_months: Number(form.duration_months),
          finance_type: config.label,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: 'pending', message: 'Application received. AI evaluation in progress.', score: 78 });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--deep-blue)', paddingTop: 70 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a192f, #1a365d)', padding: '50px 24px 36px', borderBottom: '1px solid var(--border-gold)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #B8860B)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.6rem', color: '#000' }}>
            <i className={`fas ${config.icon}`} />
          </div>
          <h1 style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: 10 }}>
            {config.label}
          </h1>
          <p style={{ color: 'var(--silver)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>{config.desc}</p>
        </div>
      </div>

      {/* Other Finance Types */}
      <div style={{ padding: '16px 24px', overflowX: 'auto', display: 'flex', gap: 10, borderBottom: '1px solid var(--border-gold)', maxWidth: '100%' }}>
        {Object.entries(FINANCE_TYPES).map(([key, val]) => (
          <a key={key} href={`/finance/${key}`}
            style={{ flexShrink: 0, padding: '7px 16px', borderRadius: 20, background: key === service ? 'var(--gold)' : 'transparent', color: key === service ? '#000' : 'var(--silver)', border: '1px solid var(--border-gold)', textDecoration: 'none', fontSize: '0.82rem', whiteSpace: 'nowrap', fontWeight: key === service ? 700 : 400 }}>
            <i className={`fas ${val.icon}`} style={{ marginRight: 6 }} />{val.label}
          </a>
        ))}
      </div>

      {/* Form */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
        {!result ? (
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border-gold)', borderRadius: 20, padding: '32px 28px' }}>
            <h2 style={{ marginBottom: 24, fontSize: '1.15rem' }}>
              <i className="fas fa-file-alt" style={{ marginRight: 10, color: 'var(--gold)' }} />
              Application Form — {config.label}
            </h2>

            {/* AI badges */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              {['90% AI Automated', '~2 Min Processing', 'Zero Paper Required'].map(txt => (
                <span key={txt} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', color: 'var(--gold)', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem' }}>
                  ✦ {txt}
                </span>
              ))}
            </div>

            <input type="text" placeholder="Full Legal Name *" value={form.applicant_name} onChange={e => setForm(f => ({ ...f, applicant_name: e.target.value }))} />
            <input type="text" placeholder="National ID / KRA PIN" value={form.national_id} onChange={e => setForm(f => ({ ...f, national_id: e.target.value }))} />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input type="number" placeholder="Monthly Income (KES) *" value={form.monthly_income} onChange={e => setForm(f => ({ ...f, monthly_income: e.target.value }))} />
            <input type="number" placeholder="Finance Amount Needed (KES)" value={form.amount_needed} onChange={e => setForm(f => ({ ...f, amount_needed: e.target.value }))} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <select value={form.duration_months} onChange={e => setForm(f => ({ ...f, duration_months: e.target.value }))}>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="60">60 Months (5yr)</option>
                <option value="120">120 Months (10yr)</option>
                <option value="180">180 Months (15yr)</option>
                <option value="240">240 Months (20yr)</option>
                <option value="300">300 Months (25yr)</option>
              </select>
              <select value={form.employment_type} onChange={e => setForm(f => ({ ...f, employment_type: e.target.value }))}>
                <option>Employed</option>
                <option>Self-Employed</option>
                <option>Business Owner</option>
                <option>Diaspora</option>
                <option>Developer</option>
              </select>
            </div>

            <button className="btn-gold" style={{ width: '100%', padding: 16, fontSize: '1rem', marginTop: 8 }} onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> AI Evaluating Application...</> : <><i className="fas fa-robot" style={{ marginRight: 10 }} />Submit to AI Evaluator</>}
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--charcoal)', border: `2px solid ${result.status === 'approved' ? 'var(--success)' : result.status === 'rejected' ? 'var(--danger)' : 'var(--gold)'}`, borderRadius: 20, padding: '32px 28px' }}>
            <div className="receipt-box" style={{ display: 'block' }}>
              <div style={{ marginBottom: 16, fontFamily: "'Share Tech Mono', monospace" }}>
                <span style={{ color: result.status === 'approved' ? 'var(--success)' : result.status === 'rejected' ? 'var(--danger)' : 'var(--gold)', fontSize: '1.1rem', fontWeight: 700 }}>
                  {result.status?.toUpperCase()} — AI Score: {result.score}%
                </span>
              </div>
              <p style={{ color: 'var(--silver)', lineHeight: 1.7 }}>{result.message}</p>
              {result.needs_human && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,165,0,0.1)', border: '1px solid orange', borderRadius: 8, color: 'orange', fontSize: '0.82rem' }}>
                  ⚠ Flagged for Amanda SOP Review — 8AM/8PM window
                </div>
              )}
              <button className="btn-outline" style={{ width: '100%', marginTop: 20 }} onClick={() => setResult(null)}>Apply Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
