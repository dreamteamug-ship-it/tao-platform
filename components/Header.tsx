'use client';
import { Language } from '@/types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  currentView: string;
  onNavShop: () => void;
  onNavSubscribe: () => void;
  onNavCC: () => void;
}

export default function Header({ lang, setLang, currentView, onNavShop, onNavSubscribe, onNavCC }: HeaderProps) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(5,10,16,0.96)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(212,175,55,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: 64,
    }}>
      {/* Brand */}
      <button onClick={onNavShop} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700 }}>
          <span style={{ color: 'var(--gold)' }}>Together</span>
          <em style={{ color: '#fff', fontStyle: 'italic' }}> As One</em>
        </span>
      </button>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
        <button onClick={onNavShop}
          style={{ background: 'none', border: 'none', color: currentView === 'shop' ? 'var(--gold)' : 'var(--silver)', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, fontSize: '0.85rem', fontWeight: currentView === 'shop' ? 700 : 400 }}>
          <i className="fas fa-store" style={{ marginRight: 6 }} />Shop
        </button>
        <a href="/services" style={{ color: 'var(--silver)', textDecoration: 'none', padding: '6px 12px', fontSize: '0.85rem', borderRadius: 8 }}>
          <i className="fas fa-users" style={{ marginRight: 6 }} />Services
        </a>
        <a href="/pricing" style={{ color: 'var(--silver)', textDecoration: 'none', padding: '6px 12px', fontSize: '0.85rem', borderRadius: 8 }}>
          <i className="fas fa-tags" style={{ marginRight: 6 }} />Pricing
        </a>
        <a href="/finance/mortgage" style={{ color: 'var(--silver)', textDecoration: 'none', padding: '6px 12px', fontSize: '0.85rem', borderRadius: 8 }}>
          <i className="fas fa-landmark" style={{ marginRight: 6 }} />Finance
        </a>
        <button onClick={onNavSubscribe}
          style={{ color: '#fff', background: 'linear-gradient(135deg, #0a4f2a, #1a7a3f)', border: 'none', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
          <i className="fas fa-crown" style={{ marginRight: 6 }} />Post/Subscribe
        </button>

        {/* Language Switcher */}
        <select value={lang} onChange={e => setLang(e.target.value as Language)}
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', color: 'var(--gold)', padding: '7px 10px', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
          <option value="en">🌐 ENG</option>
          <option value="sw">🇰🇪 SW</option>
          <option value="sh">🔥 SHG</option>
        </select>

        {/* CTO Login */}
        <button onClick={onNavCC}
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold)', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'Share Tech Mono', monospace" }}>
          <i className="fas fa-terminal" style={{ marginRight: 6 }} />CTO
        </button>
      </nav>
    </header>
  );
}
