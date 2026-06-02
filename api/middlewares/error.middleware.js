import { env } from '../core/config/env.js';

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const isServerError = statusCode >= 500;
  const message = isServerError && env.nodeEnv === 'production'
    ? 'Error interno del servidor'
    : error.message || 'Error interno del servidor';

  const payload = {
    status: 'error',
    message,
  };

  if (error.code) {
    payload.code = error.code;
  }

  if (error.details && env.nodeEnv !== 'production') {
    payload.details = error.details;
  }

  res.status(statusCode).json(payload);
}

export { errorMiddleware };