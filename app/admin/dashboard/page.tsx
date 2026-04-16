'use client';
import { useState, useEffect } from 'react';
import EscrowLedger from '@/components/EscrowLedger';
import InventoryManager from '@/components/InventoryManager';

export default function TitaniumAdmin() {
  const [activeTab, setActiveTab] = useState('escrow');
  const [stats, setStats] = useState({ locked: 0, fees: 0, assets: 0 });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <header className="flex justify-between items-center mb-12 border-b border-yellow-600/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-yellow-500">TITANIUM ERP v1.0</h1>
          <p className="text-gray-400">Wonderland Hospitality | Sovereign Admin Panel</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">System Status</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-green-500">ZENITH_OPERATIONAL</span>
          </div>
        </div>
      </header>

      <nav className="flex gap-4 mb-8">
        {['escrow', 'inventory', 'amanda_sop', 'regional'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={px-6 py-2 rounded-full border \}
          >
            {tab.toUpperCase().replace('_', ' ')}
          </button>
        ))}
      </nav>

      <main className="grid grid-cols-1 gap-8">
        {activeTab === 'escrow' && <EscrowLedger />}
        {activeTab === 'inventory' && <InventoryManager />}
        {/* Additional modules will hydrate here */}
      </main>
    </div>
  );
}