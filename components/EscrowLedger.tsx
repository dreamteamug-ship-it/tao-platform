'use client';
export default function EscrowLedger({ transactions = [] }: { transactions?: any[] }) {
  return (
    <div className="space-y-4">
      {transactions.length === 0 ? <p className="text-silver italic">No pending settlements...</p> :
        transactions.map((tx: any, i: number) => (
          <div key={i} className="flex justify-between items-center p-4 bg-zinc-900 rounded-xl border border-gold/10">
            <div><div className="font-bold text-white">{tx.id}</div><div className="text-xs text-silver">{tx.date}</div></div>
            <div className="text-right"><div className="text-xs text-gold">SaaS Fee (0.5%): {tx.fee}</div><div className="text-sm font-mono text-gold">Status: {tx.state}</div></div>
          </div>
        ))
      }
    </div>
  );
}