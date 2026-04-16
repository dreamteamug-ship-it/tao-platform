'use client';
import { useState } from 'react';

export default function TitaniumMap() {
  const [activeAsset, setActiveAsset] = useState(null);
  return (
    <div className="h-screen w-full bg-titan-dark relative overflow-hidden">
      <div id="google-earth-overlay" className="absolute inset-0 opacity-40" />
      {/* 3D Asset Pins with Telemetry Overlays */}
      <div className="absolute top-10 left-10 glass-card p-6 z-50">
        <h3 className="text-gold font-bold uppercase tracking-tighter">IoT Radar: 27 Countries</h3>
        <input type="text" placeholder="Search GPS / Description..." className="input-titan mt-4" />
      </div>
    </div>
  );
}