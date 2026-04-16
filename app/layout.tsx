import './globals.css';
import NavigationOverlay from '@/components/NavigationOverlay';
import AmandaSuperMax from '@/components/AmandaSuperMax';

export const metadata = {
  title: 'Wonderland Hospitality - Sovereign Asset Nexus',
  description: 'The 26-country SADC/EA Transaction Fortress',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white">
        {/* Universal Home/Back Buttons */}
        <NavigationOverlay />
        
        {children}

        {/* Multi-LLM Infused Amanda Agent */}
        <AmandaSuperMax />
      </body>
    </html>
  );
}