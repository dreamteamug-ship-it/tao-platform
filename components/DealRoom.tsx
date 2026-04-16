'use client';
import { useState } from 'react';

export default function DealRoom({ onClose }: { onClose: () => void }) {
  const [parties, setParties] = useState(['You (Architect)']);
  const [inviteEmail, setInviteEmail] = useState('');

  const agents = [
    { name: 'Amanda (Chief)', status: 'Monitoring Escrow', focus: 'Finance' },
    { name: 'Legal-Swarm', status: 'Scanning Title Deed', focus: 'Compliance' },
    { name: 'IoT-Sentry', status: 'Connected to Asset-777', focus: 'Telemetry' }
  ];

  const handleInvite = () => {
    setParties([...parties, inviteEmail]);
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black p-8 flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-black italic tracking-tighter text-yellow-500">TITANIUM DEAL ROOM</h2>
        <button onClick={onClose} className="bg-white/10 p-4 rounded-full">✕</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Swarm Assistants */}
        <div className="space-y-6 overflow-y-auto pr-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Virtual Assistant Swarm</h3>
          {agents.map(a => (
            <div key={a.name} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{a.name}</span>
                <span className="text-[8px] bg-yellow-500/10 text-yellow-500 px-2 rounded-full py-1">ACTIVE</span>
              </div>
              <p className="text-xs text-gray-400">{a.status}</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Live Asset Telemetry (IoT) */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-8">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live IoT Telemetry</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black rounded-2xl text-center">
              <div className="text-2xl mb-2">🔋</div>
              <div className="text-xl font-black">98%</div>
              <div className="text-[8px] text-gray-500">Asset Battery</div>
            </div>
            <div className="p-4 bg-black rounded-2xl text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-xl font-black">LOCKED</div>
              <div className="text-[8px] text-gray-500">Smart Lock</div>
            </div>
          </div>
          <div className="h-48 bg-black/50 border border-white/5 rounded-2xl flex items-center justify-center italic text-xs text-gray-600">
            [Live Satellite Feed Encrypted]
          </div>
        </div>

        {/* Parties & Collaboration */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 flex flex-col">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Parties in Room</h3>
          <div className="flex-1 space-y-4">
            {parties.map(p => (
              <div key={p} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">P</div>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <input 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Invite Party Email"
              className="w-full bg-black border border-white/10 rounded-full px-4 py-3 text-xs outline-none focus:border-yellow-500"
            />
            <button 
              onClick={handleInvite}
              className="w-full bg-white text-black py-4 rounded-full font-black text-xs uppercase"
            >
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}