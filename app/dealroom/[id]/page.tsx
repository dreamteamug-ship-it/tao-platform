'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import DealroomControls from '@/components/DealroomControls';
import { startAmandaListener, stopAmandaListener, generateMinutes, formatSOPReport, TranscriptSegment } from '@/lib/amandaListener';

// ─────────────────────────────────────────────────────────────
// TITANIUM B2 COCKPIT DEALROOM
// WebRTC / LiveKit-compatible split-screen architecture
// Left: 8K Visual Asset Sync | Right: Video Grid
// ─────────────────────────────────────────────────────────────

interface Participant {
  id: string;
  name: string;
  role: 'buyer' | 'seller' | 'agent' | 'legal' | 'cto';
  stream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isSpeaking: boolean;
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'P1', name: 'You', role: 'buyer', stream: null, audioEnabled: true, videoEnabled: true, isSpeaking: false },
  { id: 'P2', name: 'Agent James Kariuki', role: 'agent', stream: null, audioEnabled: true, videoEnabled: true, isSpeaking: false },
  { id: 'P3', name: 'Amanda AI', role: 'cto', stream: null, audioEnabled: true, videoEnabled: false, isSpeaking: false },
];

const ASSET_IMAGES = [
  'https://images.unsplash.com/photo-1637593757034-64cf9c98f6d6?w=1200&auto=format',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format',
];

