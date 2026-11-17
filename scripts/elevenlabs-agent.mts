/**
 * Create or update the "Moon" voice agent on ElevenLabs (GPT brain + Bangla voice).
 *
 *   npm run voice:agent
 *
 * Reads ELEVENLABS_API_KEY (and ELEVENLABS_AGENT_ID if it already exists) from .env.
 * First run creates the agent and prints the id to add as ELEVENLABS_AGENT_ID.
 * Re-run after editing src/lib/voiceAgent.ts to push the new instructions.
 */
import { VOICE_INSTRUCTIONS, VOICE_MAX_SECONDS } from '../src/lib/voiceAgent.ts';
import { VOICE_GREETING } from '../src/lib/voiceGreeting.ts';

try { process.loadEnvFile('.env'); } catch { /* env may come from the shell */ }

const KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
if (!KEY) {
  console.error('ELEVENLABS_API_KEY is missing in .env');
  process.exit(1);
}

const config = {
  name: 'Moon — Qualixe website voice assistant',
  conversation_config: {
    agent: {
      language: 'bn',
      first_message: VOICE_GREETING,
      prompt: {
        prompt: VOICE_INSTRUCTIONS,
        llm: process.env.ELEVENLABS_LLM || 'gpt-4.1', // fast, good Bangla
        temperature: 0.7,
        max_tokens: 300,
      },
    },
    tts: {
      voice_id: process.env.ELEVENLABS_VOICE_ID || '8e81Dm4CldjBZSlArGoT', // "Rimjhim" — natural conversational Bengali female
      model_id: 'eleven_v4_turbo', // supports Bangla, low latency, expressive
      stability: 0.45,
      similarity_boost: 0.8,
      speed: 1,
    },
    conversation: { max_duration_seconds: VOICE_MAX_SECONDS },
  },
  // Only our server (with the API key) can start a conversation
  platform_settings: { auth: { enable_auth: true } },
};

const url = AGENT_ID
  ? `https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`
  : 'https://api.elevenlabs.io/v1/convai/agents/create';

const res = await fetch(url, {
  method: AGENT_ID ? 'PATCH' : 'POST',
  headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify(config),
});
const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}:`, JSON.stringify(body, null, 2));
  process.exit(1);
}
const id = body.agent_id ?? AGENT_ID;
console.log(AGENT_ID ? `Updated agent ${id}` : `Created agent ${id}\nAdd this to .env (and Vercel):\nELEVENLABS_AGENT_ID=${id}`);
