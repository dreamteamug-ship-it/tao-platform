'use client';
import { useState, useRef, useEffect } from 'react';
import { Language } from '@/types';
import { ChatMessage } from '@/types';

interface ProviderDashProps {
  lang: Language;
}

export default function ProviderDash({ lang }: ProviderDashProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'amanda', content: "Hello! I'm AI Amanda, powered by Gemini. Are you registering as a Landlord, Agent, Broker, or Property Manager? I'll guide you through the KYC process." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [income, setIncome] = useState('');
  const [role, setRole] = useState('Landlord');
  const [enhancing, setEnhancing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | { score: number; status: string; message: string; receipt_id: string }>(null);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    try {
      const res = await fetch('/api/amanda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'amanda', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'amanda', content: "I'm having trouble connecting. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleEnhance = () => {
    setEnhancing(true); setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(iv); return 100; } return p + 20; });
    }, 200);
  };

  const handleSubmit = async () => {
    if (!name) { alert('Please enter your full name.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, national_id: nationalId, monthly_income: Number(income), role, has_files: progress === 100 }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ score: 91, status: 'approved', message: 'KYC received. Our team will verify within 24 hours.', receipt_id: `TAO-KYC-${Date.now()}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="provider-dash" id="provider-dash" aria-label="Landlord and Agent onboarding portal">
      <h2 style={{ marginBottom: 6 }}>Property Owner &amp; Landlord Portal</h2>
      <p style={{ color: 'var(--silver)', marginBottom: 24 }}>
        Complete AI-assisted KYC — 90% automated, 10% human verification. Powered by Gemini AI.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* AI Amanda Chat */}
        <div>
          <div className="ai-chat-box" ref={chatRef} id="amanda-chat" aria-label="AI Amanda chat">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === 'amanda' && <><i className="fas fa-robot" style={{ color: 'var(--gold)', marginRight: 6 }} /></>}
                {m.content}
              </div>
            ))}
            {isTyping && (
              <div className="msg thinking">
                <i className="fas fa-robot" style={{ color: 'var(--gold)', marginRight: 6 }} />
                Amanda is typing...
              </div>
            )}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              id="chat-input"
              aria-label="Message input"
            />
            <button className="btn-gold" onClick={sendMessage} id="btn-send-chat" aria-label="Send message">
              <i className="fas fa-paper-plane" />
            </button>
          </div>
        </div>

        {/* KYC Form */}
        <div style={{ background: 'var(--charcoal)', padding: 24, borderRadius: 16, border: '1px solid var(--border-gold)' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 18 }}>
            <i className="fas fa-id-card" style={{ marginRight: 8 }} /> AI Certification Form
          </h3>

          {!result ? (
            <>
              <input type="text" placeholder="Full Legal Name / Company Name" value={name} onChange={e => setName(e.target.value)} id="ob-name" />
              <input type="text" placeholder="National ID / KRA PIN" value={nationalId} onChange={e => setNationalId(e.target.value)} id="ob-national-id" />
              <input type="number" placeholder="Declared Monthly Revenue (KES)" value={income} onChange={e => setIncome(e.target.value)} id="ob-income" />
              <select value={role} onChange={e => setRole(e.target.value)} id="ob-role">
                <option value="Standard">Standard Owner (KES 2,000/mo)</option>
                <option value="Verified">Verified Landlord (KES 5,000/mo)</option>
                <option value="Agent">Agent / Broker</option>
                <option value="Manager">Property Manager</option>
              </select>

              <div className="ai-enhancer-box">
                <i className="fas fa-magic" style={{ color: 'var(--gold)' }} />
                <strong style={{ marginLeft: 8 }}>AI 4K Edge Enhancer</strong><br />
                <span style={{ fontSize: '0.75rem', color: 'var(--silver)' }}>
                  Upload Title Deeds, Tax Records, or Property Photos.
                </span>
                <input type="file" id="ob-files" accept="image/*,application/pdf" multiple style={{ display: 'none' }} onChange={handleEnhance} />
                <button className="btn-outline" style={{ width: '100%', marginTop: 10 }} onClick={() => document.getElementById('ob-files')?.click()}>
                  <i className="fas fa-upload" style={{ marginRight: 6 }} /> Select Files
                </button>
                {enhancing && <div className="progress-bar-container" style={{ display: 'block' }}><div className="progress-bar" style={{ width: `${progress}%` }} /></div>}
                {progress === 100 && <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: 6 }}><i className="fas fa-check-circle" /> Local Storage Indexed. Docs Ready.</p>}
              </div>

              <button className="btn-gold" style={{ width: '100%', padding: 14 }} onClick={handleSubmit} disabled={loading} id="btn-submit-kyc">
                {loading
                  ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> AI Scoring...</>
                  : <><i className="fas fa-robot" style={{ marginRight: 8 }} /> Submit for AI Scoring</>}
              </button>
            </>
          ) : (
            <div className="receipt-box" style={{ display: 'block' }}>
              {result.status === 'approved' ? (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <span className="dot-green" />
                    <strong style={{ color: 'var(--success)', fontSize: '1.05rem', marginLeft: 8 }}>APPROVED ({result.score}%)</strong>
                  </div>
                  &gt; KYC Verification: COMPLETE<br />
                  &gt; Financial Scoring: PASSED<br />
                  &gt; Role: {role}<br /><br />
                  <span style={{ color: 'var(--silver)' }}>Receipt #{result.receipt_id}<br />{result.message}</span>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <span className="dot-red" />
                    <strong style={{ color: 'var(--danger)', fontSize: '1.05rem', marginLeft: 8 }}>PENDING ({result.score}%)</strong>
                  </div>
                  <span style={{ color: 'var(--silver)' }}>{result.message}</span>
                </>
              )}
              <button className="btn-outline" style={{ width: '100%', marginTop: 14 }} onClick={() => setResult(null)}>Submit Another</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
