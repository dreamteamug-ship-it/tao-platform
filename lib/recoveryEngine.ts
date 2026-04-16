export const calculatePatientScore = (history: number, telemetry: number, value: number) => {
  const score = (history * 0.4) + (telemetry * 0.3) + (value * 0.3);
  return { score, status: score < 50 ? 'RED' : score < 75 ? 'BLUE' : 'GREEN' };
};
export const recoverySOP = ['Moratorium', 'Trade-In', 'Buy-Off', 'Rescheduling'];