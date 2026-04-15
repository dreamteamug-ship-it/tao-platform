'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import PropertyGrid from '@/components/PropertyGrid';
import ProviderDash from '@/components/ProviderDash';
import CommandCenter from '@/components/CommandCenter';
import ProductDashboard from '@/components/ProductDashboard';
import FinanceModal from '@/components/FinanceModal';
import CTOLoginModal from '@/components/CTOLoginModal';
import { Property, Language } from '@/types';

type View = 'shop' | 'subscribe' | 'cc';

// Generate local seed properties (fallback when Supabase not populated)
function generateProperties(): Property[] {
  const cats: Property['category'][] = ['Residential', 'Commercial', 'Land', 'Airbnb'];
  const imgs = {
    Residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=75',
    Commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=75',
    Land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=75',
    Airbnb: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=75',
  };
  return Array.from({ length: 100 }, (_, i) => {
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const price = cat === 'Land' ? Math.floor(Math.random() * 50000000) + 1000000 : Math.floor(Math.random() * 90000000) + 10000000;
    const txPool = ['buy', 'rent', 'lease', 'tradein'];
    const txCount = Math.floor(Math.random() * 2) + 1;
    const transactions = txPool.slice(0, txCount);
    return {
      id: `TAO-${1000 + i + 1}`,
      category: cat,
      title: `${cat} Property ${i + 1}`,
      price,
      image_url: imgs[cat],
      gps_active: Math.random() > 0.2,
      lat: -1.2864 + (Math.random() - 0.5) * 0.2,
      lng: 36.8172 + (Math.random() - 0.5) * 0.2,
      agent: `Agent ${Math.floor(Math.random() * 9) + 1}`,
      verified: Math.random() > 0.25,
      share_unlock: false,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      land_size: Math.floor(Math.random() * 200) + 50,
      year_built: 2000 + Math.floor(Math.random() * 24),
      transactions,
    };
  });
}

export default function HomePage() {
  const [view, setView] = useState<View>('shop');
  const [lang, setLang] = useState<Language>('en');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [financeType, setFinanceType] = useState('');
  const [financePropertyId, setFinancePropertyId] = useState('');
  const [showCTOLogin, setShowCTOLogin] = useState(false);
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [transFilter, setTransFilter] = useState('all');

  // Load properties from Supabase, fallback to local seed
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties?category=${category}&sort=${sortOrder}&transaction=${transFilter}`);
        const data = await res.json();
        if (data.properties && data.properties.length > 0) {
          setProperties(data.properties);
        } else {
          // Use local seed with localStorage persistence for share unlock
          const saved = localStorage.getItem('tao_properties');
          if (saved) {
            setProperties(JSON.parse(saved));
          } else {
            const generated = generateProperties();
            localStorage.setItem('tao_properties', JSON.stringify(generated));
            setProperties(generated);
          }
        }
      } catch {
        const saved = localStorage.getItem('tao_properties');
        if (saved) setProperties(JSON.parse(saved));
        else {
          const generated = generateProperties();
          localStorage.setItem('tao_properties', JSON.stringify(generated));
          setProperties(generated);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, sortOrder, transFilter]);

  const handleShareUnlock = useCallback((id: string) => {
    setProperties(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, share_unlock: true } : p);
      localStorage.setItem('tao_properties', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleOpenFinance = (type: string, propertyId: string) => {
    setFinanceType(type);
    setFinancePropertyId(propertyId);
    setSelectedProperty(null);
  };

  const handleCCLogin = () => {
    setShowCTOLogin(true);
  };

  const handleCTOSuccess = () => {
    setShowCTOLogin(false);
    setView('cc');
  };

  const handleCTOCancel = () => {
    setShowCTOLogin(false);
    setView('shop');
  };

  return (
    <>
      <Header
        lang={lang}
        setLang={setLang}
        currentView={view}
        onNavShop={() => setView('shop')}
        onNavSubscribe={() => setView('subscribe')}
        onNavCC={handleCCLogin}
      />

      {view === 'shop' && (
        <PropertyGrid
          lang={lang}
          properties={properties}
          loading={loading}
          category={category}
          setCategory={setCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          transFilter={transFilter}
          setTransFilter={setTransFilter}
          onOpenDashboard={setSelectedProperty}
          onShareUnlock={handleShareUnlock}
        />
      )}

      {view === 'subscribe' && (
        <ProviderDash lang={lang} />
      )}

      {view === 'cc' && (
        <CommandCenter properties={properties} />
      )}

      {selectedProperty && (
        <ProductDashboard
          property={selectedProperty}
          lang={lang}
          onClose={() => setSelectedProperty(null)}
          onOpenFinance={handleOpenFinance}
        />
      )}

      {financeType && (
        <FinanceModal
          financeType={financeType}
          propertyId={financePropertyId}
          onClose={() => setFinanceType('')}
        />
      )}

      {showCTOLogin && (
        <CTOLoginModal
          onSuccess={handleCTOSuccess}
          onCancel={handleCTOCancel}
        />
      )}
    </>
  );
}