export default function DealroomPage() {
  const { id: dealroomId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const titaniumQR = searchParams.get('qr') || 'TAO-TQ-DEMO';
  const assetId = searchParams.get('asset');

  const [phase, setPhase] = useState<'lobby' | 'active' | 'locked'>('lobby');
  const [participants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [sessionStart] = useState(new Date().toISOString());
  const [assetImgIdx, setAssetImgIdx] = useState(0);
  const [dealPrice, setDealPrice] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [escrowResult, setEscrowResult] = useState<any>(null);
  const [lockLoading, setLockLoading] = useState(false);
  const [sopReport, setSopReport] = useState('');

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Rotate asset preview image
  useEffect(() => {
    const t = setInterval(() => setAssetImgIdx(i => (i + 1) % ASSET_IMAGES.length), 8000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Try to get local camera
  useEffect(() => {
    if (phase !== 'active') return;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch(() => {});

    startAmandaListener(
      dealroomId,
      participants.map(p => p.name),
      seg => setTranscript(prev => [...prev, seg])
    );

    return () => { stopAmandaListener(); };
  }, [phase, dealroomId, participants]);

  const handleLockDeal = useCallback(async () => {
    const price = parseFloat(dealPrice.replace(/,/g, ''));
    if (!price || price <= 0) { alert('Please enter a valid deal price.'); return; }

    setLockLoading(true);
    const segments = stopAmandaListener();
    const minutes = generateMinutes(dealroomId, sessionStart, participants.map(p => p.name), price, currency);
    const report = formatSOPReport(minutes);
    setSopReport(report);

    try {
      const res = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealroomId,
          assetId,
          dealPrice: price,
          currency,
          minutesJson: minutes,
        }),
      });
      const data = await res.json();
      setEscrowResult(data);
      setPhase('locked');
    } catch (err) {
      alert('Escrow lock failed. Try again.');
    } finally {
      setLockLoading(false);
    }
  }, [dealPrice, currency, dealroomId, assetId, sessionStart, participants]);

  if (phase === 'lobby') return <LobbyScreen dealroomId={dealroomId} titaniumQR={titaniumQR} onJoin={() => setPhase('active')} />;

  return (
    <div style={{ minHeight: '100vh', background: '#020508', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,10,16,0.96)', borderBottom: '1px solid rgba(212,175,55,0.3)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: phase === 'locked' ? '#E74C3C' : '#27AE60', boxShadow: `0 0 8px ${phase === 'locked' ? '#E74C3C' : '#27AE60'}` }} />
          <div>
            <div style={{ color: 'var(--gold)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem' }}>TITANIUM DEALROOM</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{dealroomId}</div>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', borderRadius: 8, padding: '3px 10px', fontSize: '0.7rem', color: 'var(--gold)', fontFamily: "'Share Tech Mono', monospace" }}>
            QR: {titaniumQR}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'var(--silver)', fontSize: '0.75rem' }}>{participants.length} participants</span>
          {phase !== 'locked' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={dealPrice}
                onChange={e => setDealPrice(e.target.value.replace(/[^0-9.,]/g, ''))}
                placeholder="Deal price"
                style={{ width: 130, padding: '6px 10px', fontSize: '0.82rem', textAlign: 'right' }}
              />
              <select value={currency} onChange={e => setCurrency(e.target.value)}
                style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid var(--border-gold)', borderRadius: 8, padding: '6px 8px', fontSize: '0.78rem' }}>
                {['KES','TZS','UGX','RWF','ZAR','USD','EUR','ZMW','BWP','NAD','MUR'].map(c => <option key={c}>{c}</option>)}
              </select>
              <button
                onClick={handleLockDeal}
                disabled={lockLoading}
                style={{ padding: '6px 18px', background: 'linear-gradient(135deg, #C0392B, #8B0000)', border: '1px solid #E74C3C', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                {lockLoading ? '⏳' : '🔒'} {lockLoading ? 'Locking...' : 'Lock the Deal'}
              </button>
            </div>
          )}
          {phase === 'locked' && <div style={{ color: '#E74C3C', fontWeight: 700, fontSize: '0.85rem' }}>🔒 DEAL LOCKED</div>}
        </div>
      </div>

      {/* B2 Cockpit Split Screen */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0, overflow: 'hidden', minHeight: 'calc(100vh - 120px)' }}>

        {/* LEFT — 8K Visual Asset Sync */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(212,175,55,0.15)' }}>
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', background: '#000' }}>
            <img
              src={ASSET_IMAGES[assetImgIdx]}
              alt="Asset visual"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.8s', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 8, padding: '5px 12px', fontSize: '0.7rem', color: 'var(--gold)', fontFamily: "'Share Tech Mono', monospace" }}>
              ⚡ 8K VISUAL SYNC · ASSET: {assetId || 'LIVE PREVIEW'}
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
              {assetId && (
                <div style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '1.4rem', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                  Asset <span style={{ color: 'var(--gold)' }}>#{assetId}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {ASSET_IMAGES.map((_, i) => (
                  <button key={i} onClick={() => setAssetImgIdx(i)}
                    style={{ width: 28, height: 4, background: i === assetImgIdx ? 'var(--gold)' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 2, cursor: 'pointer', padding: 0, transition: 'background 0.3s' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Amanda Transcript */}
          <div style={{ height: 200, background: '#050a10', borderTop: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--gold)', fontSize: '0.72rem', fontFamily: "'Share Tech Mono', monospace" }}>
                🎙️ AMANDA AI — LIVE TRANSCRIPT ({transcript.length} segments)
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60', animation: 'pulse 1.5s infinite' }} />
                <span style={{ color: '#27AE60', fontSize: '0.65rem' }}>LISTENING</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px' }}>
              {transcript.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', textAlign: 'center', marginTop: 20 }}>
                  Waiting for conversation to begin…
                </div>
              ) : (
                transcript.map((seg, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <span style={{ color: 'var(--gold)', fontSize: '0.68rem', fontFamily: "'Share Tech Mono', monospace" }}>
                      [{new Date(seg.timestamp).toLocaleTimeString()}] {seg.speaker}:
                    </span>
                    <span style={{ color: 'var(--silver)', fontSize: '0.78rem', marginLeft: 6 }}>{seg.text}</span>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>

        {/* RIGHT — Video Grid + Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#030710' }}>
          {/* Video grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: 8, overflowY: 'auto' }}>
            {participants.map((p, idx) => (
              <div key={p.id} style={{ position: 'relative', background: '#0a0f1a', borderRadius: 10, overflow: 'hidden', border: p.isSpeaking ? '2px solid var(--gold)' : '2px solid rgba(212,175,55,0.1)', aspectRatio: '16/9', flexShrink: 0 }}>
                {idx === 0 && p.videoEnabled ? (
                  <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0f1a, #050a10)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '1.2rem', color: '#000', fontWeight: 700 }}>
                        {p.name[0]}
                      </div>
                      <div style={{ color: 'var(--silver)', fontSize: '0.72rem' }}>{p.name}</div>
                    </div>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4 }}>{p.name}</span>
                  <span style={{ background: p.role === 'cto' ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.6)', color: p.role === 'cto' ? 'var(--gold)' : 'var(--silver)', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4 }}>{p.role.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* DealroomControls */}
          <DealroomControls dealroomId={dealroomId} phase={phase} />
        </div>
      </div>

      {/* Escrow Result Modal */}
      {escrowResult?.success && (
        <div className="modal-overlay open">
          <div className="modal-card" style={{ maxWidth: 560, overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ textAlign: 'center', padding: '24px 20px 16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>🔒</div>
              <h2 style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", margin: '0 0 6px' }}>Deal Locked — Transaction Fortress Active</h2>
              <p style={{ color: 'var(--silver)', fontSize: '0.85rem' }}>Escrow reserved. SaaS fee routed. Amanda SOP scheduled.</p>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              {Object.entries(escrowResult.summary).map(([k, v]: any) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(212,175,55,0.1)', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--silver)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
              {sopReport && (
                <details style={{ marginTop: 16 }}>
                  <summary style={{ color: 'var(--gold)', cursor: 'pointer', fontSize: '0.8rem' }}>View Amanda SOP Report</summary>
                  <pre style={{ background: '#050a10', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, padding: 12, fontSize: '0.65rem', color: 'var(--silver)', overflowX: 'auto', marginTop: 8, whiteSpace: 'pre-wrap' }}>
                    {sopReport}
                  </pre>
                </details>
              )}
              <button onClick={() => { setEscrowResult(null); }} className="btn-gold" style={{ width: '100%', marginTop: 16, padding: '12px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lobby Screen ──────────────────────────────────────────────
function LobbyScreen({ dealroomId, titaniumQR, onJoin }: { dealroomId: string; titaniumQR: string; onJoin: () => void }) {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #0d1626 0%, #020508 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏛️</div>
        <div style={{ color: 'var(--gold)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', marginBottom: 8 }}>TITANIUM DEALROOM · LOBBY</div>
        <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '1.8rem', margin: '0 0 8px' }}>{dealroomId}</h1>
        <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', borderRadius: 10, padding: '10px 16px', marginBottom: 24, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: 'var(--gold)' }}>
          TITANIUM QR: {titaniumQR}
        </div>
        <p style={{ color: 'var(--silver)', lineHeight: 1.7, marginBottom: 28 }}>
          You are about to enter a secure, AI-monitored transaction room. Amanda will transcribe all proceedings. Ensure you are ready to proceed.
        </p>
        <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid #27ae60', borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: '0.8rem', color: '#27ae60', textAlign: 'left' }}>
          ✓ WebRTC encrypted tunnel ready<br />
          ✓ Amanda AI listener armed<br />
          ✓ Escrow engine on standby<br />
          ✓ 8K visual asset sync connected
        </div>
        <button onClick={onJoin} className="btn-gold" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', letterSpacing: 1 }}>
          <i className="fas fa-video" style={{ marginRight: 10 }} />Enter Dealroom
        </button>
      </div>
    </div>
  );
}
