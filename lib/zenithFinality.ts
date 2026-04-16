export const sadcFiscal = { ZM: 0.16, TZ: 0.18, KE: 0.16 };
export const certifyExpert = (name: string) => ({ name, title: 'Sovereign Expert', signedBy: 'Amanda Super Max' });
export const fleetRadar = (id: string) => ({ id, status: 'Active', signal: '99.9%', region: 'SADC' });
export const escrowTTL = (created: number) => Date.now() - created > 86400000;
export const applyPriceShield = (p: number, f: number) => p < f ? f : p;
export const etimsSignature = (txId: string) => 'KRA-TX-' + txId + '-' + Math.random().toString(36).substring(7);