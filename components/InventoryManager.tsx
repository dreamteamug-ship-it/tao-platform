'use client';
export default function InventoryManager({ assets = [] }: { assets: any[] }) {
  return (
    <table className="w-full text-left">
      <thead><tr className="text-silver border-b border-gold/10"><th className="pb-4">Asset</th><th className="pb-4">Type</th><th className="pb-4">Status</th></tr></thead>
      <tbody>
        {assets.map((asset: any, i: number) => (
          <tr key={i} className="border-b border-gold/5">
            <td className="py-4 font-bold">{asset.name}</td><td className="py-4">{asset.type}</td>
            <td className="py-4 text-xs"><span className="px-2 py-1 rounded bg-gold/10 text-gold">{asset.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}