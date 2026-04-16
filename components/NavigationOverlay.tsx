'use client';
import { useRouter } from 'next/navigation';

export default function NavigationOverlay() {
  const router = useRouter();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex gap-2">
      <button 
        onClick={() => router.back()}
        className="px-6 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black tracking-widest hover:bg-white/10 transition-colors"
      >
        ← BACK
      </button>
      <button 
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-yellow-500 text-black rounded-full text-[10px] font-black tracking-widest hover:bg-yellow-400 transition-colors shadow-lg"
      >
        ⌂ HOME
      </button>
    </div>
  );
}