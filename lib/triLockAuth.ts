export class TriLockAuth {
  private approvals: Record<'admin' | 'cto' | 'content', boolean> = { admin: false, cto: false, content: false };
  async authorize(agent: 'admin' | 'cto' | 'content') {
    this.approvals[agent] = true;
    if (this.approvals.admin && this.approvals.cto && this.approvals.content) return 'SOVEREIGN_MINTED';
    return 'PENDING_SIGNATURES';
  }
}