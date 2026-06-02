import { env } from '../../../core/config/env.js';
import { buildCookie, buildExpiredCookie, getCookieValue } from '../../../utils/cookies.js';
import { getSessionMaxAgeSeconds } from '../../../utils/session.js';
import { login, logout } from '../services/auth.service.js';

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const result = await login(email, password);

    const cookie = buildCookie({
      name: env.authCookieName,
      value: result.token,
      maxAgeSeconds: getSessionMaxAgeSeconds(),
      httpOnly: true,
      sameSite: 'Lax',
      secure: env.nodeEnv === 'production',
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
}

async function logoutController(req, res, next) {
  try {
    const sessionToken = getCookieValue(req.headers.cookie, env.authCookieName);
    await logout(sessionToken);

    const cookie = buildExpiredCookie({
      name: env.authCookieName,
      httpOnly: true,
      sameSite: 'Lax',
      secure: env.nodeEnv === 'production',
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
}

function meController(req, res) {
  const user = req.user;

  res.status(200).json({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
  });
}

export { loginController, logoutController, meController };
