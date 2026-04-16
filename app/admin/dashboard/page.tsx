'use client';
import { useState, useEffect } from 'react';
import EscrowLedger from '@/components/EscrowLedger';
import InventoryManager from '@/components/InventoryManager';
import ETIMSModule from '@/components/ETIMSModule';
import SwarmCommand from '@/components/SwarmCommand';
import SwarmStatus from '@/components/SwarmStatus'; from '@/components/SwarmCommand';

export default function TitaniumNexus() {
  const [activeTab, setActiveTab] = useState('swarm');
  const [systemLoad, setSystemLoad] = useState(92); // AI Validation Ratio

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-yellow-500/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-white">
            TITANIUM ERP NEXUS
          </h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Amanda Super Max Agent | Status: Monitoring Swarm_01
          </p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-right">
            <div className="text-[10px] text-gray-500">AI/HUMAN RATIO</div>
            <div className="text-xl font-mono text-yellow-500">{systemLoad}/8</div>
          </div>
          <div className="h-10 w-10 rounded-full border border-yellow-500/50 flex items-center justify-center animate-pulse">
            🤖
          </div>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 mb-8 bg-[#111] p-2 rounded-xl border border-gray-900">
        {['swarm', 'escrow', 'inventory', 'etims', 'market_intel'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={px-4 py-2 rounded-lg text-xs font-bold transition-all \}
          >
            {tab.toUpperCase().replace('_', ' ')}
          </button>
        ))}
      </nav>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'swarm' && <SwarmCommand />}
          {activeTab === 'escrow' && <EscrowLedger />}
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'etims' && <ETIMSModule />}
        </div>
        
        <aside className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-yellow-500 mb-4">AMANDA LOGS</h3>
          <div className="space-y-4 font-mono text-[10px]">
            <div className="text-green-400">[09:25] OpenCrawl: 26 SADC hubs indexed.</div>
            <div className="text-blue-400">[09:26] eTIMS: Daily KRA sync pending.</div>
            <div className="text-yellow-400">[09:27] Swarm: Detecting arbitrage in ZAR cars.</div>
          </div>
        </aside>
      </main>
    </div>
  );
}