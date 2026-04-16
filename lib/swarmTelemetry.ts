export const getSwarmTelemetry = async () => {
  return {
    nodes: 26,
    active_swarm: 'SWARM_01_NAIROBI',
    integrity_score: 0.98,
    last_amanda_ping: new Date().toISOString()
  };
};
