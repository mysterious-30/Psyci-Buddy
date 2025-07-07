// Converted to plain JavaScript for easier execution
require('dotenv').config({ path: '../../.env.local' });

const A4F_API_KEY = process.env.A4F_API_KEY;
const A4F_CHAT_COMPLETIONS_URL = 'https://api.a4f.co/v1/chat/completions';

async function getFetch() {
  if (typeof fetch === 'function') return fetch;
  return (await import('node-fetch')).default;
}

async function testA4F() {
  const fetch = await getFetch();
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Say hello in a friendly way.' }
  ];

  try {
    const response = await fetch(A4F_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${A4F_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'provider-5/gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 100
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error JSON' }));
      console.error('A4F API error:', response.status, errorData);
      return;
    }
    const data = await response.json();
    console.log('A4F API Success:', data.choices?.[0]?.message?.content || data);
  } catch (error) {
    console.error('Failed to connect to A4F API:', error);
  }
}

testA4F(); 