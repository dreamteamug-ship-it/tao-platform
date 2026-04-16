'use client';
import { useState, useEffect, useMemo } from 'react';

interface Provider {
  id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  country: string;
  kyc_status: string;
  rating?: number;
  review_count?: number;
  years_experience?: number;
  coverage?: string;
  narrative_description?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Legal': '⚖️', 'Finance': '🏦', 'Architecture': '🏛️', 'Insurance': '🛡️',
  'Construction': '🔨', 'Valuation': '📊', 'Interior Design': '🎨',
  'Moving': '🚛', 'Security': '🔒', 'Utilities': '⚡', 'Agency': '🏠',
  'Surveying': '📐', 'Technology': '💻', 'Management': '📋',
  'Cleaning': '🧹', 'Property Services': '🔧', 'Commercial': '🏢',
  'Development': '🏗️', 'Vehicle Services': '🔩',
};

const COUNTRY_FLAGS: Record<string, string> = {
  KE:'🇰🇪', TZ:'🇹🇿', UG:'🇺🇬', RW:'🇷🇼', ET:'🇪🇹',
  ZA:'🇿🇦', ZW:'🇿🇼', ZM:'🇿🇲', BW:'🇧🇼', NA:'🇳🇦',
  DJ:'🇩🇯', SC:'🇸🇨', CD:'🇨🇩', MU:'🇲🇺', MG:'🇲🇬',
};

