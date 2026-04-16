'use client';
import { useState } from 'react';

export default function ServiceOnboarding() {
  const [tier, setTier] = useState('FREE');
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#0a0a0a] border border-yellow-500/20 p-12 rounded-[3rem] text-center space-y-8">
        <h1 className="text-3xl font-black italic text-yellow-500">EXPERT ONBOARDING</h1>
        <p className="text-xs text-gray-500 uppercase">Subscribe to boost your visibility in 26 SADC/EA hubs</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[0, 5, 10, 20, 50, 100].map(price => (
            <button 
              key={price} 
              onClick={() => setTier(price.toString())}
              className={`p-6 rounded-2xl border ${tier === price.toString() ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/5 bg-black'} transition-all`}
            >
              <div className="text-xl font-black">${price}</div>
              <div className="text-[8px] text-gray-500 uppercase mt-1">per month</div>
            </button>
          ))}
        </div>

        <button className="w-full bg-yellow-500 text-black py-4 rounded-full font-black uppercase">Verify & Boost Market Preference</button>
      </div>
    </div>
  );
}