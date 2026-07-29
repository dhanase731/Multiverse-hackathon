import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LIVE_PROMPT = (transcript) => `You are an expert meeting assistant.
Analyze the meeting transcript and return ONLY valid JSON. No markdown, no explanations, no extra text.

Transcript:
${transcript}

Rules:
- Maximum 5 bullet points
- Maximum 3 action items
- Summary under 60 words

Output format:
{
  "summary": "",
  "bulletPoints": [],
  "actionItems": [
    { "person": "", "task": "" }
  ]
}`;

const FINAL_PROMPT = (transcript) => `You are an expert meeting assistant.
Analyze the complete meeting transcript and return ONLY valid JSON. No markdown, no explanations, no extra text.

Transcript:
${transcript}

Rules:
- Maximum 8 bullet points
- Maximum 5 action items
- Summary under 100 words
- Extract key decisions made

Output format:
{
  "summary": "",
  "bulletPoints": [],
  "actionItems": [
    { "person": "", "task": "" }
  ],
  "decisions": [],
  "keyPoints": []
}`;

async function callGroq(prompt) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });
  return completion.choices[0]?.message?.content ?? null;
}

function parseJSON(raw) {
  if (!raw) throw new Error('Empty response from Groq');
  return JSON.parse(raw);
}

async function callWithRetry(prompt) {
  try {
    const raw = await callGroq(prompt);
    return parseJSON(raw);
  } catch {
    // Retry once
    const raw = await callGroq(prompt);
    return parseJSON(raw);
  }
}

/**
 * Called on every N-th transcript chunk during a live meeting.
 * Returns { summary, bulletPoints, actionItems } or null on failure.
 */
export async function generateLiveNotes(transcript, previousNotes = null) {
  try {
    const result = await callWithRetry(LIVE_PROMPT(transcript));
    return {
      summary:     result.summary     ?? previousNotes?.summary     ?? '',
      bulletPoints: result.bulletPoints ?? previousNotes?.bulletPoints ?? [],
      actionItems:  result.actionItems  ?? previousNotes?.actionItems  ?? [],
    };
  } catch (err) {
    console.error('[Groq] generateLiveNotes failed after retry:', err.message);
    return previousNotes; // Return last known good state instead of crashing
  }
}

/**
 * Called once when the meeting ends with the full transcript.
 * Returns { summary, bulletPoints, actionItems, decisions, keyPoints } or null.
 */
export async function generateFinalSummary(transcript) {
  try {
    const result = await callWithRetry(FINAL_PROMPT(transcript));
    return {
      summary:      result.summary      ?? '',
      bulletPoints: result.bulletPoints ?? [],
      actionItems:  result.actionItems  ?? [],
      decisions:    result.decisions    ?? [],
      keyPoints:    result.keyPoints    ?? [],
    };
  } catch (err) {
    console.error('[Groq] generateFinalSummary failed after retry:', err.message);
    return null;
  }
}
