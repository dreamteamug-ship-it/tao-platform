import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
// AMANDA SUPER MAX — MULTI-LLM SWARM ROUTER
// Routes tasks to: DeepSeek (Finance) | Gemini (Marketing) | Claude (Legal)
// 90/10 enforcement — RED tasks escalate to human
// ═══════════════════════════════════════════════════════════════

type LLMRoute = 'deepseek' | 'gemini' | 'claude' | 'human';
type TaskDomain = 'finance' | 'marketing' | 'legal' | 'operations' | 'compliance' | 'recovery';

const DOMAIN_ROUTER: Record<TaskDomain, LLMRoute> = {
  finance:    'deepseek',
  marketing:  'gemini',
  legal:      'claude',
  compliance: 'claude',
  operations: 'gemini',
  recovery:   'deepseek',
};

function classifyDomain(prompt: string): TaskDomain {
  const p = prompt.toLowerCase();
  if (p.match(/escrow|payment|invoice|saas|fee|tax|revenue|equity|mpesa|fx|currency/)) return 'finance';
  if (p.match(/contract|kyc|legal|deed|sig|authorize|notary/))                           return 'legal';
  if (p.match(/campaign|seo|aeo|marketing|airbnb|oyo|wonderland|listing/))               return 'marketing';
  if (p.match(/etims|kra|sadc|compliance|fiscal|vat/))                                   return 'compliance';
  if (p.match(/moratorium|trade.?in|buy.?off|recovery|patient|score/))                   return 'recovery';
  return 'operations';
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return '[Gemini] API key not configured';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: `You are Amanda, the Wonderland Hospitality sovereign AI. ${prompt}` }] }] }),
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '[Gemini] No response';
}

async function callOpenRouter(model: string, prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return `[${model}] OpenRouter key not configured`;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are Amanda, the Wonderland Hospitality sovereign AI operating at 90% autonomy.' },
        { role: 'user', content: prompt },
      ],
    }),
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || `[${model}] No response`;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, agentId, domain: forceDomain, sessionId } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 });

    const domain   = (forceDomain as TaskDomain) || classifyDomain(prompt);
    const route    = DOMAIN_ROUTER[domain];
    const start    = Date.now();

    let response: string;
    let model: string;

    switch (route) {
      case 'deepseek':
        model = 'deepseek/deepseek-r1';
        response = await callOpenRouter(model, prompt);
        break;
      case 'claude':
        model = 'anthropic/claude-3.5-sonnet';
        response = await callOpenRouter(model, prompt);
        break;
      case 'gemini':
      default:
        model = 'gemini-2.0-flash';
        response = await callGemini(prompt);
        break;
    }

    const latency = Date.now() - start;
    const status  = response.includes('[Amanda]') ? 'RED' : 'GREEN';

    return NextResponse.json({
      sessionId:  sessionId || crypto.randomUUID(),
      agentId:    agentId || 'AMANDA-CORE',
      domain,
      route,
      model,
      response,
      latency,
      status,
      sopSlot:    new Date().getHours() < 12 ? '08:00' : '20:00',
      timestamp:  new Date().toISOString(),
      humanRequired: status === 'RED',
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET: swarm health check
export async function GET() {
  return NextResponse.json({
    status: 'LEGION',
    agents: 100,
    aiRatio: 90,
    routes: DOMAIN_ROUTER,
    sopSlots: ['08:00', '20:00'],
    countries: 27,
    timestamp: new Date().toISOString(),
  });
}
