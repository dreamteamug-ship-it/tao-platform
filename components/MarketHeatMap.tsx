'use client';
import { useState } from 'react';

const REGIONS = [
  { code: 'KE', name: 'Kenya', arbitrage: 0.92, status: 'HIGH' },
  { code: 'ZA', name: 'South Africa', arbitrage: 0.45, status: 'LOW' },
  { code: 'RW', name: 'Rwanda', arbitrage: 0.88, status: 'HIGH' },
  { code: 'UG', name: 'Uganda', arbitrage: 0.72, status: 'MED' },
  { code: 'ZM', name: 'Zambia', arbitrage: 0.65, status: 'MED' }
];

export default function MarketHeatMap() {
  return (
    <div className="bg-[#050505] border border-yellow-500/10 p-6 rounded-3xl">
      <h3 className="text-xs font-black tracking-widest text-yellow-500 mb-6 uppercase">Regional Arbitrage Heat Map</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {REGIONS.map(r => (
          <div key={r.code} className="p-4 rounded-2xl bg-[#0a0a0a] border border-gray-900 relative overflow-hidden">
            <div className="text-lg font-bold mb-1">{r.code}</div>
            <div className="text-[10px] text-gray-500">{r.name}</div>
            <div className={`mt-2 h-1 w-full rounded-full ${r.status === 'HIGH' ? 'bg-green-500' : 'bg-yellow-500'}`} 
                 style={{ width: `${r.arbitrage * 100}%` }} />
            {r.status === 'HIGH' && <div className="absolute top-2 right-2 text-[8px] bg-green-500/10 text-green-500 px-1 rounded animate-pulse">ALPHA</div>}
          </div>
        ))}
      </div>
    </div>
  );
}