'use client';
import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// AMANDA SUPER MAX — GOD-MODE CTO COMMAND CENTER
// 6-Screen Titanium ERP Dashboard
// Monitors: Tech Stack · AI Performance · IoT · 27-Country Revenue
// 90/10 Ratio Enforcement · Multi-LLM Swarm Routing
// ═══════════════════════════════════════════════════════════════

type StatusColor = 'GREEN' | 'BLUE' | 'RED';
interface AgentStatus { id: string; name: string; model: string; task: string; status: StatusColor; load: number; lastSOP: string; }
interface RevenueRow { country: string; flag: string; currency: string; mrr: number; escrow: number; saas: number; trend: '+' | '-' | '~'; }

const AGENT_SWARM: AgentStatus[] = [
  { id:'A01', name:'Amanda Core',      model:'Gemini 2.0 Flash', task:'SOP Reports 08:00/20:00',       status:'GREEN', load:87, lastSOP:'08:00 EAT' },
  { id:'A02', name:'FinanceBot-KE',    model:'DeepSeek-R2',      task:'Equity Bank Ingest + FX',       status:'GREEN', load:72, lastSOP:'23:20 EAT' },
  { id:'A03', name:'LegalSentinel',    model:'Claude 3.5',       task:'Contract Review — Tri-Lock',    status:'BLUE',  load:45, lastSOP:'22:55 EAT' },
  { id:'A04', name:'MarketingAI',      model:'Gemini 1.5 Pro',   task:'AEO — 26-country campaigns',    status:'GREEN', load:91, lastSOP:'23:10 EAT' },
  { id:'A05', name:'OpenCrawl-01',     model:'GPT-4o',           task:'Airbnb/Booking.com scrape',     status:'BLUE',  load:60, lastSOP:'23:15 EAT' },
  { id:'A06', name:'WhatsApp Sentry',  model:'Gemini Flash',     task:'Customer support — 27 hubs',    status:'GREEN', load:94, lastSOP:'23:28 EAT' },
  { id:'A07', name:'Fleet Matcher',    model:'DeepSeek',         task:'Cargo/vehicle matching — SADC', status:'GREEN', load:68, lastSOP:'23:00 EAT' },
  { id:'A08', name:'eTIMS Fiscal',     model:'Claude 3 Haiku',   task:'KRA compliance sign loop',      status:'GREEN', load:55, lastSOP:'20:00 EAT' },
  { id:'A09', name:'IoT Telemetry',    model:'Gemini Pro',       task:'27-country asset ping',         status:'BLUE',  load:78, lastSOP:'23:25 EAT' },
  { id:'A10', name:'HR Appraisal AI',  model:'DeepSeek-Chat',    task:'360° feedback processing',      status:'GREEN', load:40, lastSOP:'20:00 EAT' },
  { id:'A11', name:'Delite Trigger',   model:'Gemini Vision',    task:'8K media quality check',        status:'BLUE',  load:35, lastSOP:'22:40 EAT' },
  { id:'A12', name:'PatientRecovery',  model:'Gemini Pro',       task:'Moratorium scoring — SADC',     status:'RED',   load:99, lastSOP:'23:28 EAT' },
];

const REVENUE_TABLE: RevenueRow[] = [
  { country:'Kenya',        flag:'🇰🇪', currency:'KES', mrr:4200000,  escrow:18500000, saas:92500,  trend:'+' },
  { country:'Tanzania',     flag:'🇹🇿', currency:'TZS', mrr:1800000,  escrow:7200000,  saas:36000,  trend:'+' },
  { country:'Uganda',       flag:'🇺🇬', currency:'UGX', mrr:2100000,  escrow:8400000,  saas:42000,  trend:'~' },
  { country:'Rwanda',       flag:'🇷🇼', currency:'RWF', mrr:890000,   escrow:3200000,  saas:16000,  trend:'+' },
  { country:'South Africa', flag:'🇿🇦', currency:'ZAR', mrr:6800000,  escrow:32000000, saas:160000, trend:'+' },
  { country:'Ghana',        flag:'🇬🇭', currency:'GHS', mrr:1200000,  escrow:5400000,  saas:27000,  trend:'+' },
  { country:'Djibouti',     flag:'🇩🇯', currency:'DJF', mrr:420000,   escrow:1800000,  saas:9000,   trend:'~' },
];

