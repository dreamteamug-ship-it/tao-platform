export const priceShield = (price: number, floor: number) => price < floor ? floor : price;
export const auditLog = (action: string) => console.log('📁 [AUDIT] ' + new Date().toISOString() + ': ' + action);
export const escrowTTL = (created: Date) => (new Date().getTime() - created.getTime()) > 86400000;