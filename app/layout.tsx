import './globals.css';
import SovereignIntelligence from '@/components/SovereignIntelligence';
export const metadata = { title: 'Wonderland Hospitality - Sovereign Asset Nexus' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="bg-[#050505] text-white"><SovereignIntelligence />{children}</body></html>);
}