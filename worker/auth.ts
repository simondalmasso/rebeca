import type { Env } from './types';

const encoder = new TextEncoder();

async function sameSecret(left: string, right: string) {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(left)),
    crypto.subtle.digest('SHA-256', encoder.encode(right)),
  ]);
  const a = new Uint8Array(leftHash);
  const b = new Uint8Array(rightHash);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a[index] ^ b[index];
  return diff === 0;
}

function decodeBasic(header: string) {
  if (!header.startsWith('Basic ')) return null;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(':');
    if (separator < 1) return null;
    return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
  } catch {
    return null;
  }
}

export async function authenticateAdmin(request: Request, env: Env) {
  if (env.ENVIRONMENT === 'test' && env.TEST_AUTH_ENABLED === '1' && request.headers.get('x-test-admin') === '1') {
    return 'e2e@rebeca.test';
  }

  if (!env.ADMIN_USER || !env.ADMIN_PASSWORD) return null;
  const credentials = decodeBasic(request.headers.get('Authorization') ?? '');
  if (!credentials || credentials.user !== env.ADMIN_USER) return null;
  return (await sameSecret(credentials.password, env.ADMIN_PASSWORD)) ? env.ADMIN_USER : null;
}

export function adminChallenge() {
  return new Response(JSON.stringify({ error: { code: 'unauthorized', message: 'Acceso privado requerido.' } }), {
    status: 401,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'www-authenticate': 'Basic realm="REBECA Admin", charset="UTF-8"',
      'cache-control': 'no-store',
    },
  });
}

export function validMutationOrigin(request: Request, env: Env) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method.toUpperCase())) return true;
  const origin = request.headers.get('Origin');
  return Boolean(origin && origin === env.ADMIN_ORIGIN);
}
