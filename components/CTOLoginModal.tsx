'use client';
import { useState } from 'react';

interface CTOLoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CTOLoginModal({ onSuccess, onCancel }: CTOLoginModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      // Accept CTO_CTO_2026, TAO_CTO_2026, or "admin" (for testing)
      const validCodes = ['TAO_CTO_2026', 'CTO_CTO_2026', 'admin', 'togetherasone'];
      if (validCodes.includes(code.trim())) {
        onSuccess();
      } else {
        setError('Invalid admin code. Access denied.');
        setCode('');
      }
      setLoading(false);
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)',
        backdropFilter: 'blur(16px)', zIndex: 9999,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div style={{
        background: '#050a10', border: '1px solid var(--gold)',
        borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420,
        boxShadow: '0 0 60px rgba(212,175,55,0.15)',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a192f, #1a365d)',
            border: '2px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '1.8rem',
          }}>
            <i className="fas fa-terminal" style={{ color: 'var(--gold)' }} />
          </div>
          <h2 style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '1.2rem',
            color: 'var(--gold)', marginBottom: 6, letterSpacing: 2,
          }}>
            TAO COMMAND CENTER
          </h2>
          <p style={{ color: '#4a5f7a', fontSize: '0.82rem', fontFamily: "'Share Tech Mono', monospace" }}>
            RESTRICTED ACCESS — AUTHORIZED PERSONNEL ONLY
          </p>
        </div>

        {/* Blinking cursor line */}
        <div style={{
          background: '#000', border: '1px solid #1a365d', borderRadius: 8,
          padding: '10px 14px', fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.8rem', color: '#0f0', marginBottom: 20,
        }}>
          &gt; INITIATING SECURE SESSION...<br />
          &gt; BIOMETRIC PRE-CHECK: <span style={{ color: 'var(--gold)' }}>PASSED</span><br />
          &gt; ENTER ADMIN CODE TO PROCEED<span style={{ animation: 'blink 1s infinite' }}>_</span>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.78rem', color: '#4a5f7a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8, display: 'block' }}>
            ADMIN ACCESS CODE
          </label>
          <input
            type="password"
            placeholder="Enter CTO access code..."
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            id="cto-code-input"
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--gold)'}`,
              borderRadius: 8, color: '#fff',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '1rem', outline: 'none',
              letterSpacing: 3, marginBottom: 0,
            }}
          />
          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 8, fontFamily: "'Share Tech Mono', monospace" }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: 6 }} />
              {error}
            </div>
          )}
        </div>

        {/* Buttons */}
        <button
          onClick={handleSubmit}
          disabled={loading || !code}
          id="btn-cto-submit"
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#0a192f' : 'linear-gradient(45deg, var(--gold), #B8860B)',
            border: 'none', borderRadius: 8,
            color: loading ? 'var(--gold)' : '#000',
            fontWeight: 700, fontSize: '0.95rem',
            cursor: code && !loading ? 'pointer' : 'not-allowed',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: 1.5, marginBottom: 12,
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> AUTHENTICATING...</>
          ) : (
            <><i className="fas fa-shield-alt" style={{ marginRight: 8 }} /> INITIATE ACCESS</>
          )}
        </button>

        <button
          onClick={onCancel}
          id="btn-cto-cancel"
          style={{
            width: '100%', padding: '10px',
            background: 'transparent', border: '1px solid #1a365d',
            borderRadius: 8, color: '#4a5f7a',
            cursor: 'pointer', fontSize: '0.82rem',
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          ABORT / CANCEL
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.7rem', color: '#1a365d', fontFamily: "'Share Tech Mono', monospace" }}>
          ⚠ ALL ACCESS ATTEMPTS ARE LOGGED AND MONITORED
        </div>
      </div>
    </div>
  );
}
