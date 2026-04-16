'use client';

export default function EscrowLedger() {
  const transactions = [
    { id: 'TX-9921', buyer: 'Alice (KE)', amount: 'KES 1,200,000', fee: 'KES 6,000', state: 'LOCKED' },
    { id: 'TX-9922', buyer: 'Bob (ZA)', amount: 'ZAR 50,000', fee: 'ZAR 250', state: 'VERIFIED_AI' }
  ];

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">🏦 Equity-Alibaba Escrow Ledger</h2>
        <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded text-sm font-mono">
          Operational Treasury: KES 187,500 (Total SaaS Fees)
        </div>
      </div>
      <div className="space-y-4">
        {transactions.map(tx => (
          <div key={tx.id} className="flex justify-between items-center p-4 bg-[#0a0a0a] border border-gray-800 rounded-lg">
            <div>
              <div className="text-sm text-gray-500">ID: {tx.id} | {tx.buyer}</div>
              <div className="text-lg font-bold">{tx.amount}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-yellow-500">SaaS Fee (0.5%): {tx.fee}</div>
              <div className={	ext-sm font-mono \}>
                Status: {tx.state}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}