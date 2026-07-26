// Smoke tests for the ResumeCraft API.
//
// Deliberately dependency-free: node:test + node:assert, no jest/mocha/supertest. Runs with
// `npm test` and needs no database, no API keys, and no network — so it is reproducible by a
// reviewer on a fresh clone.
//
// MUST stay the first import: it sets NODE_ENV=test before server.js is evaluated, which is what
// stops the app binding a real port and dialing a real database. Import order is load order.
import './env-setup.js';

import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server.js';
import { isValidAnalysis } from '../controllers/aiController.js';

// Boot one ephemeral listener for the whole file and tear it down at the end.
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

test.after(() => server.close());

test('GET /health reports process liveness and database state separately', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200, 'health must be 200 even with no database');

  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.ok(
    ['connected', 'disconnected', 'connecting', 'disconnecting'].includes(body.db),
    `unexpected db state: ${body.db}`
  );
  assert.equal(typeof body.uptimeSeconds, 'number');
});

test('GET / stays up when the database is unreachable (no crash loop)', async () => {
  // The regression this guards: config/db.js used to call process.exit(1) on a failed connection,
  // so the host restart-looped and every request returned zero bytes.
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /API is running/);
});

test('protected routes reject a request with no token', async () => {
  for (const path of ['/api/resumes', '/api/ai/enhance-summary']) {
    const res = await fetch(`${base}${path}`, { method: path === '/api/resumes' ? 'GET' : 'POST' });
    // 401 when the database is up; 503 when it is not — the guard runs first. Either proves the
    // route is not reachable unauthenticated.
    assert.ok([401, 503].includes(res.status), `${path} returned ${res.status}, expected 401 or 503`);
  }
});

test('unknown routes return a JSON 404, not an HTML error page', async () => {
  const res = await fetch(`${base}/api/does-not-exist`);
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-type') ?? '', /application\/json/);
  assert.match((await res.json()).message, /Not found/);
});

test('rate limiter trips on repeated AI requests and advertises its headers', async () => {
  // Limit is 30 per 15 min. Fire 35 and require that the tail is throttled, which proves the
  // paid-model path cannot be called without bound.
  const statuses = [];
  for (let i = 0; i < 35; i++) {
    const res = await fetch(`${base}/api/ai/enhance-summary`, { method: 'POST' });
    statuses.push(res.status);
  }
  assert.ok(statuses.includes(429), `expected a 429 within 35 requests, saw: ${[...new Set(statuses)]}`);

  const limited = await fetch(`${base}/api/ai/enhance-summary`, { method: 'POST' });
  assert.equal(limited.status, 429);
  assert.ok(limited.headers.has('ratelimit'), 'draft-7 RateLimit header should be present');
});

test('isValidAnalysis accepts a score of 0', () => {
  // Regression: the previous check was `if (!analysis.score)`, so a genuine 0 — the most
  // important score to surface to a user — was rejected as a malformed model response.
  const analysis = {
    score: 0,
    categories: { tone_style: {}, content: {}, structure: {}, skills: {} },
    keywords: { missing: ['react'], present: [] }
  };
  assert.equal(isValidAnalysis(analysis), true);
});

test('isValidAnalysis rejects malformed model output', () => {
  const cases = {
    'null': null,
    'a bare string': 'not an object',
    'a stringified score': { score: '85', categories: {}, keywords: { missing: [], present: [] } },
    'a score above 100': { score: 150, categories: {}, keywords: { missing: [], present: [] } },
    'a negative score': { score: -1, categories: {}, keywords: { missing: [], present: [] } },
    'missing categories': { score: 70, keywords: { missing: [], present: [] } },
    'missing keywords': { score: 70, categories: {} },
    'keywords that are not arrays': { score: 70, categories: {}, keywords: { missing: 'react', present: [] } }
  };

  for (const [label, value] of Object.entries(cases)) {
    assert.equal(isValidAnalysis(value), false, `should reject ${label}`);
  }
});