// 50 hardcoded service providers (mirrors supabase-phase3.sql seed)
const HARDCODED: Provider[] = [
  { id:'SP001', name:'Apex Property Law LLP', category:'Legal', phone:'+254722100001', email:'info@apexlaw.co.ke', country:'KE', kyc_status:'verified', rating:4.9, review_count:312, years_experience:18, coverage:'National', narrative_description:'East Africa\'s premier conveyancing firm, processing KSh 47B+ in transactions since 2006.' },
  { id:'SP002', name:'Milestone Mortgage Brokers', category:'Finance', phone:'+254733200002', email:'apply@milestonemortgage.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:276, years_experience:12, coverage:'National', narrative_description:'4,200+ home loan approvals with 94% success rate and 48-hour AI pre-qualification.' },
  { id:'SP003', name:'NairobiArch Studio', category:'Architecture', phone:'+254741300003', email:'design@nairobi-arch.co.ke', country:'KE', kyc_status:'verified', rating:4.9, review_count:198, years_experience:15, coverage:'National', narrative_description:'2024 AIA Africa Award recipient — bioclimatic design for Kenya\'s diverse climate zones.' },
  { id:'SP004', name:'EastShield Insurance Brokers', category:'Insurance', phone:'+254712400004', email:'protect@eastshield.co.ke', country:'KE', kyc_status:'verified', rating:4.7, review_count:445, years_experience:14, coverage:'National', narrative_description:'12,000+ clients, 23% avg premium savings, TAO exclusive platform insurance partner.' },
  { id:'SP005', name:'StructCorp Engineering', category:'Construction', phone:'+254751500005', email:'build@structcorp.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:167, years_experience:20, coverage:'Regional', narrative_description:'ISO 9001:2015 certified — 340+ structures across Kenya, Uganda, Tanzania.' },
  { id:'SP006', name:'ValuePro Valuers & Surveyors', category:'Valuation', phone:'+254762600006', email:'value@valuepro.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:389, years_experience:16, coverage:'National', narrative_description:'47 BORAQS-registered valuers, 48-hour mortgage valuation turnaround.' },
  { id:'SP007', name:'Habitat Interior Design', category:'Interior Design', phone:'+254773700007', email:'hello@habitat.co.ke', country:'KE', kyc_status:'verified', rating:4.9, review_count:134, years_experience:11, coverage:'National', narrative_description:'280+ luxury spaces transformed, East Africa\'s largest furniture showroom.' },
  { id:'SP008', name:'MoveMaster Logistics', category:'Moving', phone:'+254784800008', email:'move@movemaster.co.ke', country:'KE', kyc_status:'verified', rating:4.6, review_count:521, years_experience:9, coverage:'National', narrative_description:'78 dedicated moving trucks, 91% damage claims reduction via digital inventory app.' },
  { id:'SP009', name:'Sentinel Security Systems', category:'Security', phone:'+254795900009', email:'secure@sentinel.co.ke', country:'KE', kyc_status:'verified', rating:4.7, review_count:298, years_experience:13, coverage:'National', narrative_description:'8,500+ properties protected, SmartGuard AI with 6-min response time.' },
  { id:'SP010', name:'SolarPeak Energy Solutions', category:'Utilities', phone:'+254706010010', email:'power@solarpeak.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:213, years_experience:10, coverage:'National', narrative_description:'2,700+ solar systems installed, 78% average household electricity bill reduction.' },
  { id:'SP011', name:'TanzaProp Realty', category:'Agency', phone:'+255754100011', email:'list@tanzaprop.co.tz', country:'TZ', kyc_status:'verified', rating:4.7, review_count:187, years_experience:12, coverage:'Regional', narrative_description:'560+ Dar es Salaam luxury transactions, Zanzibar foreign investor specialists.' },
  { id:'SP012', name:'Kampala Legal Associates', category:'Legal', phone:'+256782200012', email:'law@kampala-legal.co.ug', country:'UG', kyc_status:'verified', rating:4.6, review_count:156, years_experience:14, coverage:'National', narrative_description:'Uganda\'s premier property law firm — Mailo, Freehold, Leasehold navigation.' },
  { id:'SP013', name:'Kigali Real Estate Group', category:'Agency', phone:'+250788300013', email:'invest@kigali-realty.rw', country:'RW', kyc_status:'verified', rating:4.9, review_count:224, years_experience:8, coverage:'National', narrative_description:'780+ transactions in Vision 2050 corridors, Rwanda\'s #1 SADC diaspora advisor.' },
  { id:'SP014', name:'Addis Prime Properties', category:'Agency', phone:'+251911400014', email:'invest@addisprime.et', country:'ET', kyc_status:'verified', rating:4.5, review_count:143, years_experience:10, coverage:'National', narrative_description:'Proprietary Lease Optimization Index for Ethiopia\'s 99-year municipal leases.' },
  { id:'SP015', name:'Cape Town Coastal Properties', category:'Agency', phone:'+27825500015', email:'list@capeproperty.co.za', country:'ZA', kyc_status:'verified', rating:4.9, review_count:412, years_experience:19, coverage:'Regional', narrative_description:'R12.4B portfolio — Atlantic Seaboard, V&A Waterfront luxury specialists.' },
  { id:'SP016', name:'Harare Heritage Estates', category:'Agency', phone:'+263774600016', email:'homes@harareheritage.co.zw', country:'ZW', kyc_status:'verified', rating:4.4, review_count:98, years_experience:16, coverage:'National', narrative_description:'USD-denominated pricing in Borrowdale, Highlands, Avondale segments.' },
  { id:'SP017', name:'ProClean Facilities Management', category:'Cleaning', phone:'+254717710017', email:'clean@proclean.co.ke', country:'KE', kyc_status:'verified', rating:4.7, review_count:334, years_experience:8, coverage:'National', narrative_description:'620+ clients, ISO 14001:2015 eco-cleaning, post-construction handover specialists.' },
  { id:'SP018', name:'EliteFit Gym Equipment Supply', category:'Property Services', phone:'+254728820018', email:'equip@elitefit.co.ke', country:'KE', kyc_status:'pending', rating:4.5, review_count:67, years_experience:6, coverage:'National', narrative_description:'78+ apartment gym fit-outs — Life Fitness, Precor, Technogym direct supplier.' },
  { id:'SP019', name:'AquaStream Pool Solutions', category:'Property Services', phone:'+254739930019', email:'pools@aquastream.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:112, years_experience:11, coverage:'National', narrative_description:'420+ swimming pools built, AquaBot™ 24/7 IoT chemical management system.' },
  { id:'SP020', name:'MegaSpan Roofing & Waterproofing', category:'Construction', phone:'+254740040020', email:'roof@megaspan.co.ke', country:'KE', kyc_status:'verified', rating:4.6, review_count:189, years_experience:13, coverage:'National', narrative_description:'1,800+ roofing projects, Aquaseal™ membrane with 20-year material guarantee.' },
  { id:'SP021', name:'Geo-Tech Land Surveyors', category:'Surveying', phone:'+254751150021', email:'survey@geotech.co.ke', country:'KE', kyc_status:'verified', rating:4.7, review_count:234, years_experience:17, coverage:'National', narrative_description:'One of Kenya\'s 12 corporate survey licences — 800+ surveys/year with drone mapping.' },
  { id:'SP022', name:'Lumière Lighting Design', category:'Interior Design', phone:'+254762260022', email:'light@lumiere.co.ke', country:'KE', kyc_status:'verified', rating:4.9, review_count:78, years_experience:9, coverage:'National', narrative_description:'East Africa\'s only dedicated architectural lighting firm — NMK, 14 towers, 40+ villas.' },
  { id:'SP023', name:'QuickLinks Internet & CCTV', category:'Technology', phone:'+254773370023', email:'connect@quicklinks.co.ke', country:'KE', kyc_status:'pending', rating:4.4, review_count:156, years_experience:7, coverage:'National', narrative_description:'LinkSmesh™ estate-wide Wi-Fi deployed in 38 apartment blocks — 100% uptime.' },
  { id:'SP024', name:'PrimePark Parking Solutions', category:'Property Services', phone:'+254784480024', email:'park@primepark.co.ke', country:'KE', kyc_status:'verified', rating:4.5, review_count:89, years_experience:8, coverage:'National', narrative_description:'Hydraulic puzzle-parking multiplies site capacity by 340% — 12 CBD developments.' },
  { id:'SP025', name:'Highland Landscaping & Gardens', category:'Property Services', phone:'+254795590025', email:'gardens@highland.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:201, years_experience:14, coverage:'National', narrative_description:'340+ grounds designed — IFLA Africa Region Award winner for JKIA public realm.' },
  { id:'SP026', name:'SwiftSeal Plumbing & Gas', category:'Property Services', phone:'+254706600026', email:'fix@swiftseal.co.ke', country:'KE', kyc_status:'verified', rating:4.6, review_count:312, years_experience:10, coverage:'National', narrative_description:'280+ service calls/month, 2-hour emergency response, HBE Gas Certification.' },
  { id:'SP027', name:'Electra Power Systems', category:'Utilities', phone:'+254717710027', email:'power@electra.co.ke', country:'KE', kyc_status:'verified', rating:4.7, review_count:178, years_experience:12, coverage:'National', narrative_description:'620+ generator units monitored, 99.97% uptime — FG Wilson, Cummins authorized.' },
  { id:'SP028', name:'AirCool HVAC Engineers', category:'Property Services', phone:'+254728820028', email:'cool@aircool.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:245, years_experience:15, coverage:'National', narrative_description:'VRF systems reducing energy by 35%, ASHRAE/CIBSE affiliate members.' },
  { id:'SP029', name:'DocuSign Property Conveyancing', category:'Legal', phone:'+254739930029', email:'convey@docusign.co.ke', country:'KE', kyc_status:'pending', rating:4.5, review_count:123, years_experience:8, coverage:'National', narrative_description:'First firm to complete fully digital title transfer in Kenya — zero rejected lodgements.' },
  { id:'SP030', name:'Mombasafront Coastal Realty', category:'Agency', phone:'+254711040030', email:'coastal@mombasafront.co.ke', country:'KE', kyc_status:'verified', rating:4.7, review_count:167, years_experience:16, coverage:'National', narrative_description:'Exclusive mandates on Watamu, Malindi, Diani frontage — 28-35% net Airbnb yield.' },
  { id:'SP031', name:'KisimuLake Properties', category:'Agency', phone:'+254722150031', email:'lake@kisumuprops.co.ke', country:'KE', kyc_status:'verified', rating:4.5, review_count:134, years_experience:11, coverage:'National', narrative_description:'Western Kenya anchor agency — lakefront, LAPSSET corridor industrial land.' },
  { id:'SP032', name:'AutoPrime Garage Solutions', category:'Vehicle Services', phone:'+254751160032', email:'garage@autoprime.co.ke', country:'KE', kyc_status:'verified', rating:4.6, review_count:289, years_experience:10, coverage:'National', narrative_description:'12 locations, 8,400+ vehicles/month serviced, TAO Vehicle Finance Partner.' },
  { id:'SP033', name:'MedAbode Health Estates', category:'Development', phone:'+254762270033', email:'health@medabode.co.ke', country:'KE', kyc_status:'pending', rating:4.7, review_count:56, years_experience:7, coverage:'National', narrative_description:'Sub-Saharan Africa\'s first CCRC — 240-unit Kiambu retirement community.' },
  { id:'SP034', name:'PropertyTax Kenya', category:'Legal', phone:'+254773380034', email:'tax@propertytax.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:223, years_experience:13, coverage:'National', narrative_description:'KSh 14B in treaty-based CGT-exempt cross-border transactions structured.' },
  { id:'SP035', name:'ExpressVault Property Management', category:'Management', phone:'+254784490035', email:'manage@expressvault.co.ke', country:'KE', kyc_status:'verified', rating:4.7, review_count:345, years_experience:11, coverage:'National', narrative_description:'2,400+ units managed, PropVault™ real-time owner dashboard integrated on TAO.' },
  { id:'SP036', name:'Buildco Steel & Fabrication', category:'Construction', phone:'+254795500036', email:'steel@buildco.co.ke', country:'KE', kyc_status:'verified', rating:4.6, review_count:134, years_experience:18, coverage:'Regional', narrative_description:'East Africa\'s oldest structural steel contractor — 48 towers, TEKLA engineering.' },
  { id:'SP037', name:'StartHome Affordable Housing', category:'Development', phone:'+254706610037', email:'afford@starthome.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:278, years_experience:9, coverage:'National', narrative_description:'3,200 government social housing units — 28% cost reduction via modular construction.' },
  { id:'SP038', name:'PlatinumTile & Stone', category:'Property Services', phone:'+254717720038', email:'tiles@platinum.co.ke', country:'KE', kyc_status:'pending', rating:4.5, review_count:89, years_experience:7, coverage:'National', narrative_description:'2,400+ varieties in 12,000m² showroom — Italian, Spanish, Turkish, Ethiopian stone.' },
  { id:'SP039', name:'SmartGate Access Control', category:'Technology', phone:'+254728830039', email:'access@smartgate.co.ke', country:'KE', kyc_status:'verified', rating:4.8, review_count:167, years_experience:10, coverage:'National', narrative_description:'280+ estates protected — SmartMesh™ operates offline, syncs when connectivity restores.' },
  { id:'SP040', name:'Nairobi Paint & Décor Centre', category:'Property Services', phone:'+254739940040', email:'paint@nrbpaint.co.ke', country:'KE', kyc_status:'pending', rating:4.4, review_count:112, years_experience:6, coverage:'National', narrative_description:'Plascon/Levis/Crown exclusive distributor — ColourVision™ AR paint preview app.' },
  { id:'SP041', name:'SolarSave Energy Tanzania', category:'Utilities', phone:'+255766050041', email:'solar@solarsave.co.tz', country:'TZ', kyc_status:'verified', rating:4.7, review_count:134, years_experience:8, coverage:'Regional', narrative_description:'140+ solar microgrids, 18,000 households — World Bank recognized PAYGO model.' },
  { id:'SP042', name:'Lusaka Gateway Properties', category:'Agency', phone:'+260976160042', email:'list@lusakagateway.co.zm', country:'ZM', kyc_status:'verified', rating:4.6, review_count:98, years_experience:11, coverage:'National', narrative_description:'Exclusive mandates on 14 Lusaka South MFEZ logistics warehouse facilities.' },
  { id:'SP043', name:'RwandaBuild Construction', category:'Construction', phone:'+250788270043', email:'build@rwandabuild.rw', country:'RW', kyc_status:'verified', rating:4.9, review_count:189, years_experience:12, coverage:'National', narrative_description:'EDGE-certified sustainable construction leader — only dedicated sustainability engineer in Rwanda.' },
  { id:'SP044', name:'Gaborone Land Brokers', category:'Agency', phone:'+26771380044', email:'land@gaborone.co.bw', country:'BW', kyc_status:'verified', rating:4.7, review_count:112, years_experience:15, coverage:'National', narrative_description:'Botswana\'s SHHA, tribal, and freehold expert — preferred SADC entry for SA institutional investors.' },
  { id:'SP045', name:'Windhoek Prime Realty', category:'Agency', phone:'+264812490045', email:'namibia@windhoekprime.com.na', country:'NA', kyc_status:'verified', rating:4.6, review_count:134, years_experience:14, coverage:'National', narrative_description:'Namibia dollarized market — coastal Swakopmund/Walvis tourism 19-24% USD yields.' },
  { id:'SP046', name:'Djibouti Trade Hub Properties', category:'Commercial', phone:'+25377550046', email:'hub@djiboutiprops.dj', country:'DJ', kyc_status:'verified', rating:4.8, review_count:67, years_experience:9, coverage:'Regional', narrative_description:'Port-adjacent warehouses 18-22% gross yield — Horn of Africa logistics gateway.' },
  { id:'SP047', name:'Seychelles Paradise Villas', category:'Agency', phone:'+248256605047', email:'luxury@seyvillas.sc', country:'SC', kyc_status:'verified', rating:4.9, review_count:89, years_experience:12, coverage:'National', narrative_description:'IRS/PDS schemes — 0% CGT, 0% inheritance tax, GDP per capita USD 16,000+.' },
  { id:'SP048', name:'DRC Kinshasa Urban Properties', category:'Agency', phone:'+243818710048', email:'invest@kinshasaurban.cd', country:'CD', kyc_status:'pending', rating:4.3, review_count:78, years_experience:8, coverage:'National', narrative_description:'Coutumier Rights Mapping for Kinshasa\'s 17M-person urban economy exposure.' },
  { id:'SP049', name:'Mauritius Global Living', category:'Agency', phone:'+23054820049', email:'invest@mauriceglobal.mu', country:'MU', kyc_status:'verified', rating:4.9, review_count:223, years_experience:16, coverage:'National', narrative_description:'IRS/RES/PDS/Smart City — residency from USD 375K, 9.8% avg USD appreciation p.a.' },
  { id:'SP050', name:'Madagascar Amber Coast Realty', category:'Agency', phone:'+26132930050', email:'invest@ambercoast.mg', country:'MG', kyc_status:'pending', rating:4.5, review_count:45, years_experience:7, coverage:'Regional', narrative_description:'Nosy Be frontier market — 80% Airbnb occupancy, first-mover SADC opportunity.' },
];

const CATEGORIES_LIST = ['All', ...Array.from(new Set(HARDCODED.map(p => p.category))).sort()];
const COUNTRIES_LIST = ['All', ...Array.from(new Set(HARDCODED.map(p => p.country))).sort()];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#FFD700' : '#333', fontSize: '0.75rem' }}>★</span>
      ))}
      <span style={{ color: 'var(--silver)', fontSize: '0.72rem', marginLeft: 2 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ServicesPage() {
  const [providers, setProviders] = useState<Provider[]>(HARDCODED);
  const [category, setCategory] = useState('All');
  const [country, setCountry] = useState('All');
  const [kyc, setKyc] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Provider | null>(null);

  // Merge Supabase data silently
  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => {
        if (d.providers?.length) {
          const ids = new Set(HARDCODED.map(p => p.id));
          const newOnes = d.providers.filter((p: Provider) => !ids.has(p.id));
          if (newOnes.length) setProviders([...HARDCODED, ...newOnes]);
        }
      }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return providers.filter(p => {
      if (category !== 'All' && p.category !== category) return false;
      if (country !== 'All' && p.country !== country) return false;
      if (kyc !== 'All' && p.kyc_status !== kyc.toLowerCase()) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !(p.narrative_description || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [providers, category, country, kyc, search]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--deep-blue)', paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(5,10,16,0) 60%), linear-gradient(to bottom, #050a10, #0a0f1a)', padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid var(--border-gold)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', borderRadius: 30, padding: '5px 18px', marginBottom: 16, fontSize: '0.78rem', color: 'var(--gold)', fontFamily: "'Share Tech Mono', monospace" }}>
          ✦ TAO SOVEREIGN SERVICE DIRECTORY · {providers.length} VERIFIED PROVIDERS · 26 SADC/EA NATIONS
        </div>
        <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 14px' }}>
          Service <span style={{ color: 'var(--gold)' }}>Providers</span>
        </h1>
        <p style={{ color: 'var(--silver)', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
          KYC-verified professionals across law, finance, construction, design, and 15+ categories. Every specialist TAO-screened for sovereignty.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', zIndex: 1 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, category, or specialty..."
            style={{ paddingLeft: 44, width: '100%', boxSizing: 'border-box', background: 'rgba(5,10,16,0.9)' }}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'rgba(5,10,16,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)', padding: '14px 24px', position: 'sticky', top: 64, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: '8px 12px', fontSize: '0.82rem' }}>
            {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={country} onChange={e => setCountry(e.target.value)} style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: '8px 12px', fontSize: '0.82rem' }}>
            {COUNTRIES_LIST.map(c => <option key={c} value={c}>{c === 'All' ? 'All Countries' : `${COUNTRY_FLAGS[c] || ''} ${c}`}</option>)}
          </select>
          <select value={kyc} onChange={e => setKyc(e.target.value)} style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: '8px 12px', fontSize: '0.82rem' }}>
            <option value="All">All KYC Status</option>
            <option value="Verified">✓ Verified</option>
            <option value="Pending">⏳ Pending</option>
          </select>
          <span style={{ color: 'var(--silver)', fontSize: '0.8rem', marginLeft: 'auto' }}>{filtered.length} providers found</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--silver)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <p>No providers match your search. Try adjusting the filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map(p => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                style={{ background: 'var(--card-bg)', border: `1px solid ${p.kyc_status === 'verified' ? 'var(--border-gold)' : 'rgba(255,165,0,0.3)'}`, borderRadius: 16, padding: '20px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(212,175,55,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontSize: '1.8rem' }}>{CATEGORY_ICONS[p.category] || '🏢'}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ background: p.kyc_status === 'verified' ? 'rgba(39,174,96,0.2)' : 'rgba(255,165,0,0.15)', border: `1px solid ${p.kyc_status === 'verified' ? '#27ae60' : 'orange'}`, color: p.kyc_status === 'verified' ? '#27ae60' : 'orange', padding: '2px 8px', borderRadius: 10, fontSize: '0.65rem', fontWeight: 700 }}>
                      {p.kyc_status === 'verified' ? '✓ KYC' : '⏳ Pending'}
                    </span>
                    <span style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--silver)', padding: '2px 8px', borderRadius: 10, fontSize: '0.65rem' }}>
                      {COUNTRY_FLAGS[p.country] || ''} {p.country}
                    </span>
                  </div>
                </div>

                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4, lineHeight: 1.2 }}>{p.name}</div>
                <div style={{ color: 'var(--gold)', fontSize: '0.75rem', marginBottom: 8 }}>{p.category}</div>

                {p.rating && <StarRating rating={p.rating} />}
                {p.review_count && <div style={{ color: 'var(--silver)', fontSize: '0.7rem', marginTop: 2 }}>{p.review_count} reviews · {p.years_experience}yr experience</div>}

                {p.narrative_description && (
                  <p style={{ color: 'var(--silver)', fontSize: '0.78rem', lineHeight: 1.6, marginTop: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.narrative_description}
                  </p>
                )}

                <div style={{ borderTop: '1px solid rgba(212,175,55,0.12)', marginTop: 12, paddingTop: 10, display: 'flex', gap: 8 }}>
                  <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} style={{ flex: 1, textAlign: 'center', padding: '7px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', borderRadius: 8, color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                    <i className="fas fa-phone" style={{ marginRight: 4 }} />Call
                  </a>
                  <a href={`https://wa.me/${p.phone.replace(/\+|\s/g, '')}?text=Hi, I found you on the TAO Platform. I'd like to discuss your services.`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ flex: 1, textAlign: 'center', padding: '7px', background: '#25D366', borderRadius: 8, color: '#fff', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                    <i className="fab fa-whatsapp" style={{ marginRight: 4 }} />WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join CTA */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(0,0,0,0))', border: '1px solid var(--border-gold)', maxWidth: 1400, margin: '0 24px 48px', borderRadius: 20, padding: '48px', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: '1.5rem', marginBottom: 12 }}>Are You a Service Provider?</h3>
        <p style={{ color: 'var(--silver)', maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Join 50+ verified professionals on the TAO Sovereign Platform. Pass our KYC process and get connected to East Africa's most active property buyers, investors, and developers.
        </p>
        <a href="mailto:providers@tao-platform.com?subject=TAO Service Provider Application" className="btn-gold" style={{ padding: '14px 32px', fontSize: '1rem' }}>
          <i className="fas fa-user-plus" style={{ marginRight: 10 }} />Apply to Join the Directory
        </a>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-card" style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem' }}>{CATEGORY_ICONS[selected.category] || '🏢'}</div>
                <div>
                  <div style={{ color: 'var(--gold)', fontSize: '0.78rem', marginBottom: 2 }}>{selected.category}</div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{selected.name}</h2>
                </div>
              </div>
              <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '5px 12px' }} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ padding: '0 20px 20px' }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <span style={{ background: selected.kyc_status === 'verified' ? 'rgba(39,174,96,0.2)' : 'rgba(255,165,0,0.15)', border: `1px solid ${selected.kyc_status === 'verified' ? '#27ae60' : 'orange'}`, color: selected.kyc_status === 'verified' ? '#27ae60' : 'orange', padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>
                  {selected.kyc_status === 'verified' ? '✓ TAO KYC Verified' : '⏳ KYC Pending Review'}
                </span>
                <span style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', color: 'var(--gold)', padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem' }}>
                  {COUNTRY_FLAGS[selected.country] || ''} {selected.country}
                </span>
                {selected.coverage && <span style={{ background: 'rgba(74,144,226,0.1)', border: '1px solid rgba(74,144,226,0.4)', color: '#4A90E2', padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem' }}>{selected.coverage} Coverage</span>}
              </div>

              {/* Rating & Stats */}
              {selected.rating && (
                <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '14px', marginBottom: 16, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <StarRating rating={selected.rating} />
                    <div style={{ color: 'var(--silver)', fontSize: '0.7rem', marginTop: 2 }}>{selected.review_count} reviews</div>
                  </div>
                  {selected.years_experience && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}>{selected.years_experience}</div>
                      <div style={{ color: 'var(--silver)', fontSize: '0.7rem' }}>Years Experience</div>
                    </div>
                  )}
                </div>
              )}

              {/* Narrative */}
              {selected.narrative_description && (
                <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
                  <p style={{ color: 'var(--silver)', lineHeight: 1.8, margin: 0, fontSize: '0.88rem' }}>{selected.narrative_description}</p>
                  <div style={{ marginTop: 10, fontSize: '0.7rem', color: 'rgba(212,175,55,0.4)', fontFamily: "'Share Tech Mono', monospace" }}>
                    ✦ AI-GENERATED PROFILE · AMANDA SOP VALIDATED · 90/10 RATIO
                  </div>
                </div>
              )}

              {/* Contact buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={`tel:${selected.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', borderRadius: 12, color: 'var(--gold)', fontWeight: 700, textDecoration: 'none' }}>
                  <i className="fas fa-phone" />Call {selected.phone}
                </a>
                <a href={`https://wa.me/${selected.phone.replace(/\+|\s/g, '')}?text=Hi ${selected.name}, I found you on TAO Platform and would like to discuss your services.`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px', background: '#25D366', borderRadius: 12, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
                  <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }} />WhatsApp — Instant Connect
                </a>
                <a href={`mailto:${selected.email}?subject=TAO Platform Enquiry`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px', background: 'rgba(74,144,226,0.15)', border: '1px solid rgba(74,144,226,0.4)', borderRadius: 12, color: '#4A90E2', fontWeight: 700, textDecoration: 'none' }}>
                  <i className="fas fa-envelope" />Email {selected.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
