import rateLimit from 'express-rate-limit';

// /api/ai/* reaches a metered third-party model on every call. Before this, an authenticated
// account could issue unbounded paid requests, and a leaked 30-day token could run up the bill
// unchecked. This is the tightest budget that still allows normal interactive use.
// ponytail: in-memory store — per-instance counters. Swap for the Redis store only if this ever
// runs more than one instance, otherwise the limit silently multiplies by instance count.
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // Keyed by IP (the library default), not user id: this runs at the router level, ahead of the
  // `protect` middleware, so no user is resolved yet. Deliberate — an unauthenticated flood is
  // rejected before it can cost a token verification or a database lookup.
  message: { message: 'Too many AI requests. Please wait a few minutes and try again.' }
});

// Blunts credential stuffing against register/login.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' }
});
