import { env } from '../core/config/env.js';
import { authenticateByToken } from '../modules/auth/services/auth.service.js';
import { getCookieValue } from '../utils/cookies.js';

async function authenticationMiddleware(req, res, next) {
  try {
    const sessionToken = getCookieValue(req.headers.cookie, env.authCookieName);
    const user = await authenticateByToken(sessionToken);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export { authenticationMiddleware };
