'use client';
import { useEffect, useState } from 'react';

interface HeaderProps {
  lang: string;
  setLang: (lang: string) => void;
  currentView: string;
  onNavShop: () => void;
  onNavSubscribe: () => void;
  onNavCC: () => void;
}

export default function Header({ lang, setLang, currentView, onNavShop, onNavSubscribe, onNavCC }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const countries = [
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' }
  ];

  return (
    <header style={{ 
      padding: '1rem 2rem', 
      background: '#0a0a0a', 
      borderBottom: '1px solid rgba(212,175,55,0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1 onClick={() => window.location.href = "/"} style={{ cursor: "pointer", color: "#d4af37", margin: 0, fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-0.05em" }}>
          WONDERLAND HOSPITALITY
        </h1>
        
        <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#888' }}>
          <span onClick={onNavShop} style={{ cursor: 'pointer' }}>MARKETPLACE</span>
          <span onClick={onNavSubscribe} style={{ cursor: 'pointer' }}>SUBSCRIPTIONS</span>
          <span onClick={onNavCC} style={{ cursor: 'pointer' }}>CONTACT</span>
        </nav>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ background: 'transparent', color: '#d4af37', border: 'none', cursor: 'pointer' }}
        >
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
        
        <a 
          href={mounted ? '/dealroom/' + Math.random().toString(36).substring(2, 10).toUpperCase() : '#'}
          style={{
            background: '#d4af37',
            color: 'black',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '900',
            textDecoration: 'none'
          }}
        >
          OPEN DEALROOM
        </a>
      </div>
    </header>
  );
}