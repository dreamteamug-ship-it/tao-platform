'use client';
import { useState } from 'react';
import { SUBSCRIPTION_MODELS, SubscriptionTier } from '@/lib/monetization';

export default function ServicePortal() {
  const [step, setStep] = useState<'auth' | 'tier' | 'onboard'>('auth');
  const [specialty, setSpecialty] = useState('');

  return (
    <div className="bg-[#050505] border border-blue-500/20 rounded-[3rem] p-12 space-y-8 shadow-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-black italic tracking-tighter text-blue-500 uppercase">Expert Onboarding</h2>
        <p className="text-[10px] text-gray-500 uppercase mt-2">Verified SADC Service Network</p>
      </div>

      {step === 'auth' && (
        <div className="space-y-4">
          <input className="w-full bg-black border border-white/10 rounded-full px-6 py-4 text-sm" placeholder="Professional Email" />
          <button onClick={() => setStep('tier')} className="w-full bg-blue-600 text-white py-4 rounded-full font-black text-xs uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)]">Get Verification Code</button>
        </div>
      )}

      {step === 'tier' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(SUBSCRIPTION_MODELS) as SubscriptionTier[]).map(tier => (
              <button key={tier} className="p-4 rounded-2xl border border-white/5 bg-black hover:border-blue-500 transition-all text-left">
                <div className="text-[10px] font-black text-blue-500 uppercase">{tier}</div>
                <div className="text-lg font-black">${SUBSCRIPTION_MODELS[tier].price}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('onboard')} className="w-full bg-white text-black py-4 rounded-full font-black text-xs uppercase">Choose Tier & Proceed</button>
        </div>
      )}

      {step === 'onboard' && (
        <div className="space-y-6">
          <select className="w-full bg-black border border-white/10 rounded-full px-6 py-4 text-sm outline-none focus:border-blue-500">
            <option>Legal & Compliance</option>
            <option>Asset Inspection</option>
            <option>Hospitality Management</option>
            <option>System Architecture</option>
          </select>
          <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl text-center text-[10px] text-gray-500">UPLOAD CERTIFICATION / LICENSE</div>
          <button onClick={() => window.location.href = '/'} className="w-full bg-blue-600 text-white py-4 rounded-full font-black text-xs uppercase">Initialize Sovereign Expert Profile</button>
        </div>
      )}
    </div>
  );
}