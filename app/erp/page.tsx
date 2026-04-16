'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// TITANIUM ZENITH v7.1 — ERP NEXUS HUB
// 30-Point Sovereign Protocol — All modules unified
// Routes: /erp → tabs for all 14 remaining modules
// ═══════════════════════════════════════════════════════════════

type TabId = 'pos'|'fleet'|'hr'|'supply'|'repair'|'fundraise'|'minter'|'fission'|'whatsapp'|'etims'|'partner'|'aeo'|'pwa'|'settlement';

const STATUS = { GREEN:'#27AE60', BLUE:'#3498DB', RED:'#E74C3C' };

// ── POS Hub ──────────────────────────────────────────────────
function POSHub() {
  const [items] = useState([
    { id:'P1', name:'Grilled Tilapia', price:1200, category:'Restaurant', stock:40, aiPrice:1350 },
    { id:'P2', name:'Nyama Choma 500g', price:2500, category:'Restaurant', stock:20, aiPrice:2650 },
    { id:'P3', name:'Premium Suite Night', price:18000, category:'Hospitality', stock:3, aiPrice:21000 },
    { id:'P4', name:'Safari Hamper', price:5400, category:'Shop', stock:12, aiPrice:5900 },
    { id:'P5', name:'Chapati x10', price:200, category:'Restaurant', stock:100, aiPrice:200 },
    { id:'P6', name:'Freshly Brewed Coffee', price:350, category:'Restaurant', stock:60, aiPrice:380 },
  ]);
  const [cart, setCart] = useState<{id:string;qty:number}[]>([]);

  const addToCart = (id: string) => {
    setCart(c => {
      const ex = c.find(i => i.id === id);
      if (ex) return c.map(i => i.id === id ? {...i, qty: i.qty+1} : i);
      return [...c, {id, qty:1}];
    });
  };

  const total = cart.reduce((sum, ci) => {
    const item = items.find(i => i.id === ci.id);
    return sum + (item?.aiPrice || 0) * ci.qty;
  }, 0);

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {['All','Restaurant','Hospitality','Shop'].map(cat => (
          <span key={cat} style={{ padding:'4px 12px', borderRadius:20, border:'1px solid rgba(212,175,55,0.3)', color:'#D4AF37', fontSize:'0.72rem', cursor:'pointer' }}>{cat}</span>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:10 }}>
          {items.map(item => (
            <div key={item.id} style={{ background:'#0a0a0a', border:'1px solid rgba(212,175,55,0.15)', borderRadius:10, padding:14 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:700, marginBottom:4 }}>{item.name}</div>
              <div style={{ fontSize:'0.65rem', color:'#888', marginBottom:6 }}>{item.category} · Stock: {item.stock}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <span style={{ fontSize:'0.72rem', color:'#555', textDecoration:'line-through' }}>KES {item.price.toLocaleString()}</span>
                  <div style={{ color:'#27AE60', fontWeight:700, fontSize:'0.85rem' }}>KES {item.aiPrice.toLocaleString()}</div>
                  <div style={{ fontSize:'0.6rem', color:'#3498DB' }}>AI Dynamic Price</div>
                </div>
                <button onClick={() => addToCart(item.id)}
                  style={{ padding:'6px 12px', background:'rgba(212,175,55,0.2)', border:'1px solid rgba(212,175,55,0.4)', borderRadius:8, color:'#D4AF37', fontSize:'0.75rem', cursor:'pointer' }}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Cart */}
        <div style={{ background:'#0a0a0a', border:'1px solid rgba(212,175,55,0.2)', borderRadius:12, padding:16 }}>
          <h4 style={{ color:'#D4AF37', margin:'0 0 12px', fontSize:'0.85rem' }}>🛒 ORDER CART</h4>
          {cart.length === 0 ? <p style={{ color:'#555', fontSize:'0.78rem' }}>No items yet</p> : (
            <>
              {cart.map(ci => {
                const item = items.find(i => i.id === ci.id);
                return item ? (
                  <div key={ci.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', marginBottom:8, color:'#aaa' }}>
                    <span>{item.name} ×{ci.qty}</span>
                    <span style={{ color:'#D4AF37' }}>KES {(item.aiPrice * ci.qty).toLocaleString()}</span>
                  </div>
                ) : null;
              })}
              <div style={{ borderTop:'1px solid rgba(212,175,55,0.2)', paddingTop:12, marginTop:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, color:'#fff' }}>
                  <span>TOTAL</span><span style={{ color:'#D4AF37' }}>KES {total.toLocaleString()}</span>
                </div>
              </div>
              <button style={{ width:'100%', marginTop:12, padding:'10px', background:'linear-gradient(135deg,#D4AF37,#8B6914)', border:'none', borderRadius:8, color:'#000', fontWeight:700, cursor:'pointer', fontSize:'0.82rem' }}>
                💳 Pay via Paybill 400200
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Fleet Lori Matchmaker ─────────────────────────────────────
function FleetLori() {
  const [matches] = useState([
    { cargo:'10T Maize — Kisumu→Nairobi', truck:'ISUZU FVR 26T', driver:'James Omollo', eta:'4h 20min', fuel:'180L', cost:28000, status:'GREEN' },
    { cargo:'Cold Chain Pharma — NBO→KLA', truck:'Mercedes Refrigerator', driver:'Ruth Namukasa', eta:'9h 45min', fuel:'340L', cost:65000, status:'BLUE' },
    { cargo:'40ft Container — Mombasa Port', truck:'Volvo FH16 750', driver:'Patrick Audo', eta:'2h 10min', fuel:'95L', cost:42000, status:'GREEN' },
    { cargo:'Livestock x40 — Eldoret→DSM', truck:'MAN TGS Livestock', driver:'Ali Hassan', eta:'16h', fuel:'520L', cost:98000, status:'BLUE' },
  ]);

  return (
    <div>
      <div style={{ background:'rgba(52,152,219,0.1)', border:'1px solid rgba(52,152,219,0.3)', borderRadius:12, padding:16, marginBottom:16, fontSize:'0.78rem', color:'#3498DB' }}>
        🤖 Fleet AI: Analysing fuel efficiency, route congestion, and driver performance scores across the COMESA corridor in real time.
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {matches.map((m, i) => (
          <div key={i} style={{ background:'#0a0a0a', border:`1px solid ${STATUS[m.status as keyof typeof STATUS]}33`, borderRadius:12, padding:16, display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:700, marginBottom:6, fontSize:'0.85rem' }}>{m.cargo}</div>
              <div style={{ display:'flex', gap:20, fontSize:'0.72rem', color:'#888', flexWrap:'wrap' }}>
                <span>🚛 {m.truck}</span>
                <span>👤 {m.driver}</span>
                <span>⏱ {m.eta}</span>
                <span>⛽ {m.fuel}</span>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'#D4AF37', fontWeight:700 }}>KES {m.cost.toLocaleString()}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end', marginTop:6 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:STATUS[m.status as keyof typeof STATUS], display:'inline-block', animation:'pulse 1.5s infinite', boxShadow:`0 0 6px ${STATUS[m.status as keyof typeof STATUS]}` }} />
                <span style={{ fontSize:'0.65rem', color:STATUS[m.status as keyof typeof STATUS] }}>{m.status}</span>
              </div>
              <button style={{ marginTop:8, padding:'6px 14px', background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:6, color:'#D4AF37', fontSize:'0.72rem', cursor:'pointer', fontWeight:700 }}>
                DISPATCH
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HR Appraisal AI ───────────────────────────────────────────
function HRAppraisal() {
  const [staff] = useState([
    { name:'Amina Wanjiru', role:'Property Manager', score:94, kpi:['Client Satisfaction: 97%','Listings: 23 active','Response: <2h'], trend:'+' },
    { name:'Brian Otieno',  role:'Fleet Coordinator', score:78, kpi:['On-time: 89%','Fuel saved: 12%','Escalations: 2'], trend:'~' },
    { name:'Claire Njoki',  role:'Finance Agent',    score:88, kpi:['Reconciliation: 100%','Escrow handled: 14','Disputes: 0'], trend:'+' },
    { name:'Denis Kamau',   role:'Field Inspector',  score:61, kpi:['Assets inspected: 8','Quality: 72%','Delays: 3'], trend:'-' },
  ]);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
      {staff.map(s => (
        <div key={s.name} style={{ background:'#0a0a0a', border:'1px solid rgba(212,175,55,0.15)', borderRadius:12, padding:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <div style={{ fontWeight:700 }}>{s.name}</div>
              <div style={{ fontSize:'0.7rem', color:'#888' }}>{s.role}</div>
            </div>
            <div style={{ fontSize:'1.8rem', fontWeight:900, color: s.score>=85?'#27AE60':s.score>=70?'#D4AF37':'#E74C3C' }}>{s.score}</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:4, height:6, marginBottom:12 }}>
            <div style={{ width:`${s.score}%`, height:'100%', borderRadius:4, background: s.score>=85?'#27AE60':s.score>=70?'#D4AF37':'#E74C3C' }} />
          </div>
          {s.kpi.map(k => (
            <div key={k} style={{ fontSize:'0.7rem', color:'#aaa', marginBottom:4, paddingLeft:8, borderLeft:`2px solid rgba(212,175,55,0.3)` }}>
              {k}
            </div>
          ))}
          <button style={{ width:'100%', marginTop:12, padding:'8px', background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.25)', borderRadius:8, color:'#D4AF37', fontSize:'0.72rem', cursor:'pointer' }}>
            🤖 Generate 360° AI Report
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Expert Minter ─────────────────────────────────────────────
function ExpertMinter() {
  const [name, setName] = useState('');
  const [cert, setCert] = useState('');
  const [minted, setMinted] = useState<{name:string,cert:string,id:string,ts:string}[]>([]);

  const mint = () => {
    if (!name || !cert) return;
    const id = `WH-CERT-${Date.now().toString(36).toUpperCase()}`;
    setMinted(m => [...m, { name, cert, id, ts: new Date().toLocaleTimeString('en-KE') }]);
    setName(''); setCert('');
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
      <div style={{ background:'#0a0a0a', border:'1px solid rgba(212,175,55,0.2)', borderRadius:12, padding:20 }}>
        <h4 style={{ color:'#D4AF37', margin:'0 0 16px', fontSize:'0.9rem' }}>🎯 MINT AI CERTIFICATION</h4>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Expert Full Name"
          style={{ width:'100%', padding:'10px 14px', background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:8, color:'#fff', fontSize:'0.82rem', marginBottom:10, boxSizing:'border-box' }} />
        <select value={cert} onChange={e=>setCert(e.target.value)}
          style={{ width:'100%', padding:'10px 14px', background:'#111', border:'1px solid rgba(212,175,55,0.3)', borderRadius:8, color:'#fff', fontSize:'0.82rem', marginBottom:16, boxSizing:'border-box' }}>
          <option value="">Select Certification...</option>
          <option>Wonderland Hospitality Pro — Level 1</option>
          <option>SADC Property Valuation Expert</option>
          <option>Titanium Escrow Agent Certified</option>
          <option>Fleet Management Specialist</option>
          <option>Amanda AI Operator</option>
        </select>
        <button onClick={mint} style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg,#D4AF37,#8B6914)', border:'none', borderRadius:8, color:'#000', fontWeight:700, cursor:'pointer' }}>
          🤖 Mint AI-Signed Certificate
        </button>
      </div>
      <div>
        <h4 style={{ color:'#D4AF37', margin:'0 0 16px', fontSize:'0.9rem' }}>📜 MINTED STACK</h4>
        {minted.length === 0 ? <p style={{ color:'#555', fontSize:'0.78rem' }}>No certifications minted yet.</p> : (
          minted.map(m => (
            <div key={m.id} style={{ background:'linear-gradient(135deg,rgba(212,175,55,0.08),rgba(0,0,0,0))', border:'1px solid rgba(212,175,55,0.3)', borderRadius:10, padding:14, marginBottom:10 }}>
              <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:4 }}>{m.name}</div>
              <div style={{ fontSize:'0.72rem', color:'#aaa', marginBottom:6 }}>{m.cert}</div>
              <div style={{ fontFamily:'monospace', fontSize:'0.65rem', color:'#D4AF37' }}>{m.id}</div>
              <div style={{ fontSize:'0.6rem', color:'#666', marginTop:4 }}>✦ Amanda AI Signed · {m.ts} EAT</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Settlement ─────────────────────────────────────────────────
function Settlement() {
  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,rgba(212,175,55,0.1),rgba(0,0,0,0))', border:'1px solid rgba(212,175,55,0.3)', borderRadius:16, padding:24, marginBottom:20, textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:8 }}>💳</div>
        <h3 style={{ color:'#D4AF37', fontFamily:"'Cinzel',serif", margin:'0 0 8px' }}>SOVEREIGN SETTLEMENT GATEWAY</h3>
        <p style={{ color:'#888', fontSize:'0.82rem', margin:'0 0 20px' }}>All international merchant payments route to Altovex</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:400, margin:'0 auto' }}>
          {[
            { label:'Paybill', val:'400200' },
            { label:'Account', val:'4045731' },
            { label:'Bank', val:'Altovex' },
            { label:'Currency', val:'Multi — 27 countries' },
          ].map(r => (
            <div key={r.label} style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)', borderRadius:10, padding:'12px' }}>
              <div style={{ color:'#888', fontSize:'0.65rem', marginBottom:4 }}>{r.label}</div>
              <div style={{ color:'#D4AF37', fontWeight:700, fontFamily:'monospace', fontSize:'0.9rem' }}>{r.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
        {['M-Pesa','Airtel Money','T-Kash','MTN Mobile','Alipay','WeChat Pay','Visa/Mastercard','SWIFT Wire','Equity Direct','KCB Linkuru'].map(method => (
          <div key={method} style={{ background:'#0a0a0a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'12px', textAlign:'center', fontSize:'0.72rem', color:'#aaa' }}>
            {method}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WhatsApp Sentry ────────────────────────────────────────────
function WhatsAppSentry() {
  const [msgs] = useState([
    { from:'+254711234567', text:'Hi, I want to book Karen Estate for 3 nights', time:'23:41', agent:'Amanda', reply:'Hello! I found 3 available dates. Shall I lock the escrow?' },
    { from:'+256772345678', text:'When will my vehicle be delivered?', time:'23:39', agent:'FleetAI', reply:'Your Hilux D/Cab is 42km away. ETA: 1h 20min. Track: TAO-TRK-441' },
    { from:'+27821234567', text:'I need the Tri-Lock documents signed', time:'23:35', agent:'LegalAI', reply:'Routing to CTO for Tri-Lock signature #3. Est: 15 minutes.' },
  ]);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'#25D366', boxShadow:'0 0 8px #25D366', animation:'pulse 2s infinite' }} />
          <span style={{ fontSize:'0.8rem', color:'#25D366', fontWeight:700 }}>AMANDA WhatsApp Sentry — LIVE</span>
        </div>
        {msgs.map((m, i) => (
          <div key={i} style={{ background:'#0a0a0a', border:'1px solid rgba(37,211,102,0.15)', borderRadius:12, padding:14, marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:'0.72rem', color:'#25D366', fontFamily:'monospace' }}>{m.from}</span>
              <span style={{ fontSize:'0.65rem', color:'#555' }}>{m.time} EAT · {m.agent}</span>
            </div>
            <div style={{ fontSize:'0.78rem', color:'#aaa', marginBottom:8 }}>📥 {m.text}</div>
            <div style={{ fontSize:'0.78rem', color:'#fff', background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', borderRadius:8, padding:'8px 10px' }}>
              🤖 {m.reply}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:'#0a0a0a', border:'1px solid rgba(212,175,55,0.15)', borderRadius:12, padding:16 }}>
        <h4 style={{ color:'#D4AF37', margin:'0 0 12px', fontSize:'0.85rem' }}>📊 SENTRY STATS</h4>
        {[
          { label:'Active chats', val:'23', color:'#27AE60' },
          { label:'AI resolved', val:'94%', color:'#3498DB' },
          { label:'Human escalated', val:'6%', color:'#E74C3C' },
          { label:'Orders processed', val:'7 today', color:'#D4AF37' },
        ].map(s => (
          <div key={s.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'0.78rem' }}>
            <span style={{ color:'#888' }}>{s.label}</span>
            <span style={{ color:s.color, fontWeight:700 }}>{s.val}</span>
          </div>
        ))}
        <a href={`https://wa.me/254718554383`} target="_blank" rel="noopener noreferrer"
          style={{ display:'block', marginTop:16, padding:'10px', background:'#25D366', color:'#fff', borderRadius:8, textAlign:'center', fontWeight:700, fontSize:'0.82rem', textDecoration:'none' }}>
          Open WhatsApp Hub
        </a>
      </div>
    </div>
  );
}

// ── Asset Repair Hub ──────────────────────────────────────────
function AssetRepair() {
  const [tickets] = useState([
    { id:'RPR-001', asset:'Toyota Land Cruiser V8 (V001)', issue:'Gearbox oil leak', status:'BLUE', tech:'Jonah Automotive', est:45000, days:3 },
    { id:'RPR-002', asset:'Karen Estate — Plumbing', issue:'Roof leak — 2 rooms', status:'RED', tech:'BuildFix Kenya', est:120000, days:7 },
    { id:'RPR-003', asset:'Bajaj Boxer Fleet x5', issue:'Scheduled service 5000km', status:'GREEN', tech:'Bajaj Service Centre', est:15000, days:1 },
  ]);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {tickets.map(t => (
        <div key={t.id} style={{ background:'#0a0a0a', border:`1px solid ${STATUS[t.status as keyof typeof STATUS]}33`, borderRadius:12, padding:18 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12, alignItems:'start' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:STATUS[t.status as keyof typeof STATUS], display:'inline-block', animation:'pulse 1.5s infinite', boxShadow:`0 0 6px ${STATUS[t.status as keyof typeof STATUS]}` }} />
                <span style={{ fontFamily:'monospace', color:'#D4AF37', fontSize:'0.72rem' }}>{t.id}</span>
              </div>
              <div style={{ fontWeight:700, marginBottom:4 }}>{t.asset}</div>
              <div style={{ fontSize:'0.78rem', color:'#888', marginBottom:8 }}>🔧 {t.issue}</div>
              <div style={{ fontSize:'0.72rem', color:'#aaa' }}>Technician: {t.tech} · ETA: {t.days} day{t.days>1?'s':''}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'#D4AF37', fontWeight:700 }}>KES {t.est.toLocaleString()}</div>
              <button style={{ marginTop:8, padding:'6px 14px', background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:6, color:'#D4AF37', fontSize:'0.72rem', cursor:'pointer' }}>
                Approve
              </button>
            </div>
          </div>
        </div>
      ))}
      <button style={{ padding:'12px', background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:10, color:'#D4AF37', fontSize:'0.82rem', cursor:'pointer', fontWeight:700 }}>
        + Log New Repair Ticket
      </button>
    </div>
  );
}

// ── MAIN ERP HUB ──────────────────────────────────────────────
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id:'pos',        label:'POS Hub',        icon:'🛒' },
  { id:'fleet',      label:'Fleet Lori',     icon:'🚛' },
  { id:'hr',         label:'HR Appraisal',   icon:'👥' },
  { id:'repair',     label:'Asset Repair',   icon:'🔧' },
  { id:'minter',     label:'Expert Minter',  icon:'🎓' },
  { id:'whatsapp',   label:'WhatsApp Sentry',icon:'💬' },
  { id:'settlement', label:'Settlement',     icon:'💳' },
  { id:'supply',     label:'Supply Chain',   icon:'📦' },
  { id:'fundraise',  label:'Fundraising',    icon:'🏦' },
  { id:'aeo',        label:'AEO Swarm',      icon:'🔍' },
  { id:'fission',    label:'Fission',        icon:'⚡' },
  { id:'etims',      label:'eTIMS',          icon:'🧾' },
  { id:'partner',    label:'Partner Hub',    icon:'🤝' },
  { id:'pwa',        label:'PWA Status',     icon:'📱' },
];

export default function ERPNexus() {
  const [tab, setTab] = useState<TabId>('pos');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const renderTab = () => {
    switch(tab) {
      case 'pos':        return <POSHub />;
      case 'fleet':      return <FleetLori />;
      case 'hr':         return <HRAppraisal />;
      case 'repair':     return <AssetRepair />;
      case 'minter':     return <ExpertMinter />;
      case 'whatsapp':   return <WhatsAppSentry />;
      case 'settlement': return <Settlement />;
      case 'supply':     return <SupplyChain />;
      case 'fundraise':  return <Fundraising />;
      case 'aeo':        return <AEOSwarm />;
      case 'fission':    return <FissionMechanic />;
      case 'etims':      return <ETIMSLoop />;
      case 'partner':    return <PartnerHub />;
      case 'pwa':        return <PWAStatus />;
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#020508', color:'#fff', fontFamily:'Inter,sans-serif' }}>
      {/* Header */}
      <div style={{ background:'rgba(5,10,16,0.98)', borderBottom:'1px solid rgba(212,175,55,0.2)', padding:'0 24px', display:'flex', alignItems:'center', height:52, gap:16 }}>
        <span style={{ color:'#D4AF37', fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:'0.95rem' }}>⚡ TITANIUM ERP NEXUS</span>
        <span style={{ color:'#555', fontSize:'0.7rem', fontFamily:'monospace', flex:1 }}>27 NATIONS · 90/10 AI RATIO · DIVINE ZENITH v7.1</span>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {([['GREEN',12],['BLUE',5],['RED',1]] as const).map(([c,n]) => (
            <span key={c} style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.68rem', color:STATUS[c] }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:STATUS[c], display:'inline-block', animation:c==='RED'?'pulse 1s infinite':'none' }} />{n}
            </span>
          ))}
          <span style={{ fontFamily:'monospace', color:'#D4AF37', fontSize:'0.78rem', borderLeft:'1px solid rgba(212,175,55,0.2)', paddingLeft:10 }}>
            {time.toLocaleTimeString('en-KE',{hour12:false})} EAT
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background:'#050a10', borderBottom:'1px solid rgba(212,175,55,0.1)', padding:'0 20px', display:'flex', gap:4, overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'10px 14px', border:'none', background:tab===t.id?'rgba(212,175,55,0.15)':'transparent', color:tab===t.id?'#D4AF37':'#555', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', borderBottom:tab===t.id?'2px solid #D4AF37':'2px solid transparent', letterSpacing:0.5 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:24, maxWidth:1400, margin:'0 auto' }}>
        {renderTab()}
      </div>
    </div>
  );
}

// ── Remaining stub modules ─────────────────────────────────────
function SupplyChain() {
  const items = [
    { sku:'SC-MAT-001', name:'Ceramic Floor Tiles', qty:2400, unit:'sqm', location:'Mombasa ICD', status:'GREEN', eta:'2 days' },
    { sku:'SC-VEH-012', name:'Toyota Hilux Parts Batch', qty:150, unit:'units', location:'Toyota Kenya Warehouse', status:'BLUE', eta:'5 days' },
    { sku:'SC-EQP-007', name:'HVAC Units — 3 Bedrm', qty:12, unit:'units', location:'Jomo Kenyatta Port', status:'BLUE', eta:'12 days' },
  ];
  return (
    <div>
      <h3 style={{ color:'#D4AF37', marginBottom:16, fontSize:'0.9rem', fontFamily:'monospace' }}>REAL-TIME PROCUREMENT TRACKING</h3>
      {items.map(i => (
        <div key={i.sku} style={{ background:'#0a0a0a', border:`1px solid ${STATUS[i.status as keyof typeof STATUS]}22`, borderRadius:10, padding:'14px 18px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:700, marginBottom:4 }}>{i.name}</div>
            <div style={{ fontSize:'0.72rem', color:'#888' }}>{i.sku} · {i.qty} {i.unit} · {i.location}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:STATUS[i.status as keyof typeof STATUS], fontSize:'0.72rem', marginBottom:4 }}>ETA: {i.eta}</div>
            <span style={{ width:8, height:8, borderRadius:'50%', background:STATUS[i.status as keyof typeof STATUS], display:'inline-block' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Fundraising() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
      {[
        { name:'Karen Estate Fund', target:50000000, raised:32000000, investors:14, returns:'12% p.a.', status:'GREEN' },
        { name:'SADC Vehicle Fleet Bond', target:80000000, raised:18500000, investors:7, returns:'15% p.a.', status:'BLUE' },
        { name:'Djibouti Port Logistics', target:120000000, raised:5000000, investors:3, returns:'18% p.a.', status:'BLUE' },
      ].map(f => (
        <div key={f.name} style={{ background:'#0a0a0a', border:'1px solid rgba(212,175,55,0.2)', borderRadius:12, padding:18 }}>
          <div style={{ fontWeight:700, marginBottom:6, fontSize:'0.85rem' }}>{f.name}</div>
          <div style={{ fontSize:'0.72rem', color:'#888', marginBottom:10 }}>{f.investors} investors · {f.returns}</div>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:4, height:6, marginBottom:8 }}>
            <div style={{ width:`${Math.min(100,(f.raised/f.target)*100)}%`, height:'100%', borderRadius:4, background:'#D4AF37' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem' }}>
            <span style={{ color:'#D4AF37' }}>KES {(f.raised/1e6).toFixed(1)}M</span>
            <span style={{ color:'#555' }}>of {(f.target/1e6).toFixed(0)}M</span>
          </div>
          <button style={{ width:'100%', marginTop:12, padding:'8px', background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:8, color:'#D4AF37', fontSize:'0.72rem', cursor:'pointer' }}>
            Invest Now
          </button>
        </div>
      ))}
    </div>
  );
}

function AEOSwarm() {
  return (
    <div>
      <div style={{ background:'rgba(52,152,219,0.08)', border:'1px solid rgba(52,152,219,0.3)', borderRadius:12, padding:16, marginBottom:16 }}>
        <div style={{ color:'#3498DB', fontWeight:700, marginBottom:8 }}>🔍 GEMINI AEO ENGINE — ACTIVE</div>
        <div style={{ fontSize:'0.78rem', color:'#888' }}>Answer Engine Optimization for Google AI Overviews, Perplexity, and ChatGPT search dominance across 27 SADC/EA markets.</div>
      </div>
      {['Wonderland Hospitality featured in AI Overview for "luxury real estate Kenya"','TAO Platform cited by Perplexity for "SADC property escrow"','AEO agent pushed 14 structured Q&A blocks this week','Vehicle Hub appearing in ChatGPT "best car marketplace East Africa"'].map((insight, i) => (
        <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'0.78rem' }}>
          <span style={{ color:'#3498DB', marginTop:2 }}>•</span>
          <span style={{ color:'#aaa' }}>{insight}</span>
        </div>
      ))}
    </div>
  );
}

function FissionMechanic() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const categories = [
    { id:'vehicles', label:'🚗 Vehicle Marketplace', locked:true },
    { id:'properties', label:'🏡 Luxury Properties', locked:true },
    { id:'experts', label:'👨‍💼 Expert Directory', locked:true },
    { id:'fleet', label:'🚛 Fleet Lori Matchmaker', locked:true },
  ];
  const share = (id: string) => {
    navigator.clipboard?.writeText(`https://tao-platform.vercel.app/${id}?ref=FISSION_${Date.now()}`).catch(()=>{});
    setUnlocked(u => [...u, id]);
  };
  return (
    <div>
      <p style={{ color:'#888', fontSize:'0.82rem', marginBottom:16 }}>Share once to unlock full category access — Fission Mechanic.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background:'#0a0a0a', border:`1px solid ${unlocked.includes(cat.id)?'#27AE60':'rgba(212,175,55,0.2)'}`, borderRadius:12, padding:18, textAlign:'center' }}>
            <div style={{ fontSize:'1.5rem', marginBottom:8 }}>{unlocked.includes(cat.id)?'🔓':'🔒'}</div>
            <div style={{ fontWeight:700, marginBottom:10, fontSize:'0.82rem' }}>{cat.label}</div>
            {unlocked.includes(cat.id)
              ? <div style={{ color:'#27AE60', fontSize:'0.72rem' }}>✅ Unlocked via Fission</div>
              : <button onClick={() => share(cat.id)} style={{ padding:'8px 16px', background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:8, color:'#D4AF37', fontSize:'0.75rem', cursor:'pointer', fontWeight:700 }}>⚡ Share to Unlock</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function ETIMSLoop() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Invoices Signed Today', val:'47', status:'GREEN' },
          { label:'KRA Sync Status', val:'LIVE', status:'GREEN' },
          { label:'Pending eTIMS', val:'3', status:'BLUE' },
        ].map(s => (
          <div key={s.label} style={{ background:'#0a0a0a', border:`1px solid ${STATUS[s.status as keyof typeof STATUS]}33`, borderRadius:12, padding:18, textAlign:'center' }}>
            <div style={{ fontSize:'2rem', fontWeight:900, color:STATUS[s.status as keyof typeof STATUS], marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:'0.72rem', color:'#888' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'rgba(39,174,96,0.08)', border:'1px solid rgba(39,174,96,0.25)', borderRadius:10, padding:14, fontSize:'0.78rem', color:'#aaa' }}>
        🧾 eTIMS Loop: Automated fiscal signatures fire every escrow release. KRA compliance engine running. SADC harmonized tax schema active across 27 nations.
      </div>
    </div>
  );
}

function PartnerHub() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
        {['Equity Bank','Altovex','Alipay','WeChat Pay','Mpesa Paybill','KCB Group','Stanbic IBTC','Ecobank'].map(p => (
          <div key={p} style={{ background:'#0a0a0a', border:'1px solid rgba(212,175,55,0.15)', borderRadius:10, padding:'14px', textAlign:'center', fontSize:'0.82rem', color:'#aaa' }}>
            <div style={{ fontSize:'1.8rem', marginBottom:8 }}>🏦</div>
            {p}
          </div>
        ))}
      </div>
      <button style={{ marginTop:16, padding:'11px 24px', background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:10, color:'#D4AF37', fontSize:'0.82rem', cursor:'pointer', fontWeight:700 }}>
        + Clone Dashboard for New Partner
      </button>
    </div>
  );
}

function PWAStatus() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
        {[
          { label:'Service Worker', val:'Registered ✅', color:'#27AE60' },
          { label:'Offline Cache', val:'Active ✅', color:'#27AE60' },
          { label:'Manifest', val:'Loaded ✅', color:'#27AE60' },
          { label:'Install Prompt', val:'Ready ✅', color:'#27AE60' },
          { label:'Push Notifications', val:'Pending ⏳', color:'#3498DB' },
          { label:'Background Sync', val:'Active ✅', color:'#27AE60' },
        ].map(s => (
          <div key={s.label} style={{ background:'#0a0a0a', border:`1px solid ${s.color}33`, borderRadius:10, padding:16 }}>
            <div style={{ color:s.color, fontWeight:700, marginBottom:4, fontSize:'0.85rem' }}>{s.val}</div>
            <div style={{ color:'#888', fontSize:'0.72rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
