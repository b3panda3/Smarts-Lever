// Shared Gemini helper used by chat, lesson generation, onboarding and
// profile-questions routes.
//
// Model note: Google deprecated `gemini-2.0-flash` (404 "no longer available").
// The current model is used by default and can be overridden with GEMINI_MODEL.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

export async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 404) {
      throw new Error(
        `Gemini model "${GEMINI_MODEL}" is not available for this API key. ` +
          `Set GEMINI_MODEL in your environment to an available model.`
      );
    }
    if (res.status === 400 && errText.includes('location is not supported')) {
      throw new Error(
        'Gemini API is geo-restricted for this server region. ' +
          'It typically works when deployed to Vercel (US region).'
      );
    }
    throw new Error(`Gemini API error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((p: { text?: string }) => p?.text ?? '').join('')
    : '';
  if (!text) {
    throw new Error('Gemini API returned an empty response');
  }
  return text;
}
