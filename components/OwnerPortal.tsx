'use client';
import { useState } from 'react';
import { SUBSCRIPTION_MODELS, SubscriptionTier } from '@/lib/monetization';

export default function OwnerPortal() {
  const [step, setStep] = useState<'auth' | 'tier' | 'upload'>('auth');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('FREE');

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-black italic tracking-tighter text-yellow-500">OWNER VERIFICATION</h2>
        <p className="text-[10px] text-gray-500 uppercase mt-2">Nairobi Beta • 26 Hubs Integrated</p>
      </div>

      {step === 'auth' && (
        <div className="space-y-4">
          <p className="text-xs text-center text-gray-400">Verify your email to access the Hexa-Core Pipeline.</p>
          <input className="w-full bg-black border border-white/10 rounded-full px-6 py-4 text-sm" placeholder="Broker Email" />
          <button onClick={() => setStep('tier')} className="w-full bg-yellow-500 text-black py-4 rounded-full font-black text-xs uppercase">Get 6-Digit Code</button>
        </div>
      )}

      {step === 'tier' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(SUBSCRIPTION_MODELS) as SubscriptionTier[]).map(tier => (
              <button 
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`p-4 rounded-2xl border ${selectedTier === tier ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/5 bg-black'} transition-all text-left`}
              >
                <div className="text-[10px] font-black text-yellow-500 uppercase">{tier}</div>
                <div className="text-lg font-black">${SUBSCRIPTION_MODELS[tier].price}<span className="text-[8px] text-gray-500">/mo</span></div>
                <div className="text-[8px] text-gray-400 mt-1">Boost: {SUBSCRIPTION_MODELS[tier].seo_weight}x</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('upload')} className="w-full bg-white text-black py-4 rounded-full font-black text-xs uppercase">Confirm & Pay</button>
        </div>
      )}

      {step === 'upload' && (
        <div className="text-center space-y-4">
          <div className="p-12 border-2 border-dashed border-white/10 rounded-[2rem]">
            <p className="text-xs text-gray-500">DRAG ASSET DOCUMENTATION <br/> (TITLE DEED / LOGBOOK)</p>
          </div>
          <button className="w-full bg-green-500 text-black py-4 rounded-full font-black text-xs uppercase">Deploy to Wonderland Hub</button>
        </div>
      )}
    </div>
  );
}