import { HttpError } from '../core/exceptions/http-error.js';

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'No autenticado'));
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.rol)) {
      return next(new HttpError(403, 'No autorizado'));
    }

    return next();
  };
}

export { requireRole };
