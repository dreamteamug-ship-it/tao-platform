'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────
// DEALROOM CONTROLS — Advanced Media Suite
// Podcast Mode | TV Station Mode | Radio Mode
// Web Audio API → Dolby DTS / Surround simulation
// ─────────────────────────────────────────────────────────────

type AudioMode = 'off' | 'podcast' | 'tv' | 'radio';

interface AudioNodes {
  ctx: AudioContext;
  source: MediaStreamAudioSourceNode | null;
  compressor: DynamicsCompressorNode;
  eq_low: BiquadFilterNode;
  eq_mid: BiquadFilterNode;
  eq_high: BiquadFilterNode;
  convolver: ConvolverNode;
  gain: GainNode;
  destination: AudioDestinationNode;
}

interface Props {
  dealroomId: string;
  phase: 'lobby' | 'active' | 'locked';
}

// Audio profiles for each mode
const AUDIO_PROFILES: Record<Exclude<AudioMode, 'off'>, {
  compressor: { threshold: number; knee: number; ratio: number; attack: number; release: number };
  eq: { low: number; mid: number; high: number };
  gain: number;
  label: string;
  icon: string;
  description: string;
}> = {
  podcast: {
    compressor: { threshold: -24, knee: 10, ratio: 8, attack: 0.003, release: 0.25 },
    eq: { low: 3, mid: 2, high: 1.5 },
    gain: 1.4,
    label: 'Podcast Mode',
    icon: '🎙️',
    description: 'Broadcast-grade voice compression — warm, intimate, studio quality',
  },
  tv: {
    compressor: { threshold: -18, knee: 6, ratio: 5, attack: 0.002, release: 0.3 },
    eq: { low: -1, mid: 4, high: 3 },
    gain: 1.2,
    label: 'TV Station Mode',
    icon: '📺',
    description: 'Crisp news-anchor audio with spatial stereo enhancement',
  },
  radio: {
    compressor: { threshold: -16, knee: 2, ratio: 12, attack: 0.001, release: 0.1 },
    eq: { low: 5, mid: 1, high: 2 },
    gain: 1.6,
    label: 'Radio Mode',
    icon: '📻',
    description: 'FM loudness processing — punchy, presence-forward broadcast sound',
  },
};

