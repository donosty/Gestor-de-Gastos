import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

dotenv.config({ path: path.resolve(currentDirectory, '../../.env') });

function readRequiredEnv(name) {
  const value = process.env[name];

  if (value == null || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function readPort(name) {
  const rawValue = readRequiredEnv(name);
  const port = Number(rawValue);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port value for environment variable: ${name}`);
  }

  return port;
}

function readApiPrefix(name) {
  const value = readRequiredEnv(name);
  const normalizedValue = value.startsWith('/') ? value : `/${value}`;

  return normalizedValue.length > 1 ? normalizedValue.replace(/\/+$/, '') : normalizedValue;
}

function readDatabaseUrl(name) {
  const value = readRequiredEnv(name);
  new URL(value);

  return value;
}

function readPositiveInt(name) {
  const rawValue = readRequiredEnv(name);
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Invalid numeric value for environment variable: ${name}`);
  }

  return parsedValue;
}

function readCookieName(name) {
  const value = readRequiredEnv(name);

  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error(`Invalid cookie name for environment variable: ${name}`);
  }

  return value;
}

const env = Object.freeze({
  appName: readRequiredEnv('APP_NAME'),
  nodeEnv: readRequiredEnv('NODE_ENV'),
  port: readPort('PORT'),
  apiPrefix: readApiPrefix('API_PREFIX'),
  databaseUrl: readDatabaseUrl('DATABASE_URL'),
  authCookieName: readCookieName('AUTH_COOKIE_NAME'),
  sessionTtlDays: readPositiveInt('SESSION_TTL_DAYS'),
});

export { env };