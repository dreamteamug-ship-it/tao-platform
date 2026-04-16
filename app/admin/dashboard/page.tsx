'use client';
import { useState } from 'react';
import EscrowLedger from '@/components/EscrowLedger';
import InventoryManager from '@/components/InventoryManager';
import ETIMSModule from '@/components/ETIMSModule';
import SwarmCommand from '@/components/SwarmCommand';
import SwarmStatus from '@/components/SwarmStatus';

export default function TitaniumNexus() {
  const [activeTab, setActiveTab] = useState('swarm');
  const [systemLoad] = useState(92); // AI Validation Ratio

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.05em', background: 'linear-gradient(90deg, #D4AF37, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            TITANIUM ERP NEXUS
          </h1>
          <p style={{ fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '4px 0 0' }}>
            Amanda Super Max Agent | Status: Monitoring Swarm_01
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', color: '#555' }}>AI/HUMAN RATIO</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: '#D4AF37' }}>{systemLoad}/8</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
            🤖
          </div>
        </div>
      </header>

      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32, background: '#111', padding: 8, borderRadius: 12, border: '1px solid #1a1a1a' }}>
        {['swarm', 'escrow', 'inventory', 'etims', 'market_intel'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700,
              background: activeTab === tab ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: activeTab === tab ? '#D4AF37' : '#666',
              border: activeTab === tab ? '1px solid rgba(212,175,55,0.4)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {tab.toUpperCase().replace('_', ' ')}
          </button>
        ))}
      </nav>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {activeTab === 'swarm'     && <SwarmCommand />}
          {activeTab === 'escrow'    && <EscrowLedger />}
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'etims'     && <ETIMSModule />}
          {activeTab === 'market_intel' && (
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: '#D4AF37', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: 12 }}>
                🔭 OPENCRAWL AI — Regional Market Intelligence
              </h3>
              <div style={{ color: '#666', fontSize: '0.78rem' }}>
                Scanning 26 SADC/EA hubs... Airbnb/OYO arbitrage analysis active.
              </div>
            </div>
          )}
        </div>

        <aside style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: 24, height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', marginBottom: 16 }}>AMANDA LOGS</h3>
          <SwarmStatus />
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'monospace', fontSize: '0.65rem' }}>
            <div style={{ color: '#27AE60' }}>[08:00] OpenCrawl: 26 SADC hubs indexed.</div>
            <div style={{ color: '#3498DB' }}>[08:01] eTIMS: Daily KRA sync pending.</div>
            <div style={{ color: '#D4AF37' }}>[08:02] Swarm: Arbitrage detected — ZAR vehicles.</div>
            <div style={{ color: '#E74C3C' }}>[08:03] Escrow: 1 human review pending.</div>
          </div>
        </aside>
      </main>
    </div>
  );
}