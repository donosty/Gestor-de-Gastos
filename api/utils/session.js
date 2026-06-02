import crypto from 'node:crypto';
import { env } from '../core/config/env.js';

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getSessionExpiresAt() {
  const ttlMs = env.sessionTtlDays * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ttlMs);
}

function getSessionMaxAgeSeconds() {
  return env.sessionTtlDays * 24 * 60 * 60;
}

export {
  generateSessionToken,
  getSessionExpiresAt,
  getSessionMaxAgeSeconds,
  hashSessionToken,
};