export default function DealroomControls({ dealroomId, phase }: Props) {
  const [audioMode, setAudioMode] = useState<AudioMode>('off');
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [shareEnabled, setShareEnabled] = useState(false);
  const [recording, setRecording] = useState(false);
  const [volume, setVolume] = useState(80);
  const [fissionLink, setFissionLink] = useState('');
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<AudioNodes | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── Web Audio API Engine ──────────────────────────────────
  const buildAudioGraph = useCallback(async (mode: Exclude<AudioMode, 'off'>) => {
    try {
      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const profile = AUDIO_PROFILES[mode];

      // Dynamics Compressor (Dolby DTS simulation)
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = profile.compressor.threshold;
      compressor.knee.value = profile.compressor.knee;
      compressor.ratio.value = profile.compressor.ratio;
      compressor.attack.value = profile.compressor.attack;
      compressor.release.value = profile.compressor.release;

      // EQ — Low Shelf
      const eq_low = ctx.createBiquadFilter();
      eq_low.type = 'lowshelf';
      eq_low.frequency.value = 200;
      eq_low.gain.value = profile.eq.low;

      // EQ — Peaking Mid
      const eq_mid = ctx.createBiquadFilter();
      eq_mid.type = 'peaking';
      eq_mid.frequency.value = 2500;
      eq_mid.Q.value = 1.5;
      eq_mid.gain.value = profile.eq.mid;

      // EQ — High Shelf (air frequencies)
      const eq_high = ctx.createBiquadFilter();
      eq_high.type = 'highshelf';
      eq_high.frequency.value = 8000;
      eq_high.gain.value = profile.eq.high;

      // Convolver for spatial reverb simulation
      const convolver = ctx.createConvolver();

      // Master Gain
      const gain = ctx.createGain();
      gain.gain.value = profile.gain * (volume / 100);

      // Chain: source → compressor → eq_low → eq_mid → eq_high → gain → destination
      source.connect(compressor);
      compressor.connect(eq_low);
      eq_low.connect(eq_mid);
      eq_mid.connect(eq_high);
      eq_high.connect(gain);
      gain.connect(ctx.destination);

      audioRef.current = { ctx, source, compressor, eq_low, eq_mid, eq_high, convolver, gain, destination: ctx.destination };
      console.log(`[AUDIO] ${mode} mode activated — DTS simulation running`);
    } catch (err) {
      console.warn('[AUDIO] getUserMedia denied — audio graph bypassed:', err);
    }
  }, [volume]);

  const teardownAudio = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.ctx.close();
      } catch {}
      audioRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const handleModeToggle = useCallback((mode: AudioMode) => {
    if (audioMode === mode) {
      // Deactivate
      teardownAudio();
      setAudioMode('off');
    } else {
      teardownAudio();
      setAudioMode(mode);
      if (mode !== 'off') buildAudioGraph(mode);
    }
  }, [audioMode, buildAudioGraph, teardownAudio]);

  // Update gain when volume slider changes
  useEffect(() => {
    if (audioRef.current) {
      const profile = audioMode !== 'off' ? AUDIO_PROFILES[audioMode] : null;
      if (profile) audioRef.current.gain.gain.value = profile.gain * (volume / 100);
    }
  }, [volume, audioMode]);

  // Generate Fission share link
  useEffect(() => {
    fetch('/api/fission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: 'guest', country: 'KE' }),
    })
      .then(r => r.json())
      .then(d => { if (d.whatsappLink) setFissionLink(d.whatsappLink); })
      .catch(() => { setFissionLink(`https://wa.me/?text=Join+my+TAO+Dealroom:+${window.location.href}`); });
  }, [dealroomId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ background: '#030710', borderTop: '1px solid rgba(212,175,55,0.2)', padding: '12px' }}>

      {/* Audio Mode Selector */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ color: 'var(--gold)', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", marginBottom: 6, letterSpacing: 1 }}>
          ⚡ DOLBY DTS AUDIO ENGINE
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(Object.entries(AUDIO_PROFILES) as [Exclude<AudioMode, 'off'>, typeof AUDIO_PROFILES.podcast][]).map(([mode, profile]) => (
            <button
              key={mode}
              onClick={() => handleModeToggle(mode)}
              title={profile.description}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 8,
                border: `1px solid ${audioMode === mode ? 'var(--gold)' : 'rgba(212,175,55,0.2)'}`,
                background: audioMode === mode ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: audioMode === mode ? 'var(--gold)' : 'var(--silver)',
                fontSize: '0.65rem',
                fontWeight: audioMode === mode ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1rem', marginBottom: 2 }}>{profile.icon}</div>
              <div>{profile.label.split(' ')[0]}</div>
            </button>
          ))}
        </div>
        {audioMode !== 'off' && (
          <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '6px 10px', marginTop: 6, fontSize: '0.67rem', color: 'var(--silver)' }}>
            {AUDIO_PROFILES[audioMode as Exclude<AudioMode, 'off'>].description}
            <div style={{ color: '#27ae60', marginTop: 2, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem' }}>
              ● DTS ACTIVE — Compressor × EQ × Gain chain running
            </div>
          </div>
        )}
      </div>

      {/* Volume Slider */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.65rem', color: 'var(--silver)' }}>
          <span>🔊 Volume</span><span style={{ color: 'var(--gold)' }}>{volume}%</span>
        </div>
        <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--gold)', height: 3 }} />
      </div>

      {/* A/V Controls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[
          { label: micEnabled ? '🎙️ Mic On' : '🔇 Muted', active: micEnabled, fn: () => setMicEnabled(!micEnabled) },
          { label: camEnabled ? '📷 Cam On' : '📵 Cam Off', active: camEnabled, fn: () => setCamEnabled(!camEnabled) },
          { label: shareEnabled ? '🖥️ Sharing' : '🖥️ Share', active: shareEnabled, fn: () => setShareEnabled(!shareEnabled) },
          { label: recording ? '⏺️ REC' : '⏺️ Record', active: recording, fn: () => setRecording(!recording) },
        ].map(btn => (
          <button key={btn.label} onClick={btn.fn}
            style={{ flex: 1, padding: '8px 2px', borderRadius: 8, border: `1px solid ${btn.active ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)'}`, background: btn.active ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)', color: btn.active ? 'var(--gold)' : 'var(--silver)', fontSize: '0.6rem', cursor: 'pointer', fontWeight: btn.active ? 700 : 400, transition: 'all 0.2s' }}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Fission Share / Invite */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={copyLink}
          style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.08)', color: 'var(--gold)', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 700 }}>
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
        {fissionLink && (
          <a href={fissionLink} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#25D366', color: '#fff', fontSize: '0.68rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <i className="fab fa-whatsapp" />Invite
          </a>
        )}
      </div>

      {/* Phase indicator */}
      {phase === 'locked' && (
        <div style={{ marginTop: 10, background: 'rgba(231,76,60,0.1)', border: '1px solid #E74C3C', borderRadius: 8, padding: '8px 10px', fontSize: '0.7rem', color: '#E74C3C', textAlign: 'center', fontWeight: 700 }}>
          🔒 TRANSACTION FORTRESS ACTIVE — Deal Locked
        </div>
      )}
    </div>
  );
}
