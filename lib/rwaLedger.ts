export const rwaLedger = {
  linkAsset: (vin: string, escrowId: string) => ({ status: 'LINKED', asset: vin, contract: escrowId })
};
