'use client';
import { useState, useEffect } from 'react';

export default function SwarmStatus() {
  const [agents, setAgents] = useState([
    { name: 'Crawl-Alpha', task: 'Airbnb Pricing Scraper', status: 'Active', load: '14%' },
    { name: 'Crawl-Beta', task: 'OYO Regional Benchmarking', status: 'Active', load: '22%' },
    { name: 'Fiscal-Prime', task: 'eTIMS Signature Relay', status: 'Standby', load: '2%' }
  ]);

  return (
    <div className="bg-[#0a0a0a] border border-yellow-500/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black tracking-widest text-yellow-500 uppercase">Swarm Thought-Stream</h3>
        <span className="text-[10px] text-gray-500 font-mono">26 SADC/EA Hubs Online</span>
      </div>
      
      <div className="space-y-3">
        {agents.map(agent => (
          <div key={agent.name} className="p-3 bg-black/50 border border-gray-900 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs font-bold">{agent.name}</div>
              <div className="text-[10px] text-gray-400">{agent.task}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-green-500 font-mono">{agent.status}</div>
              <div className="text-[10px] text-gray-600">CPU: {agent.load}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-900 text-[10px] text-gray-500 italic">
        "Amanda: Swarm integrity holding at 98.4%. No leakage detected."
      </div>
    </div>
  );
}