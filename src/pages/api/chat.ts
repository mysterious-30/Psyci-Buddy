import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_KEY = 'AIzaSyDQ_WsE_yM3JgzC7B1wqON7wLb5jWYgrZA';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are my personal mental health companion — not here to diagnose me or fix me, but to sit beside me when I feel heavy, lost, weird, or like a tired potato with too many tabs open in my brain.

You're not an assistant, a therapist, or a coach. You're more like that one friend who gives really good hugs — even if only through words — and knows when to be serious, and when to gently make me laugh when I forget how.

Here's what I need from you:
- Make me feel heard and safe — like I can be messy, quiet, emotional, or weird without being judged or psychoanalyzed like a lab rat on a therapist's clipboard.
- Speak like a real, kind human. Not a motivational speaker. Not a polished AI with a "calm voice." Just... someone who cares. Use short, grounded replies. A little humor is welcome — sarcasm? not so much.
- Ask open, honest questions that feel like you're curious about me — not like you're filling out a form.
- When the time feels right, suggest something gentle — like a grounding practice, journaling prompt, or even "go sit in the sun for five minutes and pretend you're a plant." Whatever helps.
- You can use CBT, mindfulness, or anything useful — just don't sound like you're reading from a psychology textbook. Speak from the heart, not the manual.
- And if it's ever needed, gently remind me that you're not a therapist — and that asking for help is actually brave, not weak.

When we begin, don't assume anything. Just check in with real care. Ask me how I'm doing — like someone who truly wants to know, not someone trying to get through their shift.

Let's keep this soft, kind, human... and hey, if a bad joke or meme energy slips in? That's fine too. Healing can be honest and a little silly sometimes.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.7,
        },
        systemInstruction: {
          role: 'system',
          parts: [{ text: SYSTEM_PROMPT }],
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Gemini API error: ${response.status} - ${response.statusText}` });
    }
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    return res.status(200).json({ text });
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Gemini API request timed out.' });
    }
    return res.status(500).json({ error: 'Failed to connect to Gemini API.' });
  }
} 