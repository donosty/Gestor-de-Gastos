function parseCookieHeader(headerValue) {
  if (!headerValue) {
    return {};
  }

  return headerValue.split(';').reduce((cookies, part) => {
    const trimmedPart = part.trim();

    if (!trimmedPart) {
      return cookies;
    }

    const separatorIndex = trimmedPart.indexOf('=');

    if (separatorIndex === -1) {
      return cookies;
    }

    const name = trimmedPart.slice(0, separatorIndex).trim();
    const value = trimmedPart.slice(separatorIndex + 1).trim();

    if (name) {
      cookies[name] = decodeURIComponent(value);
    }

    return cookies;
  }, {});
}

function getCookieValue(headerValue, name) {
  const cookies = parseCookieHeader(headerValue);
  return cookies[name] || null;
}

function buildCookie({
  name,
  value,
  maxAgeSeconds,
  httpOnly = true,
  sameSite = 'Lax',
  secure = false,
  path = '/',
}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (path) {
    parts.push(`Path=${path}`);
  }

  if (Number.isInteger(maxAgeSeconds)) {
    parts.push(`Max-Age=${maxAgeSeconds}`);
    const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);
    parts.push(`Expires=${expiresAt.toUTCString()}`);
  }

  if (sameSite) {
    parts.push(`SameSite=${sameSite}`);
  }

  if (httpOnly) {
    parts.push('HttpOnly');
  }

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function buildExpiredCookie({
  name,
  httpOnly = true,
  sameSite = 'Lax',
  secure = false,
  path = '/',
}) {
  const parts = [`${name}=`];

  if (path) {
    parts.push(`Path=${path}`);
  }

  parts.push('Max-Age=0');
  parts.push('Expires=Thu, 01 Jan 1970 00:00:00 GMT');

  if (sameSite) {
    parts.push(`SameSite=${sameSite}`);
  }

  if (httpOnly) {
    parts.push('HttpOnly');
  }

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export { buildCookie, buildExpiredCookie, getCookieValue };
