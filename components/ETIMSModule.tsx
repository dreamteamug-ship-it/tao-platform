'use client';
export default function ETIMSModule({ logs = [] }: { logs: any[] }) {
  return (
    <div className="space-y-4">
      {logs.length === 0 ? <p className="text-silver italic">Waiting for fiscal signature...</p> : 
        logs.map((log: any, i: number) => (
          <div key={i} className="flex justify-between items-center p-4 bg-zinc-900 rounded-xl border border-gold/10">
            <div><div className="text-sm font-mono text-gold">KRA REF: {log.kra_ref}</div></div>
            <span className="text-[10px] px-2 py-1 rounded bg-gold/10 text-gold">{log.status}</span>
          </div>
        ))
      }
    </div>
  );
}