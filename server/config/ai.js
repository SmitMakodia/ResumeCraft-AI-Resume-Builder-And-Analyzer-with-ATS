import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

export default ai;
