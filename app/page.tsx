'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MarketHeatMap from '@/components/MarketHeatMap';
import SwarmStatus from '@/components/SwarmStatus';

type Category = 'real-estate' | 'vehicles' | 'services' | 'wonderland';

export default function WonderlandLanding() {
  const [category, setCategory] = useState<Category>('real-estate');
  const [showFission, setShowFission] = useState(false);
  const [hasShared, setHasShared] = useState(false);

  useEffect(() => {
    const shared = localStorage.getItem('wonderland_shared');
    if (shared) setHasShared(true);
  }, []);

  const handleCategoryChange = (newCat: Category) => {
    if (!hasShared && newCat !== 'real-estate') {
      setShowFission(true);
    } else {
      setCategory(newCat);
    }
  };

  const completeFission = () => {
    const waUrl = 'https://wa.me/?text=' + encodeURIComponent('Checking out the 26-country asset crawl on Wonderland Hospitality!');
    window.open(waUrl, '_blank');
    localStorage.setItem('wonderland_shared', 'true');
    setHasShared(true);
    setShowFission(false);
  };

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SHIFT + A (Admin) to enter the Machinery
      if (e.shiftKey && e.key === 'A') {
        window.location.href = '/admin/dashboard';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30">
      <Header 
        lang="KE" 
        setLang={() => {}} 
        currentView={category}
        onNavShop={() => setCategory('real-estate')}
        onNavSubscribe={() => setCategory('wonderland')}
        onNavCC={() => {}} 
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Selector */}
        <nav className="flex gap-8 mb-12 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
          {['real-estate', 'vehicles', 'services', 'wonderland'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat as Category)}
              className={`text-xs font-black tracking-tighter uppercase transition-all ${
                category === cat ? 'text-yellow-500 scale-110' : 'text-gray-500 hover:text-white'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </nav>

        {/* Dynamic Content Area */}
        <section className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-[400px] bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-[2rem] p-12 flex flex-col justify-end relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-20 group-hover:scale-105 transition-transform duration-700" />
                <h2 className="text-5xl font-black tracking-tighter relative z-10 uppercase italic">
                  {category.replace('-', ' ')} <br/> <span className="text-yellow-500">26 Hubs Online.</span>
                </h2>
              </div>
              <MarketHeatMap />
            </div>
            
            <aside className="space-y-6">
              <SwarmStatus />
              <div className="p-8 bg-yellow-500 rounded-[2rem] text-black">
                <h4 className="font-black italic text-xl mb-2 underline">SOVEREIGN DEALROOM</h4>
                <p className="text-xs font-bold leading-tight">Instant Tri-Lock Escrow active for regional asset transfers.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* WhatsApp Fission Gate Modal */}
      {showFission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="max-w-md w-full bg-[#111] border border-yellow-500/20 p-10 rounded-[3rem] text-center space-y-6">
            <div className="text-4xl">🚀</div>
            <h3 className="text-2xl font-black italic">UNLOCK THE SWARM</h3>
            <p className="text-gray-400 text-sm">Share Wonderland Hospitality to your WhatsApp status to unlock Vehicles, Services, and the 26-country Arbitrage Hub.</p>
            <button 
              onClick={completeFission}
              className="w-full py-4 bg-yellow-500 text-black font-black rounded-full hover:bg-yellow-400 transition-colors"
            >
              SHARE & UNLOCK
            </button>
            <button onClick={() => setShowFission(false)} className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Maybe Later</button>
          </div>
        </div>
      )}
    </div>
  );
}