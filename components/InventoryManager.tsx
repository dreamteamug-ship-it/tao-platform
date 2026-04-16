'use client';
import { useState } from 'react';

export default function InventoryManager() {
  const [assets, setAssets] = useState([
    { id: 'AST-KE-777', name: 'Nairobi Luxury Villa', type: 'Hospitality', status: 'Available', value: 'KES 45,000,000' },
    { id: 'AST-ZA-101', name: 'Cape Town Fleet - 10x SUV', type: 'Vehicle', status: 'Locked (Escrow)', value: 'ZAR 8,200,000' }
  ]);

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        📦 Asset Inventory Forge
      </h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 border-b border-gray-800">
            <th className="pb-4">Asset ID</th>
            <th className="pb-4">Name</th>
            <th className="pb-4">Category</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Sovereign Value</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b border-gray-800/50 hover:bg-yellow-500/5 transition-colors">
              <td className="py-4 font-mono text-yellow-500">{asset.id}</td>
              <td className="py-4 font-medium">{asset.name}</td>
              <td className="py-4">{asset.type}</td>
              <td className="py-4 text-xs">
                <span className={px-2 py-1 rounded \}>
                  {asset.status}
                </span>
              </td>
              <td className="py-4 font-mono">{asset.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}