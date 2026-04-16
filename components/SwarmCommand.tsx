'use client';

export default function SwarmCommand() {
  return (
    <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-2xl p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black italic">SWARM INTELLIGENCE</h2>
          <p className="text-gray-500 text-xs">OpenCrawl AI Assistant: Max Intelligence Level</p>
        </div>
        <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-bold">ACTIVE SCAN</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-500 mb-2 uppercase">OpenCrawl Multi-LLM Intel</div>
          <div className="text-sm italic">"Scanning competitor rates in Rwanda... OYO price drop detected."</div>
        </div>
        <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-500 mb-2 uppercase">Amanda Super Max Override</div>
          <div className="text-sm font-bold text-green-500">92% Validation Success. Proceeding with auto-escrow.</div>
        </div>
      </div>
    </div>
  );
}