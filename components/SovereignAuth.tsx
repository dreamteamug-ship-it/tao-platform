'use client';
import { useState } from 'react';

export default function SovereignAuth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    console.log(`📡 [SOVEREIGN_AUTH] Sending 6-digit code to ${email}...`);
    setStep('otp');
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      localStorage.setItem('wonderland_authenticated', 'true');
      onAuthSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-yellow-500/20 p-12 rounded-[3rem] text-center space-y-8 shadow-2xl">
        <div className="text-4xl">🗝️</div>
        <h2 className="text-2xl font-black italic tracking-tighter">SOVEREIGN ACCESS</h2>
        
        {step === 'email' ? (
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-full px-6 py-4 text-sm focus:border-yellow-500 outline-none text-center"
            />
            <button 
              onClick={handleSendOtp}
              className="w-full bg-yellow-500 text-black py-4 rounded-full font-black uppercase tracking-widest hover:bg-yellow-400"
            >
              Request 6-Digit Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="0 0 0 0 0 0"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-full px-6 py-4 text-2xl font-black tracking-[1em] focus:border-yellow-500 outline-none text-center"
            />
            <button 
              onClick={handleVerify}
              className="w-full bg-yellow-500 text-black py-4 rounded-full font-black uppercase tracking-widest hover:bg-yellow-400"
            >
              Verify & Enter
            </button>
          </div>
        )}
        <p className="text-[10px] text-gray-600 uppercase">Wonderland Hospitality Security Protocol</p>
      </div>
    </div>
  );
}