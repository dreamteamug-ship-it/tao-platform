'use client';
import { useState, useEffect, useRef } from 'react';
import { Property } from '@/types';
import 'leaflet/dist/leaflet.css';

interface CommandCenterProps {
  properties: Property[];
}

type CCTab = 'tactical' | 'admin' | 'erp';

export default function CommandCenter({ properties }: CommandCenterProps) {
  const [activeTab, setActiveTab] = useState<CCTab>('tactical');
  const mapRef = useRef<HTMLDivElement>(null);
  const ccMapRef = useRef<any>(null);
  const chartsInit = useRef(false);
  const scr1Ref = useRef<HTMLDivElement>(null);
  const scr2Ref = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);

  // Telemetry ticker
  useEffect(() => {
    if (activeTab !== 'tactical') return;
    const interval = setInterval(() => {
      if (!telemetryRef.current) return;
      const t = new Date().toLocaleTimeString();
      const events = [
        `[${t}] GPS_SYNC: ${properties.filter(p => p.gps_active).length} nodes active`,
        `[${t}] KYC_QUEUE: ${Math.floor(Math.random() * 12) + 1} pending`,
        `[${t}] ESCROW_VAULT: KES ${(properties.reduce((s, p) => s + p.price, 0) * 0.05).toLocaleString()} secured`,
        `[${t}] AGENT_NET: ${Math.floor(Math.random() * 9) + 1} agents online`,
        `[${t}] AI_SCORE_ENGINE: OPTIMAL`,
      ];
      telemetryRef.current.innerHTML = events.join('<br>');
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab, properties]);

  // Init Leaflet map
  useEffect(() => {
    if (activeTab !== 'tactical' || ccMapRef.current) return;
    const initMap = async () => {
      if (typeof window === 'undefined') return;
      const L = (await import('leaflet')).default;
      if (!mapRef.current || ccMapRef.current) return;
      const map = L.map(mapRef.current).setView([-1.2864, 36.8172], 12);
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      }).addTo(map);
      properties.filter(p => p.gps_active).forEach(p => {
        L.circleMarker([p.lat, p.lng], { radius: 6, color: '#D4AF37', fillColor: '#D4AF37', fillOpacity: 0.9 })
          .bindPopup(`<b>${p.title}</b><br>KES ${p.price.toLocaleString()}`)
          .addTo(map);
      });
      ccMapRef.current = map;
    };
    initMap();
  }, [activeTab, properties]);

  // Generate radar blips
  useEffect(() => {
    if (activeTab !== 'tactical' || !radarRef.current) return;
    radarRef.current.querySelectorAll('.blip').forEach(b => b.remove());
    for (let i = 0; i < 8; i++) {
      const blip = document.createElement('div');
      blip.className = 'blip';
      blip.style.top = `${Math.random() * 80 + 10}%`;
      blip.style.left = `${Math.random() * 80 + 10}%`;
      blip.style.animationDelay = `${Math.random() * 4}s`;
      radarRef.current.appendChild(blip);
    }
  }, [activeTab]);

  // Init ERP charts
  useEffect(() => {
    if (activeTab !== 'erp' || chartsInit.current) return;
    chartsInit.current = true;
    const initCharts = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      const cats = ['Residential', 'Commercial', 'Land', 'Airbnb'];
      const trendCtx = document.getElementById('trend-chart') as HTMLCanvasElement;
      const pieCtx = document.getElementById('pie-chart') as HTMLCanvasElement;
      if (trendCtx) {
        new Chart(trendCtx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Property Views',
              data: [42, 68, 53, 97, 120, 145, 189],
              borderColor: '#D4AF37',
              backgroundColor: 'rgba(212,175,55,0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#C0C0C0' } } },
            scales: {
              x: { ticks: { color: '#C0C0C0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
              y: { ticks: { color: '#C0C0C0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            },
          },
        });
      }
      if (pieCtx) {
        new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: cats,
            datasets: [{
              data: cats.map(c => properties.filter(p => p.category === c).length),
              backgroundColor: ['#D4AF37', '#C0C0C0', '#1E2A3A', '#0A4020'],
              borderColor: ['#B8860B', '#A0A0A0', '#0A1929', '#063015'],
              borderWidth: 2,
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { labels: { color: '#C0C0C0', padding: 16 } },
            },
          },
        });
      }
    };
    initCharts();
  }, [activeTab, properties]);

  const triggerAdmin = (action: string) => {
    if (!scr1Ref.current || !scr2Ref.current) return;
    if (action === 'healing') {
      scr1Ref.current.style.color = '#0f0';
      scr1Ref.current.innerHTML = '> AI SELF-HEALING ACTIVE<br>> All microservices restored<br>> Database: HEALTHY<br>> Cache: CLEARED';
    }
    if (action === 'rollback') {
      scr1Ref.current.style.color = 'orange';
      scr1Ref.current.innerHTML = '> ROLLBACK INITIATED<br>> Snapshot: 2026-04-01<br>> State: RESTORING...<br>> ETA: 45s';
    }
    if (action === 'killswitch') {
      scr1Ref.current.style.color = '#FF4444';
      scr1Ref.current.innerHTML = '!!! AIR-GAP PROTOCOL !!!<br>EMERGENCY SHUTDOWN IN PROGRESS';
      scr2Ref.current.innerHTML = '> CTO ALERTED<br>> INCIDENT: 2026-04-15<br>> Auth: SUSPENDED';
    }
    if (action === 'gps') {
      scr1Ref.current.style.color = '#D4AF37';
      scr1Ref.current.innerHTML = `> GPS TOGGLED\n> ${properties.filter(p => p.gps_active).length} nodes active`;
    }
    if (action === 'multiLLM') {
      scr2Ref.current.innerHTML = '> Gemini: Market +12% projected<br>> Claude: Risk score: LOW<br>> OpenRouter: Buy signal active<br>> Grok: Sentiment: BULLISH';
    }
  };

  const totalEscrow = properties.reduce((s, p) => s + p.price, 0) * 0.05;
  const verifiedCount = properties.filter(p => p.verified).length;

  return (
    <div className="command-center" id="command-center">
      {/* Navbar */}
      <nav className="cc-navbar" aria-label="Command center navigation">
        {(['tactical', 'admin', 'erp'] as CCTab[]).map((tab, i) => (
          <button
            key={tab}
            className={`cc-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            id={`cc-tab-${tab}`}
          >
            <i className={`fas fa-${['satellite-dish', 'shield-virus', 'chart-pie'][i]}`} />
            {['Tactical Ops', 'Admin Core', 'Titanium ERP'][i]}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', color: 'var(--success)', whiteSpace: 'nowrap' }}>
          <span className="dot-green" style={{ marginRight: 6 }} />
          TAO NEXUS — ONLINE
        </div>
      </nav>

      {/* TACTICAL */}
      <div id="tab-tactical" className={`tab-content ${activeTab === 'tactical' ? 'active' : ''}`}>
        <div className="quadrant">
          <div className="quad-header">
            <span>// SCAN.RADAR.SYS</span>
            <span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>● ACTIVE</span>
          </div>
          <div className="radar-wrapper">
            <div className="radar" ref={radarRef} id="radar" />
          </div>
        </div>

        <div className="quadrant">
          <div className="quad-header">
            <span>// GEO.TRACK.SYS</span>
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>
              {properties.filter(p => p.gps_active).length} NODES
            </span>
          </div>
          <div ref={mapRef} id="cc-map" style={{ height: '100%', width: '100%', background: '#111' }} />
        </div>

        <div className="quadrant">
          <div className="quad-header">
            <span>// SECURE.VAULT.DB</span>
            <span style={{ color: 'cyan', fontSize: '0.75rem' }}>ENCRYPTED</span>
          </div>
          <div style={{ padding: 16, color: '#888', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', lineHeight: 2 }}>
            &gt; Master_Deeds.enc [LOCKED]<br />
            &gt; KYC_Records.db [{verifiedCount} verified]<br />
            &gt; Edge_Media.ptr [ACTIVE]<br />
            &gt; Escrow_Vault.enc [SECURED]<br />
            &gt; AI_Models.bin [LOADED]
          </div>
        </div>

        <div className="quadrant">
          <div className="quad-header">
            <span>// TELEMETRY LIVE</span>
            <span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>● STREAMING</span>
          </div>
          <div
            ref={telemetryRef}
            id="telemetry-data"
            style={{ padding: 16, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', color: '#0f0', lineHeight: 2.2 }}
          />
        </div>
      </div>

      {/* ADMIN */}
      <div id="tab-admin" className={`tab-content ${activeTab === 'admin' ? 'active' : ''}`}>
        <div className="admin-sidebar">
          <h3 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.85rem', color: 'var(--silver)', marginBottom: 10, padding: '0 4px' }}>
            ADMIN CONTROLS
          </h3>
          <button onClick={() => triggerAdmin('healing')} id="btn-self-healing">
            <i className="fas fa-heartbeat" style={{ marginRight: 8, color: 'var(--success)' }} />Predictive Self-Healing
          </button>
          <button onClick={() => triggerAdmin('gps')} style={{ color: 'cyan' }} id="btn-toggle-gps">
            <i className="fas fa-satellite" style={{ marginRight: 8 }} />Toggle Property GPS
          </button>
          <button onClick={() => triggerAdmin('rollback')} style={{ color: 'orange' }} id="btn-safe-rollback">
            <i className="fas fa-history" style={{ marginRight: 8 }} />Safe Rollback
          </button>
          <button onClick={() => triggerAdmin('multiLLM')} style={{ color: 'var(--gold)' }} id="btn-multi-llm">
            <i className="fas fa-robot" style={{ marginRight: 8 }} />Run AI Swarm
          </button>
          <button
            className="btn-danger"
            onClick={() => { if (window.confirm('Initiate KILL SWITCH? This will suspend all operations.')) triggerAdmin('killswitch'); }}
            id="btn-killswitch"
            style={{ marginTop: 'auto' }}
          >
            <i className="fas fa-skull-crossbones" style={{ marginRight: 8 }} />KILL SWITCH
          </button>
        </div>
        <div className="admin-screens">
          <div className="admin-screen">
            <div className="screen-header">MONITOR 01</div>
            <div className="screen-body" ref={scr1Ref} id="scr1">&gt; STANDBY</div>
          </div>
          <div className="admin-screen">
            <div className="screen-header">ACTION LOG</div>
            <div className="screen-body" ref={scr2Ref} id="scr2">&gt; OPTIMAL<br />&gt; No active incidents</div>
          </div>
        </div>
      </div>

      {/* ERP */}
      <div id="tab-erp" className={`tab-content ${activeTab === 'erp' ? 'active' : ''}`}>
        <div className="erp-dashboard">
          <div className="erp-card">
            <h3><i className="fas fa-building" style={{ marginRight: 8 }} />Live Portfolio</h3>
            <div className="erp-counter">{properties.length}</div>
            <p>Total Properties Listed</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <div style={{ flex: 1, background: 'rgba(0,255,127,0.05)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', border: '1px solid rgba(0,255,127,0.2)' }}>
                <div style={{ color: 'var(--success)', fontWeight: 700 }}>{verifiedCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--silver)' }}>Verified</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(212,175,55,0.05)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', border: '1px solid var(--border-gold)' }}>
                <div style={{ color: 'var(--gold)', fontWeight: 700 }}>{properties.filter(p => p.gps_active).length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--silver)' }}>GPS Active</div>
              </div>
            </div>
          </div>

          <div className="erp-card">
            <h3><i className="fas fa-shield-alt" style={{ marginRight: 8 }} />Finance &amp; Escrow</h3>
            <div className="erp-counter">KES {Math.floor(totalEscrow / 1000000).toLocaleString()}M</div>
            <p>Total Escrow Value (5% held)</p>
            <button className="btn-outline" onClick={() => alert('Escrow module: AI-managed vault active. Funds released on KYC completion.')}>
              <i className="fas fa-lock" style={{ marginRight: 6 }} /> View Escrow
            </button>
          </div>

          <div className="erp-card">
            <h3><i className="fas fa-chart-line" style={{ marginRight: 8 }} />Weekly Trends</h3>
            <canvas id="trend-chart" />
          </div>

          <div className="erp-card">
            <h3><i className="fas fa-chart-pie" style={{ marginRight: 8 }} />Category Distribution</h3>
            <canvas id="pie-chart" />
          </div>

          <div className="erp-card">
            <h3><i className="fas fa-users" style={{ marginRight: 8 }} />Agent Performance</h3>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.82rem', lineHeight: 2, color: 'var(--silver)' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Agent {i + 1}</span>
                  <span style={{ color: 'var(--gold)' }}>{Math.floor(Math.random() * 15) + 3} deals</span>
                </div>
              ))}
            </div>
          </div>

          <div className="erp-card">
            <h3><i className="fas fa-heartbeat" style={{ marginRight: 8 }} />System Health</h3>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.82rem', lineHeight: 2 }}>
              <div><span style={{ color: 'var(--success)' }}>●</span> API: ONLINE</div>
              <div><span style={{ color: 'var(--success)' }}>●</span> Supabase: CONNECTED</div>
              <div><span style={{ color: 'var(--success)' }}>●</span> Gemini AI: ACTIVE</div>
              <div><span style={{ color: 'var(--success)' }}>●</span> GPS Engine: RUNNING</div>
              <div><span style={{ color: 'var(--success)' }}>●</span> Escrow Vault: SECURED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
