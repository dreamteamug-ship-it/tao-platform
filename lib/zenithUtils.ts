export const calculateSaaS = (total: number) => total * 0.005;
export const regionalPing = () => ['KE: 12ms', 'ZA: 42ms', 'UG: 18ms'];
export const eTIMSTemplate = (id: string) => 'KRA-TAX-INV-' + id;
export const fleetHealth = () => ({ status: 'Optimal', connectivity: '99.9%' });
export const mockVector = () => Array.from({length: 1536}, () => Math.random());