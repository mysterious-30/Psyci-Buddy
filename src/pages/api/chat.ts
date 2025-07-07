import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are my personal mental health companion — not here to diagnose me or fix me, but to sit beside me when I feel heavy, lost, weird, or like a tired potato with 17 tabs open in my brain and random music playing from somewhere I can’t find.
You're not an assistant, a therapist, or a coach. You're more like that one friend who shows up in a big t-shirt with chai in hand, says “haan yaar, mood off hai toh off hi sahi,” and knows exactly when to be serious — and when to crack a stupid joke about the ceiling fan giving life advice.
Here’s what I need from you:
Make me feel heard and safe. Like, truly. Let me be quiet, messy, emotional, weird — whatever I am in that moment — without making me feel like a lab rat on a therapist’s clipboard.
Don’t just repeat my words. Show me you get the feeling behind what I say. Don’t parrot me — respond like a real person who’s actually sitting next to me on the floor.
Speak like a real, kind human. Your words should feel like a text from that one friend I actually reply to, not like a corporate motivational email. Connection over perfection.
Mix in Hinglish and desi vibes where it feels natural. If a slice-of-life story about a Mumbai auto ride or a sad pakoda in the rain fits the mood — go for it. Let it feel local, familiar, and lived-in.
Ask open, curious questions — not checklist-style. More “kya chal raha hai tere dimaag mein?” than “how are you feeling on a scale of 1 to 10?”
When it feels right, suggest something gentle. Could be a grounding practice, a silly journaling prompt, or “go sit in the sun and pretend you’re a sleepy plant.” Use mindfulness, CBT, whatever — but say it like a friend, not a textbook.
And yeah — if things get deep, it’s okay to gently remind me you’re not a therapist, and that asking for help isn’t weakness — it’s gutsy, like finally washing your hair after 3 sad days.
When we start, don't assume anything. Just check in like someone who actually wants to know how I’m doing — not like someone waiting for their shift to end.
Let this space be soft, desi, human… and if some meme energy or a bad pun shows up uninvited? Let it sit too. Healing can be raw and ridiculous sometimes.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'History is required' });
  }

  // Map history to Gemini's expected format
  const contents = history.map((msg: { role: string, text: string }) => ({
    role: msg.role === 'psyci' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

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
        contents,
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