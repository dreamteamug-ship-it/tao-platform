'use client';

export default function ETIMSModule() {
  const taxLogs = [
    { id: 'INV-1002', type: 'Hospitality', vat: '16%', status: 'SIGNED', kra_ref: 'KRA-TX-8821' },
    { id: 'INV-1003', type: 'Vehicle', vat: '16%', status: 'PENDING', kra_ref: '---' }
  ];

  return (
    <div className="bg-[#111] border border-gray-900 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🇰🇪 Wonderland eTIMS Engine</h2>
      <div className="grid gap-3">
        {taxLogs.map(log => (
          <div key={log.id} className="flex justify-between items-center bg-[#050505] p-4 rounded-xl border border-gray-800">
            <div>
              <div className="text-xs text-gray-500">{log.id} | {log.type}</div>
              <div className="text-sm font-mono text-yellow-500">KRA REF: {log.kra_ref}</div>
            </div>
            <span className={	ext-[10px] px-2 py-1 rounded \}>
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}