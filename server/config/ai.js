import OpenAI from 'openai';

// Gemini via its OpenAI-compatible endpoint, so the official openai SDK can be used unchanged.
// Constructed lazily: `new OpenAI({ apiKey: undefined })` throws, which at import time would take
// the whole server down over one unconfigured integration. Now only /api/ai/* fails.
let client;

const getAi = () => {
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error('AI provider is not configured (OPENAI_API_KEY missing).');
    err.status = 503;
    throw err;
  }
  client ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
  });
  return client;
};

export default getAi;
