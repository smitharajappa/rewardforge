// Groq API helper — shared across all AI features

export const GROQ_RATE_LIMIT = 30;

export async function callGroq(
  systemPrompt: string,
  userMessage: string,
  groqKey: string,
): Promise<string> {
  const today = new Date().toDateString();
  const rateKey = 'rf_groq_calls_' + today;
  const count = parseInt(localStorage.getItem(rateKey) || '0');
  if (count >= GROQ_RATE_LIMIT) {
    throw new Error('Daily AI limit reached. Resets tomorrow.');
  }
  localStorage.setItem(rateKey, String(count + 1));

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }
  const data = await response.json();
  return data.choices[0].message.content as string;
}

export function getGroqKey(): string {
  return localStorage.getItem('rf_groq_key')
    || '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';
}

export function saveGroqKey(key: string) {
  localStorage.setItem('rf_groq_key', key);
}
