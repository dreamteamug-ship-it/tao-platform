'use client';
import { useEffect } from 'react';
import AmandaSuperMax from './AmandaSuperMax';
import NavigationOverlay from './NavigationOverlay';

export default function SovereignIntelligence() {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'A') window.location.href = '/admin/dashboard';
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  return (
    <>
      <NavigationOverlay />
      <AmandaSuperMax />
    </>
  );
}