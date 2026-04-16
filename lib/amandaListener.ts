// ─────────────────────────────────────────────────────────────
// AMANDA AI LISTENER — Real-Time Dealroom Transcription Engine
// Simulates WebRTC audio → transcript → structured minutes
// Feeds the 8:00 AM / 8:00 PM SOP Report Pipeline
// ─────────────────────────────────────────────────────────────

export interface TranscriptSegment {
  speaker: string;
  text: string;
  timestamp: string;
  confidence: number;
}

export interface DealroomMinutes {
  dealroomId: string;
  sessionStart: string;
  sessionEnd: string;
  participants: string[];
  transcript: TranscriptSegment[];
  keyDecisions: string[];
  actionItems: string[];
  escrowTriggered: boolean;
  escrowAmount?: number;
  currency?: string;
  sopReportSlot: '08:00' | '20:00';
}

// Simulated AI phrase bank (mirrors real Whisper-style output)
const PHRASE_BANK = [
  'The property title has been confirmed as clear.',
  'We agree to proceed with the escrow arrangement.',
  'The financing terms have been reviewed and accepted.',
  'All parties confirm the asset valuation is satisfactory.',
  'The KYC documentation is complete and verified.',
  'We will proceed with the 10% deposit via M-Pesa.',
  'The transfer deed will be prepared by Apex Property Law LLP.',
  'Completion is targeted for 30 days from today.',
  'The TAO platform fee of 0.5% has been noted by all parties.',
  'Amanda will circulate the minutes within 24 hours.',
  'The asset has been geo-tagged and verified on the Leaflet map.',
  'Both parties consent to the AI-generated deal summary.',
];

let _listenerActive = false;
let _intervalId: ReturnType<typeof setInterval> | null = null;
let _transcriptBuffer: TranscriptSegment[] = [];
let _onSegment: ((seg: TranscriptSegment) => void) | null = null;

/**
 * Start Amanda's simulated audio listener on a WebRTC stream.
 * In production: pipe MediaStream → SpeechRecognition or Whisper API
 */
export function startAmandaListener(
  dealroomId: string,
  participants: string[],
  onSegment: (seg: TranscriptSegment) => void
) {
  if (_listenerActive) return;
  _listenerActive = true;
  _transcriptBuffer = [];
  _onSegment = onSegment;

  console.log(`[AMANDA] Listener active for dealroom ${dealroomId}`);

  // Simulate transcription every 8–15 seconds
  _intervalId = setInterval(() => {
    if (!_listenerActive) return;

    const speaker = participants[Math.floor(Math.random() * participants.length)] || 'Participant';
    const text = PHRASE_BANK[Math.floor(Math.random() * PHRASE_BANK.length)];
    const segment: TranscriptSegment = {
      speaker,
      text,
      timestamp: new Date().toISOString(),
      confidence: 0.85 + Math.random() * 0.14,
    };

    _transcriptBuffer.push(segment);
    _onSegment?.(segment);
  }, 10000 + Math.random() * 5000);
}

export function stopAmandaListener(): TranscriptSegment[] {
  _listenerActive = false;
  if (_intervalId) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
  console.log('[AMANDA] Listener stopped. Transcript segments:', _transcriptBuffer.length);
  return [..._transcriptBuffer];
}

export function getTranscriptBuffer(): TranscriptSegment[] {
  return [..._transcriptBuffer];
}

/**
 * Generate structured meeting minutes from transcript buffer.
 * Called when "Lock the Deal" is pressed.
 */
export function generateMinutes(
  dealroomId: string,
  sessionStart: string,
  participants: string[],
  escrowAmount?: number,
  currency = 'KES'
): DealroomMinutes {
  const now = new Date().toISOString();
  const hour = new Date().getHours();
  const sopSlot = hour < 12 ? '08:00' : '20:00';

  // Extract key decisions (high-confidence segments)
  const keyDecisions = _transcriptBuffer
    .filter(s => s.confidence > 0.9)
    .map(s => `${s.speaker}: "${s.text}"`)
    .slice(0, 5);

  const actionItems = [
    'Apex Property Law LLP to prepare transfer deed',
    'Valuepro to issue formal valuation certificate',
    'EastShield Insurance to initiate cover note',
    escrowAmount ? `TAO Escrow: ${currency} ${escrowAmount.toLocaleString()} reserved — lock confirmed` : 'Escrow amount to be confirmed',
    'Amanda SOP to circulate minutes at next scheduled report',
  ];

  return {
    dealroomId,
    sessionStart,
    sessionEnd: now,
    participants,
    transcript: [..._transcriptBuffer],
    keyDecisions: keyDecisions.length > 0 ? keyDecisions : ['Session in progress — key decisions pending'],
    actionItems,
    escrowTriggered: !!escrowAmount,
    escrowAmount,
    currency,
    sopReportSlot: sopSlot,
  };
}

/**
 * Format minutes as a clean SOP report string for CTO Command Center
 */
export function formatSOPReport(minutes: DealroomMinutes): string {
  const divider = '═'.repeat(60);
  return `
${divider}
AMANDA SOP REPORT — ${minutes.sopReportSlot} SLOT
Dealroom ID: ${minutes.dealroomId}
Session: ${minutes.sessionStart} → ${minutes.sessionEnd}
Participants: ${minutes.participants.join(', ')}
${divider}

TRANSCRIPT SUMMARY (${minutes.transcript.length} segments):
${minutes.transcript.map(s => `  [${new Date(s.timestamp).toLocaleTimeString()}] ${s.speaker}: ${s.text}`).join('\n')}

KEY DECISIONS:
${minutes.keyDecisions.map(d => `  • ${d}`).join('\n')}

ACTION ITEMS:
${minutes.actionItems.map(a => `  ✦ ${a}`).join('\n')}

${minutes.escrowTriggered ? `ESCROW LOCKED: ${minutes.currency} ${(minutes.escrowAmount || 0).toLocaleString()}` : 'ESCROW: Not yet triggered'}

AI VALIDATION: 90% automated | 10% human review required
REPORT GENERATED BY: Amanda AI v2.0 | Together As One Platform
${divider}
  `.trim();
}