const STATUS_COLORS: Record<StatusColor, string> = {
  GREEN: '#27AE60', BLUE: '#3498DB', RED: '#E74C3C',
};

const SCREENS = ['SWARM', 'REVENUE', 'IoT MAP', 'VAULT', 'AUDIT', 'SYSTEM'] as const;
type Screen = typeof SCREENS[number];

export default function GodModeDashboard() {
  const [screen, setScreen]         = useState<Screen>('SWARM');
  const [time, setTime]             = useState(new Date());
  const [aiRatio]                   = useState(90);
  const [vaultLocked, setVaultLocked] = useState(true);
  const [vaultInput, setVaultInput]   = useState('');
  const [vaultMsg, setVaultMsg]       = useState('');
  const [ctrlE, setCtrlE]             = useState(false);

  // Digital task timer
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Ctrl+E ERP access gate
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'e') { e.preventDefault(); setCtrlE(v => !v); }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleVaultUnlock = () => {
    if (vaultInput === (process.env.NEXT_PUBLIC_CTO_HINT || 'TITANIUM')) {
      setVaultLocked(false);
      setVaultMsg('🔓 CTO Vault Unlocked — Tri-Lock Verified');
    } else {
      setVaultMsg('❌ Invalid Tri-Lock signature. Access denied.');
    }
  };

  const greenCount = AGENT_SWARM.filter(a => a.status === 'GREEN').length;
  const blueCount  = AGENT_SWARM.filter(a => a.status === 'BLUE').length;
  const redCount   = AGENT_SWARM.filter(a => a.status === 'RED').length;

  return (
    <div style={{ minHeight: '100vh', background: '#020508', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Ctrl+E Modal ── */}
      {ctrlE && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#050a10', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 16, padding: 32, maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔐</div>
            <h2 style={{ color: '#D4AF37', fontFamily: 'monospace', marginBottom: 4 }}>ERP ACCESS GATE</h2>
            <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 20 }}>Ctrl+E · Email OTP + CTO Approval</p>
            <input type="password" placeholder="Enter Tri-Lock passphrase..."
              value={vaultInput} onChange={e => setVaultInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVaultUnlock()}
              style={{ width: '100%', padding: '12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: '#fff', fontSize: '0.9rem', marginBottom: 12, boxSizing: 'border-box' }} />
            {vaultMsg && <p style={{ color: vaultMsg.includes('❌') ? '#E74C3C' : '#27AE60', fontSize: '0.82rem', marginBottom: 12 }}>{vaultMsg}</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleVaultUnlock} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #8B6914)', border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, cursor: 'pointer' }}>Authenticate</button>
              <button onClick={() => setCtrlE(false)} style={{ flex: 1, padding: 12, background: 'transparent', border: '1px solid #444', borderRadius: 8, color: '#888', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Nav ── */}
      <div style={{ background: 'rgba(5,10,16,0.98)', borderBottom: '1px solid rgba(212,175,55,0.25)', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 16 }}>
        <span style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>
          🏛️ GOD-MODE
        </span>

        {/* 6 screen tabs */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {SCREENS.map(s => (
            <button key={s} onClick={() => setScreen(s)}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: screen === s ? 'rgba(212,175,55,0.2)' : 'transparent', color: screen === s ? '#D4AF37' : '#555', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', letterSpacing: 1 }}>
              {s}
            </button>
          ))}
        </div>

        {/* Status indicators */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {[['GREEN', greenCount], ['BLUE', blueCount], ['RED', redCount]].map(([c, n]) => (
            <span key={c as string} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: STATUS_COLORS[c as StatusColor] }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[c as StatusColor], display: 'inline-block', animation: c === 'RED' && (n as number) > 0 ? 'pulse 1s infinite' : 'none' }} />
              {n}
            </span>
          ))}
          <span style={{ fontFamily: 'monospace', color: '#D4AF37', fontSize: '0.8rem', borderLeft: '1px solid rgba(212,175,55,0.2)', paddingLeft: 12 }}>
            {time.toLocaleTimeString('en-KE', { hour12: false })} EAT
          </span>
          <button onClick={() => setCtrlE(true)} title="Ctrl+E ERP Gate"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, padding: '3px 8px', color: '#D4AF37', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'monospace' }}>
            Ctrl+E
          </button>
        </div>
      </div>

      {/* ── Screen: SWARM ── */}
      {screen === 'SWARM' && (
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", margin: 0 }}>AMANDA SUPER MAX — 100-AGENT SWARM</h2>
              <p style={{ color: '#666', fontSize: '0.78rem', margin: '4px 0 0', fontFamily: 'monospace' }}>MULTI-LLM ROUTING: DeepSeek→Finance · Gemini→Marketing · Claude→Legal</p>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
              <div style={{ fontSize: '2rem', color: '#D4AF37', fontWeight: 900 }}>{aiRatio}<span style={{ fontSize: '1rem', color: '#888' }}>%</span></div>
              <div style={{ fontSize: '0.65rem', color: '#888' }}>AI AUTONOMY RATIO</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {AGENT_SWARM.map(agent => (
              <div key={agent.id} style={{ background: '#050a10', border: `1px solid ${STATUS_COLORS[agent.status]}33`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#888', fontFamily: 'monospace' }}>{agent.model}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[agent.status], display: 'inline-block', animation: agent.status !== 'GREEN' ? 'pulse 1.5s infinite' : 'none', boxShadow: `0 0 8px ${STATUS_COLORS[agent.status]}` }} />
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: 8 }}>{agent.task}</div>
                {/* Load bar */}
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 4, marginBottom: 6 }}>
                  <div style={{ width: `${agent.load}%`, height: '100%', borderRadius: 4, background: STATUS_COLORS[agent.status] }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#666', fontFamily: 'monospace' }}>
                  <span>Load: {agent.load}%</span>
                  <span>Last SOP: {agent.lastSOP}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Screen: REVENUE (27 Countries) ── */}
      {screen === 'REVENUE' && (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", marginBottom: 20 }}>27-COUNTRY SOVEREIGN REVENUE NEXUS</h2>
          <div style={{ background: '#050a10', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                  {['Country', 'Currency', 'MRR', 'Escrow', '0.5% SaaS', 'Trend'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REVENUE_TABLE.map((row, i) => (
                  <tr key={row.country} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px 16px' }}>{row.flag} {row.country}</td>
                    <td style={{ padding: '12px 16px', color: '#888', fontFamily: 'monospace' }}>{row.currency}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>{row.mrr.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#3498DB' }}>{row.escrow.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#D4AF37' }}>{row.saas.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: row.trend === '+' ? '#27AE60' : row.trend === '-' ? '#E74C3C' : '#888', fontWeight: 700, fontSize: '1rem' }}>{row.trend === '+' ? '↑' : row.trend === '-' ? '↓' : '→'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Settlement routing note */}
          <div style={{ marginTop: 16, background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: 16, fontSize: '0.78rem', color: '#888', fontFamily: 'monospace' }}>
            💳 SETTLEMENT ROUTING: All international payments → <span style={{ color: '#D4AF37' }}>Altovex Paybill 400200</span> · Alipay · WeChat · Cards · M-Pesa
          </div>
        </div>
      )}

      {/* ── Screen: VAULT ── */}
      {screen === 'VAULT' && (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", marginBottom: 20 }}>TRI-VAULT ARCHITECTURE</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { title: '🔐 CTO VAULT', desc: 'Source Code · API Secrets · Infrastructure Keys', color: '#D4AF37', locked: vaultLocked, items: ['GitHub Tokens', 'Vercel Deploy Keys', 'Supabase Service Role', 'Equity HMAC Secret'] },
              { title: '💰 FINANCIAL VAULT', desc: 'Escrow Records · SaaS Revenue · Settlement Logs', color: '#3498DB', locked: false, items: ['Escrow Transactions', 'SaaS Revenue Log', 'Altovex Settlement', 'Equity Bank Ingest'] },
              { title: '⚖️ LEGAL VAULT', desc: 'Contracts · KYC · Tri-Lock Authorizations', color: '#E74C3C', locked: true, items: ['Transfer Deeds', 'KYC Documents', 'Tri-Lock Sigs', 'NDA Archive'] },
            ].map(vault => (
              <div key={vault.title} style={{ background: '#050a10', border: `1px solid ${vault.color}44`, borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{vault.locked ? '🔒' : '🔓'}</div>
                <h3 style={{ color: vault.color, margin: '0 0 6px', fontSize: '0.9rem', fontFamily: 'monospace' }}>{vault.title}</h3>
                <p style={{ color: '#666', fontSize: '0.72rem', marginBottom: 16 }}>{vault.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {vault.items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: vault.locked ? '#444' : '#aaa' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: vault.locked ? '#333' : vault.color, flexShrink: 0 }} />
                      {vault.locked ? '••••••••••' : item}
                    </div>
                  ))}
                </div>
                {vault.locked && (
                  <button onClick={() => setCtrlE(true)}
                    style={{ width: '100%', marginTop: 16, padding: '10px', background: `${vault.color}22`, border: `1px solid ${vault.color}44`, borderRadius: 8, color: vault.color, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    Press Ctrl+E to Unlock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Screen: IoT MAP placeholder ── */}
      {screen === 'IoT MAP' && (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", marginBottom: 16 }}>SOVEREIGN IoT MAP</h2>
          <p style={{ color: '#888', marginBottom: 16, fontSize: '0.82rem' }}>Navigate to <a href="/iot-map" style={{ color: '#D4AF37' }}>/iot-map</a> for the full 27-country telemetry view.</p>
          <iframe src="/iot-map" style={{ width: '100%', height: '70vh', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12 }} />
        </div>
      )}

      {/* ── Screen: AUDIT ── */}
      {screen === 'AUDIT' && (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", marginBottom: 20 }}>ZENITH FINAL AUDIT — 27 REGIONAL HUBS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {['Kenya','Tanzania','Uganda','Rwanda','Ethiopia','South Africa','Zambia','Botswana','Namibia','Mozambique','Mauritius','Ghana','Nigeria','Djibouti','Seychelles','Angola','Madagascar','Zimbabwe','Malawi','Lesotho','Eritrea','South Sudan','Sudan','Somalia','DRC','Burundi','eSwatini'].map((country, i) => (
              <div key={country} style={{ background: '#050a10', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#aaa' }}>{country}</span>
                <span style={{ fontSize: '0.7rem', color: i < 7 ? '#27AE60' : i < 15 ? '#3498DB' : '#555', fontWeight: 700 }}>
                  {i < 7 ? '✅ LIVE' : i < 15 ? '⏳ SYNC' : '○ PENDING'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Screen: SYSTEM ── */}
      {screen === 'SYSTEM' && (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", marginBottom: 20 }}>TECH STACK TELEMETRY</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { label:'Next.js', version:'16.2.3 Turbopack', status:'GREEN', detail:'Vercel Edge · 7.9s build' },
              { label:'Supabase', version:'PostgreSQL 15', status:'GREEN', detail:'RLS enforced · 6 tables' },
              { label:'BigInt FX Engine', version:'v2.0', status:'GREEN', detail:'26 currencies · live rates' },
              { label:'Tri-Lock Escrow', version:'v2.0', status:'GREEN', detail:'PENDING→SOVEREIGN_RELEASE' },
              { label:'Equity Webhook', version:'HMAC-SHA256', status:'BLUE', detail:'Awaiting first live event' },
              { label:'Amanda AI', version:'Gemini 2.0', status:'GREEN', detail:'90% autonomy · 10% human' },
              { label:'ExchangeRate API', version:'v6', status:'GREEN', detail:'54b2db47... · 15min cache' },
              { label:'Recovery Engine', version:'v1.0', status:'GREEN', detail:'27-country risk index' },
            ].map(sys => (
              <div key={sys.label} style={{ background: '#050a10', border: `1px solid ${STATUS_COLORS[sys.status as StatusColor]}33`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{sys.label}</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[sys.status as StatusColor], display: 'inline-block', marginTop: 4 }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: '#D4AF37', fontFamily: 'monospace', marginBottom: 4 }}>{sys.version}</div>
                <div style={{ fontSize: '0.72rem', color: '#666' }}>{sys.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
