import { NextRequest, NextResponse } from 'next/server';
import { geminiModel, AMANDA_SYSTEM_PROMPT } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) return NextResponse.json({ error: 'No message provided' }, { status: 400 });

    // Build conversation history for Gemini
    const chat = geminiModel.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: AMANDA_SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: "Understood. I am AI Amanda, ready to assist with Together As One platform." }],
        },
        ...(history || []).map((m: { role: string; content: string }) => ({
          role: m.role === 'amanda' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error('Amanda AI error:', error);
    return NextResponse.json(
      { reply: "I'm experiencing high demand right now. Please try again shortly, or type your question and I'll respond as soon as possible." },
      { status: 200 }
    );
  }
}
