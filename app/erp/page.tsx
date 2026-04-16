'use client';
import { useState } from 'react';
export default function ERPPortal() {
  const tabs = ['POS Hub', 'Fleet Lori', 'HR Appraisal', 'Asset Repair', 'Settlement', 'eTIMS'];
  return (
    <div className='min-h-screen bg-black text-white p-10'>
      <h2 className='text-gold font-black italic'>TITANIUM HYBRID ERP (V8.5)</h2>
      <div className='flex gap-4 mt-6 overflow-x-auto'>
        {tabs.map(t => <button key={t} className='px-6 py-2 border border-gold/40 rounded-full text-xs uppercase'>{t}</button>)}
      </div>
      <div className='mt-12 bg-zinc-900/50 rounded-3xl p-20 text-center border border-white/5'>
        90% AI Processing... 10% Human Gate Active.
      </div>
    </div>
  );
}