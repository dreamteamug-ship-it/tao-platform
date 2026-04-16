'use client';
import { useState } from 'react';
import AmandaSuperMax from './AmandaSuperMax';
import DealRoom from './DealRoom';
import SovereignAuth from './SovereignAuth';

export default function SovereignOverlay() {
  const [isDRAccessible, setIsDRAccessible] = useState(false);
  const [showDR, setShowDR] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {!isAuthenticated && (
        <SovereignAuth onAuthSuccess={() => setIsAuthenticated(true)} />
      )}

      <div className="fixed bottom-6 left-6 z-[200] flex items-center gap-4">
        {/* Amanda Agent */}
        <AmandaSuperMax />

        {/* Deal Room Toggle */}
        <button 
          onClick={() => setShowDR(true)}
          className="h-16 px-8 bg-black border border-yellow-500/30 rounded-full flex items-center gap-3 shadow-2xl hover:bg-yellow-500 hover:text-black transition-all group"
        >
          <span className="text-xl group-hover:animate-bounce">🏢</span>
          <span className="text-[10px] font-black tracking-widest uppercase italic">Enter Deal Room</span>
        </button>
      </div>

      {showDR && <DealRoom onClose={() => setShowDR(false)} />}
    </>
  );
}